# 🚀 Rapid Deployment Guide - Production SaaS Platform

**For:** Sam Primeaux & Dev Team  
**Platform:** Cloudflare Pro + meauxbility.org  
**Goal:** Safe, accurate, rapid deployment of production-ready SaaS

---

## ⚡ **Quick Start**

### **1. Initial Setup (One Time)**

```bash
# Clone and setup
git clone <your-repo>
cd cloudflare-mcp-worker
npm install

# Login to Cloudflare
wrangler login

# Run setup script
./setup-production-saas.sh
```

### **2. Configure Secrets**

```bash
# Required secrets
wrangler secret put RESEND_API_KEY --config wrangler.meauxaccess-dashboard-production.toml
wrangler secret put CLOUDFLARE_IMAGES_API_TOKEN --config wrangler.meauxaccess-dashboard-production.toml

# Optional secrets
wrangler secret put OPENAI_API_KEY --config wrangler.meauxaccess-dashboard-production.toml
wrangler secret put GEMINI_API_KEY --config wrangler.meauxaccess-dashboard-production.toml
```

### **3. Database Setup**

```bash
# Apply schema
wrangler d1 execute meauxstack-saas-db --file=./database-schema.sql

# Verify
wrangler d1 execute meauxstack-saas-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

---

## 🚀 **Deployment Workflow**

### **Development → Staging → Production**

#### **1. Local Development**
```bash
# Start dev server
wrangler dev --config wrangler.meauxaccess-dashboard-production.toml

# Test endpoints
curl http://localhost:8787/api/auth/me
```

#### **2. Pre-Deployment Checklist**
- [ ] Code tested locally
- [ ] Database migrations applied
- [ ] Secrets configured
- [ ] Environment variables set
- [ ] No console.logs in production code
- [ ] Error handling in place

#### **3. Deploy to Production**
```bash
# Deploy
wrangler deploy --config wrangler.meauxaccess-dashboard-production.toml

# Verify deployment
curl https://meauxbility.org/api/auth/me
```

---

## 🔐 **Authentication Endpoints**

### **Signup**
```bash
curl -X POST https://meauxbility.org/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "SecurePass123!"
  }'
```

### **Login**
```bash
curl -X POST https://meauxbility.org/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### **Login with 2FA**
```bash
curl -X POST https://meauxbility.org/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "twoFactorCode": "123456"
  }'
```

### **Get Current User**
```bash
curl https://meauxbility.org/api/auth/me \
  -H "Cookie: meaux_session=YOUR_SESSION_ID"
```

### **Logout**
```bash
curl -X POST https://meauxbility.org/api/auth/logout \
  -H "Cookie: meaux_session=YOUR_SESSION_ID"
```

---

## 🔒 **2FA Setup**

### **1. Enable 2FA**
```bash
curl -X POST https://meauxbility.org/api/auth/2fa/enable \
  -H "Cookie: meaux_session=YOUR_SESSION_ID"
```

**Response:**
```json
{
  "success": true,
  "secret": "...",
  "qrCodeUrl": "otpauth://totp/Meauxbility:user@example.com?secret=...",
  "message": "Scan QR code with authenticator app, then verify with a code"
}
```

### **2. Verify and Complete Setup**
```bash
curl -X POST https://meauxbility.org/api/auth/2fa/verify \
  -H "Cookie: meaux_session=YOUR_SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456"
  }'
```

---

## 📊 **Database Management**

### **Run Migrations**
```bash
# Apply schema
wrangler d1 execute meauxstack-saas-db --file=./database-schema.sql

# Run custom SQL
wrangler d1 execute meauxstack-saas-db --command="SELECT * FROM users LIMIT 10;"
```

### **Backup Database**
```bash
# Export data
wrangler d1 export meauxstack-saas-db --output=backup.sql
```

### **Restore Database**
```bash
# Import data
wrangler d1 execute meauxstack-saas-db --file=backup.sql
```

---

## 🛡️ **Security Best Practices**

### **1. Password Requirements**
- Minimum 8 characters
- Recommended: uppercase, lowercase, numbers, symbols
- Enforced on signup

### **2. Account Lockout**
- 5 failed login attempts
- 30-minute lockout
- Automatic unlock after timeout

### **3. Session Security**
- HTTP-only cookies
- Secure flag (HTTPS only)
- SameSite=Lax
- 7-day expiration
- IP address tracking

### **4. Rate Limiting**
- Login: 5 attempts per 15 minutes
- Signup: 3 per hour per IP
- Password reset: 3 per hour per email
- API: 100 requests per minute per user

---

## 🧪 **Testing**

### **Test Signup Flow**
```bash
# 1. Signup
curl -X POST https://meauxbility.org/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"Test1234!"}'

# 2. Check email for verification link
# 3. Verify email
curl -X POST https://meauxbility.org/api/auth/verify-email?token=TOKEN&user=USER_ID

# 4. Login
curl -X POST https://meauxbility.org/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'
```

### **Test 2FA Flow**
```bash
# 1. Enable 2FA
curl -X POST https://meauxbility.org/api/auth/2fa/enable \
  -H "Cookie: meaux_session=SESSION_ID"

# 2. Scan QR code in authenticator app
# 3. Verify with code
curl -X POST https://meauxbility.org/api/auth/2fa/verify \
  -H "Cookie: meaux_session=SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{"code":"123456"}'

# 4. Login with 2FA
curl -X POST https://meauxbility.org/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!","twoFactorCode":"123456"}'
```

---

## 📈 **Monitoring**

### **Check Logs**
```bash
# Real-time logs
wrangler tail --config wrangler.meauxaccess-dashboard-production.toml

# Filter errors
wrangler tail --config wrangler.meauxaccess-dashboard-production.toml | grep ERROR
```

### **Check Metrics**
- Cloudflare Dashboard → Workers → Analytics
- Monitor:
  - Request count
  - Error rate
  - Response time
  - CPU time

---

## 🚨 **Troubleshooting**

### **Issue: Database not found**
```bash
# Create database
wrangler d1 create meauxstack-saas-db

# Apply schema
wrangler d1 execute meauxstack-saas-db --file=./database-schema.sql
```

### **Issue: Secret not found**
```bash
# List secrets
wrangler secret list --config wrangler.meauxaccess-dashboard-production.toml

# Set secret
wrangler secret put SECRET_NAME --config wrangler.meauxaccess-dashboard-production.toml
```

### **Issue: Deployment fails**
```bash
# Check logs
wrangler tail --config wrangler.meauxaccess-dashboard-production.toml

# Verify configuration
wrangler whoami
wrangler d1 list
```

---

## ✅ **Deployment Checklist**

### **Before Deployment:**
- [ ] Code tested locally
- [ ] Database schema applied
- [ ] All secrets configured
- [ ] Environment variables set
- [ ] No hardcoded credentials
- [ ] Error handling in place
- [ ] Rate limiting configured
- [ ] Security headers set

### **After Deployment:**
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test 2FA setup
- [ ] Test email verification
- [ ] Test password reset
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Verify SSL certificates

---

## 🎯 **Team Workflow**

### **For Developers:**

1. **Pull latest code**
   ```bash
   git pull origin main
   ```

2. **Make changes locally**
   ```bash
   wrangler dev
   ```

3. **Test thoroughly**
   - Test all endpoints
   - Test error cases
   - Test security features

4. **Deploy**
   ```bash
   wrangler deploy --config wrangler.meauxaccess-dashboard-production.toml
   ```

5. **Verify**
   - Check deployment status
   - Test in production
   - Monitor logs

---

## 📚 **Resources**

- **Database Schema:** `database-schema.sql`
- **Auth System:** `src/auth-enhanced.ts`
- **API Endpoints:** `src/auth-api.ts`
- **Strategy:** `SAAS_PLATFORM_STRATEGY.md`
- **Setup Script:** `setup-production-saas.sh`

---

## 🆘 **Support**

- **Documentation:** See `SAAS_PLATFORM_STRATEGY.md`
- **Issues:** Check Cloudflare Dashboard logs
- **Database:** Use `wrangler d1` commands
- **Secrets:** Use `wrangler secret` commands

---

**Last Updated:** January 7, 2025  
**Status:** Production Ready

---

*This guide enables rapid, safe deployment of the production SaaS platform.*
