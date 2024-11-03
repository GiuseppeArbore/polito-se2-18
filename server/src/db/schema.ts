import { AreaType, KxDocumentType, Scale, Stakeholders, PageRange } from "../models/enum";
const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    stakeholders: {
        type: [String],
        enum: Object.values(Stakeholders),
        required: true
    },
    scale_info: {
        type: String,
        enum: Object.values(Scale),
        required: true
    },
    scale: {
        type: Number,
        required: true
    },
    issuance_date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(KxDocumentType),
        required: true
    },
    connections: {
        type: Number,
        required: true
    },
    language: {
        type: String,
    },
    pages: {
        type: [{}],
    },
    area_type: {
        type: String,
        enum: Object.values(AreaType),
        required: true
    },
    description: {
        type: String,
        required: true
    }
} );  
export const Document = mongoose.model("Document", DocumentSchema);
