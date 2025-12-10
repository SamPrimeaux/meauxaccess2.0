# ?? Cloudflare DNS Setup for meauxxx.com

## ?? If meauxxx.com DNS is on Cloudflare

### Step 1: Find Your Zone

1. **Go to Cloudflare Dashboard:**
   - https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2
   - Look for `meauxxx.com` in your zones

2. **If zone exists:**
   - Click on `meauxxx.com`
   - Go to DNS ? Records

3. **If zone doesn't exist:**
   - Add a Site ? Enter `meauxxx.com`
   - Follow Cloudflare's setup wizard

### Step 2: Add/Update DNS Records

**Current Records (if any):**
- Check existing A, CNAME, or AAAA records
- You may need to update or add new ones

**Add These Records:**

1. **Root Domain (meauxxx.com):**
   ```
   Type: CNAME
   Name: @
   Target: cname.vercel-dns.com
   Proxy status: ? Proxied (Orange cloud)
   TTL: Auto
   ```

2. **WWW Subdomain:**
   ```
   Type: CNAME
   Name: www
   Target: cname.vercel-dns.com
   Proxy status: ? Proxied (Orange cloud)
   TTL: Auto
   ```

### Step 3: Verify in Vercel

1. Go to Vercel Dashboard
2. Settings ? Domains
3. Add `meauxxx.com`
4. Vercel will verify DNS automatically
5. Wait for SSL certificate (1-5 minutes)

## ?? Check Current DNS

Run this to see current DNS:

```bash
# Check A records
dig meauxxx.com +short

# Check CNAME
dig meauxxx.com CNAME +short

# Full DNS info
dig meauxxx.com ANY
```

## ?? Important Notes

1. **If domain uses Cloudflare Proxy (orange cloud):**
   - CNAME records work fine
   - Cloudflare will proxy to Vercel

2. **If domain is DNS-only (grey cloud):**
   - CNAME still works
   - But you lose Cloudflare proxy benefits
   - Still routes correctly to Vercel

3. **Vercel SSL:**
   - Vercel automatically provisions SSL
   - Works with Cloudflare proxy enabled

## ?? Expected Result

After DNS is configured:

```
meauxxx.com (DNS: Cloudflare)
    ?
Vercel (Proxy)
    ?
meauxmcp.workers.dev (Cloudflare Worker)
    ?
R2/D1/KV (All Cloudflare)
```

**All resources stay on Cloudflare!**

## ?? Quick Command to Check

```bash
# Check if DNS is pointing to Vercel
dig meauxxx.com +short
# Should show Vercel IPs or CNAME chain

# Check SSL
curl -I https://meauxxx.com
# Should return 200 OK with SSL
```
