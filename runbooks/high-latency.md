# High Latency Runbook

## Overview

This runbook provides the procedure to troubleshoot and resolve high application latency in the production Kubernetes environment.

High latency can impact:

- User experience
- API response times
- Transaction processing
- Service availability
- Customer satisfaction

---

# Incident Information

Record:

```
Incident ID:

Alert Name:

Affected Service:

Environment:

Start Time:

Engineer:

Severity:
```

---

# Common Symptoms

Users may experience:

```
Slow page loading

API timeout errors

Delayed transactions

Intermittent failures
```

Monitoring alerts:

```
HighRequestLatency

APIResponseTimeHigh

SLOViolation

ApplicationLatencyIncrease
```

---

# Latency Troubleshooting Flow

```
Latency Alert Triggered

          |

          v

Identify Affected Service

          |

          v

Check Application Metrics

          |

          v

Check Infrastructure Resources

          |

          v

Check Database Performance

          |

          v

Identify Root Cause

          |

          v

Apply Fix

          |

          v

Validate Recovery
```

---

# 1. Confirm the Issue

Check application endpoint:

```bash
curl -w "@curl-format.txt" \
-o /dev/null \
-s \
https://api.example.com
```

Check response time:

```
DNS Time:

Connection Time:

TTFB:

Total Time:
```

---

# 2. Check Application Metrics

Open Grafana dashboard:

Review:

- Request latency
- Request rate
- Error percentage
- Active connections
- Pod response time

Important metrics:

```
p50 latency

p95 latency

p99 latency
```

---

# 3. Check Backend Pods

List pods:

```bash
kubectl get pods \
-n production \
-l app=backend
```

Check:

```
CPU usage

Memory usage

Restart count

Pod status
```

---

# 4. Check Pod Resource Usage

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
CPU throttling

Memory pressure

High utilization
```

---

# 5. Check Node Resources

Check nodes:

```bash
kubectl top nodes
```

Investigate:

```
High CPU

High memory

Disk pressure

Network saturation
```

---

# 6. Check Application Logs

View logs:

```bash
kubectl logs <backend-pod> \
-n production
```

Search:

```
timeout

slow

database

connection

exception
```

---

# 7. Check Loki Logs

Grafana:

```
Explore

  |

Loki

  |

namespace="production"
```

Example query:

```
{app="backend"}
```

Look for:

```
Slow API requests

External API delays

Database timeout
```

---

# 8. Check Database Performance

Database latency is a common cause.

Check database:

```bash
kubectl get pods \
-n production \
-l app=postgres
```

---

Check active connections:

PostgreSQL:

```sql
SELECT count(*)
FROM pg_stat_activity;
```

---

Check slow queries:

```sql
SELECT query,
       query_start
FROM pg_stat_activity
ORDER BY query_start;
```

Investigate:

- Missing indexes
- Long running queries
- Connection exhaustion

---

# 9. Check Network Latency

Test service communication:

```bash
kubectl exec -it <backend-pod> \
-n production \
-- ping postgres-service
```

Check DNS:

```bash
nslookup backend-service
```

Verify:

- Service endpoints
- Network policies
- Ingress configuration

---

# 10. Check Ingress / Load Balancer

Verify ingress:

```bash
kubectl get ingress \
-n production
```

Check:

- Load balancer health
- Target availability
- SSL termination
- Request distribution

---

# 11. Check External Dependencies

Identify dependencies:

```
Payment API

Third-party APIs

Authentication Service

Message Queue
```

Check:

- Response time
- Error rate
- Timeouts

---

# Prometheus Investigation

## Request Latency

Example query:

```promql
histogram_quantile(
0.95,
rate(
http_request_duration_seconds_bucket[5m]
)
)
```

---

## CPU Usage

```promql
rate(
container_cpu_usage_seconds_total[5m]
)
```

---

## Memory Usage

```promql
container_memory_usage_bytes
```

---

# Recovery Actions

---

# Option 1: Scale Application

Increase replicas:

```bash
kubectl scale deployment backend \
--replicas=5 \
-n production
```

Use when:

- Traffic increase
- CPU saturation
- Insufficient replicas

---

# Option 2: Restart Application

Use when:

- Memory leak
- Stuck processes
- Connection issues

```bash
kubectl rollout restart deployment/backend \
-n production
```

---

# Option 3: Increase Resources

Update deployment:

```yaml
resources:

 requests:

   cpu: 500m

   memory: 1Gi


 limits:

   cpu: 2

   memory: 4Gi
```

Apply:

```bash
kubectl apply -f deployment.yaml
```

---

# Option 4: Database Optimization

Actions:

- Add indexes
- Optimize queries
- Increase connection pool
- Scale database resources

---

# Option 5: Rollback Deployment

If latency started after release:

```bash
./scripts/rollback.sh \
production \
backend
```

---

# Validation After Recovery

## Application Test

```bash
curl https://api.example.com/health
```

Expected:

```
HTTP 200
```

---

## Check Metrics

Verify:

```
Latency reduced

Error rate normal

CPU stable

Memory stable
```

---

## Check Alerts

Confirm:

```
Prometheus alert cleared

Grafana dashboard normal

Sentry issues reduced
```

---

# Root Cause Categories

| Category | Example |
|---|---|
| Application | Inefficient code |
| Database | Slow query |
| Infrastructure | CPU saturation |
| Network | High packet latency |
| Dependency | External API delay |
| Deployment | Bad release |

---

# Prevention

Best practices:

✅ Define latency SLOs  
✅ Monitor p95/p99 latency  
✅ Enable distributed tracing  
✅ Optimize database queries  
✅ Configure autoscaling  
✅ Use caching where required  
✅ Load test before releases  
✅ Monitor external dependencies  

---

# Escalation

| Issue | Owner |
|---|---|
| Application performance | Development Team |
| Kubernetes resources | DevOps/SRE |
| Database latency | DBA Team |
| Network latency | Network Team |
| Cloud infrastructure | Cloud Team |

---

# Tools Used

```
AWS EKS
Kubernetes
kubectl
Helm
Prometheus
Grafana
Loki
Sentry
AWS CloudWatch
```

---

# Objective

Restore application performance by identifying latency bottlenecks, applying corrective actions, and improving system reliability.