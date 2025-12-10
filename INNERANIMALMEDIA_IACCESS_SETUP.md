# 🌐 inneranimalmedia.com → iAccess Platform Setup

## 🎯 Goal
Configure `inneranimalmedia.com` to serve the complete iAccess SaaS platform (13 pages) using Cloudflare Workers routing.

---

## 📋 Current Status

**Zone ID**: `0bab48636c1bea4be4ea61c0c7787c3e`  
**Account ID**: `ede6590ac0d2fb7daf155b35653457b2`  
**Worker**: `iacess`  
**Domain**: `inneranimalmedia.com`

---

## 🚀 Setup Methods

### Method 1: Via Cloudflare Dashboard (Recommended)

1. **Go to Workers Dashboard**:
   - https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/iacess

2. **Add Custom Domain**:
   - Click **"Triggers"** tab
   - Click **"Add Custom Domain"**
   - Enter: `inneranimalmedia.com`
   - Check **"Override existing DNS records"** if prompted
   - Click **"Add Custom Domain"**

3. **Add www Subdomain**:
   - Click **"Add Custom Domain"** again
   - Enter: `www.inneranimalmedia.com`
   - Check **"Override existing DNS records"** if prompted
   - Click **"Add Custom Domain"**

**Cloudflare will automatically:**
- ✅ Configure DNS records
- ✅ Issue SSL certificate
- ✅ Set up routing
- ✅ Handle all paths

---

### Method 2: Via Routes (Alternative)

If custom domain doesn't work due to existing DNS records:

1. **Go to Workers Routes**:
   - https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/routes

2. **Add Route for Root Domain**:
   - Click **"Add route"**
   - **Route**: `inneranimalmedia.com/*`
   - **Worker**: `iacess`
   - Click **"Add route"**

3. **Add Route for www**:
   - Click **"Add route"** again
   - **Route**: `www.inneranimalmedia.com/*`
   - **Worker**: `iacess`
   - Click **"Add route"**

---

### Method 3: Update DNS Records Manually

If you prefer manual DNS control:

1. **Go to DNS Settings**:
   - https://dash.cloudflare.com/0bab48636c1bea4be4ea61c0c7787c3e/dns

2. **Update/Delete A Record**:
   - Find the A record for `inneranimalmedia.com` (currently 192.0.2.1)
   - Either delete it OR update it to use Workers routing

3. **Add CNAME (if needed)**:
   - Type: `CNAME`
   - Name: `@` (or blank for root)
   - Target: `iacess.meauxbility.workers.dev`
   - Proxy: ✅ **ON** (Orange cloud)
   - TTL: Auto

4. **Add www CNAME**:
   - Type: `CNAME`
   - Name: `www`
   - Target: `iacess.meauxbility.workers.dev`
   - Proxy: ✅ **ON** (Orange cloud)
   - TTL: Auto

---

## ✅ After Setup

Once configured, all iAccess pages will be available at:

### Main Pages
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

---

## 🔧 Pro Zone Features Enabled

With your Pro zone, you get:
- ✅ **Custom Domains** - Full domain support
- ✅ **Workers Analytics** - Per-worker metrics
- ✅ **Rate Limiting** - Via AI Gateway
- ✅ **WAF Rules** - Security policies
- ✅ **Access Policies** - Zero Trust
- ✅ **Page Rules** - URL-based rules
- ✅ **Cache Rules** - Edge caching
- ✅ **Transform Rules** - Request/response modification
- ✅ **Workers Analytics Engine** - Custom event tracking

---

## 📊 API Endpoints

All API endpoints will work on the custom domain:
- https://inneranimalmedia.com/api/stats (via API worker)
- https://inneranimalmedia.com/api/workers
- https://inneranimalmedia.com/api/databases
- etc.

**Note**: You may want to configure API worker with custom domain too, or use subdomain like `api.inneranimalmedia.com`

---

## ⚙️ Wrangler Configuration (Optional)

You can also add routes in `wrangler.toml`:

```toml
[[routes]]
pattern = "inneranimalmedia.com/*"
zone_id = "0bab48636c1bea4be4ea61c0c7787c3e"

[[routes]]
pattern = "www.inneranimalmedia.com/*"
zone_id = "0bab48636c1bea4be4ea61c0c7787c3e"
```

Then deploy:
```bash
cd iacess
wrangler deploy
```

---

## 🧪 Verification

After setup, test with:

```bash
# Test root domain
curl -I https://inneranimalmedia.com/

# Test www
curl -I https://www.inneranimalmedia.com/

# Test a page
curl -I https://inneranimalmedia.com/workers

# Check SSL
curl -v https://inneranimalmedia.com/ 2>&1 | grep -i ssl
```

---

## ⏳ Timeline

- **DNS Propagation**: 1-5 minutes (usually instant on Cloudflare)
- **SSL Certificate**: 1-5 minutes (automatic)
- **Full Setup**: ~5 minutes total

---

## 🐛 Troubleshooting

### Issue: "Hostname already has DNS records"
**Solution**: Use "Override existing DNS records" option in dashboard, or delete conflicting A/CNAME records first.

### Issue: Custom domain not working
**Solution**: 
1. Check DNS records are proxied (orange cloud)
2. Verify worker is deployed
3. Wait 5 minutes for propagation
4. Try routes method instead

### Issue: SSL not working
**Solution**: Wait 5-10 minutes for certificate issuance. Cloudflare handles this automatically.

---

## 📝 Notes

- All 13 pages will work on the custom domain
- API endpoints can be accessed via the domain
- Pro zone features fully enabled
- SSL/TLS automatic via Cloudflare
- No manual certificate management needed

---

**Ready to configure? Use Method 1 (Dashboard) for easiest setup!**
