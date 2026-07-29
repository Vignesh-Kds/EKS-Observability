import {
  getNodes,
  getPods,
  getDeployments,
  getServices,
  getNamespaces,
  getEvents,
} from "../services/kubernetesService.js";

/**
 * GET /api/k8s/nodes
 */
export const listNodes = async (req, res, next) => {
  try {
    const nodes = await getNodes();

    res.status(200).json({
      success: true,
      count: nodes.length,
      data: nodes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/k8s/pods
 * GET /api/k8s/pods?namespace=default
 */
export const listPods = async (req, res, next) => {
  try {
    const namespace = req.query.namespace || "";

    const pods = await getPods(namespace);

    res.status(200).json({
      success: true,
      count: pods.length,
      data: pods,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/k8s/deployments
 */
export const listDeployments = async (req, res, next) => {
  try {
    const namespace = req.query.namespace || "";

    const deployments = await getDeployments(namespace);

    res.status(200).json({
      success: true,
      count: deployments.length,
      data: deployments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/k8s/services
 */
export const listServices = async (req, res, next) => {
  try {
    const namespace = req.query.namespace || "";

    const services = await getServices(namespace);

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/k8s/namespaces
 */
export const listNamespaces = async (req, res, next) => {
  try {
    const namespaces = await getNamespaces();

    res.status(200).json({
      success: true,
      count: namespaces.length,
      data: namespaces,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/k8s/events
 */
export const listEvents = async (req, res, next) => {
  try {
    const namespace = req.query.namespace || "";

    const events = await getEvents(namespace);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};
