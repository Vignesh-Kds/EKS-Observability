# Database Connection Failure Runbook

## Overview

This runbook provides the procedure to troubleshoot and recover when an application cannot connect to the database.

Database connectivity failures can cause:

- Backend API failures
- Application errors
- Increased response time
- Failed transactions
- User login failures
- Data processing failures

---

# Incident Information

Record:

```
Incident ID:

Alert Name:

Database:

Environment:

Affected Services:

Start Time:

Engineer:

Severity:
```

---

# Common Symptoms

Application symptoms:

```
500 Internal Server Error

Database connection timeout

Authentication failure

Unable to acquire database connection

Connection pool exhausted
```

Monitoring alerts:

```
DatabaseConnectionFailure

PostgreSQLDown

HighDatabaseLatency

TooManyConnections
```

---

# Database Connectivity Flow

```
User Request

      |

      v

Frontend

      |

      v

Backend Service

      |

      v

Database Service

      |

      v

PostgreSQL / MySQL
```

---

# 1. Identify Database Impact

Determine:

- Is the database completely unavailable?
- Is only one application affected?
- Are queries slow?
- Are connections exhausted?

Check application health:

```bash
curl https://api.example.com/health
```

Expected:

```json
{
 "database": "connected",
 "status": "healthy"
}
```

---

# 2. Check Database Pod Status

For Kubernetes database:

```bash
kubectl get pods \
-n production \
-l app=postgres
```

Expected:

```
postgres-0    Running
```

Investigate:

```
CrashLoopBackOff

Pending

ContainerCreating

Error
```

---

# 3. Check Database Logs

View logs:

```bash
kubectl logs postgres-0 \
-n production
```

Look for:

```
Database system is shutting down

Too many connections

Disk full

Authentication failed

Recovery mode

Corrupted data files
```

---

# 4. Check Database Service

Verify service:

```bash
kubectl get svc \
-n production
```

Example:

```
postgres-service   ClusterIP   5432
```

---

Check endpoints:

```bash
kubectl get endpoints postgres-service \
-n production
```

Expected:

```
10.0.2.25:5432
```

If empty:

Possible causes:

- Database pod unavailable
- Service selector mismatch
- Network policy blocking traffic

---

# 5. Test Connection From Backend Pod

Enter backend container:

```bash
kubectl exec -it <backend-pod> \
-n production \
-- sh
```

Test port:

```bash
nc -zv postgres-service 5432
```

Expected:

```
Connection succeeded
```

---

Test DNS:

```bash
nslookup postgres-service
```

Expected:

```
postgres-service.production.svc.cluster.local
```

---

# 6. Verify Database Credentials

Check backend environment:

```bash
kubectl describe pod <backend-pod> \
-n production
```

Verify:

```
DATABASE_HOST

DATABASE_PORT

DATABASE_USER

DATABASE_PASSWORD

DATABASE_NAME
```

---

Check Kubernetes secrets:

```bash
kubectl get secrets \
-n production
```

View secret keys:

```bash
kubectl describe secret database-secret \
-n production
```

---

# 7. Check Database Connections

For PostgreSQL:

Connect:

```bash
kubectl exec -it postgres-0 \
-n production \
-- psql -U postgres
```

Check connections:

```sql
SELECT count(*)
FROM pg_stat_activity;
```

---

Check maximum connections:

```sql
SHOW max_connections;
```

---

Symptoms:

```
Connection count near maximum
```

Resolution:

- Increase max connections
- Fix connection leaks
- Restart application pods

---

# 8. Check Database Resource Usage

CPU:

```bash
kubectl top pod postgres-0 \
-n production
```

Memory:

```bash
kubectl top pod postgres-0 \
-n production
```

Check:

- CPU saturation
- Memory pressure
- Disk usage

---

# 9. Check Persistent Volume

Database requires persistent storage.

Check PVC:

```bash
kubectl get pvc \
-n production
```

Expected:

```
STATUS

Bound
```

---

Describe PVC:

```bash
kubectl describe pvc <pvc-name> \
-n production
```

Look for:

```
Volume not attached

Storage full

Mount failure
```

---

# 10. Check Network Policies

List policies:

```bash
kubectl get networkpolicy \
-n production
```

Verify backend can access database:

```
Backend Namespace
        |
        v
Database Service
```

---

# 11. Check External Database

If using AWS RDS:

Check status:

```bash
aws rds describe-db-instances
```

Verify:

```
DBInstanceStatus: available
```

---

Check:

- Security groups
- Subnet routing
- Database credentials
- Parameter groups

---

# Recovery Actions

## Option 1: Restart Backend Pods

Use when:

- Stale connections
- Connection pool issue

```bash
kubectl rollout restart deployment/backend \
-n production
```

---

## Option 2: Restart Database Pod

Only if safe:

```bash
kubectl delete pod postgres-0 \
-n production
```

StatefulSet will recreate it.

---

## Option 3: Increase Database Connections

PostgreSQL:

```sql
ALTER SYSTEM SET max_connections = 300;

SELECT pg_reload_conf();
```

---

## Option 4: Rollback Application

If caused by deployment:

```bash
./scripts/rollback.sh \
production \
backend
```

---

# Validation After Recovery

## Check Database

```bash
kubectl get pods \
-n production
```

Expected:

```
postgres-0 Running
```

---

## Test Connection

```bash
kubectl exec -it <backend-pod> \
-n production \
-- nc -zv postgres-service 5432
```

---

## Test Application

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

# Monitoring Checks

## Prometheus Metrics

Check:

```
Database availability

Connection count

Query latency

Transaction errors

Disk usage
```

Example:

```promql
pg_stat_database_numbackends
```

---

## Grafana Dashboard

Review:

- PostgreSQL Dashboard
- Backend API Dashboard
- Kubernetes Resources

---

## Loki Logs

Search:

```
database

connection

timeout

authentication

failed
```

---

# Root Cause Categories

| Category | Example |
|---|---|
| Application | Connection leak |
| Database | Crash |
| Network | Security group issue |
| Storage | Disk full |
| Configuration | Wrong credentials |
| Resource | CPU/memory exhaustion |

---

# Prevention

Best practices:

✅ Use database connection pooling  
✅ Monitor connection limits  
✅ Enable automated backups  
✅ Configure database alerts  
✅ Test database failover  
✅ Use managed databases for production  
✅ Review slow queries  

---

# Escalation

| Issue | Owner |
|---|---|
| Database availability | DBA Team |
| Kubernetes issue | DevOps/SRE |
| Application queries | Development Team |
| AWS RDS issue | Cloud Team |

---

# Tools Used

```
AWS RDS
PostgreSQL
Kubernetes
kubectl
Helm
Prometheus
Grafana
Loki
Sentry
```

---

# Objective

Restore database connectivity quickly while protecting data integrity and preventing repeated database outages.