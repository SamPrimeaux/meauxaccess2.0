# ?? Resend DNS Records Setup - Complete Guide

## ?? DNS Records to Add

You need to add these DNS records for Resend email verification on `meauxbility.org`:

### 1. DKIM Record (Required)

**Type:** `TXT`  
**Name:** `resend._domainkey`  
**Content:** `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5vo+oI0NR4jUVT3rqXkWiLlq/xdwN40Ki9c8CCrjYUlTrgTerCc/f7vttfnAVz+HK9amSmkgQB0q7PAryi1+PaIAmyxD8ldSayQyubG9Aei3rYYUqyFiqhDPZwJamtZrBk7YuW2nfrmBEM3gI/zl8G0VPEs+zO9NL+fWeClEAswIDAQAB`  
**TTL:** Auto (or 3600)

### 2. SPF Record (Required)

**Type:** `TXT`  
**Name:** `send`  
**Content:** `v=spf1 include:amazonses.com ~all`  
**TTL:** Auto (or 3600)

### 3. MX Record for Sending (Required)

**Type:** `MX`  
**Name:** `send`  
**Content:** `feedback-smtp.us-east-1.amazonses.com`  
**Priority:** `10`  
**TTL:** Auto (or 3600)

### 4. MX Record for Receiving (Optional)

**Type:** `MX`  
**Name:** `@` (or leave blank for root domain)  
**Content:** `inbound-smtp.us-east-1.amazonaws.com`  
**Priority:** `10`  
**TTL:** Auto (or 3600)

### 5. DMARC Record (Optional but Recommended)

**Type:** `TXT`  
**Name:** `_dmarc`  
**Content:** `v=DMARC1; p=none;`  
**TTL:** Auto (or 3600)

---

## ?? How to Add Records

### Option A: If DNS is on Cloudflare (Most Likely)

**Direct Link:**  
https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/dns/manage/2f420b6c582e4ba8d7b1f6ebaf91438b

**Or navigate:**
1. Go to: https://dash.cloudflare.com
2. Select: `meauxbility.org`
3. Go to: **DNS** ? **Records**
4. Click **"Add record"** for each record below

**Add These Records:**

#### Record 1: DKIM
```
Type: TXT
Name: resend._domainkey
Content: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5vo+oI0NR4jUVT3rqXkWiLlq/xdwN40Ki9c8CCrjYUlTrgTerCc/f7vttfnAVz+HK9amSmkgQB0q7PAryi1+PaIAmyxD8ldSayQyubG9Aei3rYYUqyFiqhDPZwJamtZrBk7YuW2nfrmBEM3gI/zl8G0VPEs+zO9NL+fWeClEAswIDAQAB
Proxy: DNS only (Gray cloud - OFF)
TTL: Auto
```

#### Record 2: SPF
```
Type: TXT
Name: send
Content: v=spf1 include:amazonses.com ~all
Proxy: DNS only (Gray cloud - OFF)
TTL: Auto
```

#### Record 3: MX for Sending
```
Type: MX
Name: send
Mail server: feedback-smtp.us-east-1.amazonses.com
Priority: 10
Proxy: DNS only (Gray cloud - OFF)
TTL: Auto
```

#### Record 4: MX for Receiving (Optional)
```
Type: MX
Name: @ (or leave blank)
Mail server: inbound-smtp.us-east-1.amazonaws.com
Priority: 10
Proxy: DNS only (Gray cloud - OFF)
TTL: Auto
```

#### Record 5: DMARC (Optional)
```
Type: TXT
Name: _dmarc
Content: v=DMARC1; p=none;
Proxy: DNS only (Gray cloud - OFF)
TTL: Auto
```

**?? Important:** All records must have **Proxy OFF** (gray cloud, not orange). Email records don't work through Cloudflare proxy.

---

### Option B: If DNS is on Vercel

If `meauxbility.org` nameservers are on Vercel:

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Settings ? Domains ? `meauxbility.org`
4. Click "DNS Records" or "Manage DNS"
5. Add each record as shown above

**Note:** Vercel DNS management may be limited. If you can't add MX/TXT records, you may need to move DNS to Cloudflare.

---

### Option C: If DNS is on Another Provider

**For GoDaddy, Namecheap, etc.:**

1. Log into your DNS provider
2. Go to DNS Management
3. Add each record:

**DKIM:**
- Type: TXT
- Host: `resend._domainkey`
- Value: `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5vo+oI0NR4jUVT3rqXkWiLlq/xdwN40Ki9c8CCrjYUlTrgTerCc/f7vttfnAVz+HK9amSmkgQB0q7PAryi1+PaIAmyxD8ldSayQyubG9Aei3rYYUqyFiqhDPZwJamtZrBk7YuW2nfrmBEM3gI/zl8G0VPEs+zO9NL+fWeClEAswIDAQAB`
- TTL: 3600

**SPF:**
- Type: TXT
- Host: `send`
- Value: `v=spf1 include:amazonses.com ~all`
- TTL: 3600

**MX for Sending:**
- Type: MX
- Host: `send`
- Value: `feedback-smtp.us-east-1.amazonses.com`
- Priority: 10
- TTL: 3600

**MX for Receiving:**
- Type: MX
- Host: `@` (or leave blank)
- Value: `inbound-smtp.us-east-1.amazonaws.com`
- Priority: 10
- TTL: 3600

**DMARC:**
- Type: TXT
- Host: `_dmarc`
- Value: `v=DMARC1; p=none;`
- TTL: 3600

---

## ? Verify Records

After adding records, wait 5-60 minutes for DNS propagation, then verify:

```bash
# Check DKIM
dig TXT resend._domainkey.meauxbility.org +short

# Check SPF
dig TXT send.meauxbility.org +short

# Check MX
dig MX send.meauxbility.org +short
dig MX meauxbility.org +short

# Check DMARC
dig TXT _dmarc.meauxbility.org +short
```

**Or use online tools:**
- https://dnschecker.org/#TXT/resend._domainkey.meauxbility.org
- https://mxtoolbox.com/SuperTool.aspx

---

## ?? Verify in Resend

1. Go to: https://resend.com/domains
2. Find `meauxbility.org`
3. Check status - should show "Verified" ?

---

## ?? Quick Checklist

- [ ] DKIM record added (`resend._domainkey`)
- [ ] SPF record added (`send`)
- [ ] MX record for sending added (`send`)
- [ ] MX record for receiving added (`@`) - Optional
- [ ] DMARC record added (`_dmarc`) - Optional
- [ ] All records have Proxy OFF (if on Cloudflare)
- [ ] Waited 5-60 minutes for propagation
- [ ] Verified records with dig/dnschecker
- [ ] Verified domain in Resend dashboard

---

## ?? Troubleshooting

### Records Not Showing?

1. **Wait longer** - DNS can take up to 48 hours (usually 5-60 minutes)
2. **Check TTL** - Lower TTL = faster updates
3. **Clear DNS cache:**
   ```bash
   # macOS
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```

### Resend Still Shows "Pending"?

1. **Check all records are correct** - Copy/paste exact values
2. **Verify Proxy is OFF** - Email records don't work through proxy
3. **Wait 24-48 hours** - Some DNS providers are slow

### Can't Add MX Records?

- **Cloudflare:** MX records work, just make sure Proxy is OFF
- **Vercel:** May not support MX records - consider moving DNS to Cloudflare
- **Other providers:** Should support MX records

---

## ?? Done!

Once all records are verified in Resend, you can:
- ? Send emails from `noreply@meauxbility.org`
- ? Receive emails (if MX record added)
- ? Better deliverability with verified domain

**Next:** Set your `RESEND_API_KEY` in the Cloudflare Worker!
