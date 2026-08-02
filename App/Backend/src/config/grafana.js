import axios from "axios";

const grafana = axios.create({
  baseURL:
    process.env.GRAFANA_URL ||
    "http://grafana.monitoring.svc.cluster.local:3000",
  timeout: 10000,
});

export default grafana;
