import { AreaType, KxDocumentType, Language, Scale, Stakeholders } from "./enum";
import { ObjectId } from "mongodb";

export class KxDocument {
    title: string;
    stakeholders: Stakeholders[];
    scale_info: Scale;
    scale: number;
    issuance_date: Date;
    type: KxDocumentType;
    connections: number;
    language: Language;
    area_type: AreaType;
    description: string;
    _id?: ObjectId;
    pages?: number;

    constructor(
        title: string,
        stakeholders: Stakeholders[],
        scale: number,
        scale_info: Scale,
        issuance_date: Date,
        type: KxDocumentType,
        connections: number,
        language: Language,
        description: string,
        area_type: AreaType,
        _id?: ObjectId,
        pages?: number
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
        this.area_type = area_type;
        this.description = description;
        this.pages = pages;
    }

}
