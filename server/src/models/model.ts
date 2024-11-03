import { AreaType, KxDocumentType, PageRange, Scale, Stakeholders } from "./enum";
import { ObjectId } from "mongoose";

export class KxDocument {
    title: string;
    stakeholders: Stakeholders[];
    scale_info: Scale;
    scale: number;
    issuance_date?: Date;
    type?: KxDocumentType;
    connections_number?: number;
    language?: string;
    area_type?: AreaType;
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
        connections_number?: number,
        language?: string,
        description?: string,
        area_type?: AreaType,
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
        this.connections_number = connections_number;
        this.language = language;
        this.area_type = area_type;
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

