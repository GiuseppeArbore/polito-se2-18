import e, { Application } from 'express';
import { createKxDocument } from './controller';
import { validateRequest } from './errorHandlers';
import { body } from 'express-validator';
import { AreaType, KxDocumentType, Scale, Stakeholders } from './models/enum';



export function initRoutes(app: Application) {

    const kxDocumentValidationChain = [
        body('title').notEmpty().withMessage('Title is required'),
        body('stakeholders').notEmpty().withMessage('Stakeholders are required')
            .isArray().withMessage('Stakeholders must be an array')
            .custom((value) => value.every((v: string) => Object.values(Stakeholders).includes(v as Stakeholders)))
            .withMessage('Invalid stakeholder value'),
        body('scale').notEmpty().withMessage('Scale is required')
            .isNumeric().withMessage('Scale must be a number'),
        body('scale_info').notEmpty().withMessage('Scale info is required')
            .isIn(Object.values(Scale)).withMessage('Invalid scale value'),
        body('issuance_date').notEmpty().withMessage('Issuance date is required')
            .isISO8601().toDate().withMessage('Issuance date must be a valid date'),
        body('type').notEmpty().withMessage('Type is required')
            .isIn(Object.values(KxDocumentType)).withMessage('Invalid document type'),
        body('language').optional().notEmpty().withMessage('Language is required')
            .isString().withMessage('Language must be a string'),
        body('area_type').notEmpty().withMessage('Area type is required')
            .isIn(Object.values(AreaType)).withMessage('Invalid area type value'),
        body('description').notEmpty().withMessage('Description is required'),
        body('pages').optional().isArray().custom((v) => {
            if (!Array.isArray(v))
                return false;

            return v.every((e) => {
                return ((Array.isArray(e) && e.length === 2 && e.every(t => typeof t === "number" && t >= 0 && Number.isInteger(t))) ||
                    (typeof e === "number" && e >= 0 && Number.isInteger(e)));
            })
        }).withMessage('Invalid pages'),
        body('connections').optional().isObject().custom((v) => {
            if (typeof v !== 'object' || v === null) return false;
            const lists = Object.values(v);
            const allItems = lists.flat();
            const uniqueItems = new Set(allItems);
            return uniqueItems.size === allItems.length;
        }).withMessage('Invalid connections'),
    ];

    app.get("/doc", async (_, res) => {
        res.status(200).json({ ok: "ok" });
    });

    app.post(
        '/api/documents',
        kxDocumentValidationChain,
        validateRequest,
        createKxDocument
    );


}

export default initRoutes;