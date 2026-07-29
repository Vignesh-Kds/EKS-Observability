# ImagePullBackOff Runbook

## Overview

This runbook explains how to troubleshoot and resolve `ImagePullBackOff` and `ErrImagePull` errors in a Kubernetes cluster.

These errors occur when Kubernetes cannot download a container image from the configured container registry.

Common causes include:

- Incorrect image name
- Invalid image tag
- Image does not exist
- Authentication failure
- Missing imagePullSecret
- Network connectivity issues
- Registry outage

---

# Incident Information

Record:

```
Incident ID:

Alert Name:

Namespace:

Deployment:

Image:

Environment:

Engineer:

Severity:
```

---

# Symptoms

Typical pod status:

```
ImagePullBackOff

ErrImagePull
```

Application impact:

- Pod never starts
- Deployment unavailable
- Service endpoints empty
- Application downtime

---

# Troubleshooting Flow

```
Deployment Created
        |
        v
Pod Scheduled
        |
        v
Image Download
        |
   +----+----+
   |         |
Success    Failed
   |         |
Running  ImagePullBackOff
              |
              v
      Verify Image
              |
              v
      Verify Registry
              |
              v
     Verify Authentication
              |
              v
      Redeploy Application
```

---

# 1. Verify Pod Status

List pods:

```bash
kubectl get pods -n production
```

Example:

```
backend-65d8f6b6d8-abcde   ImagePullBackOff
```

---

# 2. Describe the Pod

View detailed events:

```bash
kubectl describe pod <pod-name> -n production
```

Common messages:

```
Failed to pull image

manifest unknown

pull access denied

repository does not exist

authentication required
```

---

# 3. Verify Deployment Image

Check deployment:

```bash
kubectl describe deployment backend -n production
```

Verify:

```
Image:

myrepo/backend:v1.0.0
```

Confirm:

- Repository name
- Image tag
- Registry URL

---

# 4. Verify Image Exists

Example:

```bash
docker pull myrepo/backend:v1.0.0
```

If pull fails:

```
manifest unknown

repository not found
```

The image may not exist or the tag is incorrect.

---

# 5. Verify Image Tag

Check deployment YAML:

```yaml
containers:

- name: backend

  image: myrepo/backend:v1.0.0
```

Common mistakes:

```
latest

v1

v1.0

v1.0.0
```

Ensure the deployed tag exists in the registry.

---

# 6. Check Image Pull Secret

List secrets:

```bash
kubectl get secrets -n production
```

Describe deployment:

```bash
kubectl describe deployment backend -n production
```

Verify:

```yaml
imagePullSecrets:

- name: registry-secret
```

---

# 7. Test Registry Authentication

Docker Hub example:

```bash
docker login
```

Amazon ECR example:

```bash
aws ecr get-login-password \
| docker login \
--username AWS \
--password-stdin <account>.dkr.ecr.<region>.amazonaws.com
```

---

# 8. Verify Service Account

Check service account:

```bash
kubectl get serviceaccount -n production
```

Describe:

```bash
kubectl describe serviceaccount default \
-n production
```

Verify:

```
Image pull secret attached
```

---

# 9. Check Network Connectivity

Test DNS:

```bash
nslookup docker.io
```

Test connectivity:

```bash
curl https://registry-1.docker.io
```

Verify:

- Internet access
- NAT Gateway (private nodes)
- Firewall rules
- Proxy configuration

---

# 10. Check Registry Limits

Docker Hub anonymous pulls may be rate limited.

Symptoms:

```
Too Many Requests
```

Solutions:

- Authenticate
- Use a private registry
- Mirror images
- Retry after the rate limit resets

---

# Recovery Actions

## Option 1: Correct Image Name

Update deployment:

```bash
kubectl set image deployment/backend \
backend=myrepo/backend:v1.0.1 \
-n production
```

---

## Option 2: Create Image Pull Secret

Docker Hub:

```bash
kubectl create secret docker-registry registry-secret \
--docker-server=https://index.docker.io/v1/ \
--docker-username=<username> \
--docker-password=<password> \
-n production
```

Attach:

```yaml
imagePullSecrets:

- name: registry-secret
```

---

## Option 3: Push Missing Image

Build:

```bash
docker build -t myrepo/backend:v1.0.1 .
```

Push:

```bash
docker push myrepo/backend:v1.0.1
```

---

## Option 4: Restart Deployment

```bash
kubectl rollout restart deployment/backend \
-n production
```

---

# Validation

Check rollout:

```bash
kubectl rollout status deployment/backend \
-n production
```

Expected:

```
successfully rolled out
```

---

Check pods:

```bash
kubectl get pods -n production
```

Expected:

```
STATUS

Running
```

---

Run application health check:

```bash
./scripts/health-check.sh production
```

---

# Monitoring

Verify:

- Deployment available
- Pod restart count stable
- No ImagePullBackOff alerts
- Application accessible

Review:

- Grafana dashboards
- Prometheus alerts
- Loki container logs
- Sentry application errors

---

# Prevention

Best practices:

- Use immutable image tags
- Avoid using `latest` in production
- Validate image availability in CI/CD
- Store registry credentials securely
- Rotate registry credentials regularly
- Configure image pull secrets through Kubernetes Secrets
- Scan images before deployment
- Test deployments in staging first

---

# Root Cause Categories

| Category | Example |
|----------|---------|
| Image | Incorrect image name or tag |
| Registry | Image not found |
| Authentication | Invalid registry credentials |
| Network | Registry unreachable |
| CI/CD | Image push failed |
| Configuration | Missing imagePullSecret |

---

# Escalation

| Issue | Owner |
|-------|-------|
| Missing image | Development Team |
| Registry access | DevOps Team |
| CI/CD pipeline | Platform Team |
| Network connectivity | Network Team |
| Registry outage | Cloud Team |

---

# Useful Commands

```bash
kubectl get pods

kubectl describe pod <pod-name>

kubectl logs <pod-name>

kubectl rollout status deployment/backend

kubectl get events --sort-by=.lastTimestamp

kubectl get secrets

docker pull <image>

docker login
```

---

# Tools Used

```
AWS EKS
Kubernetes
kubectl
Docker
Amazon ECR
Docker Hub
GitHub Actions
Prometheus
Grafana
Loki
Sentry
```

---

# Objective

Restore application availability by identifying and resolving image download failures, ensuring deployments can successfully pull container images and start normally.