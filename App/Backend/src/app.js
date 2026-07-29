import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Routes
import healthRoutes from "./routes/health.js";
import metricsRoutes from "./routes/metrics.js";
import kubernetesRoutes from "./routes/kubernetes.js";
import lokiRoutes from "./routes/loki.js";

// Uncomment these after creating the route files
// import alertmanagerRoutes from "./routes/alertmanager.js";
// import grafanaRoutes from "./routes/grafana.js";

// Middleware
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// ======================================================
// Security & Middleware
// ======================================================

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("combined"));

// ======================================================
// Health Check
// ======================================================

app.use("/health", healthRoutes);

// ======================================================
// Metrics API
// ======================================================

app.use("/api/metrics", metricsRoutes);

// ======================================================
// Kubernetes API
// ======================================================

app.use("/api/k8s", kubernetesRoutes);

// ======================================================
// Loki Logs API
// ======================================================

app.use("/api/logs", lokiRoutes);

// ======================================================
// Alertmanager API
// (Enable after creating routes/alertmanager.js)
// ======================================================

// app.use("/api/alertmanager", alertmanagerRoutes);

// ======================================================
// Grafana API
// (Enable after creating routes/grafana.js)
// ======================================================

// app.use("/api/grafana", grafanaRoutes);

// ======================================================
// Root Endpoint
// ======================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    application: "EKS Observability Dashboard",
    version: "1.0.0",
    status: "Running",
    timestamp: new Date().toISOString(),

    endpoints: {
      health: "/health",

      metrics: {
        cluster: "/api/metrics/cluster",
        nodes: "/api/metrics/nodes",
        pods: "/api/metrics/pods",
        services: "/api/metrics/services",
      },

      kubernetes: {
        nodes: "/api/k8s/nodes",
        pods: "/api/k8s/pods",
        deployments: "/api/k8s/deployments",
        services: "/api/k8s/services",
        namespaces: "/api/k8s/namespaces",
        events: "/api/k8s/events",
      },

      logs: {
        namespace: "/api/logs/namespace/:namespace",
        pod: "/api/logs/pod/:namespace/:pod",
        search: "/api/logs/namespace/:namespace/search?q=ERROR",
      },

      future: {
        grafana: "/api/grafana",
        alertmanager: "/api/alertmanager",
      },
    },
  });
});

// ======================================================
// 404 Handler
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Route not found",
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    },
  });
});

// ======================================================
// Global Error Handler
// ======================================================

app.use(errorHandler);

// ======================================================

export default app;
