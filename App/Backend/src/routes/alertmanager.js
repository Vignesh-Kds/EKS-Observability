const express = require("express");
const router = express.Router();

const controller = require("../controllers/alertmanagerController");

// GET all alerts
router.get("/alerts", controller.alerts);

// GET all silences
router.get("/silences", controller.silences);

// GET dashboard summary
router.get("/status", controller.status);

// POST create a silence
router.post("/silences", controller.createSilence);

// DELETE a silence
router.delete("/silences/:id", controller.deleteSilence);

module.exports = router;
