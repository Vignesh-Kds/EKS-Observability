import alertmanager from "../config/alertmanager.js";

export const getAlerts = async () => {
  const { data } = await alertmanager.get("/alerts");
  return data;
};

export const getSilences = async () => {
  const { data } = await alertmanager.get("/silences");
  return data;
};

export const createSilence = async (body) => {
  const { data } = await alertmanager.post("/silences", body);
  return data;
};

export const deleteSilence = async (id) => {
  const { data } = await alertmanager.delete(`/silence/${id}`);
  return data;
};

export const getStatus = async () => {
  const alerts = await getAlerts();
  const silences = await getSilences();

  return {
    totalAlerts: alerts.length,
    firing: alerts.filter(
      a => a.status.state === "active"
    ).length,
    suppressed: alerts.filter(
      a => a.status.state === "suppressed"
    ).length,
    silences: silences.length,
    activeSilences: silences.filter(
      s => s.status.state === "active"
    ).length
  };
};
