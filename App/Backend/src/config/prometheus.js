import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PROMETHEUS_URL =
  process.env.PROMETHEUS_URL ||
  "http://prometheus-server.monitoring.svc.cluster.local:9090";

const prometheusClient = axios.create({
  baseURL: PROMETHEUS_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Execute an instant Prometheus query
 *
 * @param {string} query
 * @returns {Promise<Object>}
 */
export const executeQuery = async (query) => {
  const response = await prometheusClient.get("/api/v1/query", {
    params: {
      query,
    },
  });

  return response.data;
};

/**
 * Execute a Prometheus range query
 *
 * @param {Object} options
 * @param {string} options.query
 * @param {string|number} options.start
 * @param {string|number} options.end
 * @param {string} options.step
 * @returns {Promise<Object>}
 */
export const executeRangeQuery = async ({
  query,
  start,
  end,
  step = "30s",
}) => {
  const response = await prometheusClient.get("/api/v1/query_range", {
    params: {
      query,
      start,
      end,
      step,
    },
  });

  return response.data;
};

export default prometheusClient;
