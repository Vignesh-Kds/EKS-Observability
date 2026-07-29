import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const lokiClient = axios.create({
  baseURL:
    process.env.LOKI_URL ||
    "http://loki.monitoring.svc.cluster.local:3100",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default lokiClient;
