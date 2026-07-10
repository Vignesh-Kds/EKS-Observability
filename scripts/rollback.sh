#!/bin/bash

set -e

#############################################
# Kubernetes Rollback Script
# Project: EKS Multi-Service Application
#############################################

NAMESPACE=${1:-production}
RELEASE=${2:-backend}

echo "===================================="
echo "Starting Rollback"
echo "===================================="

echo "Namespace : ${NAMESPACE}"
echo "Release   : ${RELEASE}"


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
# Check Kubernetes Connection
#############################################

echo ""
echo "Checking Kubernetes Cluster..."

kubectl cluster-info > /dev/null 2>&1 || {

    echo "Unable to connect to Kubernetes cluster"
    exit 1

}


#############################################
# Check Helm Release
#############################################

echo ""
echo "Checking Helm Release..."

if ! helm status "${RELEASE}" \
-n "${NAMESPACE}" >/dev/null 2>&1
then

    echo "Helm release ${RELEASE} not found"

    exit 1

fi


#############################################
# Display Release History
#############################################

echo ""
echo "Helm Release History"

helm history \
"${RELEASE}" \
-n "${NAMESPACE}"



#############################################
# Rollback Version
#############################################

REVISION=${3:-}


if [ -z "${REVISION}" ]
then

    echo ""
    echo "Rolling back to previous version..."

    helm rollback \
    "${RELEASE}" \
    -n "${NAMESPACE}"

else

    echo ""
    echo "Rolling back to revision ${REVISION}..."

    helm rollback \
    "${RELEASE}" \
    "${REVISION}" \
    -n "${NAMESPACE}"

fi



#############################################
# Wait For Rollout
#############################################

echo ""
echo "Waiting for rollout..."


kubectl rollout status \
deployment/${RELEASE} \
-n "${NAMESPACE}" \
--timeout=300s || true



#############################################
# Verify Deployment
#############################################

echo ""
echo "Deployment Status"

kubectl get pods \
-n "${NAMESPACE}"


echo ""

kubectl get deployments \
-n "${NAMESPACE}"



#############################################
# Rollback Complete
#############################################

echo ""
echo "===================================="
echo "Rollback Completed Successfully"
echo "===================================="