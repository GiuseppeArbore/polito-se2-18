import mapboxgl, { Marker } from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Tab, TabGroup, TabList } from "@tremor/react";
import { RiCheckFill, RiCloseLine, RiDeleteBinFill } from "@remixicon/react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Feature, Point } from "geojson";
import "./Map.css";

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
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

const MapControls: React.FC<MapControlsProps> = (props) => {
  return (
    <Card className="ring-transparent absolute top-0 sm:m-2 right-0 xsm:w-full sm:w-80 backdrop-blur bg-white/50">
      <TabGroup className="mt-1 flex justify-center">
        <TabList variant="solid">
          <Tab
            value="1"
            onClick={() => {
              props.setActiveTab(1);
            }}
          >
            Point
          </Tab>
          <Tab
            value="2"
            onClick={() => {
              props.setActiveTab(2);
            }}
          >
            Area
          </Tab>
          <Tab
            value="3"
            onClick={() => {
              props.setActiveTab(3);
            }}
          >
            Whole Municipality
          </Tab>
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
  const mapContainerRef = useRef<any>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Saving the Doc's point
  const [point, setPoint] = useState<{ lng: number; lat: number } | null>(null);
  //const markerRef = useRef<Marker | null>(null);
  const [activeTab, setActiveTab] = useState<number>(1);
  const drawRef = useRef<MapboxDraw | undefined>();
  const draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      point: true,
    },
  });

  function deleteAllPoints() {
    // Get all features currently drawn
    const allFeatures = draw.getAll();
    // Filter for points only
    const points = allFeatures.features.filter(
      (feature) => feature.geometry.type === "Point"
    );

    // Delete each point
    points.forEach((point: any) => {
      draw.delete(point);
    });
  }
  const resetMap = () => {
    if (lastPointId) {
      draw.delete(lastPointId);
    }
    lastPointId;

    setPoint(null);
    setActiveTab(1); // Reset active tab

    // Reset any additional state or map settings as needed
    if (drawRef.current) {
      drawRef.current.deleteAll(); // Remove all drawn features
    }
  };
  let lastPointId: string | null = null;

  function addOrReplacePoint(lng: number, lat: number) {
    // If there's an existing point, remove it first
    if (lastPointId) {
      draw.delete(lastPointId);
    }
    lastPointId = null;
    // Define the new point feature
    const pointFeature: Feature<Point> = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
      properties: {},
    };

    // Add the new point to the map and store its ID
    lastPointId = draw.add(pointFeature)[0];
  }

  // Call resetMap function when the component is closed
  const handleClose = () => {
    resetMap();
    if (props.onCancel) {
      props.onCancel(); // Call the onCancel prop to notify parent component
    }
  };

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [20.26, 67.845],
      zoom: props.zoom || defaultZoom,
      pitch: 40,
    });

    mapRef.current.addControl(draw);
    // Drawing the past/last point on the map in loading
    if (
      coordinates &&
      coordinates.lng !== undefined &&
      coordinates.lat !== undefined
    ) {
      const pointFeature: Feature<Point> = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [coordinates.lng, coordinates.lat],
        },
        properties: {},
      };
      draw.add(pointFeature);
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

      deleteAllPoints();
      // Update point state
      setPoint({ lng, lat });

      if (onMapClick) {
        onMapClick(lng, lat);
      }

      addOrReplacePoint(lng, lat);
    };

    if (activeTab === 1) {
      map.on("click", handleMapClick);
    }

    return () => {
      map.off("click", handleMapClick);
      if (drawRef.current) {
        drawRef.current.deleteAll(); // Remove all drawn features
      }
    };
  }, [activeTab, mapRef]);
  return (
    <>
      <div
        className={props.className}
        ref={mapContainerRef}
        id="map"
        style={props.style}
      />
      <MapControls
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCancel={handleClose}
        onDone={props.onDone}
      ></MapControls>
    </>
  );
};
