import lokiClient from "../config/loki.js";

export const queryLogs = async (
  namespace,
  pod,
  limit = 200
) => {
  const query = `{namespace="${namespace}",pod="${pod}"}`;

  const response = await lokiClient.get("/loki/api/v1/query_range", {
    params: {
      query,
      limit,
      direction: "backward",
    },
  });

  return response.data;
};

export const namespaceLogs = async (
  namespace,
  limit = 200
) => {
  const response = await lokiClient.get("/loki/api/v1/query_range", {
    params: {
      query: `{namespace="${namespace}"}`,
      limit,
      direction: "backward",
    },
  });

  return response.data;
};

export const searchLogs = async (
  namespace,
  keyword
) => {
  const response = await lokiClient.get("/loki/api/v1/query_range", {
    params: {
      query: `{namespace="${namespace}"} |= "${keyword}"`,
      direction: "backward",
    },
  });

  return response.data;
};
