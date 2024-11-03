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
    ENTIRE_MUNICIPALITY = "EntireMunicipality", //The entire municipality of Kiruna
    POINT = "Point", //A point in Kiruna
    AREA = "Polygon" //An area in Kiruna
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