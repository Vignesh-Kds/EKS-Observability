const grafana = require("../config/grafana");

exports.listDashboards = async () => {
  const { data } = await grafana.get("/search");

  return data.map((dashboard) => ({
    id: dashboard.id,
    uid: dashboard.uid,
    title: dashboard.title,
    folder: dashboard.folderTitle || "General",
    type: dashboard.type,
    tags: dashboard.tags || [],
    url: `${process.env.GRAFANA_URL}/d/${dashboard.uid}`,
  }));
};

exports.getDashboard = async (uid) => {
  const { data } = await grafana.get(`/dashboards/uid/${uid}`);
  return data;
};

exports.listFolders = async () => {
  const { data } = await grafana.get("/folders");
  return data;
};
