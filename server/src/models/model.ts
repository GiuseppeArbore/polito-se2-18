import { DocCoords, KxDocumentType, PageRange, Scale, Stakeholders } from "./enum";
import { ObjectId } from "mongoose";

export class KxDocument {
    title: string;
    stakeholders: Stakeholders[];
    scale_info: Scale;
    scale: number;
    issuance_date?: Date;
    type?: KxDocumentType;
    language?: string;
    doc_coordinates?: DocCoords;
    description?: string;
    _id?: ObjectId;
    pages?: PageRange[];
    connections?: Connections;

    constructor(
        title: string,
        stakeholders: Stakeholders[],
        scale: number,
        scale_info: Scale,
        issuance_date?: Date,
        type?: KxDocumentType,
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
        this.language = language;
        this.doc_coordinates = doc_coordinates;
        this.description = description;
        this.pages = pages;
    }

}

class Connections {
    direct: string[];
    collateral: string[];
    projection: string[];
    update: string[];

    constructor(
        direct: string[],
        collateral: string[],
        projection: string[],
        update: string[]
    ) {
        this.direct = direct;
        this.collateral = collateral;
        this.projection = projection;
        this.update = update;
    }
}

