#!/bin/bash

set -euo pipefail

#############################################
# Monitoring Stack Installation Script
# Project: EKS Multi-Service Application
#############################################

MONITORING_NAMESPACE="monitoring"

PROMETHEUS_RELEASE="kube-prometheus-stack"
LOKI_RELEASE="loki"
PROMTAIL_RELEASE="promtail"

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"


echo "===================================="
echo "Installing Monitoring Stack"
echo "===================================="


#############################################
# Check Required Tools
#############################################

for tool in kubectl helm
do
    if ! command -v "${tool}" &> /dev/null
    then
        echo "ERROR: ${tool} is not installed"
        exit 1
    fi
done


#############################################
# Verify Kubernetes Connection
#############################################

echo ""
echo "Checking Kubernetes Cluster..."

if ! kubectl cluster-info > /dev/null 2>&1
then
    echo "ERROR: Unable to connect to Kubernetes cluster"
    exit 1
fi


echo "Kubernetes connection successful"


#############################################
# Create Monitoring Namespace
#############################################

echo ""
echo "Creating Monitoring Namespace..."


kubectl create namespace "${MONITORING_NAMESPACE}" \
--dry-run=client \
-o yaml | kubectl apply -f -



#############################################
# Add Helm Repositories
#############################################

echo ""
echo "Adding Helm Repositories..."


helm repo add prometheus-community \
https://prometheus-community.github.io/helm-charts \
|| true


helm repo add grafana \
https://grafana.github.io/helm-charts \
|| true


helm repo update



#############################################
# Install Prometheus Stack
#############################################

echo ""
echo "Installing Prometheus + Grafana + Alertmanager..."


helm upgrade --install "${PROMETHEUS_RELEASE}" \
prometheus-community/kube-prometheus-stack \
--namespace "${MONITORING_NAMESPACE}" \
--create-namespace \
-f "${PROJECT_ROOT}/monitoring/prometheus/prometheus-values.yaml" \
--wait \
--timeout 10m



#############################################
# Install Loki
#############################################

echo ""
echo "Installing Loki..."


helm upgrade --install "${LOKI_RELEASE}" \
grafana/loki-stack \
--namespace "${MONITORING_NAMESPACE}" \
-f "${PROJECT_ROOT}/monitoring/loki/loki-values.yaml" \
--wait \
--timeout 10m



#############################################
# Install Promtail
#############################################

echo ""
echo "Installing Promtail..."


helm upgrade --install "${PROMTAIL_RELEASE}" \
grafana/promtail \
--namespace "${MONITORING_NAMESPACE}" \
-f "${PROJECT_ROOT}/monitoring/loki/promtail-values.yaml" \
--wait \
--timeout 10m



#############################################
# Apply ServiceMonitors
#############################################

echo ""
echo "Applying ServiceMonitors..."


kubectl apply \
-f "${PROJECT_ROOT}/monitoring/prometheus/servicemonitor-backend.yaml" \
-n "${MONITORING_NAMESPACE}"


kubectl apply \
-f "${PROJECT_ROOT}/monitoring/prometheus/servicemonitor-frontend.yaml" \
-n "${MONITORING_NAMESPACE}"


kubectl apply \
-f "${PROJECT_ROOT}/monitoring/prometheus/servicemonitor-postgres.yaml" \
-n "${MONITORING_NAMESPACE}"



#############################################
# Apply Prometheus Rules
#############################################

echo ""
echo "Applying Alert Rules..."


kubectl apply \
-f "${PROJECT_ROOT}/monitoring/prometheus/prometheusrule.yaml" \
-n "${MONITORING_NAMESPACE}"



#############################################
# Wait For Monitoring Pods
#############################################

echo ""
echo "Waiting For Monitoring Pods..."


kubectl wait \
--for=condition=Ready pod \
--all \
-n "${MONITORING_NAMESPACE}" \
--timeout=600s



#############################################
# Validation
#############################################

echo ""
echo "===================================="
echo "Monitoring Pods"
echo "===================================="

kubectl get pods \
-n "${MONITORING_NAMESPACE}"



echo ""
echo "===================================="
echo "Monitoring Services"
echo "===================================="

kubectl get svc \
-n "${MONITORING_NAMESPACE}"



echo ""
echo "===================================="
echo "Prometheus Resources"
echo "===================================="

kubectl get prometheus \
-n "${MONITORING_NAMESPACE}"



echo ""
echo "===================================="
echo "Grafana Service"
echo "===================================="

kubectl get svc \
-n "${MONITORING_NAMESPACE}" \
| grep grafana || echo "Grafana service not found"



echo ""
echo "===================================="
echo "Monitoring Installation Completed"
echo "===================================="
