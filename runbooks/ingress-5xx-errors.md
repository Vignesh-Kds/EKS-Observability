# Ingress 5XX Errors Runbook

## Alert Name
Ingress 5XX Errors

## Severity
**Critical (P1)** if error rate > 5% for more than 5 minutes

**Warning (P2)** if error rate is between 1% and 5%

---

## Description

This alert indicates that the Kubernetes Ingress Controller (NGINX Ingress) is returning HTTP 5XX responses (500, 502, 503, 504) to clients.

High 5XX rates usually indicate:

- Backend application failure
- Pods unavailable
- Service endpoint issues
- Network connectivity problems
- Application crash
- Database dependency failure
- Ingress misconfiguration

NGINX Ingress commonly exposes metrics that can be used to alert on excessive 5XX responses. :contentReference[oaicite:0]{index=0}

---

## Impact

- Users receive server errors
- APIs become unavailable
- Website pages fail to load
- Customer requests fail
- Revenue loss for production systems

---

## Possible Causes

### Application Issues

- Application crashed
- CrashLoopBackOff
- OOMKilled
- Startup failure
- High CPU
- High Memory

### Kubernetes Issues

- Pods not Ready
- Deployment failed
- Rolling update failure
- No service endpoints
- Failed readiness probe

### Service Issues

- Wrong targetPort
- Wrong selector
- Service misconfiguration

### Ingress Issues

- Incorrect backend service
- Wrong port mapping
- Invalid rewrite rules
- TLS configuration errors

### Infrastructure Issues

- Database unavailable
- Redis unavailable
- DNS failure
- Node failure
- Network Policy blocking traffic

---

# Investigation Steps

## 1. Check Alert

Open Grafana dashboard

Look for:

- 5XX error rate
- Request volume
- Affected host
- Affected path
- Time of failure

---

## 2. Check Ingress

```bash
kubectl get ingress -A

kubectl describe ingress <ingress-name> -n <namespace>
```

Verify

- Backend service
- Host
- Path
- Port

---

## 3. Check Ingress Controller

```bash
kubectl get pods -n ingress-nginx

kubectl logs deployment/ingress-nginx-controller \
-n ingress-nginx --tail=100
```

Look for

- upstream timed out
- no endpoints available
- connection refused
- service unavailable

---

## 4. Check Backend Service

```bash
kubectl get svc -n <namespace>

kubectl describe svc <service-name>
```

Verify

- Port
- TargetPort
- Selector

---

## 5. Check Endpoints

```bash
kubectl get endpoints <service-name> \
-n <namespace>
```

Healthy

```
10.244.1.15:8080
10.244.2.18:8080
```

Problem

```
<none>
```

No endpoints means the Service cannot route traffic.

---

## 6. Check Pods

```bash
kubectl get pods -n <namespace>
```

Look for

- CrashLoopBackOff
- Error
- Pending
- ImagePullBackOff
- OOMKilled

---

## 7. Describe Pod

```bash
kubectl describe pod <pod-name> \
-n <namespace>
```

Check

- Events
- Readiness probe
- Liveness probe
- Restart count

---

## 8. Check Logs

```bash
kubectl logs <pod-name> \
-n <namespace>
```

Look for

- Exception
- Panic
- Database errors
- Connection timeout
- Out of memory

---

## 9. Verify Service Connectivity

```bash
kubectl exec -it <pod> -- sh
```

Inside pod

```bash
curl http://service-name:8080
```

Expected

```
HTTP 200
```

---

## 10. Check Deployment

```bash
kubectl rollout status deployment/<deployment>

kubectl rollout history deployment/<deployment>
```

If a recent deployment introduced the issue, rollback may restore service quickly. :contentReference[oaicite:1]{index=1}

---

## 11. Check Recent Deployment

```bash
kubectl rollout history deployment/<deployment>

kubectl rollout undo deployment/<deployment>
```

If issue started immediately after deployment

Rollback.

---

## 12. Check Resource Usage

```bash
kubectl top pod

kubectl top node
```

Look for

- CPU >90%
- Memory >90%

---

## 13. Check Events

```bash
kubectl get events \
--sort-by=.metadata.creationTimestamp
```

Look for

- FailedScheduling
- Killing
- BackOff
- Unhealthy

---

## Resolution

### Case 1

Pods crashed

**Action**

Restart deployment

```bash
kubectl rollout restart deployment <deployment>
```

---

### Case 2

No endpoints

**Action**

Fix Service selector

```bash
kubectl get pods --show-labels
kubectl describe svc
```

---

### Case 3

Wrong targetPort

Update Service

```yaml
targetPort: 8080
```

---

### Case 4

Application bug

Rollback deployment

```bash
kubectl rollout undo deployment <deployment>
```

---

### Case 5

Database unavailable

- Verify database status
- Check credentials
- Restore connectivity

---

### Case 6

Readiness probe failure

Increase

- initialDelaySeconds
- timeoutSeconds
- failureThreshold

---

### Case 7

Resource exhaustion

Increase

```yaml
resources:
  requests:
    cpu: 500m
    memory: 512Mi
  limits:
    cpu: 1
    memory: 1Gi
```

---

## Validation

Confirm

```bash
kubectl get pods

kubectl get endpoints

kubectl get ingress
```

Verify

```bash
curl https://your-domain.com
```

Expected

```
HTTP/1.1 200 OK
```

Monitor

- 5XX errors return to normal
- Pod restarts stop
- Latency decreases
- User traffic succeeds

---

## Escalation

Escalate if

- Error persists after rollback
- Database outage
- Multiple services affected
- Cluster networking issue
- Node failures
- Ingress controller unavailable

Notify

- Platform Team
- DevOps Team
- Application Team
- Database Team (if required)

---

## Useful Commands

```bash
kubectl get ingress -A

kubectl describe ingress <name>

kubectl get svc

kubectl get endpoints

kubectl get pods

kubectl logs <pod>

kubectl describe pod <pod>

kubectl top pod

kubectl top node

kubectl rollout history deployment/<deployment>

kubectl rollout undo deployment/<deployment>

kubectl get events --sort-by=.metadata.creationTimestamp
```

---

## Prevention

- Configure readiness and liveness probes correctly.
- Enable autoscaling (HPA) for backend services.
- Set CPU and memory requests and limits.
- Use rolling updates with health checks.
- Monitor 5XX error rates, latency, and backend availability.
- Test Ingress changes in staging before production deployment.
- Ensure backend Services always have healthy endpoints. :contentReference[oaicite:2]{index=2}