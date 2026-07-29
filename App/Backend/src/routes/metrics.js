import express from "express";

import {
  getClusterMetrics,
  getNodeMetrics,
  getPodMetrics,
  getServiceMetrics
} from "../controllers/metricsController.js";

const router = express.Router();

/*
 * Cluster Metrics
 * GET /api/metrics/cluster
 */
router.get("/cluster", getClusterMetrics);

/*
 * Node Metrics
 * GET /api/metrics/nodes
 */
router.get("/nodes", getNodeMetrics);

/*
 * Pod Metrics
 * GET /api/metrics/pods
 */
router.get("/pods", getPodMetrics);

/*
 * Service Metrics
 * GET /api/metrics/services
 */
router.get("/services", getServiceMetrics);

export default router;
