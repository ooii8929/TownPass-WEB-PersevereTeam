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

type Map = google.maps.Map;

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = { lat: 25.033671, lng: 121.564427 };

const locations = [
  { name: "北投溫泉", position: { lat: 25.1377, lng: 121.5065 } },
  { name: "士林北藝", position: { lat: 25.0911, lng: 121.517 } },
  { name: "大稻埕", position: { lat: 25.0583, lng: 121.5105 } },
  { name: "萬華艋舺", position: { lat: 25.0324, lng: 121.4997 } },
  { name: "城北廊帶", position: { lat: 25.0477, lng: 121.517 } },
  { name: "城南台大", position: { lat: 25.0173, lng: 121.539 } },
  { name: "信義松菸", position: { lat: 25.0402, lng: 121.565 } },
  { name: "南港北流", position: { lat: 25.0554, lng: 121.6177 } },
];

const additionalLocations = [
  {
    name: "永樂布市",
    position: { lat: 25.05488, lng: 121.50788 },
    zoom: 17,
    uid: "e736ef49-ab33-414b-9bab-f79310398ae8",
  },
  {
    name: "霞海城隍廟",
    position: { lat: 25.05668, lng: 121.50795 },
    zoom: 17,
    uid: "a50adb30-1dc7-444d-b5d0-33073a4a3861",
  },
  {
    name: "迪化街中街",
    position: { lat: 25.05551, lng: 121.51003 },
    zoom: 16,
    uid: "59e2c6e9-3ebe-4ff0-9c9c-9bb9aca65543",
  },
  {
    name: "寧夏夜市",
    position: { lat: 25.05686, lng: 121.51586 },
    zoom: 17,
    uid: "0809973a-444f-40c3-8e68-4a76c1b35132",
  },
  {
    name: "大稻埕辜宅",
    position: { lat: 25.05892, lng: 121.50929 },
    zoom: 17,
    uid: "9c0f4540-0dcb-4be2-9834-b331274c1059",
  },
];

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

  const handleMarkerClick = (location: {
    name: string;
    position: { lat: number; lng: number };
  }) => {
    // if (location.name === "大稻埕") setAdditionalMarkers(additionalLocations);
    // else setAdditionalMarkers([]);
    map?.setCenter(location.position);
    setZoom(15);
  };

  const handleAddMarkerClick = (location: { name: string; uid: string }) => {
    router.navigate({ to: `/tasks/$tid`, params: { tid: location.uid } });
  };

  const onLoad = useCallback((map: Map) => setMap(map), []);

  const onUnmount = useCallback((map: Map) => setMap(null), []);

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

        {additionalLocations.map((loc, index) => (
          <Marker
            key={index}
            position={loc.position}
            label={getMarkerLabel(loc.name)}
            onClick={() => handleAddMarkerClick(loc)}
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
