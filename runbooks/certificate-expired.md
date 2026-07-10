# Certificate Expired Runbook

## Overview

This runbook provides the procedure to troubleshoot and recover when an SSL/TLS certificate expires or becomes invalid.

A certificate expiration can cause:

- HTTPS failures
- Browser security warnings
- API communication failures
- Ingress downtime
- Failed external integrations

---

# Incident Information

Record:

```
Incident ID:

Alert Name:

Domain:

Environment:

Certificate Name:

Start Time:

Engineer:

Severity:
```

---

# Common Symptoms

Users may see:

```
NET::ERR_CERT_DATE_INVALID

Your connection is not private

SSL handshake failed

502/503 errors

API connection failures
```

Monitoring alerts:

```
CertificateExpiryWarning

TLS Certificate Expired

HTTPS Endpoint Down
```

---

# Certificate Flow

```
User
 |
 v
Route53 DNS
 |
 v
AWS Load Balancer
 |
 v
NGINX Ingress
 |
 v
cert-manager
 |
 v
TLS Secret
 |
 v
Application
```

---

# 1. Identify Expired Certificate

## Check Domain Certificate

Using OpenSSL:

```bash
openssl s_client \
-connect example.com:443 \
-servername example.com \
</dev/null \
| openssl x509 -noout -dates
```

Example:

```
notBefore=Jan 01 00:00:00 2026 GMT

notAfter=Jan 01 00:00:00 2027 GMT
```

---

# 2. Check Kubernetes TLS Secrets

List secrets:

```bash
kubectl get secrets \
-n production
```

Find TLS secrets:

```
example-tls
api-tls
frontend-tls
```

---

Check certificate:

```bash
kubectl describe secret example-tls \
-n production
```

---

# 3. Check cert-manager Status

Check certificates:

```bash
kubectl get certificates \
-A
```

Example:

```
NAME          READY

app-cert      True
```

---

Check certificate details:

```bash
kubectl describe certificate app-cert \
-n production
```

Look for:

```
Ready: False

Reason:
CertificateExpired
```

---

# 4. Check cert-manager Pods

Verify cert-manager:

```bash
kubectl get pods \
-n cert-manager
```

Expected:

```
cert-manager-controller     Running

cert-manager-webhook        Running

cert-manager-cainjector     Running
```

---

Check logs:

```bash
kubectl logs \
-n cert-manager \
deployment/cert-manager
```

Look for:

```
ACME challenge failed

DNS validation failed

Permission denied

Rate limit exceeded
```

---

# 5. Check Certificate Issuer

List issuers:

```bash
kubectl get clusterissuer
```

Example:

```
letsencrypt-prod
```

Describe:

```bash
kubectl describe clusterissuer letsencrypt-prod
```

Verify:

- Issuer ready
- ACME account valid
- DNS challenge working

---

# 6. Check Ingress TLS Configuration

Check ingress:

```bash
kubectl get ingress \
-n production
```

Describe:

```bash
kubectl describe ingress <ingress-name> \
-n production
```

Verify:

```yaml
tls:

- hosts:

  - example.com

  secretName: example-tls
```

---

# 7. Manual Certificate Renewal

## Trigger Renewal

Delete certificate resource:

```bash
kubectl delete certificate <certificate-name> \
-n production
```

cert-manager will recreate it.

---

Check:

```bash
kubectl get certificate \
-n production \
-w
```

Expected:

```
READY=True
```

---

# 8. Force Renewal Using cert-manager

Restart cert-manager:

```bash
kubectl rollout restart deployment/cert-manager \
-n cert-manager
```

---

Check certificate request:

```bash
kubectl get certificaterequest \
-n production
```

---

# 9. Check AWS Load Balancer Certificate

If using AWS Load Balancer Controller:

Check ingress:

```bash
kubectl describe ingress <ingress-name> \
-n production
```

Verify:

```
alb.ingress.kubernetes.io/certificate-arn
```

---

Check ACM certificate:

```bash
aws acm describe-certificate \
--certificate-arn <certificate-arn>
```

Verify:

```
Status: ISSUED
```

---

# 10. Verify DNS

Check DNS:

```bash
nslookup example.com
```

or:

```bash
dig example.com
```

Verify:

```
Domain
 |
 v
Correct Load Balancer
```

---

# Recovery Actions

## Option 1: Restart Ingress Controller

```bash
kubectl rollout restart deployment/ingress-nginx-controller \
-n ingress-nginx
```

---

## Option 2: Recreate TLS Secret

Delete:

```bash
kubectl delete secret example-tls \
-n production
```

Apply again:

```bash
kubectl apply -f tls-secret.yaml
```

---

## Option 3: Renew Certificate

```bash
kubectl delete certificate <certificate-name> \
-n production
```

Wait for cert-manager:

```bash
kubectl get certificate \
-n production \
-w
```

---

# Validation

## Test HTTPS

```bash
curl -Iv https://example.com
```

Expected:

```
SSL certificate verify ok
HTTP/2 200
```

---

## Browser Validation

Check:

```
Lock Icon
 |
 v
Certificate Details
 |
 v
Valid Until Future Date
```

---

## Run Health Check

```bash
./scripts/health-check.sh production
```

---

# Monitoring

## Prometheus Alert Example

```yaml
alert: CertificateExpiry

expr:

certmanager_certificate_expiration_timestamp_seconds
-
time()
<
604800
```

Meaning:

```
Certificate expires within 7 days
```

---

# Grafana Dashboard Checks

Monitor:

- Certificate expiry days
- TLS errors
- HTTPS availability
- Ingress errors

---

# Prevention

## Best Practices

✅ Use cert-manager automation  
✅ Use Let's Encrypt production issuer  
✅ Configure renewal alerts  
✅ Monitor expiry before 30 days  
✅ Use AWS ACM where possible  
✅ Automate certificate rotation  
✅ Document certificate ownership  

---

# Certificate Renewal Timeline

```
Certificate Created

       |
       v

30 Days Before Expiry

       |
       v

Renewal Attempt

       |
       v

New Certificate Issued

       |
       v

Secret Updated

       |
       v

Ingress Reloaded
```

---

# Escalation

| Issue | Owner |
|---|---|
| cert-manager failure | DevOps/SRE |
| DNS validation issue | Network Team |
| ACM issue | Cloud Team |
| Application HTTPS issue | Development Team |

---

# Tools Used

```
Kubernetes
cert-manager
kubectl
Helm
AWS ACM
AWS Load Balancer Controller
NGINX Ingress
Prometheus
Grafana
```

---

# Objective

Restore secure HTTPS communication quickly and ensure automated certificate renewal prevents future outages.