import { KxDocumentType, Scale, Stakeholders, PageRange, isDocCoords } from "../models/enum";
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
    language: {
        type: String,
    },
    pages: {
        type: [{}],
    },
    doc_coordinates: {
        type: {},
        validate: {
            validator: isDocCoords,
        },
        required: true
    },
    description: {
        type: String,
        required: true
    },
    connections: {
        type: {
            direct: [String],
            collateral: [String],
            projection: [String],
            update: [String]
        }
    }
} );  
export const Document = mongoose.model("Document", DocumentSchema);
