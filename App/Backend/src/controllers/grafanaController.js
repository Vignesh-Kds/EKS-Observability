const service = require("../services/grafanaService");

exports.listDashboards = async (req, res) => {
  try {
    const dashboards = await service.listDashboards();
    res.json(dashboards);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const dashboard = await service.getDashboard(req.params.uid);
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.listFolders = async (req, res) => {
  try {
    const folders = await service.listFolders();
    res.json(folders);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
