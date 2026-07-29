# Node Not Ready Runbook

## Overview

This runbook describes how to troubleshoot and recover a Kubernetes node that has entered the **NotReady** state.

When a node becomes **NotReady**, Kubernetes cannot schedule new pods on it and may evict existing workloads depending on the outage duration.

Common causes include:

- Kubelet failure
- Container runtime failure
- Network connectivity issues
- Disk pressure
- Memory pressure
- CPU exhaustion
- Node reboot
- Cloud instance failure

---

# Incident Information

Record:

```
Incident ID:

Alert Name:

Affected Node:

Environment:

Availability Zone:

Engineer:

Severity:
```

---

# Symptoms

Typical symptoms:

```
kubectl get nodes

NAME            STATUS
worker-node-1   NotReady
```

Possible application impact:

- Pods remain Pending
- Existing pods become unavailable
- Failed deployments
- Increased latency
- Service disruption

---

# Troubleshooting Flow

```
Alert Triggered
       |
       v
Check Node Status
       |
       v
Describe Node
       |
       v
Check Kubelet
       |
       v
Check Container Runtime
       |
       v
Check Resources
       |
       v
Restore Node
       |
       v
Validate Cluster
```

---

# 1. Verify Node Status

```bash
kubectl get nodes
```

Example:

```
NAME              STATUS

worker-node-01    NotReady
```

---

# 2. Describe the Node

```bash
kubectl describe node worker-node-01
```

Review:

```
Conditions

Ready

MemoryPressure

DiskPressure

PIDPressure

NetworkUnavailable
```

Common messages:

```
Kubelet stopped posting node status

NodeStatusUnknown

Container runtime unavailable
```

---

# 3. Check Node Events

```bash
kubectl describe node worker-node-01
```

Review the **Events** section for:

- Failed mounts
- Disk pressure
- Network failures
- Kubelet errors

---

# 4. SSH into the Node

```bash
ssh ec2-user@<node-ip>
```

Verify node health:

```bash
hostname

uptime
```

---

# 5. Check Kubelet Service

```bash
sudo systemctl status kubelet
```

If stopped:

```bash
sudo systemctl restart kubelet
```

Enable at boot:

```bash
sudo systemctl enable kubelet
```

---

# 6. Check Container Runtime

Containerd:

```bash
sudo systemctl status containerd
```

Restart:

```bash
sudo systemctl restart containerd
```

Docker (if used):

```bash
sudo systemctl status docker
```

Restart:

```bash
sudo systemctl restart docker
```

---

# 7. Check Disk Space

```bash
df -h
```

If disk usage is high:

```bash
sudo journalctl --vacuum-time=7d

crictl rmi --prune
```

---

# 8. Check Memory Usage

```bash
free -h
```

Check top processes:

```bash
top
```

or

```bash
htop
```

---

# 9. Check CPU Usage

```bash
top
```

Investigate:

- Runaway processes
- High CPU utilization
- Infinite loops

---

# 10. Check Network Connectivity

Verify API server connectivity:

```bash
curl -k https://<api-server-endpoint>/healthz
```

Test DNS:

```bash
nslookup kubernetes.default.svc.cluster.local
```

Check routing:

```bash
ip route
```

---

# 11. Check Node Resources

From the control plane:

```bash
kubectl top nodes
```

Check pods:

```bash
kubectl top pods -A
```

---

# 12. Check AWS Instance Status (EKS)

Verify EC2 instance:

```bash
aws ec2 describe-instance-status \
--instance-ids <instance-id>
```

Confirm:

```
InstanceState = running

SystemStatus = ok

InstanceStatus = ok
```

---

# Recovery Actions

## Option 1: Restart Kubelet

```bash
sudo systemctl restart kubelet
```

---

## Option 2: Restart Container Runtime

```bash
sudo systemctl restart containerd
```

---

## Option 3: Reboot Node

```bash
sudo reboot
```

Wait for the node to rejoin the cluster.

---

## Option 4: Drain the Node

Prevent new workloads:

```bash
kubectl drain worker-node-01 \
--ignore-daemonsets \
--delete-emptydir-data
```

---

## Option 5: Replace the Node

For managed node groups:

- Create a replacement node
- Remove the unhealthy node

Delete node:

```bash
kubectl delete node worker-node-01
```

The managed node group should provision a replacement.

---

# Validation

Check node status:

```bash
kubectl get nodes
```

Expected:

```
STATUS

Ready
```

---

Check pods:

```bash
kubectl get pods -A
```

Expected:

```
Running
```

---

Run health check:

```bash
./scripts/health-check.sh production
```

---

# Monitoring

Review:

- Prometheus node exporter metrics
- Grafana Kubernetes dashboards
- Loki system logs
- CloudWatch instance metrics

Useful Prometheus metrics:

```promql
kube_node_status_condition{
condition="Ready",
status="true"
}
```

```promql
node_cpu_seconds_total
```

```promql
node_memory_MemAvailable_bytes
```

```promql
node_filesystem_avail_bytes
```

---

# Root Cause Categories

| Category | Example |
|----------|---------|
| Kubelet | Service stopped |
| Container Runtime | containerd failure |
| Storage | Disk full |
| Memory | OOM condition |
| CPU | Resource exhaustion |
| Network | API server unreachable |
| Cloud | EC2 instance failure |

---

# Prevention

Best practices:

- Enable Cluster Autoscaler
- Monitor node health continuously
- Configure node auto-repair
- Enable disk and memory alerts
- Rotate logs regularly
- Patch worker nodes regularly
- Use multiple Availability Zones
- Define appropriate resource requests and limits

---

# Escalation

| Issue | Owner |
|-------|-------|
| Kubernetes node | DevOps/SRE |
| EC2 instance | Cloud Team |
| Network | Network Team |
| Application impact | Development Team |

---

# Useful Commands

```bash
kubectl get nodes

kubectl describe node <node-name>

kubectl top nodes

kubectl get events -A

systemctl status kubelet

systemctl status containerd

df -h

free -h
```

---

# Tools Used

```
AWS EKS
Kubernetes
kubectl
containerd
Prometheus
Grafana
Loki
CloudWatch
```

---

# Objective

Restore the affected node to the **Ready** state as quickly as possible, minimize application impact, and identify the root cause to prevent future node availability issues.