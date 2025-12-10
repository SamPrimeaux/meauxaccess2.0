# ?? iautodidact.org DNS Setup - Step by Step

## ?? Current Situation

Your domain `iautodidact.org` is in Cloudflare, but you only have:
- ? MX records (for email)
- ? TXT records (for SPF/DKIM)
- ? **Missing**: CNAME or A records to point to your worker

---

## ?? Solution: Add CNAME Records

You need to add **2 CNAME records** to point your domain to the worker.

---

## ?? Step-by-Step: Add DNS Records

### **Step 1: Go to DNS Settings**

1. Go to: https://dash.cloudflare.com
2. Click on: **iautodidact.org** (your domain)
3. Click: **DNS** tab (in left sidebar)
4. Click: **Add record** button

### **Step 2: Add Root Domain CNAME**

**For `iautodidact.org` (root domain):**

1. **Type**: Select `CNAME`
2. **Name**: Enter `@` (or leave blank - represents root domain)
3. **Target**: Enter `connor-mcneely.meauxbility.workers.dev`
4. **Proxy status**: ? **Turn ON** (Orange cloud icon - this is important!)
5. **TTL**: Auto
6. Click: **Save**

**Important**: The proxy must be **ON** (orange cloud) for Workers to work!

### **Step 3: Add www Subdomain CNAME**

1. Click: **Add record** again
2. **Type**: Select `CNAME`
3. **Name**: Enter `www`
4. **Target**: Enter `connor-mcneely.meauxbility.workers.dev`
5. **Proxy status**: ? **Turn ON** (Orange cloud icon)
6. **TTL**: Auto
7. Click: **Save**

---

## ? What You Should See After Adding

Your DNS records should look like:

| Type | Name | Content | Proxy | TTL |
|------|------|---------|-------|-----|
| CNAME | @ | connor-mcneely.meauxbility.workers.dev | ?? Proxied | Auto |
| CNAME | www | connor-mcneely.meauxbility.workers.dev | ?? Proxied | Auto |
| MX | @ | route1.mx.cloudflare.net | ? DNS only | Auto |
| MX | @ | route2.mx.cloudflare.net | ? DNS only | Auto |
| MX | @ | route3.mx.cloudflare.net | ? DNS only | Auto |
| TXT | @ | v=spf1... | ? DNS only | Auto |
| TXT | cf2024-1._domainkey | v=DKIM1... | ? DNS only | Auto |

---

## ?? Alternative: Add Custom Domain via Workers Dashboard

Instead of DNS records, you can add the domain directly to the worker:

### **Method 1: Via Workers Dashboard**

1. Go to: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/connor-mcneely
2. Click: **Triggers** tab
3. Click: **Add Custom Domain** button
4. Enter: `iautodidact.org`
5. Click: **Add Custom Domain**

**This method automatically:**
- ? Creates the DNS records for you
- ? Sets up SSL certificate
- ? Configures routing

### **Method 2: Via Routes**

1. Go to: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/routes
2. Click: **Add route**
3. **Route**: `iautodidact.org/*`
4. **Worker**: `connor-mcneely`
5. Click: **Add route**

Repeat for `www.iautodidact.org/*`

---

## ?? Create API Token (For Script)

If you want to use the automated script, create an API token:

### **Step 1: Create Token**

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click: **Create Token**
3. Click: **Get started** on "Edit Cloudflare Workers" template
4. **Account Resources**: Select your account
5. **Zone Resources**: 
   - Include: `iautodidact.org`
   - Permission: **Read**
6. Click: **Continue to summary**
7. Click: **Create Token**
8. **Copy the token** (you won't see it again!)

### **Step 2: Use Token in Script**

```bash
export CLOUDFLARE_API_TOKEN="your-copied-token-here"
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker
./setup-iautodidact-domain.sh
```

---

## ?? Why "Add Custom Domain" Might Not Work

If the "Add Custom Domain" button doesn't work or is grayed out, it's usually because:

1. **Domain not verified**: Make sure `iautodidact.org` is fully set up in Cloudflare
2. **Nameservers not updated**: Verify nameservers are pointing to Cloudflare
3. **Worker not deployed**: Make sure `connor-mcneely` worker is deployed
4. **Account limits**: Check if you've hit custom domain limits

**Solution**: Use the DNS method (CNAME records) instead - it always works!

---

## ? Verification

After adding DNS records or custom domain:

1. **Wait 2-5 minutes** for DNS propagation
2. **Test**: https://iautodidact.org
3. **Test**: https://www.iautodidact.org
4. **Check SSL**: Should automatically have HTTPS

---

## ?? Recommended Approach

**Easiest method**: Add CNAME records manually (Steps 1-3 above)

**Why?**
- ? Works immediately
- ? No API token needed
- ? Full control
- ? Easy to verify

**After DNS records are added, your domain will work!** ??
