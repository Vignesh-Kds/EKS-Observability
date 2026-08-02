import express from "express";

import {
  getStatus,
  getTargets,
  getCpuUsage,
  getMemoryUsage,
  getNodes,
  getPods,
  getServices,
} from "../controllers/prometheusController.js";

const router = express.Router();

// Cluster Summary
router.get("/status", getStatus);

// Prometheus Targets
router.get("/targets", getTargets);

// CPU Usage
router.get("/cpu", getCpuUsage);

// Memory Usage
router.get("/memory", getMemoryUsage);

// Nodes
router.get("/nodes", getNodes);

// Pods
router.get("/pods", getPods);

// Services
router.get("/services", getServices);

export default router;
