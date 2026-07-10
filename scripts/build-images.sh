#!/bin/bash

set -e

#############################################
# Build Docker Images Script
# Project: EKS Multi-Service Application
#############################################

# Configuration

REGISTRY="your-dockerhub-user"
VERSION=${1:-latest}

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
    echo "Docker is not installed"
    exit 1
fi


docker info > /dev/null 2>&1 || {
    echo "Docker daemon is not running"
    exit 1
}


#############################################
# Build Backend Image
#############################################

echo ""
echo "Building Backend Image..."

cd "${PROJECT_ROOT}/backend"

docker build \
-t "${BACKEND_IMAGE}" \
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
-t "${FRONTEND_IMAGE}" \
.


echo "Frontend image created:"
echo "${FRONTEND_IMAGE}"


#############################################
# Display Images
#############################################

echo ""
echo "Available Images"

docker images | grep -E "frontend|backend"


#############################################
# Push Images (Optional)
#############################################

read -p "Do you want to push images? (y/n): " PUSH


if [ "$PUSH" == "y" ]
then

    echo ""
    echo "Logging into Registry..."

    docker login


    echo "Pushing Backend..."

    docker push "${BACKEND_IMAGE}"


    echo "Pushing Frontend..."

    docker push "${FRONTEND_IMAGE}"


    echo ""
    echo "Images pushed successfully"

else

    echo ""
    echo "Skipping image push"

fi


echo ""
echo "===================================="
echo "Build Completed Successfully"
echo "===================================="