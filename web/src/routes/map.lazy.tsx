import { Button } from "@/components/ui/button";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  OverlayView,
} from "@react-google-maps/api";
import { cn } from "@/lib/utils";
import { Task, tasks } from "@/data/tasks";
import { Location, locations } from "@/data/locations";

type Map = google.maps.Map;

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = { lat: 25.033671, lng: 121.564427 };

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
};

export const Route = createLazyFileRoute("/map")({
  component: StartPage,
});

function StartPage() {
  const router = useRouter();
  const [map, setMap] = useState<Map | null>(null);
  const [zoom, setZoom] = useState(12);
  // const [center, setCenter] = useState(undefined);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_API_KEY,
    // googleMapsApiKey: "",
  });

  const getMarkerLabel = (text: string) => ({
    text: text,
    className: "custom-marker-label",
    color: "black",
    fontWeight: "bold",
    fontSize: "14px",
  });

  const handleMarkerClick = (location: Location | Task) => {
    map?.setCenter(location.position);
    setZoom(15);
  };

  const handleAddMarkerClick = (task: Task) => {
    router.navigate({ to: `/tasks/$tid`, params: { tid: task.uid } });
  };

  const onLoad = useCallback((map: Map) => setMap(map), []);

  const onUnmount = useCallback(() => setMap(null), []);

  const handleResetClick = () => {
    if (map) {
      map.panTo(center);
      // map.setCenter(center);
      setZoom(12);
      // setAdditionalMarkers([]);
    }
  };

  return isLoaded ? (
    <div className="animate-fade">
      <GoogleMap
        zoom={zoom}
        center={center}
        onLoad={onLoad}
        options={mapOptions}
        onUnmount={onUnmount}
        mapContainerStyle={containerStyle}
        clickableIcons={false}
        onZoomChanged={() => setZoom(map?.getZoom() ?? 12)}
      >
        {locations.map((location, index) => (
          <OverlayView
            key={index}
            position={location.position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <button
              className={cn(
                "whitespace-nowrap rounded-lg bg-white/90 px-3 py-2 text-base font-medium transition-opacity duration-300",
                zoom > 14 ? "opacity-0" : "opacity-100",
              )}
              onClick={() => handleMarkerClick(location)}
              style={
                {
                  // background: "#fff",
                  // border: "1px solid #ccc",
                  // padding: "10px",
                  // borderRadius: "5px",
                  // whiteSpace: "nowrap",
                  // textAlign: "center",
                  // display: "inline-block",
                  // boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
                }
              }
            >
              {location.name}
            </button>
          </OverlayView>
        ))}

        {tasks.map((task, index) => (
          <Marker
            key={index}
            position={task.position}
            label={getMarkerLabel(task.name)}
            onClick={() => handleAddMarkerClick(task)}
            options={{ opacity: zoom > 14 ? 100 : 0 }}
            // className={cn(
            //   "custom-marker-label transition-opacity duration-300",
            //   zoom < 14 ? "opacity-100" : "opacity-0",
            // )}
          />
        ))}
      </GoogleMap>
      <Button
        size="lg"
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl transition-opacity",
          zoom === 12 ? "opacity-0" : "opacity-100",
        )}
        onClick={handleResetClick}
      >
        回到初始位置
      </Button>
    </div>
  ) : (
    <></>
  );
}
