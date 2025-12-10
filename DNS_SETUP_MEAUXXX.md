# ?? DNS Setup for meauxxx.com - 100% Connection Guide

## ?? Goal

Configure DNS so `meauxxx.com` properly routes to Vercel, which proxies to your Cloudflare Worker.

## ? Step 1: Add Domain to Vercel

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Select your project (or create new one)

2. **Add Domain:**
   - Settings ? Domains
   - Click "Add Domain"
   - Enter: `meauxxx.com`
   - Click "Add"

3. **Vercel will show you DNS records needed:**
   - Usually a CNAME or A record
   - Copy these values

## ? Step 2: Update DNS Records

### Option A: DNS is on Cloudflare (Recommended)

If `meauxxx.com` DNS is managed in Cloudflare:

1. **Go to Cloudflare Dashboard:**
   - https://dash.cloudflare.com
   - Select `meauxxx.com` zone

2. **Add/Update DNS Records:**

   **For Root Domain (`meauxxx.com`):**
   ```
   Type: CNAME
   Name: @
   Target: cname.vercel-dns.com
   Proxy: ? ON (Orange cloud)
   TTL: Auto
   ```

   **For WWW (`www.meauxxx.com`):**
   ```
   Type: CNAME
   Name: www
   Target: cname.vercel-dns.com
   Proxy: ? ON (Orange cloud)
   TTL: Auto
   ```

   **OR if Vercel provides specific records:**
   - Use the exact records Vercel shows you
   - Usually something like: `cname.vercel-dns.com` or specific A records

### Option B: DNS is on Another Provider

If DNS is managed elsewhere (GoDaddy, Namecheap, etc.):

1. **Log into your DNS provider**
2. **Add CNAME record:**
   - Type: CNAME
   - Host: @ (or leave blank for root)
   - Value: `cname.vercel-dns.com`
   - TTL: 3600 (or default)

3. **Add WWW record:**
   - Type: CNAME
   - Host: www
   - Value: `cname.vercel-dns.com`
   - TTL: 3600

## ? Step 3: Verify DNS Propagation

After updating DNS, verify it's working:

```bash
# Check DNS records
dig meauxxx.com
nslookup meauxxx.com

# Should show Vercel's IP addresses or CNAME
```

**Or use online tools:**
- https://dnschecker.org/#A/meauxxx.com
- https://www.whatsmydns.net/#A/meauxxx.com

## ? Step 4: SSL Certificate

Vercel automatically provisions SSL certificates:
- Usually takes 1-5 minutes after DNS is configured
- Check Vercel Dashboard ? Domains ? SSL status

## ? Step 5: Test Connection

Once DNS propagates (usually 5-60 minutes):

```bash
# Test root domain
curl -I https://meauxxx.com

# Test dashboard
curl -I https://meauxxx.com/dashboard

# Test API
curl https://meauxxx.com/api/team/members
```

## ?? Troubleshooting

### DNS Not Propagating?

1. **Check DNS records are correct:**
   ```bash
   dig meauxxx.com +short
   # Should show Vercel IPs or CNAME
   ```

2. **Clear DNS cache:**
   ```bash
   # macOS
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   
   # Or use Google DNS: 8.8.8.8
   ```

3. **Wait for propagation:**
   - Can take up to 48 hours (usually 5-60 minutes)
   - Check with: https://dnschecker.org

### Vercel Shows "Invalid Configuration"?

1. **Check DNS records match exactly what Vercel shows**
2. **Ensure CNAME points to `cname.vercel-dns.com`**
3. **If using A records, use the exact IPs Vercel provides**

### SSL Certificate Issues?

1. **Wait 5-10 minutes after DNS is configured**
2. **Check Vercel Dashboard ? Domains ? SSL**
3. **If stuck, remove and re-add domain in Vercel**

## ?? Quick Checklist

- [ ] Domain added to Vercel project
- [ ] DNS records updated (CNAME or A records)
- [ ] DNS propagated (check with dnschecker.org)
- [ ] SSL certificate issued (check Vercel dashboard)
- [ ] `vercel.json` with rewrites is in project
- [ ] Test `https://meauxxx.com` works

## ?? Expected DNS Records

**For Cloudflare DNS:**
```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
Proxy: ON

Type: CNAME  
Name: www
Target: cname.vercel-dns.com
Proxy: ON
```

**For Other DNS Providers:**
```
Type: CNAME
Host: @
Value: cname.vercel-dns.com

Type: CNAME
Host: www
Value: cname.vercel-dns.com
```

## ?? After DNS is Configured

Once DNS is set up and propagated:

1. ? `meauxxx.com` ? Routes to Vercel
2. ? Vercel ? Proxies to Cloudflare Worker
3. ? Worker ? Accesses R2, D1, KV (all on Cloudflare)
4. ? Response ? Worker ? Vercel ? Browser

**100% connection achieved!** ??

## ?? Need Help?

If you need me to:
- Check your current DNS records
- Find your DNS provider
- Configure specific DNS settings

Just let me know and I can help!
