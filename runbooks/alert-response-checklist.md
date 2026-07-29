# Alert Response Checklist

## Overview

This runbook provides a standard operating procedure (SOP) for responding to production alerts in the EKS Kubernetes environment.

The objective is to:

- Quickly identify the affected service
- Reduce Mean Time To Recovery (MTTR)
- Restore service safely
- Capture incident details
- Prevent future occurrences

---

# Incident Response Flow

```
Alert Triggered
       |
       v
Acknowledge Alert
       |
       v
Identify Severity
       |
       v
Check Application Health
       |
       v
Investigate Root Cause
       |
       v
Apply Remediation
       |
       v
Validate Recovery
       |
       v
Document Incident
```

---

# 1. Alert Acknowledgement

When an alert is received:

## Record

```
Incident ID:
Alert Name:
Detected Time:
Affected Service:
Environment:
Severity:
Assigned Engineer:
```

---

# 2. Severity Classification

| Severity | Description | Example | Response |
|---|---|---|---|
| SEV-1 | Complete outage | Website unavailable | Immediate |
| SEV-2 | Major degradation | API errors > 10% | Within 15 min |
| SEV-3 | Minor impact | High latency | Within 1 hour |
| SEV-4 | Warning | Resource threshold | Monitor |

---

# 3. Initial Health Check

Run:

```bash
./scripts/health-check.sh production
```

---

## Kubernetes Cluster Status

Check nodes:

```bash
kubectl get nodes
```

Expected:

```
NAME              STATUS
eks-node-group    Ready
```

Investigate:

```
NotReady
Unknown
SchedulingDisabled
```

---

# 4. Application Pod Checks

List pods:

```bash
kubectl get pods \
-n production
```

Check for:

```
CrashLoopBackOff
ImagePullBackOff
Pending
Error
OOMKilled
ContainerCreating
```

---

## Pod Investigation

Describe pod:

```bash
kubectl describe pod <pod-name> \
-n production
```

View logs:

```bash
kubectl logs <pod-name> \
-n production
```

Previous crash logs:

```bash
kubectl logs <pod-name> \
-n production \
--previous
```

---

# 5. Deployment Health

Check deployments:

```bash
kubectl get deployments \
-n production
```

Expected:

```
READY = AVAILABLE
```

---

Check rollout:

```bash
kubectl rollout status \
deployment/<service-name> \
-n production
```

---

# 6. Recent Deployment Check

Verify recent changes:

```bash
helm history <release-name> \
-n production
```

Check:

- New Docker image
- Configuration changes
- Environment variables
- Secrets
- Database migrations

---

# 7. Kubernetes Events

Check recent events:

```bash
kubectl get events \
-n production \
--sort-by=.lastTimestamp
```

Common issues:

| Event | Possible Cause |
|-|-|
| FailedScheduling | Resource shortage |
| FailedMount | Storage issue |
| BackOff | Container crash |
| ImagePullBackOff | Image issue |

---

# 8. Resource Investigation

## CPU and Memory

Check usage:

```bash
kubectl top pods \
-n production
```

Check nodes:

```bash
kubectl top nodes
```

Investigate:

- CPU throttling
- Memory pressure
- OOMKilled containers
- Resource limits

---

# 9. Service and Network Checks

Check services:

```bash
kubectl get svc \
-n production
```

Check endpoints:

```bash
kubectl get endpoints \
-n production
```

Validate:

- Service selectors
- Pod readiness
- Network policies
- Ingress configuration

---

# 10. Database Health Check

Check database pods:

```bash
kubectl get pods \
-n production \
-l app=postgres
```

Database logs:

```bash
kubectl logs <postgres-pod> \
-n production
```

Test connectivity:

```bash
kubectl exec -it <backend-pod> \
-n production \
-- nc -zv postgres-service 5432
```

---

# 11. Monitoring Investigation

## Prometheus

Check:

```
Prometheus UI
    |
    +--> Status
    |
    +--> Targets
    |
    +--> Alerts
```

Verify:

- Targets UP
- Alert rules loaded
- Metrics available

---

## Grafana

Review dashboards:

- Kubernetes Cluster Dashboard
- Node Metrics
- Application Dashboard
- PostgreSQL Dashboard

Check:

```
CPU
Memory
Requests/sec
Error Rate
Latency
Pod Restarts
```

---

## Loki Logs

Search:

```
Grafana
   |
   v
Explore
   |
   v
Loki
```

Filter:

```
namespace="production"
app="backend"
```

---

# 12. Common Remediation Actions

## Restart Application

```bash
kubectl rollout restart deployment/<service-name> \
-n production
```

---

## Scale Application

Increase replicas:

```bash
kubectl scale deployment <service-name> \
--replicas=5 \
-n production
```

---

## Rollback Deployment

If issue started after deployment:

```bash
./scripts/rollback.sh \
production \
backend
```

---

## Delete Failed Pod

Kubernetes will recreate it:

```bash
kubectl delete pod <pod-name> \
-n production
```

---

# 13. Post Recovery Validation

Run:

```bash
./scripts/health-check.sh production
```

Verify:

- Pods running
- Services reachable
- Metrics available
- Alerts cleared
- Application response normal

---

# 14. Incident Documentation

Complete:

```
Incident ID:

Summary:

Impact:

Start Time:

End Time:

Affected Components:

Root Cause:

Resolution:

Preventive Actions:
```

---

# 15. Post Incident Review

Discuss:

## Detection

- Was alert received quickly?
- Was alert actionable?

## Response

- Was remediation effective?
- Was escalation correct?

## Prevention

Actions:

- Add missing alerts
- Improve dashboards
- Add automation
- Improve deployment validation

---

# Emergency Command Reference

## All Resources

```bash
kubectl get all \
-n production
```

---

## Pod Logs

```bash
kubectl logs <pod> \
-n production
```

---

## Describe Resource

```bash
kubectl describe <resource> <name> \
-n production
```

---

## Helm Releases

```bash
helm list \
-n production
```

---

## Cluster Events

```bash
kubectl get events \
-A
```

---

# Escalation Matrix

| Issue | Team |
|---|---|
| Application failure | Development Team |
| Kubernetes failure | DevOps/SRE |
| Database issue | DBA Team |
| Security issue | Security Team |
| Network issue | Platform Team |

---

# Tools

```
AWS EKS
Kubernetes
kubectl
Helm
Prometheus
Grafana
Loki
Alertmanager
Sentry
GitHub Actions
```

---

# Goal

Restore production services quickly while maintaining reliability, security, and operational visibility.