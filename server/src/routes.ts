import { Application, Request, Response, NextFunction, RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import { createKxDocument } from './controller';
import { AreaType, KxDocumentType, Scale, Stakeholders } from './models/enum';


function initRoutes(app: Application) {
    app.get("/doc", async (req, res) => {
        res.status(200).json({ ok: "ok" });
    });

    const validateDocument: RequestHandler[] = [
        body('title').notEmpty().withMessage('Title is required'),
        body('stakeholders').isArray().withMessage('Stakeholders must be an array')
            .custom((value) => value.every((v: string) => Object.values(Stakeholders).includes(v as Stakeholders)))
            .withMessage('Invalid stakeholder value'),
        body('scale').isNumeric().withMessage('Scale must be a number'),
        body('scale_info').isIn(Object.values(Scale)).withMessage('Invalid scale value'),
        body('issuance_date').isISO8601().toDate().withMessage('Issuance date must be a valid date'),
        body('type').isIn(Object.values(KxDocumentType)).withMessage('Invalid document type'),
        body('connections').isNumeric().withMessage('Connections must be a number'),
        body('language').isString().withMessage('Language must be a string'),
        body('area_type').isIn(Object.values(AreaType)).withMessage('Invalid area type value'),
        body('description').notEmpty().withMessage('Description is required'),
        (req: Request, res: Response, next: NextFunction): void => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
            } else {
                next();
            }
        }
    ];

    app.post('/api/documents', validateDocument, createKxDocument);
}

export default initRoutes;