import { DocCoords, KxDocumentType, PageRange, Scale, Stakeholders } from "./enum";
import { ObjectId } from "mongodb";

export class KxDocument {
    title: string;
    stakeholders: Stakeholders[];
    scale_info: Scale;
    scale: number;
    issuance_date?: Date;
    type?: KxDocumentType;
    connections?: number;
    language?: string;
    doc_coordinates?: DocCoords;
    description?: string;
    _id?: ObjectId;
    pages?: PageRange[];

    constructor(
        title: string,
        stakeholders: Stakeholders[],
        scale: number,
        scale_info: Scale,
        lng: number, 
        lat: number,
        issuance_date?: Date,
        type?: KxDocumentType,
        connections?: number,
        language?: string,
        description?: string,
        doc_coordinates?: DocCoords,
        _id?: ObjectId,
        pages?: PageRange[]
    ) {
        this.title = title;
        this._id = _id;
        this.stakeholders = stakeholders;
        this.scale = scale;
        this.scale_info = scale_info;
        this.issuance_date = issuance_date;
        this.type = type;
        this.connections = connections;
        this.language = language;
        this.doc_coordinates = doc_coordinates;
        this.description = description;
        this.pages = pages;
    }

}
