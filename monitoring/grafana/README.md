# Grafana Monitoring Setup

## Overview

Grafana provides visualization and dashboarding for the Kubernetes production monitoring platform.

It connects with multiple data sources:

* Prometheus → Metrics
* Loki → Logs
* PostgreSQL → Database analytics

Grafana dashboards provide visibility into:

* Application performance
* Kubernetes cluster health
* Database performance
* Infrastructure utilization

---

# Architecture

```text
                    Kubernetes Cluster

                           |
                           |
                    Prometheus
                           |
                           |
        +------------------+------------------+
        |                  |                  |
        v                  v                  v

   Frontend Metrics   Backend Metrics   Kubernetes Metrics


                           |
                           v

                        Grafana

             +-------------+-------------+
             |             |             |
             v             v             v

        Dashboards       Alerts        Logs

                         |
                         |
                         v

                       Loki
```

---

# Directory Structure

```text
grafana/
|
├── dashboards/
│
│   ├── frontend-dashboard.json
│   ├── backend-dashboard.json
│   ├── kubernetes-dashboard.json
│   └── postgres-dashboard.json
│
├── datasources/
│
│   └── datasource.yaml
│
└── README.md
```

---

# Prerequisites

Required components:

* Kubernetes Cluster
* Prometheus
* Alertmanager
* Loki
* Grafana
* kube-state-metrics
* node-exporter

Verify monitoring namespace:

```bash
kubectl get pods -n monitoring
```

Expected:

```text
prometheus
alertmanager
grafana
loki
```

---

# Install Grafana

Using Helm:

```bash
helm repo add grafana https://grafana.github.io/helm-charts

helm repo update
```

Install:

```bash
helm install grafana grafana/grafana \
--namespace monitoring \
--create-namespace
```

Verify:

```bash
kubectl get pods -n monitoring
```

---

# Configure Datasources

Datasource configuration:

```text
datasources/
└── datasource.yaml
```

Configured datasources:

## Prometheus

Purpose:

* Kubernetes metrics
* Application metrics
* Infrastructure metrics

## Loki

Purpose:

* Container logs
* Application logs
* Kubernetes logs

## PostgreSQL

Purpose:

* Database analytics
* SQL dashboards

---

# Apply Datasource Configuration

Create ConfigMap:

```bash
kubectl create configmap grafana-datasources \
--from-file=datasource.yaml \
-n monitoring
```

Verify:

```bash
kubectl get configmap -n monitoring
```

---

# Dashboard Configuration

Available dashboards:

## Frontend Dashboard

File:

```text
frontend-dashboard.json
```

Metrics:

* Request rate
* HTTP status codes
* Error rate
* Response latency
* CPU usage
* Memory usage
* Pod availability

---

## Backend Dashboard

File:

```text
backend-dashboard.json
```

Metrics:

* API requests
* API latency
* HTTP errors
* Container resources
* Pod restarts

---

## Kubernetes Dashboard

File:

```text
kubernetes-dashboard.json
```

Metrics:

* Node health
* CPU utilization
* Memory usage
* Pod count
* Deployment status
* Namespace usage

---

## PostgreSQL Dashboard

File:

```text
postgres-dashboard.json
```

Metrics:

* Database availability
* Connections
* Transactions
* Cache hit ratio
* Database size
* Locks
* Deadlocks

---

# Import Dashboards Manually

Grafana UI:

```
Dashboards
      |
      v
Import
      |
      v
Upload JSON File
      |
      v
Select Prometheus Datasource
      |
      v
Import
```

---

# Access Grafana

Port forward:

```bash
kubectl port-forward svc/grafana 3000:80 -n monitoring
```

Open:

```text
http://localhost:3000
```

---

# Get Admin Password

```bash
kubectl get secret grafana \
-n monitoring \
-o jsonpath="{.data.admin-password}" | base64 --decode
```

Login:

```text
Username:
admin

Password:
<decoded-password>
```

---

# Dashboard Provisioning (GitOps)

Recommended production approach:

```text
Git Repository

       |
       |
       v

Dashboard JSON Files

       |
       |
       v

Kubernetes ConfigMap

       |
       |
       v

Grafana Sidecar

       |
       |
       v

Automatic Dashboard Loading
```

---

# Monitoring Workflow

```text
Application
     |
     |
Expose Metrics Endpoint
     |
     |
Prometheus Scrapes Metrics
     |
     |
Grafana Visualizes Data
     |
     |
Alertmanager Sends Notifications
```

---

# Best Practices

Implemented:

✅ Dashboards stored in Git
✅ Datasources provisioned automatically
✅ Separate dashboards per service
✅ Kubernetes resource monitoring
✅ Database monitoring
✅ Log aggregation with Loki
✅ Production-ready observability model

---

# Troubleshooting

## Grafana Pod Not Running

Check:

```bash
kubectl describe pod <grafana-pod> -n monitoring
```

View logs:

```bash
kubectl logs <grafana-pod> -n monitoring
```

---

## Dashboard Not Loading

Check:

```bash
kubectl get configmap -n monitoring
```

Verify JSON syntax.

---

## Prometheus Data Missing

Check datasource:

```text
Grafana
 → Connections
 → Data Sources
 → Prometheus
 → Test
```

---

# Production Monitoring Stack

```text
                    Users

                      |
                      v

                 Application

                      |
                      v

              Prometheus Metrics

                      |
                      v

                   Grafana

        +-------------+-------------+

        v             v             v

   App Dashboard  K8s Dashboard  DB Dashboard
```
