# ?? Resend DNS Records - Manual Setup Steps

## ?? Direct Link to Cloudflare DNS

**Go here:**  
https://dash.cloudflare.com/2f420b6c582e4ba8d7b1f6ebaf91438b/dns

## ?? Records to Add/Update

### Record 1: Update DKIM (TXT)

**Find existing record:** `resend._domainkey`

1. **Click "Edit"** on the existing `resend._domainkey` TXT record
2. **Update Content to:**
   ```
   p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5vo+oI0NR4jUVT3rqXkWiLlq/xdwN40Ki9c8CCrjYUlTrgTerCc/f7vttfnAVz+HK9amSmkgQB0q7PAryi1+PaIAmyxD8ldSayQyubG9Aei3rYYUqyFiqhDPZwJamtZrBk7YuW2nfrmBEM3gI/zl8G0VPEs+zO9NL+fWeClEAswIDAQAB
   ```
3. **Make sure Proxy is OFF** (gray cloud, not orange)
4. **Click "Save"**

### Record 2: Add SPF (TXT)

1. **Click "Add record"**
2. **Configure:**
   - **Type:** `TXT`
   - **Name:** `send`
   - **Content:** `v=spf1 include:amazonses.com ~all`
   - **Proxy:** DNS only (Gray cloud - OFF) ??
   - **TTL:** Auto
3. **Click "Save"**

### Record 3: Add MX for Sending

1. **Click "Add record"**
2. **Configure:**
   - **Type:** `MX`
   - **Name:** `send`
   - **Mail server:** `feedback-smtp.us-east-1.amazonses.com`
   - **Priority:** `10`
   - **Proxy:** DNS only (Gray cloud - OFF) ??
   - **TTL:** Auto
3. **Click "Save"**

### Record 4: Add MX for Receiving (Optional)

1. **Click "Add record"**
2. **Configure:**
   - **Type:** `MX`
   - **Name:** `@` (or leave blank for root)
   - **Mail server:** `inbound-smtp.us-east-1.amazonaws.com`
   - **Priority:** `10`
   - **Proxy:** DNS only (Gray cloud - OFF) ??
   - **TTL:** Auto
3. **Click "Save"**

### Record 5: Add DMARC (Optional)

1. **Click "Add record"**
2. **Configure:**
   - **Type:** `TXT`
   - **Name:** `_dmarc`
   - **Content:** `v=DMARC1; p=none;`
   - **Proxy:** DNS only (Gray cloud - OFF) ??
   - **TTL:** Auto
3. **Click "Save"**

## ?? Important Notes

1. **Proxy MUST be OFF** for all email records
2. **Wait 5-60 minutes** for DNS propagation
3. **Verify in Resend** dashboard after adding records

## ? Final Checklist

After adding all records:

- [ ] DKIM updated with new value
- [ ] SPF record added
- [ ] MX record for sending added
- [ ] MX record for receiving added (optional)
- [ ] DMARC record added (optional)
- [ ] All records have Proxy OFF
- [ ] Verified in Resend dashboard

## ?? Done!

Your Resend domain will be verified once DNS propagates!
