import {
  fetchClusterMetrics,
  fetchNodeMetrics,
  fetchPodMetrics,
  fetchServiceMetrics,
  fetchTargets,
  fetchCpuGraph,
  fetchMemoryGraph,
} from "../services/prometheusService.js";

import logger from "../utils/logger.js";

/**
 * ======================================================
 * GET /api/prometheus/status
 * ======================================================
 */
export const getStatus = async (req, res, next) => {
  try {
    logger.info("Fetching Prometheus cluster status");

    const data = await fetchClusterMetrics();

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    logger.error("Prometheus status failed", error);
    next(error);
  }
};

/**
 * ======================================================
 * GET /api/prometheus/targets
 * ======================================================
 */
export const getTargets = async (req, res, next) => {
  try {
    logger.info("Fetching Prometheus targets");

    const data = await fetchTargets();

    res.status(200).json({
      success: true,
      count: data.length,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    logger.error("Prometheus targets failed", error);
    next(error);
  }
};

/**
 * ======================================================
 * GET /api/prometheus/cpu
 * ======================================================
 */
export const getCpuUsage = async (req, res, next) => {
  try {
    logger.info("Fetching CPU metrics");

    const data = await fetchCpuGraph();

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    logger.error("CPU metrics failed", error);
    next(error);
  }
};

/**
 * ======================================================
 * GET /api/prometheus/memory
 * ======================================================
 */
export const getMemoryUsage = async (req, res, next) => {
  try {
    logger.info("Fetching Memory metrics");

    const data = await fetchMemoryGraph();

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    logger.error("Memory metrics failed", error);
    next(error);
  }
};

/**
 * ======================================================
 * GET /api/prometheus/nodes
 * ======================================================
 */
export const getNodes = async (req, res, next) => {
  try {
    logger.info("Fetching Node metrics");

    const data = await fetchNodeMetrics();

    res.status(200).json({
      success: true,
      count: data.length,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    logger.error("Node metrics failed", error);
    next(error);
  }
};

/**
 * ======================================================
 * GET /api/prometheus/pods
 * ======================================================
 */
export const getPods = async (req, res, next) => {
  try {
    logger.info("Fetching Pod metrics");

    const data = await fetchPodMetrics();

    res.status(200).json({
      success: true,
      count: data.length,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    logger.error("Pod metrics failed", error);
    next(error);
  }
};

/**
 * ======================================================
 * GET /api/prometheus/services
 * ======================================================
 */
export const getServices = async (req, res, next) => {
  try {
    logger.info("Fetching Service metrics");

    const data = await fetchServiceMetrics();

    res.status(200).json({
      success: true,
      count: data.length,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    logger.error("Service metrics failed", error);
    next(error);
  }
};
