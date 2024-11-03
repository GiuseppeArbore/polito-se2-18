export enum Stakeholders {
    URBAN_DEVELOPER = "Urban Developer",
    URBAN_PLANNER = "Urban Planner",
    RESIDENT = "Resident",
    VISITOR = "Visitor"

}

export enum Scale {
    TEXT = "Text",
    LARGE_ARCHITECTURAL = "Large Architectural Scale",
    SMALL_ARCHITECTURAL = "Small Architectural Scale"
}

export enum KxDocumentType {
    INFORMATIVE = "Informative Document",
    PRESCRIPTIVE = "Prescriptive Document",
    DESIGN = "Design Document",
    TECHNICAL = "Technical Document",
    STRATEGY = "Strategy",
    AGREEMENT = "Agreement",
    CONFLICT = "Conflict Resolution",
    CONSULTATION = "Consultation",
}

export enum AreaType {
    ENTIRE_MUNICIPALITY = "The entire municipality of Kiruna",
    POINT = "A point in Kiruna",
    AREA = "An area in Kiruna"
}

export type PageRange = [number, number] | number;

export interface Point {
    type: AreaType.POINT,
    coordinates: number[]
}

export interface Area {
    type: AreaType.AREA,
    coordinates: number[][][]
}

export interface WholeMunicipality {
    type: AreaType.ENTIRE_MUNICIPALITY
}

export type DocCoords = Point | Area | WholeMunicipality;

export function isDocCoords(dc: any): dc is DocCoords {
    return (
        (dc.type) &&
        (dc.type === AreaType.POINT &&
            Object.keys(dc).length === 2 &&
            dc.coordinates &&
            Array.isArray(dc.coordinates) &&
            dc.coordinates.every((c: any) => typeof c === "number")) ||
        (dc.type === AreaType.AREA &&
            Object.keys(dc).length === 2 &&
            dc.coordinates &&
            Array.isArray(dc.coordinates) &&
            dc.coordinates.every(
                (c: any) =>
                    Array.isArray(c) &&
                    c.every(
                        (c: any) =>
                            Array.isArray(c) && c.every((c: any) => typeof c === "number")
                    )
            )) ||
        (dc.type === AreaType.ENTIRE_MUNICIPALITY && Object.keys(dc).length === 1)
    );
}