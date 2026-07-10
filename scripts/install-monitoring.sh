#!/bin/bash

set -e

#############################################
# Monitoring Stack Installation Script
# Project: EKS Multi-Service Application
#############################################

MONITORING_NAMESPACE="monitoring"
PROMETHEUS_RELEASE="kube-prometheus-stack"
LOKI_RELEASE="loki"

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"


echo "===================================="
echo "Installing Monitoring Stack"
echo "===================================="


#############################################
# Check Required Tools
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
# Verify Kubernetes Connection
#############################################

echo ""
echo "Checking Kubernetes Cluster..."

kubectl cluster-info > /dev/null 2>&1 || {

    echo "Unable to connect to Kubernetes"
    exit 1

}



#############################################
# Create Monitoring Namespace
#############################################

echo ""
echo "Creating Monitoring Namespace..."

kubectl create namespace ${MONITORING_NAMESPACE} \
--dry-run=client \
-o yaml | kubectl apply -f -



#############################################
# Add Helm Repositories
#############################################

echo ""
echo "Adding Helm Repositories..."


helm repo add prometheus-community \
https://prometheus-community.github.io/helm-charts


helm repo add grafana \
https://grafana.github.io/helm-charts


helm repo update



#############################################
# Install Prometheus + Grafana + Alertmanager
#############################################

echo ""
echo "Installing Prometheus Stack..."


helm upgrade --install ${PROMETHEUS_RELEASE} \
prometheus-community/kube-prometheus-stack \
\
--namespace ${MONITORING_NAMESPACE} \
\
-f ${PROJECT_ROOT}/monitoring/prometheus/prometheus-values.yaml



#############################################
# Install Loki
#############################################

echo ""
echo "Installing Loki Stack..."


helm upgrade --install ${LOKI_RELEASE} \
grafana/loki-stack \
\
--namespace ${MONITORING_NAMESPACE} \
\
-f ${PROJECT_ROOT}/monitoring/loki/loki-values.yaml



#############################################
# Install Promtail
#############################################

echo ""
echo "Installing Promtail..."


helm upgrade --install promtail \
grafana/promtail \
\
--namespace ${MONITORING_NAMESPACE} \
\
-f ${PROJECT_ROOT}/monitoring/loki/promtail-values.yaml



#############################################
# Apply ServiceMonitors
#############################################

echo ""
echo "Applying ServiceMonitors..."


kubectl apply \
-f ${PROJECT_ROOT}/monitoring/prometheus/servicemonitor-backend.yaml \
-n ${MONITORING_NAMESPACE}


kubectl apply \
-f ${PROJECT_ROOT}/monitoring/prometheus/servicemonitor-frontend.yaml \
-n ${MONITORING_NAMESPACE}


kubectl apply \
-f ${PROJECT_ROOT}/monitoring/prometheus/servicemonitor-postgres.yaml \
-n ${MONITORING_NAMESPACE}



#############################################
# Apply Prometheus Rules
#############################################

echo ""
echo "Applying Alert Rules..."


kubectl apply \
-f ${PROJECT_ROOT}/monitoring/prometheus/prometheusrule.yaml \
-n ${MONITORING_NAMESPACE}



#############################################
# Wait For Components
#############################################

echo ""
echo "Waiting For Monitoring Pods..."


kubectl wait \
--for=condition=Ready pod \
--all \
-n ${MONITORING_NAMESPACE} \
--timeout=600s || true



#############################################
# Validation
#############################################

echo ""
echo "Monitoring Pods"

kubectl get pods \
-n ${MONITORING_NAMESPACE}



echo ""
echo "Monitoring Services"

kubectl get svc \
-n ${MONITORING_NAMESPACE}



echo ""
echo "Prometheus Resources"

kubectl get prometheus \
-n ${MONITORING_NAMESPACE}



echo ""
echo "Grafana Access"

kubectl get svc \
-n ${MONITORING_NAMESPACE} \
| grep grafana || true



echo ""
echo "===================================="
echo "Monitoring Installation Completed"
echo "===================================="