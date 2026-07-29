# Kubernetes Production Monitoring & Observability

A production-ready Kubernetes monitoring and observability stack built with **Prometheus**, **Grafana**, **Alertmanager**, **Loki**, **Promtail**, **NGINX Ingress**, and **Sentry**. The project includes alerting, dashboards, runbooks, automation scripts, and incident response documentation suitable for real-world production environments.

---

# Features

- Prometheus metrics collection
- Grafana dashboards for infrastructure and applications
- Alertmanager for alert routing
- Loki for centralized log aggregation
- Promtail for log collection
- NGINX Ingress monitoring
- Sentry error monitoring
- Kubernetes ServiceMonitors
- Prometheus alert rules
- Incident response runbooks
- Deployment and maintenance automation scripts
- Production-ready project structure

---

# Technology Stack

| Component | Purpose |
|----------|---------|
| Kubernetes | Container orchestration |
| Prometheus | Metrics collection |
| Grafana | Dashboards & visualization |
| Alertmanager | Alert routing |
| Loki | Log aggregation |
| Promtail | Log collection |
| NGINX Ingress | Traffic routing |
| Helm | Package management |
| Sentry | Application error tracking |
| Bash | Automation scripts |

---

# Project Structure

```text
monitoring-project/
│
├── alertmanager/
├── grafana/
├── loki/
├── prometheus/
├── manifests/
├── runbooks/
├── scripts/
├── sentry/
└── README.md
```

---

# Monitoring Components

## Prometheus

Collects metrics from:

- Kubernetes Nodes
- Pods
- Services
- Applications
- Ingress Controller
- PostgreSQL
- Frontend
- Backend

Configuration includes:

- ServiceMonitors
- Prometheus Rules
- Alert Rules

---

## Grafana

Dashboards included:

- Kubernetes Cluster Dashboard
- Backend Dashboard
- Frontend Dashboard
- PostgreSQL Dashboard

Metrics visualized:

- CPU
- Memory
- Network
- Pod Health
- Request Rate
- Error Rate
- Response Time

---

## Alertmanager

Routes alerts based on:

- Severity
- Environment
- Service

Supports notifications through:

- Email
- Slack
- Microsoft Teams
- PagerDuty
- Webhooks

---

## Loki & Promtail

Provides centralized logging.

Promtail collects logs from:

- Kubernetes Pods
- Nodes
- Containers

Logs are stored in Loki and visualized through Grafana.

---

## Sentry

Tracks:

- Application Exceptions
- Stack Traces
- Performance Issues
- Release Health

Supports both backend and frontend applications.

---

# Available Runbooks

The project includes operational runbooks for common production incidents.

| Runbook | Purpose |
|---------|---------|
| alert-response-checklist.md | Standard incident response process |
| backend-service-down.md | Backend application unavailable |
| certificate-expired.md | TLS/SSL certificate renewal |
| database-connection-failure.md | Database connectivity issues |
| deployment-rollback.md | Rollback failed deployments |
| disk-pressure.md | Node disk pressure |
| high-latency.md | Application latency troubleshooting |
| imagepullbackoff.md | Image pull failures |
| ingress-5xx-errors.md | HTTP 5XX errors from Ingress |
| memory-pressure.md | Node memory pressure |
| node-not-ready.md | Kubernetes node unavailable |
| pod-crashloopbackoff.md | Pod restart troubleshooting |

---

# Automation Scripts

| Script | Purpose |
|---------|---------|
| build-images.sh | Build Docker images |
| cleanup.sh | Remove temporary resources |
| create-namespace.sh | Create Kubernetes namespaces |
| deploy.sh | Deploy monitoring stack |
| health-check.sh | Verify deployment health |
| install-ingress.sh | Install NGINX Ingress Controller |
| install-monitoring.sh | Install monitoring components |
| load-test.sh | Generate test traffic |
| rollback.sh | Roll back failed deployments |

---

# Deployment

## 1. Clone Repository

```bash
git clone <repository-url>

cd monitoring-project
```

---

## 2. Create Namespace

```bash
chmod +x scripts/create-namespace.sh

./scripts/create-namespace.sh
```

---

## 3. Install Monitoring Stack

```bash
chmod +x scripts/install-monitoring.sh

./scripts/install-monitoring.sh
```

---

## 4. Install Ingress Controller

```bash
chmod +x scripts/install-ingress.sh

./scripts/install-ingress.sh
```

---

## 5. Deploy Monitoring Resources

```bash
chmod +x scripts/deploy.sh

./scripts/deploy.sh
```

---

## 6. Verify Installation

```bash
chmod +x scripts/health-check.sh

./scripts/health-check.sh
```

---

# Verification Commands

Check Pods

```bash
kubectl get pods -A
```

Check Services

```bash
kubectl get svc -A
```

Check Ingress

```bash
kubectl get ingress -A
```

Check Prometheus Targets

```bash
kubectl port-forward svc/prometheus-server 9090:80
```

Open:

```text
http://localhost:9090
```

Check Grafana

```bash
kubectl port-forward svc/grafana 3000:80
```

Open:

```text
http://localhost:3000
```

---

# Alert Flow

```text
Application
      │
      ▼
Prometheus
      │
      ▼
Alert Rules
      │
      ▼
Alertmanager
      │
      ▼
Email / Slack / Teams / PagerDuty
      │
      ▼
Runbook
      │
      ▼
Engineer Investigation
      │
      ▼
Resolution
```

---

# Logging Flow

```text
Application Logs
       │
       ▼
Promtail
       │
       ▼
Loki
       │
       ▼
Grafana
```

---

# Best Practices

- Enable resource requests and limits for all workloads.
- Configure liveness and readiness probes.
- Monitor CPU, memory, disk, and network utilization.
- Define meaningful alert thresholds.
- Regularly test alert notifications.
- Keep dashboards updated.
- Maintain runbooks for critical incidents.
- Test backup and recovery procedures.
- Review monitoring configurations after every release.

---

# Future Enhancements

- Kubernetes Event Exporter
- Blackbox Exporter
- Thanos for long-term metrics storage
- Tempo for distributed tracing
- OpenTelemetry integration
- Kubernetes cost monitoring
- Multi-cluster monitoring
- GitOps deployment with Argo CD or Flux

---

# Contributing

1. Create a feature branch.
2. Implement changes.
3. Test locally.
4. Submit a pull request.
5. Update documentation if required.

---

# License

This project is intended for educational purposes, learning, demonstrations, and production-ready DevOps portfolio projects. Update the license section as appropriate for your repository.