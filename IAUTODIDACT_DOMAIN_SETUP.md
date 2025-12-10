# ?? iautodidact.org Custom Domain Setup

## ? Configuration Guide

This guide will help you set up `iautodidact.org` as a custom domain for the `connor-mcneely` worker.

---

## ?? Quick Setup (Automated)

### **Step 1: Run the Setup Script**

```bash
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker
export CLOUDFLARE_API_TOKEN="your-api-token"
./setup-iautodidact-domain.sh
```

The script will:
- ? Fetch Zone ID for `iautodidact.org`
- ? Add custom domain to worker
- ? Configure routes for root and www subdomain
- ? Set up DNS automatically

---

## ?? Manual Setup (Alternative)

### **Step 1: Add Custom Domain via Cloudflare Dashboard**

1. **Go to**: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/connor-mcneely
2. **Click**: "Triggers" tab
3. **Click**: "Add Custom Domain"
4. **Enter**: `iautodidact.org`
5. **Click**: "Add Custom Domain"

Cloudflare will automatically:
- ? Configure DNS records
- ? Issue SSL certificate
- ? Set up routing

### **Step 2: Add www Subdomain (Optional)**

1. **Go to**: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/routes
2. **Click**: "Add route"
3. **Configure**:
   - **Route**: `www.iautodidact.org/*`
   - **Worker**: `connor-mcneely`
   - **Click**: "Add route"

---

## ?? DNS Configuration

### **Automatic DNS (Recommended)**

When you add a custom domain via the Cloudflare Dashboard, DNS is configured automatically. No manual records needed!

### **Manual DNS (If Needed)**

If you need to configure DNS manually:

1. **Go to**: https://dash.cloudflare.com/dns/manage/{zone-id}
2. **Add CNAME Record**:
   - **Type**: `CNAME`
   - **Name**: `@` (or leave blank for root)
   - **Target**: `connor-mcneely.meauxbility.workers.dev`
   - **Proxy**: ? **ON** (Orange cloud)
   - **TTL**: Auto

3. **Add www CNAME**:
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Target**: `connor-mcneely.meauxbility.workers.dev`
   - **Proxy**: ? **ON** (Orange cloud)
   - **TTL**: Auto

---

## ??? Route Configuration

The worker now supports these routes:

- `/` ? Home (serves `connor-mcneely-portfolio.html#home`)
- `/about` ? About page
- `/coaching` ? Coaching page
- `/portfolio` ? Portfolio page
- `/community` ? Community page
- `/dashboard` ? Dashboard page
- `/contact` ? Contact page

### **How Routes Work**

1. **Root (`/`)**: Serves `connor-mcneely-portfolio.html` with `#home` hash
2. **Other Routes**: Serves corresponding HTML files from R2 bucket
3. **Fallback**: If file not found, returns 404 with available pages list

---

## ? Verification

After setup, verify:

1. **Wait 2-5 minutes** for DNS propagation
2. **Test URLs**:
   - ? https://iautodidact.org
   - ? https://www.iautodidact.org
   - ? https://iautodidact.org/about
   - ? https://iautodidact.org/portfolio
   - ? https://iautodidact.org/coaching
   - ? https://iautodidact.org/community
   - ? https://iautodidact.org/dashboard
   - ? https://iautodidact.org/contact

3. **Check SSL**: Should automatically have HTTPS enabled

---

## ?? SSL/TLS

Cloudflare automatically provides:
- ? Free SSL certificates
- ? Automatic HTTPS
- ? TLS 1.3 support
- ? HTTP/2 and HTTP/3

No configuration needed!

---

## ?? Current Status

- **Worker**: `connor-mcneely`
- **Worker URL**: `https://connor-mcneely.meauxbility.workers.dev`
- **Custom Domain**: `iautodidact.org` (to be configured)
- **R2 Bucket**: `connor-mcneely`
- **Routes**: `/`, `/about`, `/coaching`, `/portfolio`, `/community`, `/dashboard`, `/contact`

---

## ?? Troubleshooting

### **If domain doesn't work:**

1. **Check Route Status**:
   ```bash
   curl -X GET "https://api.cloudflare.com/client/v4/zones/{zone-id}/workers/routes" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

2. **Verify Worker Deployment**:
   ```bash
   wrangler deployments list --name connor-mcneely
   ```

3. **Check DNS**:
   - Go to: https://dash.cloudflare.com/dns
   - Ensure domain is active and proxied

4. **Wait for Propagation**:
   - DNS changes: 5-10 minutes
   - SSL certificates: 1-2 minutes

---

## ?? Next Steps

1. ? Run setup script or configure manually
2. ? Wait for DNS/SSL propagation
3. ? Test all routes
4. ? Update navigation links in HTML files if needed

**Your custom domain will be live at `https://iautodidact.org`!** ??
