# ? Resend DNS Records - Quick Setup

## ?? Current Status

- ? DNS is on Cloudflare
- ?? DKIM record exists but needs updating
- ? SPF record missing
- ? MX records missing

## ?? Quick Setup (2 Options)

### Option 1: Automated Script (Fastest)

**If you have Cloudflare API token with DNS permissions:**

```bash
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker
export CLOUDFLARE_API_TOKEN='your-token-with-dns-permissions'
./add-resend-dns.sh
```

### Option 2: Manual Setup (Recommended)

**Go to Cloudflare DNS:**
https://dash.cloudflare.com/2f420b6c582e4ba8d7b1f6ebaf91438b/dns

**Add/Update these 5 records:**

#### 1. Update DKIM Record

**Find existing:** `resend._domainkey` (TXT record)  
**Click Edit, then update:**
```
Type: TXT
Name: resend._domainkey
Content: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5vo+oI0NR4jUVT3rqXkWiLlq/xdwN40Ki9c8CCrjYUlTrgTerCc/f7vttfnAVz+HK9amSmkgQB0q7PAryi1+PaIAmyxD8ldSayQyubG9Aei3rYYUqyFiqhDPZwJamtZrBk7YuW2nfrmBEM3gI/zl8G0VPEs+zO9NL+fWeClEAswIDAQAB
Proxy: DNS only (Gray cloud - OFF) ??
TTL: Auto
```

#### 2. Add SPF Record

**Click "Add record":**
```
Type: TXT
Name: send
Content: v=spf1 include:amazonses.com ~all
Proxy: DNS only (Gray cloud - OFF) ??
TTL: Auto
```

#### 3. Add MX Record for Sending

**Click "Add record":**
```
Type: MX
Name: send
Mail server: feedback-smtp.us-east-1.amazonses.com
Priority: 10
Proxy: DNS only (Gray cloud - OFF) ??
TTL: Auto
```

#### 4. Add MX Record for Receiving (Optional)

**Click "Add record":**
```
Type: MX
Name: @ (or leave blank)
Mail server: inbound-smtp.us-east-1.amazonaws.com
Priority: 10
Proxy: DNS only (Gray cloud - OFF) ??
TTL: Auto
```

#### 5. Add DMARC Record (Optional)

**Click "Add record":**
```
Type: TXT
Name: _dmarc
Content: v=DMARC1; p=none;
Proxy: DNS only (Gray cloud - OFF) ??
TTL: Auto
```

## ?? Critical: Proxy Must Be OFF

**All email records MUST have Proxy OFF (gray cloud, not orange).**

Email records (MX, TXT for email) don't work through Cloudflare proxy!

## ? Verify After Setup

Wait 5-60 minutes, then check:

```bash
# Check DKIM
dig TXT resend._domainkey.meauxbility.org +short

# Check SPF
dig TXT send.meauxbility.org +short

# Check MX
dig MX send.meauxbility.org +short
```

**Or verify in Resend:**
- Go to: https://resend.com/domains
- Check `meauxbility.org` status

## ?? Done!

Once verified in Resend, you can send emails from `noreply@meauxbility.org`!
