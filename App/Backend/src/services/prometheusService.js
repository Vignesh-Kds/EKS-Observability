import { executeQuery } from "../config/prometheus.js";

/**
 * ======================================================
 * Cluster Metrics
 * ======================================================
 */
export const fetchClusterMetrics = async () => {
  try {
    const [
      nodeCount,
      podCount,
      deploymentCount,
      namespaceCount,
      cpuUsage,
      memoryUsage,
    ] = await Promise.all([
      executeQuery("count(kube_node_info)"),
      executeQuery("count(kube_pod_info)"),
      executeQuery("count(kube_deployment_labels)"),
      executeQuery("count(kube_namespace_created)"),
      executeQuery(
        `100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)`
      ),
      executeQuery(
        `(1 - (sum(node_memory_MemAvailable_bytes) / sum(node_memory_MemTotal_bytes))) * 100`
      ),
    ]);

    return {
      clusterName: process.env.CLUSTER_NAME || "vickycluster",

      nodes: Number(nodeCount?.data?.result?.[0]?.value?.[1] || 0),

      pods: Number(podCount?.data?.result?.[0]?.value?.[1] || 0),

      deployments: Number(
        deploymentCount?.data?.result?.[0]?.value?.[1] || 0
      ),

      namespaces: Number(
        namespaceCount?.data?.result?.[0]?.value?.[1] || 0
      ),

      cpuUsage: Number(
        Number(cpuUsage?.data?.result?.[0]?.value?.[1] || 0).toFixed(1)
      ),

      memoryUsage: Number(
        Number(memoryUsage?.data?.result?.[0]?.value?.[1] || 0).toFixed(1)
      ),

      status: "Healthy",
    };
  } catch (err) {
    console.error("Prometheus Cluster Metrics Error", err);

    return {
      clusterName: "vickycluster",
      nodes: 0,
      pods: 0,
      deployments: 0,
      namespaces: 0,
      cpuUsage: 0,
      memoryUsage: 0,
      status: "Unavailable",
    };
  }
};

/**
 * ======================================================
 * Node Metrics
 * ======================================================
 */
export const fetchNodeMetrics = async () => {
  try {
    const response = await executeQuery(
      `100 - (avg by(instance)(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)`
    );

    return response.data.result.map((item) => ({
      name: item.metric.instance,

      cpu: Number(parseFloat(item.value[1]).toFixed(2)),

      status: "Ready",
    }));
  } catch (err) {
    console.error(err);

    return [];
  }
};

/**
 * ======================================================
 * Pod Metrics
 * ======================================================
 */
export const fetchPodMetrics = async () => {
  try {
    const response = await executeQuery(
      `kube_pod_status_phase{phase="Running"}`
    );

    return response.data.result.map((item) => ({
      name: item.metric.pod,

      namespace: item.metric.namespace,

      status: "Running",
    }));
  } catch (err) {
    console.error(err);

    return [];
  }
};

/**
 * ======================================================
 * Service Metrics
 * ======================================================
 */
export const fetchServiceMetrics = async () => {
  try {
    const response = await executeQuery(`kube_service_info`);

    return response.data.result.map((item) => ({
      name: item.metric.service,

      namespace: item.metric.namespace,

      clusterIP: item.metric.cluster_ip,

      type: item.metric.type || "ClusterIP",
    }));
  } catch (err) {
    console.error(err);

    return [];
  }
};

/**
 * ======================================================
 * Prometheus Targets
 * ======================================================
 */
export const fetchTargets = async () => {
  try {
    const response = await executeQuery("up");

    return response.data.result.map((item) => ({
      instance: item.metric.instance,

      job: item.metric.job,

      status: item.value[1] === "1" ? "UP" : "DOWN",
    }));
  } catch (err) {
    console.error(err);

    return [];
  }
};

/**
 * ======================================================
 * CPU Usage Graph
 * ======================================================
 */
export const fetchCpuGraph = async () => {
  try {
    const response = await executeQuery(
      `100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)`
    );

    return response.data.result;
  } catch (err) {
    console.error(err);

    return [];
  }
};

/**
 * ======================================================
 * Memory Usage Graph
 * ======================================================
 */
export const fetchMemoryGraph = async () => {
  try {
    const response = await executeQuery(
      `(1 - (sum(node_memory_MemAvailable_bytes) / sum(node_memory_MemTotal_bytes))) * 100`
    );

    return response.data.result;
  } catch (err) {
    console.error(err);

    return [];
  }
};
