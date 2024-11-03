import mapboxgl from "mapbox-gl"
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card  } from "@tremor/react";
import { RiCheckFill, RiCloseLine  } from "@remixicon/react";
import { DrawBarPolygon, DrawPolygone, PreviewMapDraw} from "./DrawBar";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
mapboxgl.accessToken = "pk.eyJ1IjoiZGxzdGUiLCJhIjoiY20ydWhhNWV1MDE1ZDJrc2JkajhtZWk3cyJ9.ptoCifm6vPYahR3NN2Snmg";

export interface SatMapProps {
    drawing: any,
    zoom?: number,
    style?: React.CSSProperties,
    className?: string,
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
        mapRef.current.addControl(PreviewMapDraw, 'bottom-right');
        if(props.drawing) PreviewMapDraw.set(props.drawing);
    }, [mapContainerRef.current]);
    
    useMemo(() => {
        if(props.drawing) {
            mapRef.current?.removeControl(PreviewMapDraw);
            mapRef.current?.addControl(PreviewMapDraw, 'bottom-right');
            PreviewMapDraw.set(props.drawing);
        }
    }, [props.drawing]);

    
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
    onDone?: (path: any) => void
    onCancel?: () => void
    drawing: any
}

const MapControls: React.FC<MapControlsProps> = (props) => {
    return (
        <Card
            className="ring-transparent absolute top-0 sm:m-2 right-0 xsm:w-full sm:w-80 backdrop-blur bg-white/50"
        >
            <div className="px-2 flex justify-between space-x-2">
                <Button size="xs" variant="secondary" icon={RiCloseLine} onClick={props.onCancel} className="flex-1">Cancel</Button>
                <Button size="xs" variant="primary" icon={RiCheckFill} onClick={() => {
                    props.onDone!(DrawPolygone.getAll());
                }} className="flex-1">Save</Button>
            </div>
        </Card>
    );
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
        mapRef.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
        mapRef.current.addControl(DrawBarPolygon, "top-left")
        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        mapRef.current.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
        if(props.drawing) DrawPolygone.set(props.drawing);
        
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;

        map.setZoom(props.zoom || defaultZoom);
    }, [props.zoom]);

    return (
        <>
            <div className={props.className} ref={mapContainerRef} id="map" style={props.style} />
            <MapControls onCancel={props.onCancel} onDone={props.onDone} drawing={props.drawing}></MapControls>
        </>
    )
}