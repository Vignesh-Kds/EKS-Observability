import {
  fetchClusterMetrics,
  fetchNodeMetrics,
  fetchPodMetrics,
  fetchServiceMetrics,
} from "../services/prometheusService.js";

import logger from "../utils/logger.js";

// ======================================================
// Cluster Metrics
// ======================================================

export const getClusterMetrics = async (req, res, next) => {
  try {
    logger.info("Fetching cluster metrics");

    const data = await fetchClusterMetrics();

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    logger.error("Failed to fetch cluster metrics", error);
    next(error);
  }
};

// ======================================================
// Node Metrics
// ======================================================

export const getNodeMetrics = async (req, res, next) => {
  try {
    logger.info("Fetching node metrics");

    const data = await fetchNodeMetrics();

    res.status(200).json({
      success: true,
      count: Array.isArray(data) ? data.length : undefined,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    logger.error("Failed to fetch node metrics", error);
    next(error);
  }
};

// ======================================================
// Pod Metrics
// ======================================================

export const getPodMetrics = async (req, res, next) => {
  try {
    logger.info("Fetching pod metrics");

    const data = await fetchPodMetrics();

    res.status(200).json({
      success: true,
      count: Array.isArray(data) ? data.length : undefined,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    logger.error("Failed to fetch pod metrics", error);
    next(error);
  }
};

// ======================================================
// Service Metrics
// ======================================================

export const getServiceMetrics = async (req, res, next) => {
  try {
    logger.info("Fetching service metrics");

    const data = await fetchServiceMetrics();

    res.status(200).json({
      success: true,
      count: Array.isArray(data) ? data.length : undefined,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    logger.error("Failed to fetch service metrics", error);
    next(error);
  }
};
