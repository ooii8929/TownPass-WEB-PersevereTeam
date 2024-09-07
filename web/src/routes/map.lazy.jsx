import { Button } from "@/components/ui/button";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import React from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, OverlayView } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = { lat: 25.033671, lng: 121.564427 };

const locations = [
  { name: '北投溫泉', position: { lat: 25.1377, lng: 121.5065 } },
  { name: '士林北藝', position: { lat: 25.0911, lng: 121.5170 } },
  { name: '大稻埕', position: { lat: 25.0583, lng: 121.5105 } },
  { name: '萬華艋舺', position: { lat: 25.0324, lng: 121.4997 } },
  { name: '城北廊帶', position: { lat: 25.0477, lng: 121.5170 } },
  { name: '城南台大', position: { lat: 25.0173, lng: 121.5390 } },
  { name: '信義松菸', position: { lat: 25.0402, lng: 121.5650 } },
  { name: '南港北流', position: { lat: 25.0554, lng: 121.6177 } }
];

const additionalLocations = [
  { name: '永樂布市', position: { lat: 25.0548835, lng: 121.5078849 }, zoom: 17, uid: 'e736ef49-ab33-414b-9bab-f79310398ae8' },
  { name: '霞海城隍廟', position: { lat: 25.0566811, lng: 121.5079561 }, zoom: 17 , uid: 'a50adb30-1dc7-444d-b5d0-33073a4a3861'},
  { name: '迪化街中街', position: { lat: 25.055512071, lng: 121.5100328625679 }, zoom: 16, uid: '59e2c6e9-3ebe-4ff0-9c9c-9bb9aca65543' },
  { name: '寧夏夜市', position: { lat: 25.05686419481904, lng: 121.51586673259719 }, zoom: 17, uid: '0809973a-444f-40c3-8e68-4a76c1b35132' },
  { name: '大稻埕辜宅', position: { lat: 25.058926801149024, lng: 121.50929451529917 }, zoom: 17, uid: '9c0f4540-0dcb-4be2-9834-b331274c1059' }
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
  const [additionalMarkers, setAdditionalMarkers] = React.useState([]);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCBqVXoUft8t8BJTG119hm7QGM0Fw7yJ9U"
  })

  const getMarkerLabel = (text) => ({
    text: text,
    className: 'custom-marker-label',
    color: 'black',
    fontWeight: 'bold',
    fontSize: '14px'
  });

  const handleZoomChanged = () => {
    if (map) {
      const zoomLevel = map.getZoom();
      const textElements = document.querySelectorAll('.location-label');
      textElements.forEach(element => {
        if (zoomLevel >= 14) {
          element.style.transition = 'opacity 0.5s';
          element.style.opacity = '0';
        } else {
          element.style.transition = 'opacity 0.5s';
          element.style.opacity = '1';
        }
      });
    }
  };

  const handleMarkerClick = (location) => {
    if (location.name === '大稻埕') setAdditionalMarkers(additionalLocations);
    else setAdditionalMarkers([]);

    map.setCenter(location.position);
    map.setZoom(15);
    handleZoomChanged();
    map.addListener('zoom_changed', handleZoomChanged);
  };

  const handleAddMarkerClick = (location) => {
    router.navigate({ to: `/tasks/$tid`, params: { tid: location.uid } });
  }

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const handleResetClick = () => {
    if (map) {
      map.panTo(center);
      map.setZoom(12);
      setAdditionalMarkers([]);
    }
  };

  return isLoaded ? (
    <div>
      <GoogleMap sx={{ width: '100vw', height: '100vh' }}
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
        clickableIcons={false}
      >
        {locations.map((location, index) => (
          <OverlayView
            key={index}
            position={location.position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              className="location-label"
              onClick={() => handleMarkerClick(location)}
              style={{
                cursor: 'pointer',
                background: '#fff',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '5px',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                display: 'inline-block',
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              {location.name}
            </div>
          </OverlayView>

        ))}

        {additionalMarkers.map((loc, index) => (
          <Marker
            key={index}
            position={loc.position}
            label={getMarkerLabel(loc.name)}
            onClick={() => handleAddMarkerClick(loc)}
          />
        ))}
      </GoogleMap>
      <Button
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          padding: '10px 20px',
          cursor: 'pointer',
          zIndex: 1
        }}
        onClick={handleResetClick}
      >
        回到初始位置
      </Button>
      <style jsx global>{`
        .custom-marker-label {
          color: rgb(25, 25, 25);
          font-family: Roboto, Arial, sans-serif;
          font-weight: 500;
          font-size: 14px;
          -webkit-text-stroke: 2px white;
          text-stroke: 2px white;
          paint-order: stroke fill;
          text-shadow: 
            1px 1px 0 #fff,
            -1px 1px 0 #fff,
            1px -1px 0 #fff,
            -1px -1px 0 #fff;
        }
      `}</style>
    </div>
  ) : <></>
}
