# Disk Pressure Runbook

## Overview

This runbook provides the procedure to troubleshoot and recover when Kubernetes nodes experience disk pressure.

Disk pressure occurs when a node runs low on available disk space, causing Kubernetes to:

- Evict pods
- Stop scheduling new workloads
- Mark nodes as `DiskPressure=True`
- Cause application downtime

---

# Incident Information

Record:

```
Incident ID:

Alert Name:

Affected Node:

Environment:

Start Time:

Engineer:

Severity:
```

---

# Common Symptoms

Application symptoms:

```
Pods stuck in Pending

Pods evicted

Containers restarting

ImagePull failures

Application unavailable
```

Kubernetes node status:

```
DiskPressure=True
```

Common alerts:

```
KubernetesNodeDiskPressure

NodeFilesystemAlmostOutOfSpace

ContainerFilesystemUsageHigh
```

---

# Disk Pressure Flow

```
Disk Usage Increases

        |

        v

Node Disk Threshold Exceeded

        |

        v

Kubernetes Marks Node

DiskPressure=True

        |

        v

Pod Eviction Starts

        |

        v

Cleanup / Increase Storage

        |

        v

Node Returns Healthy
```

---

# 1. Check Node Status

List nodes:

```bash
kubectl get nodes
```

Example:

```
NAME              STATUS

worker-node-01    Ready
```

---

Check node conditions:

```bash
kubectl describe node <node-name>
```

Look for:

```
Conditions:

DiskPressure   True
```

Example:

```
Type            Status

DiskPressure    True
MemoryPressure  False
PIDPressure     False
```

---

# 2. Check Disk Usage on Node

SSH into node:

```bash
ssh ec2-user@<node-ip>
```

Check filesystem:

```bash
df -h
```

Example:

```
Filesystem

/dev/xvda1

Size    Used

100G    95G
```

---

Check inode usage:

```bash
df -i
```

High inode usage can also trigger disk pressure.

---

# 3. Identify Disk Consumers

## Check Root Filesystem

```bash
sudo du -sh /* | sort -h
```

Common locations:

```
/var/lib/docker

/var/lib/containerd

/var/log

/tmp
```

---

# 4. Check Container Runtime Storage

## Docker Runtime

Check:

```bash
docker system df
```

Cleanup unused data:

```bash
docker system prune
```

---

## Containerd Runtime

Check:

```bash
sudo du -sh /var/lib/containerd/*
```

---

# 5. Check Kubernetes Images

List images:

```bash
crictl images
```

Remove unused images:

```bash
crictl rmi --prune
```

---

# 6. Check Pod Disk Usage

Find large pods:

```bash
kubectl get pods \
-A \
-o wide
```

Check pod logs:

```bash
kubectl logs <pod-name> \
-n <namespace>
```

Large logs are a common cause.

---

# 7. Check Container Logs

Docker logs:

```bash
sudo du -sh /var/lib/docker/containers/*
```

Containerd logs:

```bash
sudo du -sh /var/log/pods/*
```

---

# 8. Clean Application Logs

Find large log files:

```bash
sudo find /var/log \
-type f \
-size +500M
```

Compress or remove old logs:

```bash
sudo journalctl \
--vacuum-time=7d
```

---

# 9. Check Kubernetes Events

View eviction events:

```bash
kubectl get events \
-A \
--sort-by=.lastTimestamp
```

Look for:

```
Evicted

NodeHasDiskPressure

ImageGCFailed
```

---

# 10. Check Pod Evictions

List evicted pods:

```bash
kubectl get pods \
-A \
| grep Evicted
```

Remove evicted pods:

```bash
kubectl delete pod <pod-name> \
-n <namespace>
```

---

# Recovery Actions

---

# Option 1: Remove Unused Images

Clean unused container images:

```bash
crictl rmi --prune
```

---

# Option 2: Clean Docker Resources

If Docker runtime is used:

```bash
docker system prune -a
```

Removes:

- Unused images
- Stopped containers
- Build cache

---

# Option 3: Remove Old Logs

Clean journal logs:

```bash
sudo journalctl \
--vacuum-size=500M
```

---

# Option 4: Restart Application Pods

After freeing space:

```bash
kubectl rollout restart deployment/<app-name> \
-n production
```

---

# Option 5: Increase Node Disk Size

For AWS EKS:

Increase EBS volume:

```
EC2
 |
 v
EBS Volume
 |
 v
Modify Size
 |
 v
Expand Filesystem
```

Example:

```
100GB → 200GB
```

---

# Option 6: Add More Nodes

If workload exceeds capacity:

Check:

```bash
kubectl get nodes
```

Increase node group:

```bash
eksctl scale nodegroup \
--nodes 5
```

---

# Validation After Recovery

## Check Node Condition

```bash
kubectl describe node <node-name>
```

Expected:

```
DiskPressure=False
```

---

## Check Node Health

```bash
kubectl get nodes
```

Expected:

```
Ready
```

---

## Check Pods

```bash
kubectl get pods \
-A
```

Expected:

```
Running
```

---

## Run Health Check

```bash
./scripts/health-check.sh production
```

---

# Monitoring

## Prometheus Metrics

Monitor:

```
node_filesystem_avail_bytes

node_filesystem_size_bytes

container_fs_usage_bytes
```

Example alert:

```yaml
alert: DiskPressure

expr:

node_filesystem_avail_bytes
/
node_filesystem_size_bytes
<
0.10
```

Meaning:

```
Less than 10% disk remaining
```

---

# Grafana Dashboard Checks

Review:

- Node filesystem usage
- Container storage
- Pod restarts
- Evicted pods

---

# Prevention

Best practices:

✅ Enable log rotation  
✅ Configure container log limits  
✅ Monitor disk usage  
✅ Use proper resource requests  
✅ Configure image garbage collection  
✅ Use larger EBS volumes for production  
✅ Enable node auto scaling  
✅ Remove unused images regularly  

---

# Recommended Kubernetes Settings

Example eviction thresholds:

```yaml
kubelet:

  evictionHard:

    nodefs.available: "10%"

    imagefs.available: "15%"
```

---

# Escalation

| Issue | Owner |
|---|---|
| Node storage | DevOps/SRE |
| Application logs | Development Team |
| AWS EBS capacity | Cloud Team |
| Cluster scaling | Platform Team |

---

# Tools Used

```
AWS EKS
Kubernetes
kubectl
crictl
Docker
Containerd
Prometheus
Grafana
CloudWatch
```

---

# Objective

Recover Kubernetes node capacity quickly, restore workload scheduling, and prevent future disk-related outages.