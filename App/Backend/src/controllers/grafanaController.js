import * as service from "../services/grafanaService.js";

export const listDashboards = async (req, res) => {
  try {
    const dashboards = await service.listDashboards();
    res.json(dashboards);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const dashboard = await service.getDashboard(req.params.uid);
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const listFolders = async (req, res) => {
  try {
    const folders = await service.listFolders();
    res.json(folders);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
