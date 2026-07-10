#!/bin/bash

set -e

#############################################
# Kubernetes Namespace Creation Script
# Project: EKS Multi-Service Application
#############################################

NAMESPACE=${1:-production}

echo "===================================="
echo "Creating Kubernetes Namespace"
echo "Namespace: ${NAMESPACE}"
echo "===================================="


#############################################
# Check kubectl availability
#############################################

if ! command -v kubectl &> /dev/null
then
    echo "kubectl is not installed"
    exit 1
fi


#############################################
# Check Kubernetes Connection
#############################################

kubectl cluster-info > /dev/null 2>&1 || {

    echo "Unable to connect to Kubernetes cluster"
    exit 1

}


#############################################
# Create Namespace
#############################################

if kubectl get namespace "${NAMESPACE}" >/dev/null 2>&1
then

    echo "Namespace ${NAMESPACE} already exists"

else

    kubectl create namespace "${NAMESPACE}"

    echo "Namespace ${NAMESPACE} created"

fi


#############################################
# Apply Namespace Labels
#############################################

echo "Applying namespace labels..."

kubectl label namespace "${NAMESPACE}" \
app.kubernetes.io/part-of=eks-microservices \
environment="${NAMESPACE}" \
--overwrite


#############################################
# Apply Resource Quota
#############################################

echo "Applying Resource Quota..."


kubectl apply -n "${NAMESPACE}" -f - <<EOF

apiVersion: v1
kind: ResourceQuota
metadata:
  name: ${NAMESPACE}-quota

spec:

  hard:

    requests.cpu: "10"

    requests.memory: 20Gi

    limits.cpu: "20"

    limits.memory: 40Gi

    pods: "50"

EOF


#############################################
# Apply Limit Range
#############################################

echo "Applying Default Container Limits..."


kubectl apply -n "${NAMESPACE}" -f - <<EOF

apiVersion: v1
kind: LimitRange

metadata:

  name: default-container-limits


spec:

  limits:

  - type: Container

    default:

      cpu: "500m"

      memory: "512Mi"

    defaultRequest:

      cpu: "100m"

      memory: "128Mi"

EOF


#############################################
# Verify
#############################################

echo ""
echo "Namespace Details"

kubectl get namespace "${NAMESPACE}"


echo ""
echo "Resource Quota"

kubectl get resourcequota \
-n "${NAMESPACE}"


echo ""
echo "===================================="
echo "Namespace Setup Completed"
echo "===================================="