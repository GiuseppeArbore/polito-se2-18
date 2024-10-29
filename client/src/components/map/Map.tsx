import mapboxgl from "mapbox-gl"
import React, { useEffect, useRef } from "react";

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