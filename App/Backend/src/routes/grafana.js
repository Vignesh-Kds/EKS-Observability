const express = require("express");

const router = express.Router();

const controller = require("../controllers/grafanaController");

router.get("/dashboards", controller.listDashboards);

router.get("/dashboards/:uid", controller.getDashboard);

router.get("/folders", controller.listFolders);

module.exports = router;
