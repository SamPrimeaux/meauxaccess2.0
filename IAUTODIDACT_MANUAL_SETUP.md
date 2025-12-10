# ?? iautodidact.org Manual Setup Guide

## ?? Important: API Token Required

The automated script requires a valid Cloudflare API token. If you don't have one set, use the manual setup method below.

---

## ?? Manual Setup via Cloudflare Dashboard

### **Step 1: Get Your Cloudflare API Token**

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click: "Create Token"
3. Use: "Edit Cloudflare Workers" template
4. Set permissions:
   - **Account** ? **Workers Scripts** ? **Edit**
   - **Zone** ? **Zone** ? **Read** (for iautodidact.org)
5. Copy the token

### **Step 2: Add Custom Domain to Worker**

1. **Go to**: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/connor-mcneely
2. **Click**: "Triggers" tab
3. **Click**: "Add Custom Domain"
4. **Enter**: `iautodidact.org`
5. **Click**: "Add Custom Domain"

Cloudflare will automatically:
- ? Configure DNS records
- ? Issue SSL certificate
- ? Set up routing

### **Step 3: Add www Subdomain (Optional)**

1. **Go to**: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/routes
2. **Click**: "Add route"
3. **Configure**:
   - **Route**: `www.iautodidact.org/*`
   - **Worker**: `connor-mcneely`
   - **Click**: "Add route"

---

## ?? Alternative: Use Wrangler CLI

If you prefer command-line setup:

```bash
# Set your API token
export CLOUDFLARE_API_TOKEN="your-actual-token-here"

# Navigate to worker directory
cd "/Users/samprimeaux/Downloads/FULLY BUILT MEAUXACCESS DASHBOARD READY TO DEPLOY/infra/cloudflare/connor-mcneely-worker"

# Add custom domain (requires wrangler 3.0+)
wrangler routes add iautodidact.org/* --name connor-mcneely
wrangler routes add www.iautodidact.org/* --name connor-mcneely
```

---

## ?? DNS Configuration (If Needed)

If automatic DNS setup doesn't work, manually add:

1. **Go to**: https://dash.cloudflare.com/dns/manage/{zone-id-for-iautodidact.org}
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

## ? Verification

After setup:

1. **Wait 2-5 minutes** for DNS propagation
2. **Test URLs**:
   - https://iautodidact.org
   - https://www.iautodidact.org
   - https://iautodidact.org/about
   - https://iautodidact.org/portfolio

3. **Check SSL**: Should automatically have HTTPS enabled

---

## ?? Troubleshooting

### **If domain doesn't work:**

1. **Verify domain is in Cloudflare**:
   - Go to: https://dash.cloudflare.com
   - Check if `iautodidact.org` is listed in your zones

2. **Check Worker Status**:
   - Go to: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/connor-mcneely
   - Verify worker is deployed and active

3. **Check Routes**:
   - Go to: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/routes
   - Verify routes are configured

4. **Wait for Propagation**:
   - DNS changes: 5-10 minutes
   - SSL certificates: 1-2 minutes

---

## ?? Next Steps

1. ? Add custom domain via dashboard (easiest method)
2. ? Wait for DNS/SSL propagation
3. ? Deploy updated worker with routing
4. ? Test all routes
5. ? Update navigation links in HTML files

**Your custom domain will be live at `https://iautodidact.org`!** ??
