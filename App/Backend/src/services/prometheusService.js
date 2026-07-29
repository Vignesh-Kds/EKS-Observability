import { executeQuery } from "../config/prometheus.js";

/**
 * Generic Prometheus query helper
 */
const queryPrometheus = async (query) => {
  try {
    const response = await axios.get(`${PROMETHEUS_URL}/api/v1/query`, {
      params: {
        query,
      },
      timeout: 5000,
    });

    return response.data;
  } catch (error) {
    console.warn("Prometheus unavailable. Returning mock data.");

    return null;
  }
};

/**
 * Cluster Metrics
 */
export const fetchClusterMetrics = async () => {
  const result = await queryPrometheus("sum(kube_node_status_capacity)");

  if (result) {
    return result;
  }

  return {
    clusterName: "vickycluster",
    nodes: 3,
    pods: 42,
    deployments: 12,
    namespaces: 5,
    cpuUsage: 46,
    memoryUsage: 58,
    status: "Healthy",
  };
};

/**
 * Node Metrics
 */
export const fetchNodeMetrics = async () => {
  const result = await executeQuery("node_cpu_seconds_total");

  if (result) {
    return result;
  }

  return [
    {
      name: "ip-192-168-1-10",
      cpu: 34,
      memory: 49,
      status: "Ready",
    },
    {
      name: "ip-192-168-1-11",
      cpu: 57,
      memory: 61,
      status: "Ready",
    },
    {
      name: "ip-192-168-1-12",
      cpu: 21,
      memory: 39,
      status: "Ready",
    },
  ];
};

/**
 * Pod Metrics
 */
export const fetchPodMetrics = async () => {
  const result = await queryPrometheus("kube_pod_info");

  if (result) {
    return result;
  }

  return [
    {
      name: "frontend-7cbb8fd7f8",
      namespace: "default",
      status: "Running",
      restarts: 0,
      cpu: 0.24,
      memory: "128Mi",
    },
    {
      name: "backend-6cbd58fd95",
      namespace: "default",
      status: "Running",
      restarts: 1,
      cpu: 0.31,
      memory: "256Mi",
    },
    {
      name: "postgres-0",
      namespace: "database",
      status: "Running",
      restarts: 0,
      cpu: 0.15,
      memory: "512Mi",
    },
  ];
};

/**
 * Service Metrics
 */
export const fetchServiceMetrics = async () => {
  const result = await queryPrometheus("kube_service_info");

  if (result) {
    return result;
  }

  return [
    {
      name: "frontend-service",
      namespace: "default",
      type: "LoadBalancer",
      clusterIP: "10.96.0.10",
      ports: "80",
    },
    {
      name: "backend-service",
      namespace: "default",
      type: "ClusterIP",
      clusterIP: "10.96.0.20",
      ports: "5000",
    },
    {
      name: "postgres-service",
      namespace: "database",
      type: "ClusterIP",
      clusterIP: "10.96.0.30",
      ports: "5432",
    },
  ];
};
