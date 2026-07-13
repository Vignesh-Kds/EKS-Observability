# EKS Observability Project

A production-grade **Amazon EKS Observability Platform** that provides end-to-end monitoring, logging, alerting, and incident response for Kubernetes workloads running on Amazon EKS. The project uses **Prometheus**, **Grafana**, **Alertmanager**, **Loki**, **Promtail**, **AWS CloudWatch**, **NGINX Ingress**, and **Sentry**, along with **GitHub Actions CI/CD**, **Helm**, and **Terraform** to automate deployment and operations.

This project is designed for:

- DevOps Engineers
- Site Reliability Engineers (SRE)
- Platform Engineers
- Cloud Engineers
- Kubernetes Administrators
- DevOps Portfolio Projects
- Production Environments

---

# Architecture

```text
                           Internet
                               │
                               ▼
                    AWS Application Load Balancer
                               │
                               ▼
                      NGINX Ingress Controller
                               │
          ┌────────────────────┴────────────────────┐
          │                                         │
          ▼                                         ▼
     Frontend Service                        Backend Service
          │                                         │
          └────────────────────┬────────────────────┘
                               │
                               ▼
                           Amazon EKS
                               │
        ┌───────────────┬──────────────┬──────────────┐
        ▼               ▼              ▼              ▼
  Prometheus        Grafana        Alertmanager      Loki
        │                                               │
        ▼                                               ▼
  kube-state-metrics                               Promtail
        │
        ▼
   Node Exporter
                               │
                               ▼
                    Amazon CloudWatch Logs
                               │
                               ▼
                           Sentry
```

---

# Features

- Amazon EKS deployment
- Infrastructure as Code using Terraform
- Helm-based application deployment
- Kubernetes monitoring with Prometheus
- Grafana dashboards
- Alertmanager notifications
- Centralized logging with Loki
- Promtail log collection
- AWS CloudWatch integration
- NGINX Ingress monitoring
- Sentry application monitoring
- GitHub Actions CI/CD
- Kubernetes security scanning
- Production incident runbooks
- Deployment automation
- Health check scripts

---

# Technology Stack

| Technology | Purpose |
|------------|---------|
| Amazon EKS | Kubernetes Platform |
| Terraform | Infrastructure Provisioning |
| Helm | Kubernetes Package Manager |
| Kubernetes | Container Orchestration |
| Prometheus | Metrics Collection |
| Grafana | Dashboards |
| Alertmanager | Alert Routing |
| Loki | Log Aggregation |
| Promtail | Log Collection |
| AWS CloudWatch | Cloud Monitoring |
| AWS IAM | Authentication & Authorization |
| AWS ALB | External Load Balancer |
| NGINX Ingress | Traffic Routing |
| Sentry | Error Monitoring |
| GitHub Actions | CI/CD |
| Trivy | Security Scanning |
| kube-score | Kubernetes Best Practices |
| KubeLinter | Manifest Validation |
| ShellCheck | Shell Script Validation |

---

# Repository Structure

```text
eks-observability-project/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── cd.yml
│       ├── helm-deploy.yml
│       └── security-scan.yml
│
├── terraform/
│   ├── vpc.tf
│   ├── eks.tf
│   ├── iam.tf
│   ├── nodegroups.tf
│   ├── outputs.tf
│   ├── variables.tf
│   └── providers.tf
│
├── charts/
│   ├── prometheus/
│   ├── grafana/
│   ├── loki/
│   ├── alertmanager/
│   └── ingress-nginx/
│
├── manifests/
│   ├── namespace.yaml
│   ├── servicemonitor.yaml
│   ├── prometheusrule.yaml
│   ├── ingress.yaml
│   └── networkpolicy.yaml
│
├── alertmanager/
├── grafana/
├── prometheus/
├── loki/
├── sentry/
│
├── dashboards/
│
├── monitoring/
│
├── scripts/
│   ├── deploy.sh
│   ├── destroy.sh
│   ├── install-monitoring.sh
│   ├── install-ingress.sh
│   ├── health-check.sh
│   └── rollback.sh
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
└── README.md
```

---

# Project Components

## Infrastructure

Provisioned using Terraform:

- Amazon VPC
- Public and Private Subnets
- Internet Gateway
- NAT Gateway
- Route Tables
- Amazon EKS Cluster
- Managed Node Groups
- IAM Roles
- Security Groups

---

## Monitoring

Prometheus collects metrics from:

- Kubernetes API Server
- kube-state-metrics
- Node Exporter
- Pods
- Deployments
- Services
- NGINX Ingress
- Applications

---

## Visualization

Grafana dashboards include:

- Cluster Overview
- Node Health
- CPU & Memory
- Network Usage
- Pod Health
- Persistent Volumes
- Application Performance
- Ingress Metrics

---

## Logging

Loki stores logs collected by Promtail from:

- Kubernetes Pods
- Containers
- Worker Nodes
- System Components

Logs are searchable in Grafana.

---

## Alerting

Alertmanager sends notifications to:

- Email
- Slack
- Microsoft Teams
- PagerDuty
- Webhooks

Alert categories include:

- High CPU Usage
- High Memory Usage
- Disk Pressure
- Pod CrashLoopBackOff
- Node Not Ready
- Ingress 5XX Errors
- Certificate Expiration
- High Latency

---

# Deployment

## 1. Provision Infrastructure

```bash
cd terraform

terraform init

terraform plan

terraform apply
```

---

## 2. Update kubeconfig

```bash
aws eks update-kubeconfig \
--region ap-south-1 \
--name eks-observability
```

---

## 3. Install Monitoring

```bash
./scripts/install-monitoring.sh
```

---

## 4. Install NGINX Ingress

```bash
./scripts/install-ingress.sh
```

---

## 5. Deploy Helm Charts

```bash
helm upgrade --install prometheus ./charts/prometheus -n monitoring

helm upgrade --install grafana ./charts/grafana -n monitoring

helm upgrade --install loki ./charts/loki -n monitoring

helm upgrade --install alertmanager ./charts/alertmanager -n monitoring
```

---

## 6. Verify Deployment

```bash
kubectl get pods -A

kubectl get svc -A

kubectl get ingress -A

kubectl get nodes
```

---

# GitHub Actions

The project contains four GitHub Actions workflows.

| Workflow | Purpose |
|----------|---------|
| ci.yml | Validate manifests and run CI checks |
| cd.yml | Deploy Kubernetes resources |
| helm-deploy.yml | Deploy Helm charts |
| security-scan.yml | Run security and compliance scans |

---

# Incident Runbooks

Included production runbooks:

- Alert Response Checklist
- Backend Service Down
- Certificate Expired
- Database Connection Failure
- Deployment Rollback
- Disk Pressure
- High Latency
- ImagePullBackOff
- Ingress 5XX Errors
- Memory Pressure
- Node Not Ready
- Pod CrashLoopBackOff

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
     ├──────────────┐
     ▼              ▼
 CI Pipeline   Security Scan
     │
     ▼
 Helm Deploy
     │
     ▼
 Amazon EKS
     │
     ▼
 Monitoring Stack
```

---

# Security

The project includes automated security checks using:

- Trivy
- KubeLinter
- kube-score
- YAML Lint
- ShellCheck

Scans are executed on:

- Pull Requests
- Push Events
- Weekly Scheduled Runs
- Manual Workflow Dispatch

---

# Best Practices

- Use IAM Roles for Service Accounts (IRSA).
- Enable Prometheus retention policies.
- Configure persistent storage for Grafana and Loki.
- Secure Ingress using TLS certificates.
- Enable RBAC with least privilege.
- Use Horizontal Pod Autoscaler (HPA).
- Enable Cluster Autoscaler.
- Regularly review dashboards and alerts.
- Test disaster recovery and rollback procedures.

---

# Future Enhancements

- Amazon Managed Prometheus (AMP)
- Amazon Managed Grafana (AMG)
- OpenTelemetry Collector
- AWS X-Ray integration
- Tempo distributed tracing
- Argo CD GitOps deployment
- Multi-cluster observability
- Thanos for long-term metrics storage
- AWS Karpenter for node provisioning
- AI-powered anomaly detection

---

# Skills Demonstrated

- Amazon EKS
- Terraform
- Kubernetes
- Helm
- GitHub Actions
- Prometheus
- Grafana
- Alertmanager
- Loki
- Promtail
- AWS CloudWatch
- IAM
- NGINX Ingress
- CI/CD
- Infrastructure as Code (IaC)
- Kubernetes Security
- Production Monitoring
- Incident Response
- SRE Practices

---

# License

This project is intended for educational purposes, interview preparation, production demonstrations, and DevOps portfolio showcases. Replace this section with your preferred open-source license before publishing the repository.
