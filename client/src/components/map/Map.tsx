import mapboxgl, { LngLat, LngLatBounds, LngLatLike } from "mapbox-gl";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    AllGeoJSON,
    featureCollection,
    area,
    pointOnFeature,
    centroid,
    booleanPointInPolygon,
    points,
} from "@turf/turf";
import {
    documentAreaColorMapping,
    documentBorderColorMapping,
} from "./documentcolors";
import { loadIcons } from "./imagesLoader";
import Kiruna from "./KirunaMunicipality.json";
import {
    Button,
    Card,
    TabGroup,
    TabList,
    Tab,
    Divider,
    TextInput,
    Icon,
    Dialog,
    DialogPanel,
} from "@tremor/react";
import {
    RiCheckFill,
    RiCloseLine,
    RiCrosshair2Fill,
    RiDeleteBinFill,
    RiHand,
    RiInfoI,
    RiInformation2Line,
    RiMapPinLine,
    RiScissorsCutFill,
    RiShapeLine,
    RiArrowDownSLine,
    RiFileLine,
    RiEditBoxLine,
    RiSearchLine,
    RiRoadMapLine,
    RiEarthLine,
    RiShapesLine
} from "@remixicon/react";
import { PreviewMapDraw, DocumentMapDraw } from "./DrawBar";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import {
    Feature,
    FeatureCollection,
    Position,
    Polygon,
    MultiPolygon,
    Geometry,
    Point,
    GeoJsonProperties,
} from "geojson";
import { DrawCreateEvent, DrawUpdateEvent } from "@mapbox/mapbox-gl-draw";
import { KxDocument } from "../../model";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./DropDownMenu";
import "../../index.css";
import "../../css/map.css";
import { Stakeholders } from "../../enum";
import API from "../../API";


mapboxgl.accessToken =
    "pk.eyJ1IjoiZGxzdGUiLCJhIjoiY20ydWhhNWV1MDE1ZDJrc2JkajhtZWk3cyJ9.ptoCifm6vPYahR3NN2Snmg";

export interface SatMapProps {
    drawing: FeatureCollection | undefined;
    zoom?: number;
    style?: React.CSSProperties;
    className?: string;
    entireMunicipalityDocuments?: KxDocument[];
    user: React.RefObject<{ email: string; role: Stakeholders } | null>;
    setQuickFilterText?: (text: string) => void;
}

const getPointsAndCentroids = (
    drawing: FeatureCollection<Geometry, GeoJsonProperties> | undefined,
    offsetDistance: number
): FeatureCollection<Geometry, GeoJsonProperties> => {
    return {
        type: "FeatureCollection",
        features:
            drawing?.features.flatMap<Feature<Geometry, GeoJsonProperties>>(
                (feature) => {
                    let updatedFeatures: Feature<Geometry, GeoJsonProperties>[] = [];

                    if (
                        feature.geometry.type === "Polygon" ||
                        feature.geometry.type === "MultiPolygon"
                    ) {
                        let centroid = pointOnFeature(feature as AllGeoJSON);
                        centroid.properties = { ...feature.properties, isCentroid: true }; // Add isCentroid property

                        if (!centroid.geometry) return [];
                        const centroidCoordinates = centroid.geometry.coordinates as [
                            number,
                            number,
                        ];
                        const centroidOffsetX = (Math.random() - 0.5) * offsetDistance;
                        const centroidOffsetY = (Math.random() - 0.5) * offsetDistance;
                        centroid.geometry.coordinates = [
                            centroidCoordinates[0] + centroidOffsetX,
                            centroidCoordinates[1] + centroidOffsetY,
                        ];

                        updatedFeatures.push(
                            centroid as Feature<Geometry, GeoJsonProperties>
                        );
                    }

                    if (feature.geometry.type === "Point") {
                        const pointCoordinates = feature.geometry.coordinates as [
                            number,
                            number,
                        ];
                        const pointOffsetX = (Math.random() - 0.5) * offsetDistance;
                        const pointOffsetY = (Math.random() - 0.5) * offsetDistance;
                        feature.geometry.coordinates = [
                            pointCoordinates[0] + pointOffsetX,
                            pointCoordinates[1] + pointOffsetY,
                        ];
                        updatedFeatures.push(feature);
                    }

                    return updatedFeatures;
                }
            ) || [],
    };
};

const defaultZoom = 12;
const center: LngLatLike = [20.26, 67.845];

export const PreviewMap: React.FC<SatMapProps> = (props) => {
    const mapContainerRef = useRef<any>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
   
    useEffect(() => {
        if (mapRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            //style: "mapbox://styles/mapbox/satellite-streets-v12",
            style: "mapbox://styles/mapbox/light-v11",
            center: center,
            zoom: props.zoom || defaultZoom,
            pitch: 40,
            interactive: false,
        });
        mapRef.current.addControl(PreviewMapDraw, "bottom-right");
        if (props.drawing) PreviewMapDraw.set(props.drawing);
    }, [mapContainerRef.current]);

    useEffect(() => {
        if (props.drawing) {
            const offsetDistance = 0.0001; // offsetDistance
            const pointsAndCentroids = getPointsAndCentroids(
                props.drawing,
                offsetDistance
            );
            mapRef.current?.remove();
            mapRef.current = null;
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/light-v11",
                center: pointsAndCentroids.features[0]?.geometry.type === "Point" ? pointsAndCentroids.features[0]?.geometry.coordinates as LngLatLike : center,
                zoom: props.zoom || defaultZoom,
                pitch: 40,
                interactive: false,
            });
            mapRef.current.addControl(PreviewMapDraw, "bottom-right");

            if (props.drawing) PreviewMapDraw.set(props.drawing);
        }
    }, [props.drawing]);

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
            style={{
                ...props.style,
                ...{ pointerEvents: "none", touchAction: "none" },
            }}
        ></div>
    );
};

const initializeMapLayers = async (map: mapboxgl.Map, props: SatMapProps, isKirunaVisible: boolean) => {
    try {
        await loadIcons(map);

        // KIRUNA
        if (!map.getSource('Kiruna')) {
            map.addSource('Kiruna', {
                type: 'geojson',
                data: Kiruna as FeatureCollection,
            });
        }

        if (!map.getLayer('Kiruna-fill')) {
            map.addLayer({
                id: "Kiruna-fill",
                type: 'fill',
                source: "Kiruna",
                layout: {
                    'visibility': isKirunaVisible ? 'visible' : 'none'
                },
                paint: {
                    'fill-color': '#745296',
                    'fill-opacity': 0.5,
                },
            });
        }

        if (!map.getLayer('Kiruna-line')) {
            map.addLayer({
                id: "Kiruna-line",
                type: 'line',
                source: "Kiruna",
                paint: {
                    'line-color': '#745296',
                    'line-width': 2,
                },
            });
        }

        // AREA
        const sortedDrawing = props.drawing
            ? featureCollection(
                props.drawing.features.sort((a, b) => {
                    const areaA = area(a as AllGeoJSON);
                    const areaB = area(b as AllGeoJSON);
                    return areaB - areaA; // Sort in descending order
                })
            )
            : featureCollection([]);

        if (!map.getSource('drawings')) {
            map.addSource('drawings', {
                type: 'geojson',
                data: sortedDrawing as FeatureCollection,
            });
        }

        props.drawing?.features.forEach((feature) => {
            const id = feature.properties?.id;
            const pointId = `point-${id}`;
            const layerId = `drawings-layer-${id}`;
            const borderLayerId = `drawings-border-layer-${id}`;
            const circleLayerId = `drawings-circle-layer-${id}`;

            if (!map.getLayer(layerId)) {
                map.addLayer({
                    id: layerId,
                    type: 'fill',
                    source: {
                        type: 'geojson',
                        data: feature,
                    },
                    layout: {},
                    paint: {
                        'fill-color': documentAreaColorMapping, // Assuming documentColorMapping is an object mapping feature IDs to colors
                        'fill-opacity': 0,
                    },
                });
            }

            if (!map.getLayer(borderLayerId)) {
                map.addLayer({
                    id: borderLayerId,
                    type: 'line',
                    source: {
                        type: 'geojson',
                        data: feature,
                    },
                    layout: {},
                    paint: {
                        'line-color': documentBorderColorMapping, // Border color
                        'line-width': 0,
                    },
                });
            }
        });

        // CLUSTERS
        const offsetDistance = 0.0001; // offsetDistance
        const pointsAndCentroids = getPointsAndCentroids(props.drawing, offsetDistance);

        if (!map.getSource('pointsAndCentroids')) {
            map.addSource('pointsAndCentroids', {
                type: 'geojson',
                data: pointsAndCentroids as FeatureCollection,
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50
            });
        }

        if (!map.getLayer('clusters')) {
            map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'pointsAndCentroids',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        '#51bbd6',
                        100,
                        '#f1f075',
                        750,
                        '#f28cb1'
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20,
                        100,
                        30,
                        750,
                        40
                    ]
                }
            });
        }

        if (!map.getLayer('clusters-count')) {
            map.addLayer({
                id: 'clusters-count',
                type: 'symbol',
                source: 'pointsAndCentroids',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12
                }
            });
        }

        map.on('mouseenter', 'clusters', (e) => {
            if (map) {
                map.getCanvas().style.cursor = 'pointer';
            }

            const features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });

            if (!features || features.length === 0) return;
            const clusterId = features[0].properties?.cluster_id;
            (map.getSource('pointsAndCentroids') as mapboxgl.GeoJSONSource).getClusterLeaves(clusterId, 10, 0, (err, leaves) => {
                if (err) return;

                if (!leaves) return;
                const descriptions = "Documents titles:<br>" + leaves.map(leaf => {
                    if (leaf.properties) {
                        return `<b>${leaf.properties.title}</b>`;
                    }
                    return '';
                }).join('<br>');
                const coordinates: [number, number] = (features[0].geometry as Point).coordinates.slice(0, 2) as [number, number];

                const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false })
                    .setLngLat(coordinates)
                    .setHTML(descriptions)
                    .addTo(map);
            });
        });

        map.on('mouseleave', 'clusters', () => {
            if (map) {
                map.getCanvas().style.cursor = '';
            }
            const popups = document.getElementsByClassName('mapboxgl-popup');
            while (popups[0]) {
                if (popups[0]?.parentNode) {
                    popups[0].parentNode.removeChild(popups[0]);
                }
            }
        });

        map.on('click', 'clusters', (e) => {
            if (!map) return;
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });

            const clusterId = features[0].properties?.cluster_id;
            const source = map.getSource('pointsAndCentroids');
            if (source && 'getClusterExpansionZoom' in source) {
                (source as mapboxgl.GeoJSONSource).getClusterExpansionZoom(clusterId, (err: any, zoom: number | null | undefined) => {
                    if (err || zoom === undefined || zoom === null) return;
                    const newZoom = zoom + 2;
                    map.easeTo({
                        center: (features[0].geometry.type === 'Point' ? features[0].geometry.coordinates : center) as LngLatLike,
                        zoom: newZoom
                    });
                });
            }
        });

        // POINTS
        pointsAndCentroids.features?.forEach((feature) => {
            const id = feature.properties?.id;
            const pointId = `point-${id}`;
            const layerId = `drawings-layer-${id}`;
            const circleLayerId = `drawings-circle-layer-${id}`;
            const borderLayerId = `drawings-border-layer-${id}`;

            if (!map.getLayer(pointId)) {
                map.addLayer({
                    id: circleLayerId,
                    type: 'circle',
                    source: 'pointsAndCentroids',
                    paint: {
                        'circle-radius': 15,
                        'circle-color': [
                            'case',
                            ['==', ['get', 'isCentroid'], true], // Check if the feature is a centroid
                            '#ffffff',
                            '#7499E8'
                        ],
                    },
                    filter: ['==', ['get', 'id'], feature.properties?.id]
                });

                map.addLayer({
                    id: pointId,
                    type: 'symbol',
                    source: 'pointsAndCentroids',
                    filter: ['==', ['get', 'id'], id],
                    layout: {
                        'icon-image': ['get', 'icon'], // Use the 'icon' property from the dataset
                        'icon-size': 1,
                        'icon-padding': 1.5 // Increase the clickable area
                    }
                });
            }

            let coordinates: [number, number] = [0, 0];
            if (feature.geometry.type === 'Point') {
                coordinates = [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
            }

            const description = `Document Title:<br> <b>${feature.properties?.title}</b><br>Document Type:<br> <b>${feature.properties?.type}</b>`;
            const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false })
                .setLngLat(coordinates)
                .setHTML(`<div class="popup-content">${description}</div>`);

            map.on('mouseenter', pointId, () => {
                if (map) {
                    map.getCanvas().style.cursor = 'pointer';
                }
                popup.addTo(map);
                map.setLayoutProperty(pointId, 'icon-padding', 2);
                map.setPaintProperty(circleLayerId, 'circle-radius', 25);
                map.setPaintProperty(borderLayerId, 'line-width', 3);
                map.setPaintProperty(layerId, 'fill-opacity', 0.5);
            });

            map.on('mouseleave', pointId, () => {
                if (map) {
                    map.getCanvas().style.cursor = '';
                }
                popup.remove();
                map.setLayoutProperty(pointId, 'icon-padding', 1);
                map.setPaintProperty(circleLayerId, 'circle-radius', 15);
                map.setPaintProperty(borderLayerId, 'line-width', 0);
                map.setPaintProperty(layerId, 'fill-opacity', 0);
            });

            map.on('click', pointId, () => {
                window.location.href = `/documents/${id}`;
            });
        });
    } catch (error) {
        console.error('Error loading icons:', error);
    }
}

export const DashboardMap: React.FC<SatMapProps & { isVisible: boolean }> = (props) => {
    const mapContainerRef = useRef<any>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [isKirunaVisible, setIsKirunaVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const filteredDocuments = props.entireMunicipalityDocuments?.filter((doc) =>
        doc.title.toLowerCase().includes(searchText.toLowerCase())
    );
    const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/satellite-streets-v12");

    const toggleMapStyle = () => {
        setMapStyle(mapStyle === "mapbox://styles/mapbox/satellite-streets-v12" ? "mapbox://styles/mapbox/streets-v12" : "mapbox://styles/mapbox/satellite-streets-v12");
    }

    const toggleKirunaVisibility = (isKirunaVisible: boolean) => {
        if (mapRef.current) {
            const visibility = isKirunaVisible ? 'visible' : 'none';
            mapRef.current.setLayoutProperty('Kiruna-fill', 'visibility', visibility);
            setIsKirunaVisible(isKirunaVisible);
        }
    };


    useEffect(() => {
        if (mapRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/satellite-streets-v12",
            center: center,
            zoom: props.zoom || defaultZoom,
            pitch: 40,
            interactive: true,
        });


    }, [mapContainerRef.current]);

    useEffect(() => {
        if (props.drawing) {
            const currentCenter = mapRef.current?.getCenter();
            const currentZoom = mapRef.current?.getZoom();

            mapRef.current?.remove();
            mapRef.current = null;

            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: mapStyle,
                center: currentCenter || center,
                zoom: currentZoom || props.zoom || defaultZoom,
                pitch: 40,
                interactive: true,
            });



            mapRef.current?.on("load", function () {
                if (mapRef.current) {
                    initializeMapLayers(mapRef.current, props, isKirunaVisible);
                };
            });
        }
    }, [props.drawing, mapStyle]);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;
        map.setZoom(props.zoom || defaultZoom);
    }, [props.zoom]);

    useEffect(() => {
        if (!props.isVisible) {
            props.setQuickFilterText?.('');
        }
    }, [props.isVisible]);

    return (
        <>
            <div
                className={props.className}
                ref={mapContainerRef}
                id="map"
                style={{
                    ...props.style,
                    pointerEvents: "auto",
                    touchAction: "auto",
                }}
            />


            {props.isVisible && <TextInput

                icon={RiSearchLine}
                id="quickFilter"
                placeholder="Search..."
                className="quickfilter w-full"
                onValueChange={(e) => {
                    props.setQuickFilterText?.(e);

                }}
            ></TextInput>}
            <Button className="Kiruna-map-style-button" style={{ display: props.isVisible ? "flex" : "none" }} onClick={toggleMapStyle}>
                {mapStyle === "mapbox://styles/mapbox/satellite-streets-v12" ? <RiRoadMapLine /> : <RiEarthLine />}
            </Button>

            <DropdownMenu modal={false} >
                <DropdownMenuTrigger asChild>
                    <Button className="button-whole-Kiruna" variant="primary" style={{ display: props.isVisible ? "flex" : "none" }} onMouseEnter={() => toggleKirunaVisibility(true)} onMouseLeave={() => toggleKirunaVisibility(false)} >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            Whole Kiruna: {props.entireMunicipalityDocuments?.length}
                            <RiFileLine
                                style={{
                                    fontSize: "1rem",
                                    color: "#4A4A4A",
                                    transform: "scale(0.80)",
                                }}
                            />
                            <RiArrowDownSLine
                                style={{
                                    fontSize: "1rem",
                                    color: "#4A4A4A",
                                    marginLeft: "0.25rem",
                                }}
                            />
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent >
                    <DropdownMenuLabel>Documents</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div style={{ padding: '0.2rem' }}>
                        <input className='input-dropdown'
                            type="text"
                            placeholder="Search documents..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                            style={{
                                width: '100%',
                                height: '1.5rem',
                                padding: '0.5rem',
                                boxSizing: 'border-box',
                                borderRadius: '0.5rem',
                                fontSize: '0.75rem',
                            }}
                        />
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="dropdown-menu-group light-scrollbar dark-scrollbar" style={{ maxHeight: '15rem', overflowY: 'auto' }}>
                        {filteredDocuments?.map((doc, index) => (
                            <DropdownMenuItem
                                key={index}
                                onClick={() => (window.location.href = `/documents/${doc._id}`)}
                            >
                                {doc.title}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};


const loadMapData = async (map: mapboxgl.Map, drawing: FeatureCollection<Geometry, GeoJsonProperties>) => {
    try {
        await loadIcons(map);

        const offsetDistance = 0.0001; // offsetDistance
        const pointsAndCentroids = getPointsAndCentroids(drawing, offsetDistance);

        // Add source for drawings
        map?.addSource('drawings', {
            type: 'geojson',
            data: drawing as FeatureCollection,
        });

        // Add layers for each feature in drawings
        drawing?.features.forEach((feature) => {
            const id = feature.properties?.id;
            const pointId = `point-${id}`;
            const layerId = `drawings-layer-${id}`;
            const borderLayerId = `drawings-border-layer-${id}`;
            const circleLayerId = `drawings-circle-layer-${id}`;

            // Add the main fill layer
            map?.addLayer({
                id: layerId,
                type: 'fill',
                source: {
                    type: 'geojson',
                    data: feature,
                },
                layout: {},
                paint: {
                    'fill-color': documentAreaColorMapping, // Assuming documentColorMapping is an object mapping feature IDs to colors
                    'fill-opacity': 0.5,
                },
            });

            // Add the border layer
            map?.addLayer({
                id: borderLayerId,
                type: 'line',
                source: {
                    type: 'geojson',
                    data: feature,
                },
                layout: {},
                paint: {
                    'line-color': documentBorderColorMapping, // Border color
                    'line-width': 3,
                },
            });
        });

        // Add source for points and centroids
        map?.addSource('pointsAndCentroids', {
            type: 'geojson',
            data: pointsAndCentroids as FeatureCollection,
        });

        // Add layers for each feature in points and centroids
        pointsAndCentroids.features?.forEach((feature) => {
            const id = feature.properties?.id;
            const pointId = `point-${id}`;
            const circleLayerId = `drawings-circle-layer-${id}`;

            if (!map?.getLayer(pointId)) {
                map?.addLayer({
                    id: circleLayerId,
                    type: 'circle',
                    source: 'pointsAndCentroids',
                    paint: {
                        'circle-radius': 15,
                        'circle-color': [
                            'case',
                            ['==', ['get', 'isCentroid'], true], // Check if the feature is a centroid
                            '#ffffff',
                            '#7499E8'
                        ],
                    },
                    filter: ['==', ['get', 'id'], feature.properties?.id]
                });

                map?.addLayer({
                    id: pointId,
                    type: 'symbol',
                    source: 'pointsAndCentroids',
                    filter: ['==', ['get', 'id'], id],
                    layout: {
                        'icon-image': ['get', 'icon'], // Use the 'icon' property from the dataset
                        'icon-size': 1,
                        'icon-padding': 1.5 // Increase the clickable area
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error loading icons:', error);
    }
};


export const DocumentPageMap: React.FC<SatMapProps & { setDrawing: (drawing: FeatureCollection<Geometry, GeoJsonProperties> | undefined) => void }> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [drawing, setDrawing] = useState(props.drawing);
    const mapContainerRef = useRef<any>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const canEdit = props.user.current && props.user.current.role === Stakeholders.URBAN_PLANNER;
    const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/satellite-streets-v12");

    const toggleMapStyle = () => {
        setMapStyle(mapStyle === "mapbox://styles/mapbox/satellite-streets-v12" ? "mapbox://styles/mapbox/streets-v12" : "mapbox://styles/mapbox/satellite-streets-v12");
    }

    const offsetDistance = 0.0001; // offsetDistance
    const pointsAndCentroids = getPointsAndCentroids(props.drawing, offsetDistance);


    useEffect(() => {

        if (mapRef.current) return;
        if (props.drawing) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: mapStyle,
                 center: pointsAndCentroids.features[0]?.geometry?.type === "Point"
                ? pointsAndCentroids.features[0]?.geometry.coordinates as LngLatLike
                : center,
                zoom: defaultZoom,
                pitch: 40,
                interactive: true,
            });

            mapRef.current?.on("load", function () {
                if (mapRef.current) {
                    mapRef.current.addControl(PreviewMapDraw, "bottom-right");
                    if (props.drawing) {
                        loadMapData(mapRef.current, props.drawing);
                    }
                }
            });
        }
    }, [props.drawing]);

    useEffect(() => {

        if (props.drawing) {
            const currentCenter = mapRef.current?.getCenter();
            const currentZoom = mapRef.current?.getZoom();
            mapRef.current?.remove();
            mapRef.current = null;

            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: mapStyle,
                center: currentCenter || center,
                zoom: currentZoom || props.zoom || defaultZoom,
                pitch: 40,
                interactive: true,
            });

            mapRef.current?.on("load", function () {
                if (mapRef.current) {
                    mapRef.current.addControl(PreviewMapDraw, "bottom-right");
                    if (props.drawing) {
                        loadMapData(mapRef.current, props.drawing);
                    }
                }
            });
        }
    }, [mapStyle]);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;
        map.setZoom(props.zoom || defaultZoom);
    }, [props.zoom]);

    return (
        <>
           
            <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
                <DialogPanel
                    className="p-0 overflow-hidden"
                    style={{ maxWidth: "100%" }}
                >
                    <SatMap
                        drawing={drawing}
                        onCancel={() => setIsOpen(false)}
                        onDone={(v) => {
                            props.setDrawing(v);
                            setIsOpen(false);
                        }}
                        style={{ minHeight: "95vh", width: "100%" }}
                        user={props.user}
                    ></SatMap>
                </DialogPanel>
            </Dialog>
            <Button className="Kiruna-map-style-button" onClick={toggleMapStyle}>
                {mapStyle === "mapbox://styles/mapbox/satellite-streets-v12" ? <RiRoadMapLine /> : <RiEarthLine />}
            </Button>
        
            <div
                className={props.className}
                ref={mapContainerRef}
                id="map"
                style={{
                    ...props.style,
                    pointerEvents: "auto",
                    touchAction: "auto",
                }}
            />
        </>
    );
};

interface MapControlsProps {
    // path type is temporary
    onDone: (path: FeatureCollection) => void;
    onCancel: () => void;
    drawing: FeatureCollection | undefined;
}

const MapControls: React.FC<
    MapControlsProps & {
        bounds: LngLatBounds | null;
        flyTo: (coords: LngLatLike) => void;
        setFeature: (_: Feature) => void;
    }
> = (props) => {
    const [index, setIndex] = useState(0);
    const [pointCoords, setPointCoords] = useState<[string, string]>(["", ""]);
    const [coordsError, setCoordsError] = useState(false);
    function str2pos(str: [string, string]): Position {
        return [Number(str[0]), Number(str[1])];
    }
    function pos2str(pos: Position): [string, string] {
        return [pos[0].toString(), pos[1].toString()];
    }

    const emptyPointFeature: Feature = {
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: [] },
    };
    // structuredClone is necessary to avoid modifying the prop's original value.
    const feature = structuredClone(props?.drawing?.features?.at?.(0));
    let geometry = feature?.geometry;
    const pos = geometry?.type === "Point" ? geometry.coordinates : [NaN, NaN];
    const area =
        geometry?.type === "Polygon" ? geometry.coordinates : [[[NaN, NaN]]];
    const kirunaArea = Kiruna.features[0] as Feature<Polygon | MultiPolygon>;
    const [documents, setDocuments] = useState<KxDocument[]>([]);
    const [selectedTitle, setSelectedTitle] = useState<string>('');
    const [selectedDocument, setSelectedDocument] = useState<KxDocument | null>(null);
    const [searchText, setSearchText] = useState('');
    const filteredDocuments = documents?.filter((doc) =>
        doc.title.toLowerCase().includes(searchText.toLowerCase())
    );


    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const fetchedDocuments = await API.getAllKxDocuments();
                const filteredDocuments = fetchedDocuments.filter(doc => doc.doc_coordinates.type !== 'EntireMunicipality');
                setDocuments(filteredDocuments);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchDocuments();
    }, []);

    useEffect(() => {
        if (!selectedTitle) return;

        const selectedDoc = documents.find(doc => doc.title === selectedTitle);
        setSelectedDocument(selectedDoc || null);
    }, [selectedTitle]);


    useEffect(() => {
        if (!selectedDocument?.doc_coordinates) return;

        const geometry = selectedDocument.doc_coordinates as Geometry;

        const feature: Feature<Geometry, GeoJsonProperties> = {
            type: 'Feature',
            geometry: geometry,
            properties: {} // Add any properties if needed
        };

        if (geometry.type === 'Point') {
            const coordinates = geometry.coordinates;
            setPointCoords([coordinates[0].toString(), coordinates[1].toString()]);
            PreviewMapDraw.changeMode('simple_select');
            PreviewMapDraw.set({
                type: 'FeatureCollection',
                features: [feature],
            });
        } else if (geometry.type === 'Polygon') {
            PreviewMapDraw.changeMode('simple_select');
            PreviewMapDraw.set({
                type: 'FeatureCollection',
                features: [feature],
            });
        }
    }, [selectedDocument]);



    useEffect(() => {
        if (geometry?.type === "Point") {
            setIndex(1);
            setPointCoords(pos2str(pos));
        } else if (geometry?.type === "Polygon") {
            setIndex(2);
        }
    }, [geometry?.type, pos?.[0], pos?.[1]]);

    useEffect(() => {
        if (geometry?.type !== "Point") return;
        if (
            booleanPointInPolygon(
                { type: "Point", coordinates: str2pos(pointCoords) },
                kirunaArea
            ) ||
            pointCoords.find((c) => c === "") !== undefined
        ) {
            setCoordsError(false);
        } else {
            setCoordsError(true);
        }

        if (
            index === 1 &&
            PreviewMapDraw.getMode() === "simple_select" &&
            pointCoords.every((c) => c === "")
        ) {
            PreviewMapDraw.deleteAll();
            PreviewMapDraw.changeMode("draw_point");
        }
    }, [pointCoords[0], pointCoords[1]]);

    useEffect(() => {
        if (geometry?.type !== "Polygon") return;
        const allPointsInside = area[0].every((coord) =>
            booleanPointInPolygon({ type: "Point", coordinates: coord }, kirunaArea)
        );

        if (allPointsInside) {
            setCoordsError(false);
        } else {
            setCoordsError(true);
        }
    }, [area[0]]);

    // Note:
    // React's useEffect() are run starting from the children. This means that we cannot change
    // DrawPolygone's mode in the MapControls component's useEffect because it is not going to
    // be completely initialized and it's going to cause an exception.

    return (
        <>
            <Card
                className="ring-transparent absolute top-0 sm:m-2 sm:right-0 sm:left-auto left-0 right-0 mx-auto xsm:w-full backdrop-blur bg-white/50"
                style={{ width: '80%', maxWidth: '25rem', padding: '1rem' }}
            >
                <TabGroup
                    className="mt-1 flex justify-center mx-auto tab-group"
                    index={index}
                    onIndexChange={(i) => {
                        PreviewMapDraw.deleteAll();
                        setCoordsError(false);
                        setPointCoords(["", ""]);
                        switch (i) {
                            default: // case 0
                                PreviewMapDraw.changeMode("simple_select");
                                break;
                            case 1:
                                PreviewMapDraw.changeMode("draw_point");
                                break;
                            case 2:
                                PreviewMapDraw.changeMode("draw_polygon");
                                break;
                        }
                        setIndex(i);
                    }}
                >
                    <TabList variant="solid" className='tab-group'>
                        <Tab value="1" icon={RiHand} className="tab">
                            Drag
                        </Tab>
                        <Tab value="2" icon={RiMapPinLine} className="tab">
                            Point
                        </Tab>
                        <Tab value="3" icon={RiShapeLine} className="tab">
                            Draw
                        </Tab>
                        <Tab value="4" icon={RiShapesLine} className="tab">
                            Select
                        </Tab>
                    </TabList>
                </TabGroup>
                <div className="mt-4 px-2">
                    {index === 0 ? (
                        <></>
                    ) : index === 1 ? (
                        <>
                            <p className="text-sm italic mx-2">
                                Click on the map or type the coordinates to add a Point
                            </p>
                            <div className="mt-2">
                                <TextInput
                                    value={pointCoords[0]}
                                    onValueChange={(longitude) => {
                                        const tmp = Number(longitude);
                                        if (tmp < 0 || tmp > 180) return;
                                        const newCoords: [string, string] = [
                                            isNaN(tmp) ? pointCoords[0] : longitude,
                                            pointCoords[1],
                                        ];
                                        setPointCoords(newCoords);
                                        if (newCoords.every((c) => !isNaN(Number(c)) && c !== "")) {
                                            let tmp =
                                                feature?.geometry.type === "Point"
                                                    ? feature
                                                    : emptyPointFeature;
                                            tmp.geometry = {
                                                ...tmp.geometry,
                                                type: "Point",
                                                coordinates: str2pos(newCoords),
                                            };
                                            PreviewMapDraw.changeMode("simple_select");
                                            PreviewMapDraw.set({
                                                type: "FeatureCollection",
                                                features: [tmp],
                                            });
                                        }
                                    }}
                                    error={coordsError}
                                    icon={() => (
                                        <p className="dark:border-dark-tremor-border border-r h-full text-tremor-default italic text-end text-right tremor-TextInput-icon shrink-0 h-5 w-16 mx-1.5 absolute left-0 flex items-center text-tremor-content-subtle dark:text-dark-tremor-content-subtle">
                                            Longitude
                                        </p>
                                    )}
                                    className="mt-1 pl-9 rounded-b-none"
                                />
                                <TextInput
                                    value={pointCoords[1]}
                                    onValueChange={(latitude) => {
                                        const tmp = Number(latitude);
                                        if (tmp < -90 || tmp > 90) return;
                                        const newCoords: [string, string] = [
                                            pointCoords[0],
                                            isNaN(tmp) ? pointCoords[1] : latitude,
                                        ];
                                        setPointCoords(newCoords);
                                        if (newCoords.every((c) => !isNaN(Number(c)) && c !== "")) {
                                            let tmp =
                                                feature?.geometry.type === "Point"
                                                    ? feature
                                                    : emptyPointFeature;
                                            tmp.geometry = {
                                                ...tmp.geometry,
                                                type: "Point",
                                                coordinates: str2pos(newCoords),
                                            };
                                            PreviewMapDraw.changeMode("simple_select");
                                            PreviewMapDraw.set({
                                                type: "FeatureCollection",
                                                features: [tmp],
                                            });
                                        }
                                    }}
                                    error={coordsError}
                                    errorMessage="All points must be inside the municipality of Kiruna"
                                    icon={() => (
                                        <p className="dark:border-dark-tremor-border border-r h-full text-tremor-default italic text-end text-right tremor-TextInput-icon shrink-0 h-5 w-16 mx-1.5 absolute left-0 flex items-center text-tremor-content-subtle dark:text-dark-tremor-content-subtle">
                                            Latitude
                                        </p>
                                    )}
                                    className="pl-9 border-t-0 rounded-t-none"
                                />
                                {!coordsError &&
                                    pointCoords.every((c) => c !== "") &&
                                    !props.bounds?.contains(str2pos(pointCoords) as LngLatLike) ? (
                                    <div className="flex justify-center mt-2">
                                        <Button
                                            icon={RiCrosshair2Fill}
                                            size="xs"
                                            variant="light"
                                            onClick={() => {
                                                props.flyTo(str2pos(pointCoords) as LngLatLike);
                                            }}
                                        >
                                            Navigate to point
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                            <div className="mt-2 flex justify-center ">
                                <Button
                                    size="xs"
                                    variant="secondary"
                                    icon={RiDeleteBinFill}
                                    color="red"
                                    className="flex-1"
                                    onClick={() => {
                                        setPointCoords(["", ""]);
                                        PreviewMapDraw.deleteAll();
                                        PreviewMapDraw.changeMode("draw_point");
                                    }}
                                >
                                    Remove point
                                </Button>
                            </div>
                        </>
                    ) : index === 2 ? (
                        <>
                            <p className="text-sm italic mx-2">
                                Click to add points; to terminate a selection, double click on the
                                last point.
                            </p>
                            <div className="mt-2 flex justify-center space-x-2">
                                <Button
                                    size="xs"
                                    variant="secondary"
                                    icon={RiDeleteBinFill}
                                    color="red"
                                    className="flex-1"
                                    onClick={() => {
                                        PreviewMapDraw.deleteAll();
                                        PreviewMapDraw.changeMode("draw_polygon");
                                    }}
                                >
                                    Remove area
                                </Button>
                                <Button
                                    size="xs"
                                    variant="secondary"
                                    icon={RiScissorsCutFill}
                                    className="flex-1"
                                    onClick={() => {
                                        if (PreviewMapDraw.getMode() === "draw_polygon") return;
                                        const features = PreviewMapDraw.getAll().features.map(
                                            (f: any) => f.id
                                        );
                                        if (features.length === 0) return;
                                        PreviewMapDraw.changeMode("simple_select", {
                                            featureIds: features,
                                        });
                                        PreviewMapDraw.changeMode("cut_polygon");
                                    }}
                                >
                                    Cut in shape
                                </Button>
                            </div>
                            {coordsError && (
                                <p className="text-red-500 text-sm mt-4">
                                    All points must be inside the municipality of Kiruna
                                </p>
                            )}
                        </>
                    ) : index === 3 ? (
                        <>
                            <p className="text-sm italic mx-2">
                                Select an area or a point of an existing document from the dropdown menu.
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <Button className='button-select-area' variant="primary" style={{ marginTop: '0rem' }}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                {selectedTitle || "Select a document"}
                                                <RiArrowDownSLine
                                                    style={{
                                                        fontSize: "1rem",
                                                        color: "#4A4A4A",
                                                        marginLeft: "0.25rem",
                                                    }}
                                                />
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel className='input-dropdown-area-item'>Documents</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <div style={{ padding: '0.2rem' }}>
                                            <input
                                                className='input-dropdown-area'
                                                type="text"
                                                placeholder="Search documents..."
                                                value={searchText}
                                                onChange={(e) => setSearchText(e.target.value)}
                                                onKeyDown={(e) => e.stopPropagation()}
                                                style={{
                                                    width: '100%',
                                                    height: '1.5rem',
                                                    padding: '0.5rem',
                                                    boxSizing: 'border-box',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.75rem',
                                                }}
                                            />
                                        </div>
                                        <DropdownMenuSeparator />

                                        <DropdownMenuGroup className="dropdown-menu-group light-scrollbar dark-scrollbar" style={{ maxHeight: '15rem', overflowY: 'auto' }}>
                                            {filteredDocuments.map((doc, index) => (
                                                <DropdownMenuItem

                                                    key={index}
                                                    onMouseEnter={() => {
                                                        const coordinates = (doc.doc_coordinates as Polygon).coordinates.flat(2);
                                                        props.flyTo(str2pos([coordinates[0].toString(), coordinates[1].toString()]) as LngLatLike);
                                                        setSelectedTitle(doc.title)
                                                    } }
                                                    className='input-dropdown-area-item'
                                                >
                                                    {doc.title}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </>
                    ) : null}
                </div>
                <Divider />
                <div className="px-2 flex justify-between space-x-2">
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
                        disabled={coordsError}
                        size="xs"
                        variant="primary"
                        icon={RiCheckFill}
                        onClick={() => {
                            // This changeMode is necessary, otherwise the MapDraw might contain malformed data
                            PreviewMapDraw.changeMode("simple_select");
                            props.onDone(PreviewMapDraw.getAll());
                        }}
                        className="flex-1"
                    >
                        Save
                    </Button>
                </div>
            </Card>
        </>
    );
};

export const SatMap: React.FC<SatMapProps & MapControlsProps> = (props) => {
    const mapContainerRef = useRef<any>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [tmpDrawing, setTmpDrawing] = useState<FeatureCollection | undefined>(
        props.drawing
    );
    const [mapBounds, setMapBounds] = useState<LngLatBounds | null>(null);
    const offsetDistance = 0.0001; // offsetDistance
    const pointsAndCentroids = getPointsAndCentroids(
        props.drawing,
        offsetDistance
    );


    const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/satellite-streets-v12");
    const toggleMapStyle = () => {
        setMapStyle(mapStyle === "mapbox://styles/mapbox/satellite-streets-v12" ? "mapbox://styles/mapbox/streets-v12" : "mapbox://styles/mapbox/satellite-streets-v12");
    };
    useEffect(() => {
        if (mapRef.current) return;
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/satellite-streets-v12",
            center: pointsAndCentroids.features[0]?.geometry?.type === "Point"
            ? pointsAndCentroids.features[0]?.geometry.coordinates as LngLatLike
            : center,
            zoom: props.zoom || defaultZoom,
            pitch: 40,
        });
        // mapRef.current.addControl(new mapboxgl.ScaleControl(), "bottom-right");
        mapRef.current.addControl(PreviewMapDraw, "top-left");
        // mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");
        // mapRef.current.addControl(new mapboxgl.FullscreenControl(), "bottom-right");

        mapRef.current.on("move", (e) => {
            setMapBounds(e.target.getBounds());
        });
        mapRef.current.on("draw.create", (e: DrawCreateEvent) => {
            setTmpDrawing({ type: "FeatureCollection", features: e.features });
        });
        mapRef.current.on("draw.delete", () => {
            setTmpDrawing(undefined);
        });
        mapRef.current.on("draw.update", (e: DrawUpdateEvent) => {
            setTmpDrawing({ type: "FeatureCollection", features: e.features });
        });

        mapRef.current?.on("load", function () {
            //KIRUNA-----------------------------------------------------
            mapRef.current?.addSource("Kiruna", {
                type: "geojson",
                data: Kiruna as FeatureCollection,
            });

            mapRef.current?.addLayer({
                id: "Kiruna-line",
                type: "line",
                source: "Kiruna",
                paint: {
                    "line-color": "#745296",
                    "line-width": 4,
                    "line-dasharray": [1, 1],
                },
            });
        });
        if (props.drawing) {
            PreviewMapDraw.set(props.drawing);
        }
    },[]);
    useEffect(() => {
        if (mapRef.current) {
            const currentCenter = mapRef.current?.getCenter();
            const currentZoom = mapRef.current?.getZoom();

            mapRef.current?.remove();
            mapRef.current = null;

            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: mapStyle,
                center: currentCenter || center,
                zoom: currentZoom || props.zoom || defaultZoom,
                pitch: 40,
                interactive: true,
            });
            //mapRef.current.addControl(new mapboxgl.ScaleControl(), "bottom-right");
            mapRef.current.addControl(PreviewMapDraw, "top-left");
            // mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");
            // mapRef.current.addControl(new mapboxgl.FullscreenControl(), "bottom-right");

            mapRef.current.on("move", (e) => {
                setMapBounds(e.target.getBounds());
            });
            mapRef.current.on("draw.create", (e: DrawCreateEvent) => {
                setTmpDrawing({ type: "FeatureCollection", features: e.features });
            });
            mapRef.current.on("draw.delete", () => {
                setTmpDrawing(undefined);
            });
            mapRef.current.on("draw.update", (e: DrawUpdateEvent) => {
                setTmpDrawing({ type: "FeatureCollection", features: e.features });
            });

            mapRef.current?.on("load", function () {
                //KIRUNA-----------------------------------------------------
                mapRef.current?.addSource('Kiruna', {
                    type: 'geojson',
                    data: Kiruna as FeatureCollection,
                });

                mapRef.current?.addLayer({
                    id: "Kiruna-line",
                    type: 'line',
                    source: "Kiruna",
                    paint: {
                        'line-color': '#745296',
                        'line-width': 4,
                        'line-dasharray': [1, 1]
                    }, 
                });
            }); 
            if (props.drawing) {
                PreviewMapDraw.set(props.drawing);
            }
            if (tmpDrawing ) {
                PreviewMapDraw.set(tmpDrawing);
            }

        }
    }, [mapStyle]);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;

        map.setZoom(props.zoom || defaultZoom);
    }, [props.zoom]);

    return (
        <>
            <div
                className={props.className}
                ref={mapContainerRef}
                id="map"
                style={props.style}
            />
            <Button className="Kiruna-map-style-button" onClick={toggleMapStyle}>
                {mapStyle === "mapbox://styles/mapbox/satellite-streets-v12" ? <RiRoadMapLine /> : <RiEarthLine />}
            </Button>
            <MapControls
                onCancel={props.onCancel}
                onDone={props.onDone}
                setFeature={(f) => {
                    PreviewMapDraw.set({ type: "FeatureCollection", features: [f] });
                }}
                drawing={tmpDrawing}
                bounds={mapBounds}
                flyTo={(coords: LngLatLike) => {
                    mapRef.current?.flyTo({
                        center: coords,
                        zoom: props.zoom || defaultZoom,
                    });
                }}
            />
        </>
    );
};
