# Deployment Rollback Runbook

## Overview

This runbook provides the procedure to safely rollback a failed Kubernetes deployment to a previously stable version.

Rollback is required when:

- New deployment causes application failures
- Error rates increase after release
- Pods enter CrashLoopBackOff
- Health checks fail
- Performance degrades
- Configuration changes break the application

---

# Incident Information

Record:

```
Incident ID:

Deployment Name:

Application:

Environment:

Current Version:

Rollback Version:

Start Time:

Engineer:

Severity:
```

---

# Rollback Decision Flow

```
New Deployment Released

          |

          v

Monitor Application

          |

     +----+----+

     |         |

   Healthy   Failed

     |         |

 Continue    Investigate

               |

               v

          Rollback Decision

               |

               v

        Restore Previous Version

               |

               v

        Validate Application
```

---

# 1. Identify Deployment Issue

Check application status:

```bash
kubectl get pods \
-n production
```

Look for:

```
CrashLoopBackOff

ImagePullBackOff

Error

NotReady

High Restarts
```

---

# 2. Check Recent Deployment

View deployments:

```bash
kubectl get deployments \
-n production
```

---

Check rollout status:

```bash
kubectl rollout status \
deployment/<application> \
-n production
```

---

# 3. Review Deployment History

## Kubernetes Rollout History

```bash
kubectl rollout history \
deployment/<application> \
-n production
```

Example:

```
REVISION

1

2

3
```

---

View specific revision:

```bash
kubectl rollout history \
deployment/<application> \
--revision=3 \
-n production
```

---

# 4. Helm Release History

For Helm-managed applications:

```bash
helm history <release-name> \
-n production
```

Example:

```
REVISION   STATUS

1          superseded

2          deployed

3          failed
```

---

# 5. Verify Rollback Target

Before rollback confirm:

- Previous version is stable
- Image exists
- Configuration is compatible
- Database changes are backward compatible

Check images:

```bash
kubectl describe deployment <application> \
-n production
```

---

# Rollback Methods

---

# Method 1: Kubernetes Rollback

Rollback to previous revision:

```bash
kubectl rollout undo deployment/<application> \
-n production
```

---

Rollback to specific revision:

```bash
kubectl rollout undo deployment/<application> \
--to-revision=2 \
-n production
```

---

# Method 2: Helm Rollback

Check releases:

```bash
helm list \
-n production
```

Rollback:

```bash
helm rollback <release-name> \
-n production
```

---

Rollback specific revision:

```bash
helm rollback <release-name> 2 \
-n production
```

---

# Method 3: Project Script Rollback

Using automation:

```bash
./scripts/rollback.sh \
production \
backend
```

Example:

```bash
./scripts/rollback.sh \
production \
frontend
```

---

# 6. Monitor Rollback Progress

Watch pods:

```bash
kubectl get pods \
-n production \
-w
```

---

Check rollout:

```bash
kubectl rollout status \
deployment/<application> \
-n production
```

Expected:

```
successfully rolled out
```

---

# 7. Validate Application

## Health Check

Run:

```bash
./scripts/health-check.sh production
```

---

## API Validation

Example:

```bash
curl https://api.example.com/health
```

Expected:

```json
{
 "status":"healthy"
}
```

---

## Check Metrics

Grafana:

Review:

- Error rate
- Request count
- Latency
- Pod restarts
- CPU usage
- Memory usage

---

# 8. Check Application Logs

View logs:

```bash
kubectl logs \
deployment/<application> \
-n production
```

Check:

```
No exceptions

No database failures

No startup errors
```

---

# 9. Database Compatibility Check

Before rollback verify:

- Database migrations
- Schema changes
- API compatibility

Example:

```
Application v2
      |
      v
Database migration
      |
      v
Rollback to v1
```

Risk:

```
Old application
      |
      X
New database schema
```

---

# 10. Rollback Failure Troubleshooting

## Pods Still Failing

Check:

```bash
kubectl describe pod <pod-name> \
-n production
```

---

## Image Not Available

Check:

```bash
kubectl describe deployment <application> \
-n production
```

Verify:

```
Image exists in registry
```

---

## Configuration Issue

Check:

```bash
kubectl get configmap \
-n production
```

and:

```bash
kubectl get secrets \
-n production
```

---

# Emergency Recovery

If application is completely unavailable:

## Scale Previous Version

```bash
kubectl scale deployment <application> \
--replicas=5 \
-n production
```

---

## Restore Previous Image

```bash
kubectl set image deployment/<application> \
container=<previous-image> \
-n production
```

---

# Post Rollback Checklist

## Application

- [ ] Pods healthy
- [ ] Health endpoint working
- [ ] Error rate normal
- [ ] User traffic restored

## Infrastructure

- [ ] Nodes healthy
- [ ] Services available
- [ ] Ingress working

## Monitoring

- [ ] Prometheus alerts cleared
- [ ] Grafana metrics normal
- [ ] Loki logs reviewed
- [ ] Sentry errors reduced

---

# Incident Documentation

Record:

```
Rollback Reason:

Failed Version:

Restored Version:

Root Cause:

Impact:

Resolution:

Follow-up Actions:
```

---

# Prevention Actions

After rollback:

- Add deployment tests
- Improve CI/CD validation
- Add canary deployments
- Improve health probes
- Add automated rollback
- Review failed release

---

# Production Deployment Strategy

Recommended:

```
Developer Commit

        |

        v

CI Pipeline

        |

        v

Testing

        |

        v

Canary Deployment

        |

        v

Monitoring

        |

   +----+----+

   |         |

Success   Failure

   |         |

Full      Rollback

Deploy
```

---

# Escalation

| Issue | Owner |
|---|---|
| Application failure | Development Team |
| Kubernetes issue | DevOps/SRE |
| Database migration | DBA Team |
| Infrastructure issue | Cloud Team |

---

# Tools Used

```
Kubernetes
kubectl
Helm
AWS EKS
GitHub Actions
Docker
Prometheus
Grafana
Loki
Sentry
```

---

# Objective

Restore application availability quickly by safely reverting failed deployments while maintaining production stability.