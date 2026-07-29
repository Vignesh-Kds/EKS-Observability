// ==========================================
// EKS Observability Dashboard Constants
// ==========================================


// Application Information

export const APP_NAME =
  "EKS Observability Dashboard";


export const APP_VERSION =
  "1.0.0";



export const ENVIRONMENT =
  "Production";





// ==========================================
// API Endpoints
// ==========================================

export const API_ENDPOINTS = {

  CLUSTER:
    "/cluster",

  NODES:
    "/nodes",

  PODS:
    "/pods",

  SERVICES:
    "/services",

  METRICS:
    "/metrics",

  ALERTS:
    "/alerts",

};





// ==========================================
// Kubernetes Namespaces
// ==========================================

export const NAMESPACES = [

  "default",

  "monitoring",

  "kube-system",

];





// Default Namespace

export const DEFAULT_NAMESPACE =
  "monitoring";





// ==========================================
// Monitoring Configuration
// ==========================================

export const REFRESH_INTERVALS = [

  {
    label: "10 Seconds",
    value: 10000,
  },

  {
    label: "30 Seconds",
    value: 30000,
  },

  {
    label: "1 Minute",
    value: 60000,
  },

  {
    label: "5 Minutes",
    value: 300000,
  },

];





export const DEFAULT_REFRESH_INTERVAL =
  30000;





// ==========================================
// Kubernetes Resource Types
// ==========================================

export const RESOURCE_TYPES = [

  "Pod",

  "Deployment",

  "StatefulSet",

  "DaemonSet",

  "Service",

  "Ingress",

  "Node",

];





// ==========================================
// Pod Status
// ==========================================

export const POD_STATUS = {

  RUNNING:
    "Running",

  PENDING:
    "Pending",

  FAILED:
    "Failed",

  CRASH_LOOP:
    "CrashLoopBackOff",

  TERMINATED:
    "Terminated",

};





// ==========================================
// Service Types
// ==========================================

export const SERVICE_TYPES = [

  "ClusterIP",

  "NodePort",

  "LoadBalancer",

];





// ==========================================
// Health Status
// ==========================================

export const HEALTH_STATUS = {

  HEALTHY:
    "Healthy",

  WARNING:
    "Warning",

  CRITICAL:
    "Critical",

  UNKNOWN:
    "Unknown",

};





// ==========================================
// AWS / EKS Configuration
// ==========================================

export const AWS_CONFIG = {

  REGION:
    "ap-south-1",

  CLUSTER_NAME:
    "vickycluster",

};





// ==========================================
// Chart Configuration
// ==========================================

export const CHART_COLORS = {

  CPU:
    "#2563eb",

  MEMORY:
    "#7c3aed",

  SUCCESS:
    "#16a34a",

  WARNING:
    "#d97706",

  ERROR:
    "#dc2626",

};
