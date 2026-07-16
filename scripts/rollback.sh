#!/bin/bash

set -euo pipefail

#############################################
# Kubernetes Rollback Script
# Project: EKS Multi-Service Application
#############################################

NAMESPACE=${1:-production}
RELEASE=${2:-backend}
REVISION=${3:-}

DEPLOYMENT=${4:-${RELEASE}}

echo "===================================="
echo "Starting Helm Rollback"
echo "===================================="

echo "Namespace  : ${NAMESPACE}"
echo "Release    : ${RELEASE}"
echo "Deployment : ${DEPLOYMENT}"


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
# Check Kubernetes Connection
#############################################

echo ""
echo "Checking Kubernetes Cluster..."


if ! kubectl cluster-info >/dev/null 2>&1
then
    echo "ERROR: Unable to connect to Kubernetes cluster"
    exit 1
fi


echo "Cluster connection successful"



#############################################
# Check Helm Release
#############################################

echo ""
echo "Checking Helm Release..."


if ! helm status "${RELEASE}" \
-n "${NAMESPACE}" >/dev/null 2>&1

then

    echo "ERROR: Helm release ${RELEASE} not found"

    exit 1

fi



#############################################
# Display Current Status
#############################################

echo ""
echo "Current Helm Release"

helm status \
"${RELEASE}" \
-n "${NAMESPACE}"



echo ""
echo "Helm History"

helm history \
"${RELEASE}" \
-n "${NAMESPACE}"



#############################################
# Perform Rollback
#############################################

if [[ -z "${REVISION}" ]]
then

    echo ""
    echo "Rolling back to previous revision..."

    helm rollback \
    "${RELEASE}" \
    -n "${NAMESPACE}" \
    --wait \
    --timeout 5m


else

    echo ""
    echo "Rolling back to revision ${REVISION}..."

    helm rollback \
    "${RELEASE}" \
    "${REVISION}" \
    -n "${NAMESPACE}" \
    --wait \
    --timeout 5m

fi



#############################################
# Verify Deployment Rollout
#############################################

echo ""
echo "Checking Deployment Rollout..."


kubectl rollout status \
deployment/"${DEPLOYMENT}" \
-n "${NAMESPACE}" \
--timeout=300s



#############################################
# Verify Pods
#############################################

echo ""
echo "Pods After Rollback"

kubectl get pods \
-n "${NAMESPACE}"



echo ""
echo "Deployment Status"

kubectl get deployment \
"${DEPLOYMENT}" \
-n "${NAMESPACE}"



#############################################
# Rollback Complete
#############################################

echo ""
echo "===================================="
echo "Rollback Completed Successfully"
echo "===================================="
