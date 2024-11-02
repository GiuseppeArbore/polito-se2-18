import mapboxgl from "mapbox-gl"
import React, { useEffect, useRef } from "react";
import { Button, Card, Tab, TabGroup, TabList } from "@tremor/react";
import { RiCheckFill, RiCloseLine, RiDeleteBinFill } from "@remixicon/react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import FreehandMode from 'mapbox-gl-draw-freehand-mode'
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

mapboxgl.accessToken = "pk.eyJ1IjoiZGxzdGUiLCJhIjoiY20ydWhhNWV1MDE1ZDJrc2JkajhtZWk3cyJ9.ptoCifm6vPYahR3NN2Snmg";

export interface SatMapProps {
    zoom?: number,
    style?: React.CSSProperties,
    className?: string
}

const defaultZoom = 12;

export const PreviewMap: React.FC<SatMapProps> = (props) => {
    const mapContainerRef = useRef<any>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (mapRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            //style: "mapbox://styles/mapbox/satellite-streets-v12",
            style: "mapbox://styles/mapbox/light-v11",
            center: [20.26, 67.845],
            zoom: props.zoom || defaultZoom,
            pitch: 40,
            interactive: false
        });
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;

        map.setZoom(props.zoom || defaultZoom);
    }, [props.zoom]);

    return (
        <div className={props.className} ref={mapContainerRef} id="map" style={props.style}></div>
    )
}

interface MapControlsProps {
    // path type is temporary
    onDone?: (path: number) => void
    onCancel?: () => void
}

const MapControls: React.FC<MapControlsProps> = (props) => {
    return (
        <Card
            className="ring-transparent absolute top-0 sm:m-2 right-0 xsm:w-full sm:w-80 backdrop-blur bg-white/50"
        >
            <TabGroup className="mt-1 flex justify-center">
                <TabList variant="solid">
                    <Tab value="1">Point</Tab>
                    <Tab value="2">Area</Tab>
                    <Tab value="3">Whole Municipality</Tab>
                </TabList>
            </TabGroup>
            <div className="mt-4 px-2 flex justify-between space-x-2">
                <Button size="xs" variant="secondary" icon={RiCloseLine} onClick={props.onCancel} className="flex-1">Cancel</Button>
                <Button size="xs" variant="primary" icon={RiCheckFill} onClick={() => {
                    props.onDone!(1);
                }} className="flex-1">Save</Button>
            </div>
        </Card>
    )
};

export const SatMap: React.FC<SatMapProps & MapControlsProps> = (props) => {
    const mapContainerRef = useRef<any>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (mapRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/satellite-streets-v12",
            center: [20.26, 67.845],
            zoom: props.zoom || defaultZoom,
            pitch: 40,
        });
        var Draw = new MapboxDraw({
            displayControlsDefault: true,
            modes: {
                ...MapboxDraw.modes,
                draw_polygon: FreehandMode
            },
            controls: {
                polygon: true,
                trash: true,
                line_string: false,
                point: false,
                combine_features: false,
                uncombine_features: false,
            }
        });
        
        mapRef.current.addControl(Draw, 'top-left');
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;

        map.setZoom(props.zoom || defaultZoom);
    }, [props.zoom]);

    return (
        <>
            <div className={props.className} ref={mapContainerRef} id="map" style={props.style} />
            <MapControls onCancel={props.onCancel} onDone={props.onDone}></MapControls>
        </>
    )
}