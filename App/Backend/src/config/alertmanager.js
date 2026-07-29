const axios = require("axios");

const alertmanager = axios.create({
  baseURL:
    process.env.ALERTMANAGER_URL ||
    "http://alertmanager.monitoring.svc.cluster.local:9093/api/v2",
  timeout: 10000,
});

module.exports = alertmanager;
