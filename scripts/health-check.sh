#!/bin/bash

set -e

#############################################
# Kubernetes Health Check Script
# Project: EKS Multi-Service Application
#############################################

NAMESPACE=${1:-production}

echo "===================================="
echo "Kubernetes Health Check"
echo "Namespace: ${NAMESPACE}"
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
# Cluster Health
#############################################

echo ""
echo "Checking Kubernetes Cluster..."

kubectl cluster-info

echo ""

kubectl get nodes

echo ""

kubectl get nodes \
-o wide


#############################################
# Namespace Check
#############################################

echo ""
echo "Checking Namespace..."

if kubectl get namespace "${NAMESPACE}" >/dev/null 2>&1
then
    echo "Namespace ${NAMESPACE} exists"
else
    echo "Namespace ${NAMESPACE} not found"
    exit 1
fi


#############################################
# Pod Health
#############################################

echo ""
echo "Checking Pods..."

kubectl get pods \
-n "${NAMESPACE}" \
-o wide


echo ""
echo "Unhealthy Pods"

kubectl get pods \
-n "${NAMESPACE}" \
| grep -E "CrashLoopBackOff|Error|Pending|ImagePullBackOff" \
|| echo "No unhealthy pods found"


#############################################
# Deployment Health
#############################################

echo ""
echo "Checking Deployments..."

kubectl get deployments \
-n "${NAMESPACE}"


echo ""

kubectl rollout status \
deployment/frontend \
-n "${NAMESPACE}" \
--timeout=60s || true


kubectl rollout status \
deployment/backend \
-n "${NAMESPACE}" \
--timeout=60s || true



#############################################
# Service Health
#############################################

echo ""
echo "Checking Services..."

kubectl get services \
-n "${NAMESPACE}"


#############################################
# Endpoint Check
#############################################

echo ""
echo "Checking Service Endpoints..."

kubectl get endpoints \
-n "${NAMESPACE}"


#############################################
# Database Health
#############################################

echo ""
echo "Checking Database..."

POSTGRES_POD=$(kubectl get pods \
-n "${NAMESPACE}" \
-l app=postgres \
-o jsonpath="{.items[0].metadata.name}" \
2>/dev/null || true)


if [ -n "$POSTGRES_POD" ]
then

    kubectl exec \
    -n "${NAMESPACE}" \
    "${POSTGRES_POD}" \
    -- pg_isready \
    || echo "Database health check failed"

else

    echo "PostgreSQL pod not found"

fi



#############################################
# Ingress Check
#############################################

echo ""
echo "Checking Ingress..."

kubectl get ingress \
-n "${NAMESPACE}" \
|| echo "No ingress configured"



#############################################
# Monitoring Health
#############################################

echo ""
echo "Checking Monitoring Stack..."


if kubectl get namespace monitoring >/dev/null 2>&1
then

    echo "Prometheus/Grafana namespace found"

    kubectl get pods \
    -n monitoring

else

    echo "Monitoring namespace not found"

fi



#############################################
# Helm Release Status
#############################################

echo ""
echo "Helm Releases..."

helm list \
--all-namespaces



#############################################
# Events
#############################################

echo ""
echo "Recent Kubernetes Events..."

kubectl get events \
-n "${NAMESPACE}" \
--sort-by=.lastTimestamp \
| tail -20



#############################################
# Final Result
#############################################

echo ""
echo "===================================="
echo "Health Check Completed"
echo "===================================="