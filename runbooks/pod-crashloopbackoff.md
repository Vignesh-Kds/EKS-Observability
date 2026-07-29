# Pod CrashLoopBackOff Runbook

## Alert Name

Pod CrashLoopBackOff

## Severity

**Critical (P1)** if a production Pod remains in **CrashLoopBackOff** for more than 5 minutes.

**Warning (P2)** if a non-production Pod is repeatedly restarting.

---

# Description

This alert indicates that a Kubernetes Pod is repeatedly starting, crashing, and restarting. Kubernetes places the Pod in the **CrashLoopBackOff** state and increases the delay between restart attempts.

Common causes include:

- Application crash
- Configuration errors
- Missing Secrets or ConfigMaps
- Database connectivity issues
- Resource limits exceeded
- Invalid startup command
- Failed liveness probe

---

# Impact

- Application unavailable
- API failures
- Service degradation
- Increased restart count
- Failed deployments
- Customer-facing outages

---

# Possible Causes

## Application Issues

- Unhandled exception
- Startup failure
- Missing dependencies
- Invalid application configuration

## Configuration Issues

- Missing ConfigMap
- Missing Secret
- Incorrect environment variables
- Invalid startup command

## Infrastructure Issues

- Database unavailable
- Redis unavailable
- External API failure
- DNS resolution failure

## Kubernetes Issues

- Liveness probe failure
- Incorrect image version
- Image startup error
- Resource limits too low

---

# Investigation Steps

## 1. Verify Pod Status

```bash
kubectl get pods -A
```

Example

```text
backend-6db7d9c7fd-xwz9k   CrashLoopBackOff
```

---

## 2. Describe the Pod

```bash
kubectl describe pod <pod-name> -n <namespace>
```

Review:

- Events
- Restart Count
- Exit Code
- Last State
- Liveness Probe
- Readiness Probe

Example

```text
Last State:
Reason: Error
Exit Code: 1

Restart Count: 18
```

---

## 3. View Application Logs

```bash
kubectl logs <pod-name> -n <namespace>
```

If the container has already restarted:

```bash
kubectl logs <pod-name> \
-n <namespace> --previous
```

Look for:

- Stack traces
- Configuration errors
- Connection failures
- Startup exceptions
- Permission denied

---

## 4. Check Events

```bash
kubectl get events \
--sort-by=.metadata.creationTimestamp
```

Look for:

```text
BackOff

Failed

Killing

Unhealthy
```

---

## 5. Verify Container Exit Code

```bash
kubectl describe pod <pod-name>
```

Common exit codes:

| Exit Code | Meaning |
|-----------|---------|
| 0 | Application exited normally |
| 1 | General application error |
| 126 | Command cannot execute |
| 127 | Command not found |
| 137 | OOMKilled |
| 139 | Segmentation fault |
| 143 | Graceful termination |

---

## 6. Check Resource Usage

```bash
kubectl top pod <pod-name>
```

If the Pod was OOMKilled:

```text
Reason: OOMKilled

Exit Code: 137
```

Increase memory limits if appropriate.

---

## 7. Verify ConfigMaps and Secrets

```bash
kubectl get configmap

kubectl get secret
```

Check environment variables.

```bash
kubectl describe pod <pod-name>
```

Verify:

- Secret names
- ConfigMap names
- Mounted volumes

---

## 8. Test Connectivity

Open a shell in another healthy Pod.

```bash
kubectl exec -it <healthy-pod> -- sh
```

Test dependencies.

```bash
curl http://backend-service:8080

nslookup database-service

ping redis-service
```

---

## 9. Check Deployment

```bash
kubectl rollout status deployment/<deployment>

kubectl rollout history deployment/<deployment>
```

If the issue started after a deployment, identify the latest revision.

---

## 10. Roll Back if Needed

```bash
kubectl rollout undo deployment/<deployment>
```

---

# Resolution

## Case 1

Application bug

**Action**

- Fix the application
- Build a new image
- Deploy the corrected version

---

## Case 2

Missing Secret

Create or restore the Secret.

```bash
kubectl apply -f secret.yaml
```

---

## Case 3

Missing ConfigMap

Apply the ConfigMap.

```bash
kubectl apply -f configmap.yaml
```

---

## Case 4

Database unavailable

Verify:

- Database health
- Credentials
- Network connectivity

---

## Case 5

Liveness probe failure

Adjust probe settings.

Example

```yaml
livenessProbe:
  initialDelaySeconds: 30
  timeoutSeconds: 5
  periodSeconds: 10
```

---

## Case 6

OOMKilled

Increase memory resources.

```yaml
resources:
  requests:
    memory: 512Mi
  limits:
    memory: 1Gi
```

---

## Case 7

Invalid startup command

Verify:

```yaml
command:

args:
```

Ensure the executable and arguments are correct.

---

# Validation

Verify Pod status.

```bash
kubectl get pods
```

Expected

```text
STATUS
Running
```

Verify:

- Restart count is no longer increasing
- Application logs show successful startup
- Readiness probe succeeds
- Service endpoints are healthy

Test the application.

```bash
curl http://<service-name>
```

Expected

```text
HTTP/1.1 200 OK
```

---

# Escalation

Escalate if:

- Pod continues crashing after rollback
- Root cause cannot be identified
- Multiple services are affected
- Database or external dependency is unavailable
- Production outage continues

Notify:

- DevOps Team
- Platform Team
- Application Team
- Database Team (if required)

---

# Useful Commands

```bash
kubectl get pods -A

kubectl describe pod <pod-name>

kubectl logs <pod-name>

kubectl logs <pod-name> --previous

kubectl top pod <pod-name>

kubectl get events --sort-by=.metadata.creationTimestamp

kubectl get configmap

kubectl get secret

kubectl rollout status deployment/<deployment>

kubectl rollout history deployment/<deployment>

kubectl rollout undo deployment/<deployment>

kubectl exec -it <healthy-pod> -- sh
```

---

# Prevention

- Configure appropriate liveness and readiness probes.
- Set CPU and memory requests and limits for all containers.
- Validate ConfigMaps and Secrets before deployment.
- Perform health checks in CI/CD pipelines.
- Use rolling updates with automatic rollback.
- Monitor restart counts and CrashLoopBackOff alerts.
- Test application startup in staging before production deployment.