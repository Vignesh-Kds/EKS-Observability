# Memory Pressure Runbook

## Alert Name
Memory Pressure

## Severity

**Critical (P1)** if node memory pressure persists for more than 5 minutes.

**Warning (P2)** if memory usage exceeds 85%.

---

# Description

This alert indicates that one or more Kubernetes nodes are experiencing memory pressure. When available memory becomes critically low, the kubelet marks the node with the **MemoryPressure** condition.

If memory continues to decrease, Kubernetes may:

- Evict Pods
- Restart containers
- Kill processes (OOMKilled)
- Prevent new Pods from scheduling
- Degrade application performance

---

# Impact

- Slow application response
- Pod evictions
- OOMKilled containers
- Failed deployments
- Service downtime
- Increased API latency

---

# Possible Causes

## Application Issues

- Memory leak
- High application traffic
- Large in-memory cache
- Infinite loop consuming memory

## Kubernetes Issues

- Missing memory limits
- Incorrect resource requests
- Too many Pods on a node
- Pod eviction

## Infrastructure Issues

- Node has insufficient RAM
- Multiple workloads sharing one node
- Autoscaler not scaling
- Swap disabled (expected in Kubernetes)

---

# Investigation Steps

## 1. Verify Alert

Check Grafana dashboards for:

- Node Memory Usage
- Available Memory
- Memory Pressure Status
- Pod Memory Usage

---

## 2. Check Node Status

```bash
kubectl get nodes
```

Example

```text
NAME           STATUS
worker-1       Ready
worker-2       Ready
```

Describe the affected node:

```bash
kubectl describe node <node-name>
```

Look for:

```text
Conditions:
MemoryPressure=True
```

---

## 3. Check Node Resource Usage

```bash
kubectl top node
```

Example

```text
NAME        CPU(cores)   MEMORY(bytes)
worker-1    850m         94%
```

---

## 4. Check Pod Memory Usage

```bash
kubectl top pods -A --sort-by=memory
```

Identify Pods consuming the most memory.

Example

```text
frontend
backend
redis
postgres
```

---

## 5. Identify OOMKilled Containers

```bash
kubectl get pods -A
```

Look for:

```text
OOMKilled
CrashLoopBackOff
```

Describe the Pod:

```bash
kubectl describe pod <pod-name> -n <namespace>
```

Example

```text
Last State:
Reason: OOMKilled
Exit Code: 137
```

---

## 6. Check Application Logs

```bash
kubectl logs <pod-name> -n <namespace>
```

Look for:

- Out of memory
- Java heap errors
- Memory allocation failures
- Container restarts

---

## 7. Check Resource Limits

```bash
kubectl describe pod <pod-name>
```

Verify:

```yaml
resources:
  requests:
    memory: 512Mi
  limits:
    memory: 1Gi
```

Check for:

- Missing limits
- Very low limits
- Very high limits

---

## 8. Check Node Events

```bash
kubectl get events \
--sort-by=.metadata.creationTimestamp
```

Look for:

```text
Evicted
MemoryPressure
OOMKilled
NodeHasInsufficientMemory
```

---

## 9. Check Pending Pods

```bash
kubectl get pods
```

If Pods remain Pending:

```bash
kubectl describe pod <pod-name>
```

Look for:

```text
Insufficient memory
```

---

## 10. Check Cluster Autoscaler

If Cluster Autoscaler is enabled:

```bash
kubectl get deployment \
-n kube-system
```

Verify the autoscaler is running and scaling nodes as expected.

---

# Resolution

## Case 1

High memory-consuming application

**Action**

Identify and optimize the application or restart it if appropriate.

```bash
kubectl rollout restart deployment <deployment>
```

---

## Case 2

Memory leak

**Action**

- Investigate application code
- Deploy a fixed version
- Monitor memory growth

---

## Case 3

Insufficient memory limits

Increase limits.

Example

```yaml
resources:
  requests:
    memory: 512Mi
  limits:
    memory: 2Gi
```

---

## Case 4

Node overloaded

Drain the node if necessary.

```bash
kubectl drain <node-name> \
--ignore-daemonsets
```

Allow workloads to move to healthier nodes.

---

## Case 5

Cluster needs more capacity

Scale the node group.

Example

```text
Current Nodes : 3
Scale To      : 5
```

---

## Case 6

Too many Pods per node

Spread workloads using:

- Node Affinity
- Pod Anti-Affinity
- Topology Spread Constraints

---

# Validation

Verify node status.

```bash
kubectl describe node <node-name>
```

Expected:

```text
MemoryPressure=False
```

Check resource usage.

```bash
kubectl top node

kubectl top pods
```

Verify:

- Memory utilization is below 80%
- No Pod evictions
- No OOMKilled events
- Applications are healthy

---

# Escalation

Escalate if:

- Memory pressure persists
- Multiple nodes affected
- Cluster Autoscaler fails
- Frequent OOMKilled events
- Memory leak cannot be identified
- Production services are impacted

Notify:

- DevOps Team
- Platform Team
- Application Team

---

# Useful Commands

```bash
kubectl get nodes

kubectl describe node <node-name>

kubectl top node

kubectl top pods -A --sort-by=memory

kubectl get pods -A

kubectl describe pod <pod-name>

kubectl logs <pod-name>

kubectl get events --sort-by=.metadata.creationTimestamp

kubectl rollout restart deployment <deployment>

kubectl drain <node-name> --ignore-daemonsets
```

---

# Prevention

- Set memory requests and limits for every container.
- Monitor node and Pod memory usage with Prometheus and Grafana.
- Configure Horizontal Pod Autoscaler (HPA) and Cluster Autoscaler.
- Regularly profile applications for memory leaks.
- Distribute workloads evenly across nodes.
- Review memory usage after each release.
- Configure alerts before nodes reach critical memory utilization.