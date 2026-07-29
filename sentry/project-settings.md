# Sentry Project Settings

## Overview

This document describes the recommended Sentry project configuration for the EKS multi-service application.

The settings define:

- Error tracking behavior
- Performance monitoring
- Release tracking
- Alert rules
- Data privacy controls
- Integration settings

---

# Project Information

| Setting | Value |
|---|---|
| Project Name | EKS Multi-Service Application |
| Environment | Production |
| Platform | Kubernetes |
| Cloud Provider | AWS EKS |
| Application Type | Web Application |
| Error Tracking | Enabled |
| Performance Monitoring | Enabled |

---

# Environments

Sentry projects should maintain separate environments.

| Environment | Purpose |
|---|---|
| Development | Developer testing |
| Staging | Pre-production validation |
| Production | Live customer traffic |

Example:

```
production
staging
development
```

---

# Error Tracking Settings

## Capture Exceptions

Enabled:

```
Yes
```

Captured errors:

- Unhandled exceptions
- API failures
- Database errors
- Background job failures
- Frontend runtime errors

---

## Error Sampling

Configuration:

```yaml
errorTracking:

  enabled: true

  captureExceptions: true

  captureUnhandledRejections: true
```

---

# Performance Monitoring

Performance monitoring tracks:

- API response time
- Database queries
- External API calls
- Frontend performance

Configuration:

```yaml
performance:

  enabled: true

  tracesSampleRate: 0.1
```

Sampling:

| Environment | Sample Rate |
|---|---|
| Development | 100% |
| Staging | 50% |
| Production | 10% |

---

# Release Tracking

Every deployment should create a Sentry release.

Release format:

```
application-name@version
```

Example:

```
backend@v1.2.0
frontend@v1.2.0
```

CI/CD flow:

```
Git Commit
     |
     v
Build Image
     |
     v
Deploy to EKS
     |
     v
Create Sentry Release
```

---

# Source Maps

Source maps should be uploaded for frontend debugging.

Enabled:

```
Yes
```

Benefits:

```
Production Error
       |
       v
Minified JavaScript
       |
       v
Source Map
       |
       v
Original Code Location
```

---

# Alert Rules

## Critical Error Rate

Condition:

```
Error count > 50 events/minute
```

Severity:

```
Critical
```

Action:

```
Notify DevOps Team
```

---

## New Issue Detected

Condition:

```
First occurrence of production error
```

Severity:

```
Warning
```

---

## Performance Regression

Condition:

```
Transaction duration > 2 seconds
```

Severity:

```
Warning
```

---

# Notification Channels

Configured channels:

```
Sentry
 |
 +--> Email
 |
 +--> Slack
 |
 +--> Microsoft Teams
 |
 +--> PagerDuty
```

---

# User Privacy Settings

## Data Collection

Recommended:

```yaml
sendDefaultPii: false
```

Do not collect:

- Passwords
- Authentication tokens
- Cookies
- Personal identifiers

---

## Sensitive Data Filtering

Masked fields:

```
password
token
authorization
cookie
secret
api_key
```

---

# Backend Project Settings

## SDK Configuration

Required:

```
SENTRY_DSN
SENTRY_ENVIRONMENT
SENTRY_RELEASE
```

Example:

```text
SENTRY_ENVIRONMENT=production

SENTRY_RELEASE=backend@1.2.0
```

---

# Frontend Project Settings

Required:

```
VITE_SENTRY_DSN
VITE_RELEASE_VERSION
```

Captured events:

- Browser errors
- Network failures
- UI crashes
- User interaction issues

---

# Kubernetes Integration

Sentry application pods should have:

Labels:

```yaml
labels:

  app: backend

  environment: production
```

Annotations:

```yaml
annotations:

  sentry.io/enabled: "true"
```

---

# CI/CD Integration Settings

GitHub Actions should:

1. Create release
2. Upload source maps
3. Associate commits
4. Deploy application

Example:

```
Code Push
    |
    v
GitHub Actions
    |
    +--> Build
    |
    +--> Test
    |
    +--> Create Sentry Release
    |
    +--> Deploy EKS
```

---

# Integration Checklist

## Application

- [ ] Sentry SDK installed
- [ ] DSN configured
- [ ] Environment configured
- [ ] Release version added

## Kubernetes

- [ ] Secret created
- [ ] Environment variables injected
- [ ] Network access verified

## CI/CD

- [ ] Sentry auth token configured
- [ ] Release automation enabled
- [ ] Source maps uploaded

## Monitoring

- [ ] Alerts configured
- [ ] Notification channels tested
- [ ] Dashboard reviewed

---

# Production Review

Before enabling production:

| Check | Status |
|---|---|
| Error tracking enabled | ☐ |
| Performance monitoring enabled | ☐ |
| Source maps uploaded | ☐ |
| Alerts configured | ☐ |
| Secrets secured | ☐ |
| Backup configured | ☐ |

---

# Recommended Production Architecture

```
                 Users

                   |

                   v

          Frontend / Backend

                   |

        +----------+----------+

        |                     |

        v                     v

   Prometheus             Sentry

   Metrics                Errors

        |                     |

        v                     v

     Grafana          Issue Management


              Application Logs

                    |

                    v

                   Loki
```

---

# Ownership

| Component | Owner |
|---|---|
| Application Errors | Development Team |
| Infrastructure | DevOps Team |
| Alerts | SRE Team |
| Security Review | Security Team |

---

# Document Version

```
Version: 1.0

Last Updated:
YYYY-MM-DD
```