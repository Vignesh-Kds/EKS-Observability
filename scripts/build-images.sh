#!/bin/bash

set -euo pipefail

#############################################
# Build Docker Images Script
# Project: EKS Multi-Service Application
#############################################

# Configuration

REGISTRY="vigneshawss"

VERSION=${1:-v1.0.0}

FRONTEND_IMAGE="${REGISTRY}/frontend:${VERSION}"
BACKEND_IMAGE="${REGISTRY}/backend:${VERSION}"

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"


echo "===================================="
echo "Building Docker Images"
echo "Version: ${VERSION}"
echo "===================================="


#############################################
# Check Docker Availability
#############################################

if ! command -v docker &> /dev/null
then
    echo "ERROR: Docker is not installed"
    exit 1
fi


if ! docker info > /dev/null 2>&1
then
    echo "ERROR: Docker daemon is not running"
    exit 1
fi


#############################################
# Build Backend Image
#############################################

echo ""
echo "Building Backend Image..."

cd "${PROJECT_ROOT}/backend"


docker build \
    --tag "${BACKEND_IMAGE}" \
    .


echo "Backend image created:"
echo "${BACKEND_IMAGE}"


#############################################
# Build Frontend Image
#############################################

echo ""
echo "Building Frontend Image..."

cd "${PROJECT_ROOT}/frontend"


docker build \
    --tag "${FRONTEND_IMAGE}" \
    .


echo "Frontend image created:"
echo "${FRONTEND_IMAGE}"


#############################################
# Display Images
#############################################

echo ""
echo "Available Images"

docker images | grep -E "frontend|backend" || true


#############################################
# Security Scan (Optional)
#############################################

read -r -p "Run Trivy image scan? (y/n): " SCAN


if [[ "${SCAN}" == "y" ]]
then

    echo ""
    echo "Scanning Backend Image..."

    trivy image \
        --severity HIGH,CRITICAL \
        "${BACKEND_IMAGE}"


    echo ""
    echo "Scanning Frontend Image..."

    trivy image \
        --severity HIGH,CRITICAL \
        "${FRONTEND_IMAGE}"

else

    echo ""
    echo "Skipping Trivy scan"

fi


#############################################
# Push Images
#############################################

read -r -p "Push images to Docker Hub? (y/n): " PUSH


if [[ "${PUSH}" == "y" ]]
then

    echo ""
    echo "Logging into Docker Hub..."

    docker login


    echo ""
    echo "Pushing Backend Image..."

    docker push "${BACKEND_IMAGE}"


    echo ""
    echo "Pushing Frontend Image..."

    docker push "${FRONTEND_IMAGE}"


    echo ""
    echo "Images pushed successfully"

else

    echo ""
    echo "Skipping image push"

fi


#############################################
# Completed
#############################################

echo ""
echo "===================================="
echo "Build Completed Successfully"
echo "===================================="

echo ""
echo "Images:"
echo "${BACKEND_IMAGE}"
echo "${FRONTEND_IMAGE}"
