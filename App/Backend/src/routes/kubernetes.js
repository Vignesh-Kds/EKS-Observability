import express from "express";

import {
  listNodes,
  listPods,
  listDeployments,
  listServices,
  listNamespaces,
  listEvents,
} from "../controllers/kubernetesController.js";

const router = express.Router();

/**
 * Cluster Nodes
 */
router.get("/nodes", listNodes);

/**
 * Pods
 * Optional:
 * /pods?namespace=default
 */
router.get("/pods", listPods);

/**
 * Deployments
 */
router.get("/deployments", listDeployments);

/**
 * Services
 */
router.get("/services", listServices);

/**
 * Namespaces
 */
router.get("/namespaces", listNamespaces);

/**
 * Events
 */
router.get("/events", listEvents);

export default router;
