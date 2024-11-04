import mapboxgl, { Marker } from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Tab, TabGroup, TabList } from "@tremor/react";
import { RiCheckFill, RiCloseLine, RiDeleteBinFill } from "@remixicon/react";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGxzdGUiLCJhIjoiY20ydWhhNWV1MDE1ZDJrc2JkajhtZWk3cyJ9.ptoCifm6vPYahR3NN2Snmg";

export interface SatMapProps {
  zoom?: number;
  style?: React.CSSProperties;
  className?: string;
  onMapClick?: (lng: number, lat: number) => void;
  coordinates?: { lng: number; lat: number };
}

const defaultZoom = 12;

export const PreviewMap: React.FC<SatMapProps> = (props) => {
  const mapContainerRef = useRef<any>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<Marker | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      //style: "mapbox://styles/mapbox/satellite-streets-v12",
      style: "mapbox://styles/mapbox/light-v11",
      center: [20.26, 67.845],
      zoom: props.zoom || defaultZoom,
      pitch: 40,
      interactive: false,
    });
  }, []);

  useEffect(() => {
    if (props.coordinates && mapRef.current) {
      // Remove existing marker if present
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Create and add a new marker at the passed coordinates
      markerRef.current = new Marker()
        .setLngLat([props.coordinates.lng, props.coordinates.lat])
        .addTo(mapRef.current);

      // Optionally, center the map on the new marker
      mapRef.current.setCenter([props.coordinates.lng, props.coordinates.lat]);
    }
  }, [props.coordinates]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    map.setZoom(props.zoom || defaultZoom);
  }, [props.zoom]);

  return (
    <div
      className={props.className}
      ref={mapContainerRef}
      id="map"
      style={props.style}
    ></div>
  );
};

interface MapControlsProps {
  // path type is temporary
  onDone?: (path: number) => void;
  onCancel?: () => void;
}

const MapControls: React.FC<MapControlsProps> = (props) => {
  return (
    <Card className="ring-transparent absolute top-0 sm:m-2 right-0 xsm:w-full sm:w-80 backdrop-blur bg-white/50">
      <TabGroup className="mt-1 flex justify-center">
        <TabList variant="solid">
          <Tab value="1">Point</Tab>
          <Tab value="2">Area</Tab>
          <Tab value="3">Whole Municipality</Tab>
        </TabList>
      </TabGroup>
      <div className="mt-4 px-2 flex justify-between space-x-2">
        <Button
          size="xs"
          variant="secondary"
          icon={RiDeleteBinFill}
          color="red"
          className="flex-1"
        >
          Line
        </Button>
        <Button
          size="xs"
          variant="secondary"
          icon={RiCloseLine}
          onClick={props.onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          size="xs"
          variant="primary"
          icon={RiCheckFill}
          onClick={() => {
            props.onDone!(1);
          }}
          className="flex-1"
        >
          Save
        </Button>
      </div>
    </Card>
  );
};

export const SatMap: React.FC<SatMapProps & MapControlsProps> = (props) => {
  const { onMapClick, coordinates } = props;
  console.log("coordinates: ", coordinates);
  const mapContainerRef = useRef<any>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Saving the Doc's point
  const [point, setPoint] = useState<{ lng: number; lat: number } | null>(null);
  const markerRef = useRef<Marker | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [20.26, 67.845],
      zoom: props.zoom || defaultZoom,
      pitch: 40,
    });

    // Drawing the past/last point on the map in loading
    if (
      coordinates &&
      coordinates.lng !== undefined &&
      coordinates.lat !== undefined
    ) {
      new Marker()
        .setLngLat([coordinates?.lng, coordinates?.lat])
        .addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    map.setZoom(props.zoom || defaultZoom);
  }, [props.zoom]);

  // for saving the clicked point
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const handleMapClick = (event: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = event.lngLat;

      // If a point already exists, remove the existing marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Update point state
      setPoint({ lng, lat });

      if (onMapClick) {
        onMapClick(lng, lat);
      }

      // Create a new marker and add it to the map
      const newMarker = new Marker().setLngLat([lng, lat]).addTo(map);

      // Store the reference to the new marker
      markerRef.current = newMarker;
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
      if (markerRef.current) {
        markerRef.current.remove(); // Remove the marker when the component unmounts
      }
    };
  }, []);
  return (
    <>
      <div
        className={props.className}
        ref={mapContainerRef}
        id="map"
        style={props.style}
      />
      <MapControls
        onCancel={props.onCancel}
        onDone={props.onDone}
      ></MapControls>
    </>
  );
};
