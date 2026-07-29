const alertmanager = require("../config/alertmanager");

exports.getAlerts = async () => {
  const { data } = await alertmanager.get("/alerts");
  return data;
};

exports.getSilences = async () => {
  const { data } = await alertmanager.get("/silences");
  return data;
};

exports.createSilence = async (body) => {
  const { data } = await alertmanager.post("/silences", body);
  return data;
};

exports.deleteSilence = async (id) => {
  const { data } = await alertmanager.delete(`/silence/${id}`);
  return data;
};

exports.getStatus = async () => {
  const alerts = await exports.getAlerts();
  const silences = await exports.getSilences();

  return {
    totalAlerts: alerts.length,
    firing: alerts.filter(a => a.status.state === "active").length,
    suppressed: alerts.filter(a => a.status.state === "suppressed").length,
    silences: silences.length,
    activeSilences: silences.filter(
      s => s.status.state === "active"
    ).length
  };
};
