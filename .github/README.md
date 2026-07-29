# Kubernetes Production Monitoring & Observability

A production-ready Kubernetes Monitoring and Observability project that deploys **Prometheus**, **Grafana**, **Alertmanager**, **Loki**, **Promtail**, **NGINX Ingress**, and **Sentry** using Kubernetes manifests and Helm charts. The repository also includes GitHub Actions CI/CD pipelines, security scanning, operational runbooks, and deployment automation, making it suitable for learning, interviews, and production-ready DevOps portfolios.

---

## Architecture

```text
                        Users
                          │
                          ▼
                  NGINX Ingress
                          │
         ┌────────────────┴────────────────┐
         │                                 │
         ▼                                 ▼
   Monitoring Stack                 Application
         │                                 │
         ├──────────────┐                  │
         ▼              ▼                  ▼
   Prometheus        Loki            Application Metrics
         │              │                  │
         ▼              ▼                  ▼
 Alertmanager      Promtail          Sentry
         │
         ▼
 Email / Slack / Teams / PagerDuty
```

---

# Features

- Kubernetes-native monitoring
- Prometheus metrics collection
- Grafana dashboards
- Alertmanager notifications
- Loki centralized logging
- Promtail log collection
- NGINX Ingress monitoring
- Sentry application monitoring
- PrometheusRule alert definitions
- ServiceMonitor resources
- GitHub Actions CI/CD
- Helm deployment automation
- Kubernetes security scanning
- Production runbooks
- Deployment automation scripts

---

# Technology Stack

| Technology | Purpose |
|------------|---------|
| Kubernetes | Container orchestration |
| Helm | Package management |
| Prometheus | Metrics collection |
| Grafana | Dashboards |
| Alertmanager | Alert routing |
| Loki | Log aggregation |
| Promtail | Log collection |
| NGINX Ingress | Ingress Controller |
| Sentry | Error monitoring |
| GitHub Actions | CI/CD |
| Trivy | Security scanning |
| KubeLinter | Kubernetes validation |
| kube-score | Best practice analysis |
| ShellCheck | Shell script linting |
| YAML Lint | YAML validation |

---

# Repository Structure

```text
monitoring-project/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── cd.yml
│       ├── helm-deploy.yml
│       └── security-scan.yml
│
├── alertmanager/
├── grafana/
├── loki/
├── prometheus/
├── sentry/
│
├── charts/
│   ├── prometheus/
│   ├── grafana/
│   ├── loki/
│   └── alertmanager/
│
├── manifests/
│
├── runbooks/
│   ├── alert-response-checklist.md
│   ├── backend-service-down.md
│   ├── certificate-expired.md
│   ├── database-connection-failure.md
│   ├── deployment-rollback.md
│   ├── disk-pressure.md
│   ├── high-latency.md
│   ├── imagepullbackoff.md
│   ├── ingress-5xx-errors.md
│   ├── memory-pressure.md
│   ├── node-not-ready.md
│   └── pod-crashloopbackoff.md
│
├── scripts/
│   ├── build-images.sh
│   ├── cleanup.sh
│   ├── create-namespace.sh
│   ├── deploy.sh
│   ├── health-check.sh
│   ├── install-ingress.sh
│   ├── install-monitoring.sh
│   ├── load-test.sh
│   └── rollback.sh
│
└── README.md
```

---

# Monitoring Components

## Prometheus

Collects metrics from:

- Kubernetes Nodes
- Pods
- Deployments
- Services
- kube-state-metrics
- Node Exporter
- Applications
- NGINX Ingress

---

## Grafana

Provides dashboards for:

- Cluster Health
- CPU Usage
- Memory Usage
- Disk Usage
- Network Traffic
- Pod Health
- Request Rate
- Error Rate
- Response Time

---

## Alertmanager

Routes alerts to:

- Email
- Slack
- Microsoft Teams
- PagerDuty
- Generic Webhooks

Supports:

- Alert grouping
- Silencing
- Routing
- Notification policies

---

## Loki & Promtail

Collects logs from:

- Kubernetes Pods
- Containers
- Nodes
- System services

Logs are visualized in Grafana.

---

## Sentry

Monitors:

- Application exceptions
- Stack traces
- Performance issues
- Release health
- Error trends

---

# GitHub Actions Workflows

| Workflow | Purpose |
|----------|---------|
| ci.yml | Validate manifests, lint YAML, scan configurations, check shell scripts |
| cd.yml | Deploy monitoring resources to Kubernetes |
| helm-deploy.yml | Deploy Helm charts |
| security-scan.yml | Run Trivy, KubeLinter, kube-score, ShellCheck and YAML Lint |

---

# Included Runbooks

| Runbook | Description |
|----------|-------------|
| alert-response-checklist.md | Standard incident response process |
| backend-service-down.md | Backend outage troubleshooting |
| certificate-expired.md | TLS certificate renewal |
| database-connection-failure.md | Database connection failures |
| deployment-rollback.md | Rollback failed deployments |
| disk-pressure.md | Node disk pressure |
| high-latency.md | Performance troubleshooting |
| imagepullbackoff.md | Image pull failures |
| ingress-5xx-errors.md | Ingress 5XX errors |
| memory-pressure.md | Node memory pressure |
| node-not-ready.md | Kubernetes node unavailable |
| pod-crashloopbackoff.md | CrashLoopBackOff troubleshooting |

---

# Deployment

## Clone Repository

```bash
git clone https://github.com/<username>/monitoring-project.git

cd monitoring-project
```

---

## Create Namespace

```bash
chmod +x scripts/create-namespace.sh

./scripts/create-namespace.sh
```

---

## Install Monitoring Stack

```bash
chmod +x scripts/install-monitoring.sh

./scripts/install-monitoring.sh
```

---

## Install NGINX Ingress

```bash
chmod +x scripts/install-ingress.sh

./scripts/install-ingress.sh
```

---

## Deploy Kubernetes Resources

```bash
chmod +x scripts/deploy.sh

./scripts/deploy.sh
```

---

## Verify Deployment

```bash
chmod +x scripts/health-check.sh

./scripts/health-check.sh
```

---

# Helm Deployment

Deploy all Helm charts:

```bash
helm upgrade --install prometheus ./charts/prometheus -n monitoring

helm upgrade --install grafana ./charts/grafana -n monitoring

helm upgrade --install loki ./charts/loki -n monitoring

helm upgrade --install alertmanager ./charts/alertmanager -n monitoring
```

---

# Useful Commands

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

Check Nodes

```bash
kubectl get nodes
```

View Logs

```bash
kubectl logs <pod-name>
```

Describe Pod

```bash
kubectl describe pod <pod-name>
```

---

# CI/CD Pipeline

```text
Developer
      │
      ▼
Git Push
      │
      ▼
GitHub Actions
      │
      ├───────────────┐
      ▼               ▼
CI Pipeline      Security Scan
      │               │
      └───────┬───────┘
              ▼
      Helm Deploy / CD
              │
              ▼
      Kubernetes Cluster
```

---

# Security Scanning

The project performs automated security checks using:

- Trivy
- KubeLinter
- kube-score
- YAML Lint
- ShellCheck

Scans run automatically on:

- Push
- Pull Request
- Scheduled weekly scans
- Manual workflow execution

---

# Best Practices

- Configure resource requests and limits.
- Enable liveness and readiness probes.
- Store secrets securely using Kubernetes Secrets.
- Use RBAC with least-privilege access.
- Enable TLS for Ingress resources.
- Keep Helm charts version-controlled.
- Monitor infrastructure and applications continuously.
- Review alerts and dashboards regularly.
- Test disaster recovery and rollback procedures.

---

# Future Enhancements

- Argo CD GitOps deployment
- Flux CD support
- OpenTelemetry integration
- Jaeger or Tempo distributed tracing
- Thanos for long-term metrics
- Blackbox Exporter
- Multi-cluster monitoring
- Kubernetes Event Exporter
- Cost monitoring dashboards
- AI-assisted anomaly detection

---

# Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run the CI pipeline locally if possible.
5. Submit a Pull Request.

---

# License

This repository is intended for educational purposes, interview preparation, learning Kubernetes observability, and building a production-ready DevOps portfolio. You may replace this section with the license of your choice (for example, MIT, Apache 2.0, or GPL) before publishing.