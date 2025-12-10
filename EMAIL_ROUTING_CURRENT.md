# 📧 Current Email Routing Configuration - inneranimalmedia.com

**Last Updated:** January 7, 2025  
**Status:** ✅ All Active

---

## ✅ **Active Email Addresses**

| Email Address | Action | Destination | Status |
|--------------|--------|-------------|--------|
| `sam@inneranimalmedia.com` | Send to email | `meauxbility@gmail.com` | ✅ Active |
| `ceo@inneranimalmedia.com` | Send to email | `meauxbility@gmail.com` | ✅ Active |
| `hey@inneranimalmedia.com` | Send to email | `meauxbility@gmail.com` | ✅ Active |
| `cto@inneranimalmedia.com` | Send to email | `connordmcneely@gmail.com` | ✅ Active |
| `fred@inneranimalmedia.com` | Send to email | `williamsfred336@gmail.com` | ✅ Active |
| `maddevp@inneranimalmedia.com` | Send to email | `tmadelinerose@gmail.com` | ✅ Active |
| `noreply@inneranimalmedia.com` | **Send to Worker** | `madelinemydawg` | ✅ Active |
| `evp@inneranimalmedia.com` | **Send to Worker** | `madelinemydawg` | ✅ Active |

---

## 🤖 **Email Workers in Use**

### **1. madelinemydawg**
- **Used by:** 
  - `noreply@inneranimalmedia.com`
  - `evp@inneranimalmedia.com`
- **Status:** ✅ Active

### **2. email-worker-sam** (Available)
- **Status:** ✅ Deployed and ready
- **Features:**
  - ✅ Email archiving to R2
  - ✅ Email logging to KV
  - ✅ Smart filtering and categorization
  - ✅ Auto-replies for specific senders
  - ✅ Important email notifications
- **Note:** Can be connected to `sam@inneranimalmedia.com` if needed

---

## 📊 **Email Routing Summary**

### **Direct Email Forwarding (6 addresses):**
- `sam@inneranimalmedia.com` → `meauxbility@gmail.com`
- `ceo@inneranimalmedia.com` → `meauxbility@gmail.com`
- `hey@inneranimalmedia.com` → `meauxbility@gmail.com`
- `cto@inneranimalmedia.com` → `connordmcneely@gmail.com`
- `fred@inneranimalmedia.com` → `williamsfred336@gmail.com`
- `maddevp@inneranimalmedia.com` → `tmadelinerose@gmail.com`

### **Worker Processing (2 addresses):**
- `noreply@inneranimalmedia.com` → `madelinemydawg`
- `evp@inneranimalmedia.com` → `madelinemydawg`

---

## 🎯 **Email Features by Address**

### **sam@inneranimalmedia.com** (Standard)
- ✅ **Forwarding:** Direct email forwarding to `meauxbility@gmail.com`
- ✅ **Status:** Active
- **Note:** `email-worker-sam` is available if you want to add archiving/processing

### **Other Addresses** (Standard)
- ✅ **Forwarding:** Direct email forwarding
- ✅ **Status:** All active and working

---

## 📋 **Quick Reference**

**Sam's Email:**
- Address: `sam@inneranimalmedia.com`
- Forwards to: `meauxbility@gmail.com`
- Status: ✅ Active
- **Optional:** Can connect `email-worker-sam` for archiving/processing

**Team Emails:**
- CEO: `ceo@inneranimalmedia.com` → `meauxbility@gmail.com`
- CTO: `cto@inneranimalmedia.com` → `connordmcneely@gmail.com`
- EVP: `evp@inneranimalmedia.com` → Worker (`automeauxemail`)
- Fred: `fred@inneranimalmedia.com` → `williamsfred336@gmail.com`
- Madeline: `maddevp@inneranimalmedia.com` → `tmadelinerose@gmail.com`

**System Emails:**
- No Reply: `noreply@inneranimalmedia.com` → Worker (`madelinemydawg`)
- General: `hey@inneranimalmedia.com` → `meauxbility@gmail.com`

---

## 🔍 **Viewing Email Archives**

### **For sam@inneranimalmedia.com:**

**R2 Archive:**
```bash
# List archived emails
wrangler r2 object list inneranimalmedia-email-archive --prefix emails/

# Get specific email
wrangler r2 object get inneranimalmedia-email-archive emails/1234567890-abc123.json
```

**KV Logs:**
```bash
# Get email count
wrangler kv key get email:count --namespace-id 9b768dd6fdf54229995c6f957dc45f6f

# List recent emails
wrangler kv key list --namespace-id 9b768dd6fdf54229995c6f957dc45f6f --prefix email:
```

**R2 Dashboard:**
- Go to: https://dash.cloudflare.com → R2 → inneranimalmedia-email-archive

---

## ✅ **Configuration Status**

- ✅ All 8 email addresses configured
- ✅ 2 workers active (`madelinemydawg`)
- ✅ 1 worker available (`email-worker-sam` for archiving)
- ✅ 6 direct forwarding addresses
- ✅ All emails routing correctly

---

**Status:** ✅ All emails active and configured correctly  
**Last Updated:** January 7, 2025
