import express from "express";
import * as controller from "../controllers/grafanaController.js";

const router = express.Router();

router.get("/dashboards", controller.listDashboards);

router.get("/dashboards/:uid", controller.getDashboard);

router.get("/folders", controller.listFolders);

export default router;
