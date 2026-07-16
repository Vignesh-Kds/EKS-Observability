#!/bin/bash

set -e

#############################################
# Cleanup Script
# Project: EKS Multi-Service Application
#############################################

echo "===================================="
echo "Starting Cleanup"
echo "===================================="


#############################################
# Docker Cleanup
#############################################

echo ""
echo "Cleaning Docker Resources..."

# Remove stopped containers
docker container prune -f


# Remove unused images
docker image prune -f


# Remove unused networks
docker network prune -f


# Remove unused volumes
docker volume prune -f


echo "Docker cleanup completed"


#############################################
# Kubernetes Cleanup
#############################################

echo ""
echo "Cleaning Kubernetes temporary resources..."


# Delete completed jobs
kubectl delete jobs \
--all \
-n default \
--ignore-not-found


# Delete failed pods
kubectl delete pods \
--field-selector=status.phase=Failed \
--all-namespaces \
--ignore-not-found


echo "Kubernetes cleanup completed"


#############################################
# Helm Cleanup
#############################################

echo ""
echo "Checking Helm releases..."

helm list --all-namespaces


read -r -p "Remove failed Helm releases? (y/n): " HELM_CLEAN


if [ "$HELM_CLEAN" == "y" ]
then

    while read -r release
    do
        echo "Removing Helm release: $release"
        helm uninstall "$release" --all-namespaces || true
    done < <(helm list --all-namespaces --failed -q)

fi


#############################################
# Local Build Cleanup
#############################################

echo ""
echo "Removing local build files..."


PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"


rm -rf "${PROJECT_ROOT}/frontend/dist"

rm -rf "${PROJECT_ROOT}/frontend/build"

rm -rf "${PROJECT_ROOT}/backend/node_modules/.cache"


echo "Local build cleanup completed"


#############################################
# Terraform Cleanup (Optional)
#############################################

if [ -d "${PROJECT_ROOT}/terraform" ]
then

    echo ""
    echo "Cleaning Terraform cache..."

    rm -rf "${PROJECT_ROOT}/terraform/.terraform"

    echo "Terraform cache removed"

fi


#############################################
# Disk Usage Report
#############################################

echo ""
echo "Docker Disk Usage"

docker system df


echo ""
echo "===================================="
echo "Cleanup Completed Successfully"
echo "===================================="
