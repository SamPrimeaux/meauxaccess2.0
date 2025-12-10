# ✅ inneranimalmedia.com → iAccess Platform Setup Guide

## 🎯 Goal
Configure `inneranimalmedia.com` to serve the complete iAccess SaaS platform (13 pages) using Cloudflare Workers.

---

## 📋 Configuration Details

**Zone ID**: `0bab48636c1bea4be4ea61c0c7787c3e`  
**Account ID**: `ede6590ac0d2fb7daf155b35653457b2`  
**Worker**: `iacess`  
**Domain**: `inneranimalmedia.com`  
**API Token**: Verified ✅

---

## 🚀 Setup Method: Cloudflare Dashboard (Recommended)

The easiest and most reliable way is via the Cloudflare Dashboard:

### Step 1: Go to Workers Dashboard
**Direct Link**:  
https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/iacess

### Step 2: Add Custom Domain
1. Click the **"Triggers"** tab
2. Scroll to **"Custom Domains"** section
3. Click **"Add Custom Domain"** button
4. Enter: `inneranimalmedia.com`
5. ✅ **Check "Override existing DNS records"** (important!)
6. Click **"Add Custom Domain"**

### Step 3: Add www Subdomain
1. Click **"Add Custom Domain"** again
2. Enter: `www.inneranimalmedia.com`
3. ✅ **Check "Override existing DNS records"**
4. Click **"Add Custom Domain"**

**Cloudflare will automatically:**
- ✅ Configure DNS records
- ✅ Issue SSL certificate (1-5 minutes)
- ✅ Set up routing for all paths
- ✅ Enable Pro zone features

---

## 🌐 After Setup - All Pages Available

Once configured, your complete iAccess platform will be live at:

### Core Pages
- https://inneranimalmedia.com/ (Dashboard)
- https://inneranimalmedia.com/analytics
- https://inneranimalmedia.com/ai-gateway
- https://inneranimalmedia.com/browser-rendering

### Services Pages
- https://inneranimalmedia.com/workers
- https://inneranimalmedia.com/databases
- https://inneranimalmedia.com/storage
- https://inneranimalmedia.com/kv
- https://inneranimalmedia.com/vectorize
- https://inneranimalmedia.com/workflows
- https://inneranimalmedia.com/queues
- https://inneranimalmedia.com/email

### Admin Pages
- https://inneranimalmedia.com/integrations
- https://inneranimalmedia.com/settings

**All pages work on both:**
- `inneranimalmedia.com`
- `www.inneranimalmedia.com`

---

## 🔧 Alternative: Via Routes API

If you prefer API-based setup, you can use routes:

```bash
# Add route for root domain
curl -X POST "https://api.cloudflare.com/client/v4/zones/0bab48636c1bea4be4ea61c0c7787c3e/workers/routes" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"pattern":"inneranimalmedia.com/*","script":"iacess"}'

# Add route for www
curl -X POST "https://api.cloudflare.com/client/v4/zones/0bab48636c1bea4be4ea61c0c7787c3e/workers/routes" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"pattern":"www.inneranimalmedia.com/*","script":"iacess"}'
```

---

## ✅ Pro Zone Features Enabled

With your Pro zone, you get full access to:

### Workers Features
- ✅ Custom domains
- ✅ Workers Analytics
- ✅ Per-worker metrics
- ✅ Log streaming
- ✅ Real-time monitoring

### Security Features
- ✅ WAF (Web Application Firewall)
- ✅ Rate limiting
- ✅ Access policies (Zero Trust)
- ✅ Page Rules
- ✅ Transform Rules

### Performance Features
- ✅ Cache Rules
- ✅ Edge caching
- ✅ Image optimization
- ✅ Workers Analytics Engine

### Advanced Features
- ✅ Workers KV
- ✅ D1 Databases
- ✅ R2 Storage
- ✅ AI Gateway
- ✅ Browser Rendering
- ✅ Vectorize
- ✅ Workflows
- ✅ Queues
- ✅ Email Routing

---

## 📊 Current Platform Status

### Infrastructure
- **69 Workers** - All manageable via dashboard
- **14 D1 Databases** - Query interface ready
- **R2 Buckets** - Storage management
- **KV Namespaces** - Key-value operations
- **API Endpoints** - All connected

### Pages Deployed
- ✅ 13 pages live on `iacess.meauxbility.workers.dev`
- ✅ All pages styled and functional
- ✅ API integration working
- ✅ Real Cloudflare data connected

---

## 🧪 Verification Commands

After setup, test with:

```bash
# Test root domain
curl -I https://inneranimalmedia.com/

# Test www
curl -I https://www.inneranimalmedia.com/

# Test a specific page
curl -I https://inneranimalmedia.com/workers

# Check SSL
curl -v https://inneranimalmedia.com/ 2>&1 | grep -i "SSL\|TLS"
```

---

## ⏳ Timeline

- **DNS Propagation**: 1-5 minutes (usually instant on Cloudflare)
- **SSL Certificate**: 1-5 minutes (automatic)
- **Full Setup**: ~5 minutes total

---

## 🐛 Troubleshooting

### Issue: "Hostname already has DNS records"
**Solution**: Use "Override existing DNS records" checkbox in dashboard

### Issue: Custom domain not working
**Solution**: 
1. Verify worker is deployed: `wrangler deploy` in `iacess/` directory
2. Check DNS records are proxied (orange cloud)
3. Wait 5 minutes for propagation
4. Try routes method instead

### Issue: SSL not working
**Solution**: Wait 5-10 minutes. Cloudflare issues certificates automatically.

---

## 📝 Notes

- All 13 pages will work on the custom domain
- API endpoints accessible via domain
- Pro zone features fully enabled
- SSL/TLS automatic via Cloudflare
- No manual certificate management needed
- All pages share the same design system
- Navigation works seamlessly between pages

---

## 🎯 Next Steps After Domain Setup

1. **Test all pages** on the custom domain
2. **Update API_BASE** in shared-components.js if needed
3. **Configure subdomain** for API (optional): `api.inneranimalmedia.com`
4. **Set up monitoring** for the custom domain
5. **Configure caching** rules for optimal performance

---

**Ready to configure? Use the Dashboard method above - it's the most reliable!** 🚀
