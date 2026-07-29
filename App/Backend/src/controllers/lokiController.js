import {
  queryLogs,
  namespaceLogs,
  searchLogs,
} from "../services/lokiService.js";

export const getPodLogs = async (req, res, next) => {
  try {
    const { namespace, pod } = req.params;

    const logs = await queryLogs(namespace, pod);

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

export const getNamespaceLogs = async (req, res, next) => {
  try {
    const { namespace } = req.params;

    const logs = await namespaceLogs(namespace);

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

export const searchNamespaceLogs = async (req, res, next) => {
  try {
    const { namespace } = req.params;
    const { q } = req.query;

    const logs = await searchLogs(namespace, q);

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};
