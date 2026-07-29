const service = require("../services/alertmanagerService");

exports.alerts = async (req, res) => {
  try {
    const data = await service.getAlerts();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.silences = async (req, res) => {
  try {
    const data = await service.getSilences();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.createSilence = async (req, res) => {
  try {
    const data = await service.createSilence(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.deleteSilence = async (req, res) => {
  try {
    const data = await service.deleteSilence(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.status = async (req, res) => {
  try {
    const data = await service.getStatus();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
