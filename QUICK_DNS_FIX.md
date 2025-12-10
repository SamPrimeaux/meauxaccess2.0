# ? Quick Fix: Add DNS Records Now

## ?? What You Need to Do

Add **2 CNAME records** in your Cloudflare DNS settings.

---

## ?? Direct Link to DNS Settings

**Go here**: https://dash.cloudflare.com ? Click **iautodidact.org** ? Click **DNS** tab

---

## ? Add These 2 Records

### **Record 1: Root Domain**

1. Click **Add record**
2. **Type**: `CNAME`
3. **Name**: `@` (or leave blank)
4. **Target**: `connor-mcneely.meauxbility.workers.dev`
5. **Proxy**: ? **ON** (Orange cloud - CRITICAL!)
6. Click **Save**

### **Record 2: www Subdomain**

1. Click **Add record**
2. **Type**: `CNAME`
3. **Name**: `www`
4. **Target**: `connor-mcneely.meauxbility.workers.dev`
5. **Proxy**: ? **ON** (Orange cloud - CRITICAL!)
6. Click **Save**

---

## ?? Critical: Proxy Must Be ON

The **orange cloud** (Proxy ON) is required for Workers to work!

- ? **Orange cloud** = Proxied = Works with Workers
- ? **Gray cloud** = DNS only = Won't work with Workers

---

## ? Done!

After adding these records:
- Wait 2-5 minutes
- Visit: https://iautodidact.org
- It should work! ??

---

## ?? Still Not Working?

1. **Check worker is deployed**: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/connor-mcneely
2. **Verify records**: Make sure both CNAME records show orange cloud
3. **Wait longer**: DNS can take up to 10 minutes
4. **Clear browser cache**: Try incognito mode
