# Deployment & Operations Scripts

## Overview

This directory contains automation scripts used for building, deploying, monitoring, testing, and maintaining the Kubernetes-based application platform.

These scripts simplify common DevOps operations across development, staging, and production environments.

---

# Directory Structure
cripts/
│
├── build-images.sh
├── cleanup.sh
├── create-namespace.sh
├── deploy.sh
├── health-check.sh
├── install-ingress.sh
├── install-monitoring.sh
├── load-test.sh
├── rollback.sh
└── README.md


---

# Prerequisites

Before running scripts, ensure the following tools are installed:

## Required Tools

| Tool | Purpose |
|---|---|
| kubectl | Kubernetes cluster management |
| helm | Kubernetes package manager |
| docker | Container image build |
| k6 | Load testing |
| AWS CLI | EKS/AWS operations |

Verify:

```bash
kubectl version --client

helm version

docker --version

aws --version