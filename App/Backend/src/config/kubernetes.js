import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();

try {
  if (process.env.KUBERNETES_SERVICE_HOST) {
    // Running inside Kubernetes
    kc.loadFromCluster();
    console.log("✅ Loaded in-cluster Kubernetes configuration");
  } else {
    // Running locally
    kc.loadFromDefault();
    console.log("✅ Loaded local kubeconfig");
  }
} catch (error) {
  console.error("❌ Failed to load Kubernetes configuration");
  console.error(error.message);
}

export const coreApi = kc.makeApiClient(k8s.CoreV1Api);

export const appsApi = kc.makeApiClient(k8s.AppsV1Api);

export const eventsApi = kc.makeApiClient(k8s.EventsV1Api);

export default kc;
