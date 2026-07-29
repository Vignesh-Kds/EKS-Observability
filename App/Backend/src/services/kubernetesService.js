import { coreApi, appsApi } from "../config/kubernetes.js";
import logger from "../utils/logger.js";

/**
 * Get Kubernetes Ready status
 */
const getReadyStatus = (conditions = []) => {
  const ready = conditions.find(
    (condition) => condition.type === "Ready"
  );

  return ready?.status === "True" ? "Ready" : "NotReady";
};

/**
 * Get all cluster nodes
 */
export const getNodes = async () => {
  try {
    logger.info("Fetching Kubernetes nodes...");

    const response = await coreApi.listNode();

    return response.items.map((node) => ({
      name: node.metadata?.name,
      status: getReadyStatus(node.status?.conditions),
      kubeletVersion: node.status?.nodeInfo?.kubeletVersion,
      os: node.status?.nodeInfo?.operatingSystem,
      architecture: node.status?.nodeInfo?.architecture,
      cpu: node.status?.capacity?.cpu,
      memory: node.status?.capacity?.memory,
      podCIDR: node.spec?.podCIDR,
      labels: node.metadata?.labels || {},
      createdAt: node.metadata?.creationTimestamp,
    }));
  } catch (error) {
    logger.error("Unable to fetch Kubernetes nodes", error);
    throw error;
  }
};

/**
 * Get Pods
 */
export const getPods = async (namespace = "") => {
  try {
    logger.info(
      `Fetching Pods${namespace ? ` from namespace '${namespace}'` : ""}`
    );

    const response = namespace
      ? await coreApi.listNamespacedPod({ namespace })
      : await coreApi.listPodForAllNamespaces();

    return response.items.map((pod) => ({
      name: pod.metadata?.name,
      namespace: pod.metadata?.namespace,
      status: pod.status?.phase,
      node: pod.spec?.nodeName,
      podIP: pod.status?.podIP,
      hostIP: pod.status?.hostIP,

      restartCount:
        pod.status?.containerStatuses?.reduce(
          (total, container) => total + container.restartCount,
          0
        ) || 0,

      containers:
        pod.spec?.containers?.map((container) => ({
          name: container.name,
          image: container.image,
        })) || [],

      labels: pod.metadata?.labels || {},

      createdAt: pod.metadata?.creationTimestamp,
    }));
  } catch (error) {
    logger.error("Unable to fetch Pods", error);
    throw error;
  }
};

/**
 * Get Deployments
 */
export const getDeployments = async (namespace = "") => {
  try {
    logger.info(
      `Fetching Deployments${namespace ? ` from namespace '${namespace}'` : ""}`
    );

    const response = namespace
      ? await appsApi.listNamespacedDeployment({ namespace })
      : await appsApi.listDeploymentForAllNamespaces();

    return response.items.map((deployment) => ({
      name: deployment.metadata?.name,
      namespace: deployment.metadata?.namespace,

      replicas: deployment.spec?.replicas,
      readyReplicas: deployment.status?.readyReplicas || 0,
      updatedReplicas: deployment.status?.updatedReplicas || 0,
      availableReplicas: deployment.status?.availableReplicas || 0,

      strategy: deployment.spec?.strategy?.type,

      image:
        deployment.spec?.template?.spec?.containers?.[0]?.image || "Unknown",

      labels: deployment.metadata?.labels || {},

      createdAt: deployment.metadata?.creationTimestamp,
    }));
  } catch (error) {
    logger.error("Unable to fetch Deployments", error);
    throw error;
  }
};

/**
 * Get Services
 */
export const getServices = async (namespace = "") => {
  try {
    logger.info(
      `Fetching Services${namespace ? ` from namespace '${namespace}'` : ""}`
    );

    const response = namespace
      ? await coreApi.listNamespacedService({ namespace })
      : await coreApi.listServiceForAllNamespaces();

    return response.items.map((service) => ({
      name: service.metadata?.name,
      namespace: service.metadata?.namespace,

      type: service.spec?.type,

      clusterIP: service.spec?.clusterIP,

      externalIPs: service.spec?.externalIPs || [],

      selector: service.spec?.selector || {},

      ports:
        service.spec?.ports?.map((port) => ({
          port: port.port,
          targetPort: port.targetPort,
          protocol: port.protocol,
        })) || [],

      labels: service.metadata?.labels || {},

      createdAt: service.metadata?.creationTimestamp,
    }));
  } catch (error) {
    logger.error("Unable to fetch Services", error);
    throw error;
  }
};

/**
 * Get Namespaces
 */
export const getNamespaces = async () => {
  try {
    logger.info("Fetching Namespaces...");

    const response = await coreApi.listNamespace();

    return response.items.map((namespace) => ({
      name: namespace.metadata?.name,
      status: namespace.status?.phase,
      labels: namespace.metadata?.labels || {},
      createdAt: namespace.metadata?.creationTimestamp,
    }));
  } catch (error) {
    logger.error("Unable to fetch Namespaces", error);
    throw error;
  }
};

/**
 * Get Cluster Events
 */
export const getEvents = async (namespace = "") => {
  try {
    logger.info(
      `Fetching Events${namespace ? ` from namespace '${namespace}'` : ""}`
    );

    const response = namespace
      ? await coreApi.listNamespacedEvent({ namespace })
      : await coreApi.listEventForAllNamespaces();

    return response.items
      .sort(
        (a, b) =>
          new Date(b.lastTimestamp || b.eventTime || 0) -
          new Date(a.lastTimestamp || a.eventTime || 0)
      )
      .slice(0, 100)
      .map((event) => ({
        type: event.type,
        reason: event.reason,
        message: event.message,

        namespace: event.metadata?.namespace,

        object: event.involvedObject?.name,
        kind: event.involvedObject?.kind,

        component: event.source?.component,

        count: event.count || 1,

        timestamp:
          event.lastTimestamp ||
          event.eventTime ||
          event.metadata?.creationTimestamp,
      }));
  } catch (error) {
    logger.error("Unable to fetch Events", error);
    throw error;
  }
};
