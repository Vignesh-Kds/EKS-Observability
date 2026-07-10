# Prometheus Monitoring

## Overview

Prometheus is used as the metrics collection and monitoring system for the Kubernetes cluster.

It collects:
- Kubernetes cluster metrics
- Node resource usage
- Application metrics
- Database metrics
- Custom business metrics

Prometheus follows a pull-based monitoring model where it periodically scrapes metrics from configured endpoints.

---

## Architecture

```
                    +----------------+
                    |  Grafana       |
                    |  Dashboards    |
                    +-------+--------+
                            |
                            |
                    +-------v--------+
                    |  Prometheus    |
                    |  TSDB          |
                    +-------+--------+
                            |
              +-------------+--------------+
              |             |              |
              v             v              v

        Backend App     Frontend App    PostgreSQL
        /metrics        /metrics        postgres_exporter

```

---

# Deployment

Prometheus is deployed using the Prometheus Operator through the kube-prometheus-stack Helm chart.

## Prerequisites

- Kubernetes cluster running
- Helm installed
- kubectl configured

Check cluster:

```bash
kubectl get nodes
```

Check Helm:

```bash
helm version
```

---

# Install Prometheus Stack

Add Prometheus Helm repository:

```bash
helm repo add prometheus-community \
https://prometheus-community.github.io/helm-charts

helm repo update
```

Install:

```bash
helm install monitoring \
prometheus-community/kube-prometheus-stack \
-f prometheus-values.yaml \
-n monitoring \
--create-namespace
```

---

# Verify Installation

Check pods:

```bash
kubectl get pods -n monitoring
```

Expected components:

```
prometheus-operator
prometheus-server
alertmanager
grafana
kube-state-metrics
node-exporter
```

---

# Access Prometheus UI

Port forward:

```bash
kubectl port-forward \
svc/monitoring-kube-prometheus-prometheus \
9090:9090 \
-n monitoring
```

Open:

```
http://localhost:9090
```

---

# Configuration Files

## prometheus-values.yaml

Contains Prometheus deployment configuration:

- Resource limits
- Storage configuration
- Retention period
- Scrape configuration
- Alert manager integration

Example:

```yaml
prometheus:
  prometheusSpec:
    retention: 15d

    resources:
      requests:
        cpu: 500m
        memory: 2Gi

      limits:
        cpu: 1
        memory: 4Gi
```

---

# ServiceMonitor Configuration

Prometheus uses ServiceMonitor resources to discover application metrics.

Files:

```
servicemonitor-backend.yaml
servicemonitor-frontend.yaml
servicemonitor-postgres.yaml
```

## Backend Monitoring

Collects:

- HTTP request metrics
- API latency
- Error rate
- Application health

Example endpoint:

```
http://backend-service:8080/metrics
```

---

## Frontend Monitoring

Collects:

- Frontend availability
- Request metrics
- Client-side metrics

Example:

```
http://frontend-service:3000/metrics
```

---

## PostgreSQL Monitoring

Uses postgres-exporter.

Collects:

- Database connections
- Query performance
- Transactions
- Cache hit ratio
- Database size

---

# Prometheus Rules

File:

```
prometheusrule.yaml
```

Contains alert rules.

Examples:

## High CPU Usage

```yaml
alert: HighCPUUsage

expr:
  node_cpu_seconds_total > 80

for:
  5m

labels:
  severity: warning
```

---

## Pod Restart Alert

Triggers when pods continuously restart.

Example:

```
kube_pod_container_status_restarts_total > 5
```

---

# Common PromQL Queries

## CPU Usage

```promql
rate(
container_cpu_usage_seconds_total[5m]
)
```

---

## Memory Usage

```promql
container_memory_usage_bytes
```

---

## Pod Status

```promql
kube_pod_status_phase
```

---

## HTTP Request Rate

```promql
rate(
http_requests_total[5m]
)
```

---

# Storage

Prometheus stores metrics using Persistent Volumes.

Configuration:

```yaml
storageSpec:

  volumeClaimTemplate:

    spec:
      storageClassName: gp3

      resources:
        requests:
          storage: 50Gi
```

---

# Alert Flow

```
Prometheus
     |
     |
     v
PrometheusRule
     |
     |
     v
Alertmanager
     |
     |
     +------------+
     |            |
     v            v

 Email        Slack/Teams
```

---

# Troubleshooting

## Prometheus Pod Not Starting

Check:

```bash
kubectl describe pod prometheus-server -n monitoring
```

Check logs:

```bash
kubectl logs prometheus-server -n monitoring
```

---

## Target Not Showing

Check:

```bash
kubectl get servicemonitor -n monitoring
```

Validate labels:

```bash
kubectl describe servicemonitor <name> -n monitoring
```

---

## Metrics Missing

Check Prometheus targets:

```
Prometheus UI
 -> Status
 -> Targets
```

---

# Production Best Practices

✅ Enable persistent storage  
✅ Configure retention policy  
✅ Use ServiceMonitor instead of static scraping  
✅ Secure Prometheus endpoint  
✅ Configure Alertmanager notifications  
✅ Set resource limits  
✅ Backup Prometheus data  
✅ Monitor Prometheus itself  

---

# Useful Commands

List Prometheus resources:

```bash
kubectl get prometheus -n monitoring
```

List ServiceMonitors:

```bash
kubectl get servicemonitor -n monitoring
```

List Alerts:

```bash
kubectl get prometheusrule -n monitoring
```

Restart Prometheus:

```bash
kubectl rollout restart statefulset prometheus \
-n monitoring
```

---

# Monitoring Stack

| Component | Purpose |
|---|---|
| Prometheus | Metrics collection |
| Alertmanager | Alert routing |
| Grafana | Visualization |
| Loki | Log aggregation |
| Promtail | Log shipping |
| Node Exporter | Node metrics |
| Kube State Metrics | Kubernetes object metrics |

---

# Maintainer

DevOps Team

Environment:

```
Kubernetes
AWS EKS
Helm
Prometheus Operator
Grafana
Alertmanager
```