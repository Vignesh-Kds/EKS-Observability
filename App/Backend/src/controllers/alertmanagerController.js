import * as service from "../services/alertmanagerService.js";

export const alerts = async (req, res) => {
  try {
    const data = await service.getAlerts();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const silences = async (req, res) => {
  try {
    const data = await service.getSilences();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const createSilence = async (req, res) => {
  try {
    const data = await service.createSilence(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const deleteSilence = async (req, res) => {
  try {
    const data = await service.deleteSilence(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const status = async (req, res) => {
  try {
    const data = await service.getStatus();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
