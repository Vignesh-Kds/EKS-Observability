const axios = require("axios");

const grafana = axios.create({
  baseURL:
    process.env.GRAFANA_URL ||
    "http://grafana.monitoring.svc.cluster.local:3000/api",
  headers: {
    Authorization: `Bearer ${process.env.GRAFANA_API_TOKEN}`,
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

module.exports = grafana;
