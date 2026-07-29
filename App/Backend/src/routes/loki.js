import express from "express";

import {
  getPodLogs,
  getNamespaceLogs,
  searchNamespaceLogs,
} from "../controllers/lokiController.js";

const router = express.Router();

router.get(
  "/namespace/:namespace",
  getNamespaceLogs
);

router.get(
  "/namespace/:namespace/search",
  searchNamespaceLogs
);

router.get(
  "/pod/:namespace/:pod",
  getPodLogs
);

export default router;
