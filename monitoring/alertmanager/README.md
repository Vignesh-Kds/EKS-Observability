# Kubernetes Production Deployment Platform

A production-ready Kubernetes platform project implementing:

* Kubernetes manifests
* RBAC security
* NGINX Ingress Controller
* TLS automation with cert-manager
* Storage management
* Network security policies
* Prometheus monitoring
* Alertmanager notifications
* Grafana dashboards
* GitOps-ready deployment structure

---

# Architecture

```
                         Users
                           |
                           |
                    Route53 DNS
                           |
                           |
                AWS Load Balancer
                           |
                           |
              NGINX Ingress Controller
                           |
          +----------------+----------------+
          |                                 |
          v                                 v

     Frontend Service                Backend Service
          |                                 |
          v                                 v

     Frontend Pods                  Backend Pods
                                             |
                                             |
                                             v

                                      Database Service
                                             |
                                             |
                                             v

                                      Persistent Storage
```

---

# Project Structure

```
project/
|
├── manifests/
│
│   ├── namespace.yaml
│   ├── storageclass.yaml
│   ├── clusterissuer.yaml
│   ├── networkpolicy.yaml
│
│   ├── rbac/
│   │   ├── serviceaccount.yaml
│   │   ├── role.yaml
│   │   ├── rolebinding.yaml
│   │   ├── clusterrole.yaml
│   │   └── clusterrolebinding.yaml
│
│   └── ingress/
│       ├── namespace.yaml
│       ├── ingress-class.yaml
│       ├── deployment.yaml
│       ├── service.yaml
│       ├── configmap.yaml
│       ├── serviceaccount.yaml
│       ├── role.yaml
│       ├── rolebinding.yaml
│       ├── clusterrole.yaml
│       ├── clusterrolebinding.yaml
│       └── validating-webhook.yaml
│
├── monitoring/
│
│   ├── prometheus/
│   │
│   ├── alertmanager/
│   │   ├── alertmanager.yaml
│   │   └── alert-rules.yaml
│   │
│   ├── grafana/
│   │
│   └── loki/
│
├── scripts/
│
├── charts/
│
└── README.md
```

---

# Prerequisites

Install:

* AWS CLI
* kubectl
* Helm
* Terraform
* Docker

Verify:

```bash
kubectl version --client

helm version

terraform version
```

---

# Kubernetes Cluster Setup

Example:

```bash
kubectl get nodes
```

Expected:

```
NAME            STATUS
worker-node-1   Ready
worker-node-2   Ready
```

---

# Install NGINX Ingress Controller

Create namespace:

```bash
kubectl apply -f manifests/ingress/namespace.yaml
```

Deploy RBAC:

```bash
kubectl apply -f manifests/ingress/serviceaccount.yaml

kubectl apply -f manifests/ingress/role.yaml

kubectl apply -f manifests/ingress/rolebinding.yaml

kubectl apply -f manifests/ingress/clusterrole.yaml

kubectl apply -f manifests/ingress/clusterrolebinding.yaml
```

Deploy controller:

```bash
kubectl apply -f manifests/ingress/
```

Verify:

```bash
kubectl get pods -n ingress-nginx
```

---

# Storage Setup

Apply StorageClass:

```bash
kubectl apply -f manifests/storageclass.yaml
```

Verify:

```bash
kubectl get storageclass
```

---

# TLS Certificate Setup

Install cert-manager:

```bash
helm install cert-manager jetstack/cert-manager \
--namespace cert-manager \
--create-namespace \
--set installCRDs=true
```

Apply ClusterIssuer:

```bash
kubectl apply -f manifests/clusterissuer.yaml
```

Verify:

```bash
kubectl get clusterissuer
```

---

# Network Security

Apply network policies:

```bash
kubectl apply -f manifests/networkpolicy.yaml
```

Check:

```bash
kubectl get networkpolicy
```

---

# RBAC Security

RBAC provides:

* Authentication
* Authorization
* Least privilege access

Apply:

```bash
kubectl apply -f manifests/rbac/
```

Verify:

```bash
kubectl get role
kubectl get rolebinding
kubectl get clusterrole
kubectl get clusterrolebinding
```

---

# Monitoring Stack

Components:

```
Prometheus
     |
     |
Alert Rules
     |
     |
Alertmanager
     |
     |
Notifications

Grafana
     |
     |
Dashboards

Loki
     |
     |
Logs
```

---

# Deploy Monitoring

Example:

```bash
helm install prometheus prometheus-community/kube-prometheus-stack \
--namespace monitoring \
--create-namespace
```

Verify:

```bash
kubectl get pods -n monitoring
```

---

# Alert Testing

Check alerts:

```bash
kubectl get prometheusrules -n monitoring
```

View Alertmanager:

```bash
kubectl port-forward svc/alertmanager 9093:9093 -n monitoring
```

Open:

```
http://localhost:9093
```

---

# Useful Kubernetes Commands

## Pods

```bash
kubectl get pods -A
```

## Logs

```bash
kubectl logs <pod-name>
```

## Describe Resource

```bash
kubectl describe pod <pod-name>
```

## Events

```bash
kubectl get events --sort-by=.lastTimestamp
```

## Rollback Deployment

```bash
kubectl rollout undo deployment <name>
```

---

# Troubleshooting

## Pod CrashLoopBackOff

Check:

```bash
kubectl describe pod <pod>

kubectl logs <pod>
```

---

## ImagePullBackOff

Verify:

```bash
kubectl describe pod <pod>
```

Check:

* Image name
* Registry credentials
* Image tag

---

## Service Not Accessible

Check:

```bash
kubectl get svc

kubectl get endpoints
```

---

# Production Best Practices

Implemented:

✅ RBAC least privilege
✅ Network policies
✅ TLS encryption
✅ Automated certificate renewal
✅ Persistent storage
✅ Health probes
✅ Resource limits
✅ Monitoring and alerting
✅ High availability ingress
✅ Git-based deployment model

---

# Deployment Flow

```
Developer
    |
    |
Git Push
    |
    |
CI/CD Pipeline
    |
    |
Container Image Build
    |
    |
Kubernetes Deployment
    |
    |
Monitoring & Alerts
```

---

# License

This project is for learning, DevOps practice, and production architecture demonstration.
