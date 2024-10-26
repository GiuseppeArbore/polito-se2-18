import { Application } from "express";

function initRoutes(app: Application) {
    app.get("/doc", async (req, res) => {
        res.status(200).json({ ok: "ok" });
    });
}

export default initRoutes;