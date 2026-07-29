import api from "./api";

export const getClusterMetrics = () =>
  api.get("/metrics/cluster").then(res => res.data);

export const getPodMetrics = () =>
  api.get("/metrics/pods").then(res => res.data);

export const getNodeMetrics = () =>
  api.get("/metrics/nodes").then(res => res.data);

export const getServiceMetrics = () =>
  api.get("/metrics/services").then(res => res.data);
