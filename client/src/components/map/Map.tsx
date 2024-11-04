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
    onDone?: (path: any) => void
    onCancel?: () => void
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

export const SatMap: React.FC<SatMapProps> = (props) => {
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
        if (props.onDone && props.onCancel) {
            mapRef.current.addControl(DrawBarPolygon(() => props.onDone!(DrawPolygone.getAll()), props.onCancel!), "top-left");
        }
        mapRef.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
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
        </>
    )
}