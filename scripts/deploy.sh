#!/bin/bash

set -e

#############################################
# Kubernetes Deployment Script
# Project: EKS Multi-Service Application
#############################################

NAMESPACE=${1:-production}
ENVIRONMENT=${2:-prod}

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "===================================="
echo "Starting Kubernetes Deployment"
echo "Namespace : ${NAMESPACE}"
echo "Environment : ${ENVIRONMENT}"
echo "===================================="


#############################################
# Validate Tools
#############################################

for tool in kubectl helm
do
    if ! command -v $tool &> /dev/null
    then
        echo "$tool is not installed"
        exit 1
    fi
done


#############################################
# Verify Cluster Connection
#############################################

echo ""
echo "Checking Kubernetes Cluster..."

kubectl cluster-info > /dev/null 2>&1 || {

    echo "Cannot connect to Kubernetes cluster"
    exit 1

}


#############################################
# Create Namespace
#############################################

echo ""
echo "Creating Namespace..."

chmod +x "${PROJECT_ROOT}/scripts/create-namespace.sh"

"${PROJECT_ROOT}/scripts/create-namespace.sh" "${NAMESPACE}"


#############################################
# Deploy Kubernetes Manifests
#############################################

echo ""
echo "Applying Kubernetes Manifests..."


kubectl apply \
-f "${PROJECT_ROOT}/manifests/" \
-n "${NAMESPACE}"


#############################################
# Deploy Backend
#############################################

echo ""
echo "Deploying Backend..."


helm upgrade --install backend \
"${PROJECT_ROOT}/charts/backend" \
-n "${NAMESPACE}" \
--create-namespace \
--values "${PROJECT_ROOT}/charts/backend/values.yaml"



#############################################
# Deploy Frontend
#############################################

echo ""
echo "Deploying Frontend..."


helm upgrade --install frontend \
"${PROJECT_ROOT}/charts/frontend" \
-n "${NAMESPACE}" \
--values "${PROJECT_ROOT}/charts/frontend/values.yaml"



#############################################
# Deploy PostgreSQL
#############################################

echo ""
echo "Deploying Database..."


helm upgrade --install postgres \
"${PROJECT_ROOT}/charts/postgres" \
-n "${NAMESPACE}" \
--values "${PROJECT_ROOT}/charts/postgres/values.yaml"



#############################################
# Deploy Monitoring Stack
#############################################

echo ""
echo "Deploying Monitoring..."


helm upgrade --install monitoring \
prometheus-community/kube-prometheus-stack \
-n monitoring \
--create-namespace \
-f "${PROJECT_ROOT}/monitoring/prometheus/prometheus-values.yaml"



#############################################
# Deploy Logging Stack
#############################################

echo ""
echo "Deploying Loki Stack..."


helm upgrade --install loki \
grafana/loki-stack \
-n monitoring \
-f "${PROJECT_ROOT}/monitoring/loki/loki-values.yaml"



#############################################
# Wait For Deployments
#############################################

echo ""
echo "Waiting for Application Pods..."


kubectl wait \
--for=condition=available \
deployment/frontend \
-n "${NAMESPACE}" \
--timeout=300s || true


kubectl wait \
--for=condition=available \
deployment/backend \
-n "${NAMESPACE}" \
--timeout=300s || true



#############################################
# Deployment Status
#############################################

echo ""
echo "===================================="
echo "Deployment Status"
echo "===================================="


kubectl get pods -n "${NAMESPACE}"

echo ""

kubectl get svc -n "${NAMESPACE}"


echo ""
echo "===================================="
echo "Deployment Completed Successfully"
echo "===================================="