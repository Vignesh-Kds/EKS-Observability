#!/bin/bash

set -e

#############################################
# NGINX Ingress Controller Installation
# Project: EKS Multi-Service Application
#############################################

NAMESPACE="ingress-nginx"
RELEASE_NAME="ingress-nginx"

echo "===================================="
echo "Installing NGINX Ingress Controller"
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

    echo "Cannot connect to Kubernetes cluster"
    exit 1

}


#############################################
# Add Helm Repository
#############################################

echo ""
echo "Adding NGINX Ingress Helm Repository..."

helm repo add ingress-nginx \
https://kubernetes.github.io/ingress-nginx


helm repo update



#############################################
# Install Ingress Controller
#############################################

echo ""
echo "Installing Ingress Controller..."


helm upgrade --install ${RELEASE_NAME} \
ingress-nginx/ingress-nginx \
\
--namespace ${NAMESPACE} \
--create-namespace \
\
--set controller.replicaCount=2 \
\
--set controller.service.type=LoadBalancer \
\
--set controller.metrics.enabled=true \
\
--set controller.podAnnotations."prometheus\.io/scrape"="true" \
\
--set controller.podAnnotations."prometheus\.io/port"="10254"



#############################################
# Wait For Deployment
#############################################

echo ""
echo "Waiting for Ingress Controller..."


kubectl wait \
--namespace ${NAMESPACE} \
--for=condition=available \
deployment/ingress-nginx-controller \
--timeout=300s



#############################################
# Verify Installation
#############################################

echo ""
echo "Ingress Controller Pods"

kubectl get pods \
-n ${NAMESPACE}



echo ""
echo "Ingress Service"

kubectl get svc \
-n ${NAMESPACE}



echo ""
echo "Ingress Class"

kubectl get ingressclass



#############################################
# Get External Endpoint
#############################################

echo ""
echo "External Load Balancer Address"

kubectl get svc \
ingress-nginx-controller \
-n ${NAMESPACE}



echo ""
echo "===================================="
echo "NGINX Ingress Installation Complete"
echo "===================================="