# Backend Service Down Runbook

## Overview

This runbook provides the procedure to troubleshoot and recover when the backend API service is unavailable or experiencing failures.

Common symptoms:

- API returning 5xx errors
- Backend pods unavailable
- Increased application errors
- Frontend unable to communicate with backend
- Sentry backend exceptions
- Prometheus backend availability alerts

---

# Incident Information

Record the following:

```
Incident ID:

Alert Name:

Environment:

Affected Service:

Start Time:

Engineer:

Severity:
```

---

# Impact Assessment

Determine:

- Is the entire application unavailable?
- Are only specific APIs affected?
- Are database operations failing?
- Are users receiving error responses?

Check application endpoint:

```bash
curl -I https://api.example.com/health
```

Expected:

```
HTTP/1.1 200 OK
```

---

# Troubleshooting Flow

```
Backend Alert
      |
      v
Check Pods
      |
      v
Check Logs
      |
      v
Check Deployment
      |
      v
Check Service
      |
      v
Check Database
      |
      v
Fix / Rollback
      |
      v
Validate Recovery
```

---

# 1. Check Backend Pods

List backend pods:

```bash
kubectl get pods \
-n production \
-l app=backend
```

Expected:

```
NAME                         READY   STATUS

backend-xxxx                 1/1     Running
```

---

## Common Pod Errors

| Status | Possible Cause |
|---|---|
| CrashLoopBackOff | Application crash |
| ImagePullBackOff | Image unavailable |
| OOMKilled | Memory limit exceeded |
| Pending | Resource issue |
| Error | Application failure |

---

# 2. Describe Backend Pod

Get detailed information:

```bash
kubectl describe pod <backend-pod> \
-n production
```

Check:

- Container state
- Events
- Environment variables
- Volume mounts
- Resource limits

---

# 3. Check Backend Logs

Current logs:

```bash
kubectl logs <backend-pod> \
-n production
```

Previous crash logs:

```bash
kubectl logs <backend-pod> \
-n production \
--previous
```

Look for:

```
Database connection failed

Application startup error

Missing environment variable

Out of memory

Port binding failure
```

---

# 4. Check Deployment Status

Verify deployment:

```bash
kubectl get deployment backend \
-n production
```

Expected:

```
READY   AVAILABLE

3/3     3
```

---

Check rollout:

```bash
kubectl rollout status \
deployment/backend \
-n production
```

---

# 5. Check Recent Deployment

A failed deployment is a common cause.

Check Helm history:

```bash
helm history backend \
-n production
```

Review:

- New image version
- Configuration changes
- Secret changes
- Dependency updates

---

# 6. Check Backend Service

Verify service:

```bash
kubectl get svc backend-service \
-n production
```

Check endpoints:

```bash
kubectl get endpoints backend-service \
-n production
```

Expected:

```
NAME              ENDPOINTS

backend-service   10.0.2.15:8080
```

If endpoints are empty:

Possible causes:

- Pods not ready
- Incorrect labels
- Service selector mismatch

---

# 7. Check Readiness Probe

Backend may be running but unavailable.

Check deployment:

```bash
kubectl describe deployment backend \
-n production
```

Verify:

```yaml
readinessProbe:

  httpGet:

    path: /health

    port: 8080
```

Test inside pod:

```bash
kubectl exec -it <backend-pod> \
-n production \
-- curl localhost:8080/health
```

---

# 8. Check Database Connectivity

Backend failures often occur due to database issues.

Check database:

```bash
kubectl get pods \
-n production \
-l app=postgres
```

Test connection:

```bash
kubectl exec -it <backend-pod> \
-n production \
-- nc -zv postgres-service 5432
```

Check backend environment:

```bash
kubectl describe pod <backend-pod> \
-n production
```

Verify:

```
DATABASE_HOST
DATABASE_USER
DATABASE_PASSWORD
DATABASE_NAME
```

---

# 9. Check Resource Usage

CPU:

```bash
kubectl top pods \
-n production
```

Memory:

```bash
kubectl top pods \
-n production
```

Look for:

```
High CPU

Memory pressure

OOMKilled
```

---

# 10. Check Application Metrics

Open Grafana:

Review:

- Request rate
- Error rate
- Response latency
- Pod restarts
- CPU usage
- Memory usage

Prometheus queries:

## Backend Request Rate

```promql
rate(http_requests_total[5m])
```

---

## Error Rate

```promql
rate(http_requests_failed_total[5m])
```

---

# 11. Check Logs in Loki

Grafana:

```
Explore
 |
 Loki
```

Query:

```
{namespace="production",app="backend"}
```

Search:

```
ERROR

Exception

Database

Timeout
```

---

# Recovery Actions

## Option 1: Restart Backend Pods

Use when:

- Temporary failure
- Memory leak
- Stale connections

Command:

```bash
kubectl rollout restart deployment/backend \
-n production
```

---

## Option 2: Scale Backend

Increase capacity:

```bash
kubectl scale deployment backend \
--replicas=5 \
-n production
```

---

## Option 3: Rollback Deployment

Use when:

- Issue started after release
- New image is broken

Rollback:

```bash
./scripts/rollback.sh \
production \
backend
```

---

## Option 4: Fix Configuration

If environment issue:

```bash
kubectl edit deployment backend \
-n production
```

Update:

- ConfigMap
- Secret
- Environment variables

Restart:

```bash
kubectl rollout restart deployment/backend \
-n production
```

---

# Validation After Recovery

## Check Pods

```bash
kubectl get pods \
-n production
```

Expected:

```
Running
Ready
```

---

## Test API

```bash
curl https://api.example.com/health
```

Expected:

```
{
 "status":"healthy"
}
```

---

## Run Health Check

```bash
./scripts/health-check.sh production
```

---

# Monitoring Verification

Confirm:

- Prometheus alert cleared
- Grafana metrics normal
- Sentry errors stopped
- Logs are clean

---

# Root Cause Categories

| Category | Example |
|---|---|
| Application | Code crash |
| Deployment | Bad image |
| Configuration | Wrong environment variable |
| Database | Connection failure |
| Resource | CPU/memory exhaustion |
| Network | Service communication issue |

---

# Post Incident Actions

Create follow-up tasks:

- Add missing alert
- Improve health checks
- Increase resources
- Add automated rollback
- Improve deployment testing

---

# Escalation

| Issue | Owner |
|---|---|
| Backend code issue | Development Team |
| Kubernetes issue | DevOps/SRE |
| Database issue | DBA |
| Infrastructure issue | Cloud Team |

---

# Tools Used

```
AWS EKS
Kubernetes
Helm
kubectl
Prometheus
Grafana
Loki
Sentry
GitHub Actions
```

---

# Objective

Restore backend availability quickly while maintaining application reliability and preventing recurrence.