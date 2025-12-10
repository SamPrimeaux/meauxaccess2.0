# ?? Complete DNS Setup Guide - meauxxx.com ? 100% Connection

## ?? Goal

Configure DNS so `meauxxx.com` routes to Vercel, which proxies to your Cloudflare Worker, ensuring 100% connection while keeping all R2/D1/KV resources on Cloudflare.

## ? Step 1: Add Domain to Vercel

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Create new project OR use existing one

2. **Add Domain:**
   - Project Settings ? Domains ? Add Domain
   - Enter: `meauxxx.com`
   - Click "Add"

3. **Vercel will show DNS records:**
   - Usually: `cname.vercel-dns.com`
   - **Copy the EXACT value shown** (may be project-specific)

## ? Step 2: Determine DNS Provider

**Check where DNS is managed:**

```bash
# Check nameservers
dig NS meauxxx.com +short

# If shows cloudflare.com ? DNS is on Cloudflare
# If shows other provider ? DNS is elsewhere
```

## ? Step 3: Update DNS Records

### Option A: DNS on Cloudflare (Recommended)

**Direct Link (if zone exists):**
- https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2
- Find `meauxxx.com` zone ? DNS ? Records

**Steps:**
1. **Delete existing A records** (if any):
   - Find A records for `@` pointing to `216.150.16.129` or `216.150.1.193`
   - Delete them

2. **Add CNAME for root:**
   ```
   Type: CNAME
   Name: @
   Target: cname.vercel-dns.com
   Proxy: ? Proxied (Orange cloud ON)
   TTL: Auto
   ```

3. **Add CNAME for www:**
   ```
   Type: CNAME
   Name: www
   Target: cname.vercel-dns.com
   Proxy: ? Proxied (Orange cloud ON)
   TTL: Auto
   ```

**?? Important:** Use the EXACT target Vercel shows you!

### Option B: DNS NOT on Cloudflare

**If zone doesn't exist in Cloudflare:**

1. **Add zone to Cloudflare:**
   - https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2
   - Add a Site ? Enter `meauxxx.com`
   - Follow setup wizard

2. **Update nameservers at registrar:**
   - Cloudflare will show nameservers (e.g., `jessica.ns.cloudflare.com`)
   - Go to your domain registrar
   - Update nameservers to Cloudflare's
   - Wait 24-48 hours for propagation

3. **Once nameservers active:**
   - Follow Option A above

### Option C: DNS on Another Provider

**If DNS is on GoDaddy, Namecheap, etc.:**

1. **Log into your DNS provider**
2. **Delete existing A records** for root
3. **Add CNAME:**
   - Host: `@` (or leave blank)
   - Value: `cname.vercel-dns.com`
   - TTL: 3600

4. **Add CNAME for www:**
   - Host: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: 3600

## ? Step 4: Verify DNS Propagation

**Wait 5-60 minutes, then check:**

```bash
# Check CNAME
dig meauxxx.com CNAME +short
# Should show: cname.vercel-dns.com

# Check resolution
dig meauxxx.com +short
# Should show Vercel IPs

# Full DNS info
dig meauxxx.com ANY
```

**Online tools:**
- https://dnschecker.org/#CNAME/meauxxx.com
- https://www.whatsmydns.net/#CNAME/meauxxx.com

**Expected:** All locations should show `cname.vercel-dns.com`

## ? Step 5: Verify in Vercel

1. **Go to Vercel Dashboard:**
   - Settings ? Domains
   - Check `meauxxx.com` status

2. **Should show:**
   - ? "Valid Configuration"
   - ? SSL certificate issued (auto, takes 1-5 minutes)

## ? Step 6: Test Connection

```bash
# Test root domain
curl -I https://meauxxx.com
# Expected: HTTP/2 200

# Test dashboard
curl -I https://meauxxx.com/dashboard
# Expected: HTTP/2 200

# Test API
curl https://meauxxx.com/api/team/members
# Expected: JSON array of team members

# Test MCP endpoint
curl -X POST https://meauxxx.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
# Expected: JSON with tools list
```

## ?? Troubleshooting

### DNS Not Propagating?

1. **Check records are correct:**
   ```bash
   dig meauxxx.com CNAME +short
   # Should show: cname.vercel-dns.com
   ```

2. **Clear DNS cache:**
   ```bash
   # macOS
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```

3. **Wait longer:**
   - Can take up to 48 hours (usually 5-60 minutes)
   - Check globally: https://dnschecker.org

### Vercel Shows "Invalid Configuration"?

1. **Check DNS matches exactly what Vercel shows**
2. **Ensure CNAME is correct**
3. **If using Cloudflare, ensure Proxy is ON (orange cloud)**

### SSL Certificate Not Issuing?

1. **Wait 5-10 minutes after DNS is configured**
2. **Check Vercel Dashboard ? Domains ? SSL status**
3. **If stuck, remove and re-add domain in Vercel**

### Connection Timeout?

1. **Check `vercel.json` is deployed with rewrites**
2. **Verify Cloudflare Worker is running:**
   ```bash
   curl https://meauxmcp.meauxbility.workers.dev/health
   # Should return: {"status":"ok"}
   ```

## ?? Final Checklist

- [ ] Domain added to Vercel project
- [ ] DNS records updated (CNAME to Vercel)
- [ ] DNS propagated (check dnschecker.org globally)
- [ ] Vercel shows "Valid Configuration"
- [ ] SSL certificate issued (check Vercel dashboard)
- [ ] `vercel.json` deployed with rewrites
- [ ] Test `https://meauxxx.com` returns 200
- [ ] Test `https://meauxxx.com/api/team/members` works
- [ ] Test `https://meauxxx.com/mcp` works

## ?? Expected Result

**100% Connection Flow:**

```
User Browser
    ?
meauxxx.com (DNS: Cloudflare/Vercel)
    ?
Vercel Proxy (vercel.json rewrites)
    ?
meauxmcp.workers.dev (Cloudflare Worker)
    ?
??????????????????????????????????
? R2       ? D1       ? KV       ?
?(Cloudflare) (Cloudflare) (Cloudflare)?
??????????????????????????????????
```

**All resources stay on Cloudflare!** ?

## ?? Quick Start Commands

**If you want me to check/update DNS automatically:**

```bash
# Check current DNS
dig meauxxx.com +short
dig NS meauxxx.com +short

# Check if zone exists in Cloudflare
# (I can help with API calls if you have token with DNS permissions)
```

## ?? Next Steps

1. **Tell me where DNS is managed** (Cloudflare, GoDaddy, etc.)
2. **I can provide exact steps** for your provider
3. **Or use the automated script** if on Cloudflare with API access

**Ready to get 100% connection!** ??
