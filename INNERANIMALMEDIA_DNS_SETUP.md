# 🌐 Inner Animal Media DNS & Domain Setup Guide

## 📋 Current DNS Status

Your domain `inneranimalmedia.com` is currently configured with:

| Type | Name | Content | Proxy | Status |
|------|------|---------|-------|--------|
| A | inneranimalmedia.com | 192.0.2.1 | ✅ Proxied | ⚠️ Placeholder IP |
| CNAME | www | inneranimalmedia.com | ✅ Proxied | ✅ OK |
| MX | send | feedback-smtp.us-east-1.amazonses.com | ❌ DNS only | ✅ OK |
| TXT | _dmarc | DMARC record | ❌ DNS only | ✅ OK |
| TXT | resend._domainkey | Domain key | ❌ DNS only | ✅ OK |
| TXT | send | SPF record | ❌ DNS only | ✅ OK |

**⚠️ Issue**: The A record points to `192.0.2.1`, which is a placeholder/test IP address (RFC 3330). This needs to be fixed.

---

## 🚀 Quick Setup (Automated)

### **Step 1: Run the Setup Script**

```bash
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker
export CLOUDFLARE_API_TOKEN="your-api-token"
./setup-inneranimalmedia-domain.sh
```

This script will:
- ✅ Add `inneranimalmedia.com` as a custom domain to the worker
- ✅ Add `www.inneranimalmedia.com` as a custom domain
- ✅ Configure automatic routing
- ✅ Set up SSL certificates

---

## 🔧 Manual Setup (Alternative)

### **Option 1: Via Cloudflare Dashboard (Recommended)**

1. **Go to Workers Dashboard**:
   - https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/meauxaccess-dashboard-production

2. **Add Custom Domain**:
   - Click "Triggers" tab
   - Click "Add Custom Domain"
   - Enter: `inneranimalmedia.com`
   - Click "Add Custom Domain"

3. **Add www Subdomain**:
   - Click "Add Custom Domain" again
   - Enter: `www.inneranimalmedia.com`
   - Click "Add Custom Domain"

Cloudflare will automatically:
- ✅ Configure DNS records
- ✅ Issue SSL certificate
- ✅ Set up routing

### **Option 2: Update DNS Manually**

Since you're using Cloudflare Workers custom domains, you have two options:

#### **Option A: Remove A Record (Recommended)**
1. Go to: https://dash.cloudflare.com/dns
2. Delete the A record for `inneranimalmedia.com` (192.0.2.1)
3. Cloudflare Workers will handle routing automatically

#### **Option B: Update A Record**
If you want to keep an A record, you can:
- Change it to Cloudflare's proxy IP: `192.0.2.1` → `104.16.0.1` (example)
- Or use Cloudflare's anycast IPs
- **Note**: With Workers custom domains, the A record isn't strictly necessary

---

## 📍 DNS Configuration Details

### **Current Setup**
- **Nameservers**: ✅ Cloudflare (jessica.ns.cloudflare.com, mike.ns.cloudflare.com)
- **Zone Status**: ✅ Active
- **Proxy Status**: ✅ Enabled (Orange cloud)

### **Email Configuration**
Your email DNS records are correctly configured:
- ✅ **MX Record**: Points to Amazon SES
- ✅ **SPF Record**: Includes Amazon SES
- ✅ **DMARC Record**: Configured
- ✅ **Domain Key**: Resend domain key configured

**Keep these records as-is** - they're working correctly.

---

## 🎯 Worker Routes

Once configured, these routes will be available:

| Route | Description | Serves |
|-------|-------------|--------|
| `/` | Home Page | Inner Animal Media homepage |
| `/pricing` | Pricing Page | Plans & pricing with dark glassmorphic header |
| `/iaccess` | Dashboard | Inner Animal Media dashboard |
| `/api/*` | API Endpoints | Various API routes |
| `/assets/*` | Static Assets | Files from R2_ASSETS bucket |

---

## ✅ Verification Steps

After setup, verify:

1. **Wait 5-10 minutes** for DNS/SSL propagation

2. **Test URLs**:
   ```bash
   # Home page
   curl -I https://inneranimalmedia.com
   curl -I https://www.inneranimalmedia.com
   
   # Pricing page
   curl -I https://inneranimalmedia.com/pricing
   
   # Dashboard
   curl -I https://inneranimalmedia.com/iaccess
   ```

3. **Check SSL**:
   - Should automatically have HTTPS enabled
   - Certificate issued by Cloudflare
   - TLS 1.3 support

4. **Test in Browser**:
   - 🌐 https://inneranimalmedia.com
   - 🌐 https://www.inneranimalmedia.com
   - 🌐 https://inneranimalmedia.com/pricing

---

## 🔍 Troubleshooting

### **If domain returns 404:**

1. **Check Custom Domain Status**:
   ```bash
   curl -X GET "https://api.cloudflare.com/client/v4/accounts/ede6590ac0d2fb7daf155b35653457b2/workers/services/meauxaccess-dashboard-production/environments/production/hostnames" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

2. **Verify Worker Deployment**:
   ```bash
   wrangler deployments list --config wrangler.meauxaccess-dashboard-production.toml
   ```

3. **Check DNS**:
   - Ensure domain is active in Cloudflare
   - Verify proxy is enabled (orange cloud)
   - Check that nameservers are correct

### **If SSL certificate issues:**

- Cloudflare automatically issues certificates
- Wait 5-10 minutes after adding custom domain
- Check SSL/TLS settings in Cloudflare Dashboard

### **If A record causes issues:**

- **Remove the A record** - Workers custom domains don't need it
- Or update it to a valid Cloudflare IP
- The CNAME for www is fine as-is

---

## 📊 DNS Record Summary

### **Records to Keep:**
- ✅ CNAME: `www` → `inneranimalmedia.com` (Proxied)
- ✅ MX: `send` → `feedback-smtp.us-east-1.amazonses.com` (DNS only)
- ✅ TXT: `_dmarc` (DNS only)
- ✅ TXT: `resend._domainkey` (DNS only)
- ✅ TXT: `send` (SPF, DNS only)

### **Records to Update/Remove:**
- ⚠️ A: `inneranimalmedia.com` → `192.0.2.1` (Remove or update)

---

## 🎨 Features Available

Once configured, you'll have:

- ✅ **Dark Glassmorphic Header** - Sitewide header on all pages
- ✅ **Home Page** - Modern landing page
- ✅ **Pricing Page** - Fortune 500 UI/UX styled pricing
- ✅ **Dashboard** - Full-featured Inner Animal Media dashboard
- ✅ **R2 Asset Serving** - Static assets from R2 bucket
- ✅ **API Endpoints** - Theme, stats, and R2 scanning APIs

---

## 🔐 Security Notes

- ✅ SSL/TLS automatically enabled
- ✅ DDoS protection via Cloudflare
- ✅ Email security (SPF, DMARC) configured
- ✅ Workers run on Cloudflare's edge network

---

## 📞 Support

If you encounter issues:
1. Check Cloudflare Dashboard for errors
2. Verify worker is deployed
3. Check DNS propagation status
4. Review worker logs in Cloudflare Dashboard

---

**Last Updated**: $(date)
**Worker**: meauxaccess-dashboard-production
**Account ID**: ede6590ac0d2fb7daf155b35653457b2
