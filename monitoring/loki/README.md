# Loki Logging Stack

## Overview

Grafana Loki is a log aggregation system designed for Kubernetes environments.

This component collects, stores, and queries application and infrastructure logs using:

* Loki → Log storage and querying engine
* Promtail → Log collection agent
* Grafana → Log visualization

The stack provides centralized logging for Kubernetes workloads.

---

# Architecture

```text
                         Kubernetes Cluster

                                 |
                                 |
                         Application Pods

                                 |
                                 |
                         Container Logs
                         /var/log/pods

                                 |
                                 |
                                 v

                         Promtail DaemonSet

                                 |
                                 |
                                 v

                              Loki

              +------------------+----------------+

              |                  |                |

          Distributor        Ingester          Querier

              |
              |
              v

          Object Storage
              |
              |
              v

             AWS S3


                                 |
                                 |
                                 v

                              Grafana

                         Log Visualization
```

---

# Directory Structure

```text
loki/
|
├── loki-values.yaml
│
├── promtail-values.yaml
│
└── README.md
```

---

# Components

## Loki

Loki is responsible for:

* Receiving logs
* Indexing log metadata
* Storing log chunks
* Querying logs using LogQL

Configuration:

```text
loki-values.yaml
```

---

## Promtail

Promtail runs as a Kubernetes DaemonSet.

Responsibilities:

* Runs on every worker node
* Reads container logs
* Adds Kubernetes metadata
* Sends logs to Loki

Configuration:

```text
promtail-values.yaml
```

---

# Prerequisites

Required:

* Kubernetes cluster
* Helm
* Grafana
* Persistent storage
* Object storage (production)

Verify:

```bash
kubectl get nodes

helm version
```

---

# Install Loki

Add Helm repository:

```bash
helm repo add grafana https://grafana.github.io/helm-charts

helm repo update
```

Install Loki:

```bash
helm install loki grafana/loki \
-f loki-values.yaml \
-n monitoring \
--create-namespace
```

---

# Install Promtail

Install Promtail agent:

```bash
helm install promtail grafana/promtail \
-f promtail-values.yaml \
-n monitoring
```

---

# Verify Deployment

Check Loki:

```bash
kubectl get pods -n monitoring
```

Expected:

```text
loki-distributor
loki-ingester
loki-querier
loki-gateway
```

Check Promtail:

```bash
kubectl get pods -n monitoring
```

Expected:

```text
promtail-xxxxx Running
```

---

# Verify Loki Health

Port forward:

```bash
kubectl port-forward svc/loki-gateway 3100:80 -n monitoring
```

Test:

```bash
curl http://localhost:3100/ready
```

Expected:

```text
ready
```

---

# Grafana Integration

Add Loki datasource:

```
Grafana
    |
    |
Connections
    |
    |
Data Sources
    |
    |
Add Loki
```

URL:

```text
http://loki-gateway.monitoring.svc.cluster.local
```

---

# Log Queries (LogQL)

## View all production logs

```logql
{namespace="production"}
```

---

## Backend application logs

```logql
{app="backend"}
```

---

## Frontend logs

```logql
{app="frontend"}
```

---

## Search errors

```logql
{namespace="production"} |= "ERROR"
```

---

## Search HTTP failures

```logql
{app="backend"} |= "500"
```

---

# Kubernetes Log Flow

```text
Application

     |
     v

Container stdout/stderr

     |
     v

/var/log/pods

     |
     v

Promtail

     |
     v

Loki

     |
     v

Grafana Explore
```

---

# Production Storage

Recommended:

```
Loki
 |
 |
AWS S3
 |
 |
Log Chunks
```

Benefits:

* Durable storage
* Cost efficient
* Long retention
* Disaster recovery

---

# Monitoring Loki

Recommended alerts:

## Loki Down

```promql
up{job="loki"} == 0
```

---

## High Log Ingestion

```promql
rate(loki_distributor_bytes_received_total[5m])
```

---

## Query Latency

```promql
loki_request_duration_seconds
```

---

# Troubleshooting

## Promtail Not Sending Logs

Check:

```bash
kubectl logs -n monitoring \
-l app.kubernetes.io/name=promtail
```

Verify:

* Loki URL
* Node log mounts
* RBAC permissions

---

## Loki Pod Restarting

Check:

```bash
kubectl describe pod <loki-pod> -n monitoring
```

Common causes:

* Storage unavailable
* Memory limits
* Invalid configuration

---

## No Logs in Grafana

Verify:

```bash
kubectl get pods -n monitoring
```

Check Promtail:

```bash
kubectl logs <promtail-pod> -n monitoring
```

Test query:

```logql
{namespace="default"}
```

---

# Best Practices

Implemented:

✅ Centralized Kubernetes logging
✅ Git-managed configuration
✅ DaemonSet-based log collection
✅ Kubernetes metadata enrichment
✅ Grafana integration
✅ S3-backed long-term storage
✅ Log querying with LogQL
✅ Production observability model

---

# Complete Observability Stack

```text
                    Kubernetes Cluster

                           |

        +------------------+------------------+

        |                  |                  |

    Prometheus          Loki            Alertmanager

        |                  |                  |

        v                  v                  v

     Metrics            Logs             Alerts

             \            |             /

                      Grafana

                         |

                  Dashboards & Reports
```
