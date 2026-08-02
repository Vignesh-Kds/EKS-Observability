import express from "express";
import * as controller from "../controllers/alertmanagerController.js";

const router = express.Router();

// Alerts
router.get("/alerts", controller.alerts);

// Silences
router.get("/silences", controller.silences);

router.post("/silences", controller.createSilence);

router.delete("/silences/:id", controller.deleteSilence);

// Dashboard summary
router.get("/status", controller.status);

export default router;
