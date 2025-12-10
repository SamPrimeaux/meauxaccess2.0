# ?? All Live URLs & Team Access - Complete Reference

## ?? All Platform URLs

### **Primary Worker URLs:**
- **Main Dashboard**: https://meauxmcp.meauxbility.workers.dev/dashboard
- **Learning Platform**: https://meauxmcp.meauxbility.workers.dev/dashboard/learning
- **iAccess (GODMODE)**: https://meauxmcp.meauxbility.workers.dev/iaccess
- **Health Check**: https://meauxmcp.meauxbility.workers.dev/health

### **Via Vercel (meauxxx.com):**
- **Dashboard**: https://meauxxx.com/dashboard
- **Learning**: https://meauxxx.com/dashboard/learning
- **iAccess**: https://meauxxx.com/iaccess

### **iautodidact.org (Custom Domain):**
- **Home**: https://iautodidact.org
- **www**: https://www.iautodidact.org
- **Dashboard**: https://iautodidact.org/dashboard
- **Learning**: https://iautodidact.org/dashboard/learning
- **About**: https://iautodidact.org/about
- **Portfolio**: https://iautodidact.org/portfolio
- **Coaching**: https://iautodidact.org/coaching
- **Community**: https://iautodidact.org/community
- **Contact**: https://iautodidact.org/contact

### **R2 Public URLs:**
- **Base URL**: https://pub-ae968de3091f4c5c89f37fe9381f9319.r2.dev
- **Vercel Dashboard**: https://pub-ae968de3091f4c5c89f37fe9381f9319.r2.dev/vercel-deployments-dashboard.html
- **Learning Dashboard**: https://pub-ae968de3091f4c5c89f37fe9381f9319.r2.dev/learning-dashboard.html
- **Course Data**: https://pub-ae968de3091f4c5c89f37fe9381f9319.r2.dev/courses/meauxcloud-course.json

---

## ?? Team Members with SSH Access

### **1. Sam Primeaux** (Admin)
- **Email**: sam@meauxbility.org
- **SSH Public Key**: 
  ```
  ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIX+Xi6EBzx1xWNOcJ0GZ9jPhLrdJ2lCWx/eCvN/R7Bi sam@meauxbility.org
  ```
- **Status**: ? Ready

### **2. Connor** (Developer)
- **Email**: connor@meauxbility.org
- **SSH Public Key**: 
  ```
  ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEKB/ENgjI76Tggz4c1jNYauG+rdzkqsDsEdyWSkV6eQ connor@meauxbility.org
  ```
- **Status**: ? Ready

### **3. Fred** (Developer)
- **Email**: fred@meauxbility.org
- **SSH Public Key**: 
  ```
  ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHU9eklbU7NZzXMbZLj6RkF4fIEIVrMmZ1Jfax1SswlK fred@meauxbility.org
  ```
- **Status**: ? Ready

### **4. Amber** (Developer)
- **Email**: amber@meauxbility.org
- **SSH Public Key**: 
  ```
  ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIO+gaDkZMXWmLpia7rWVT0XUzqdb/A8DJADq/drBc7hQ amber@meauxbility.org
  ```
- **Status**: ? Ready

**To Install**: Add all public keys above to your server's `~/.ssh/authorized_keys` file.

---

## ?? HTML Remaster System - Quick Guide

### **How to Remaster Any HTML:**

#### **Option 1: Use the Script**
```bash
./remaster-html-example.sh your-file.html
```

#### **Option 2: Via API**
```bash
curl -X POST https://meauxmcp.meauxbility.workers.dev/api/remaster \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<your HTML>",
    "options": {
      "addMeauxBranding": true,
      "addCLI": true,
      "addChat": true,
      "addBrowser": true,
      "uploadToR2": true,
      "filename": "page.html"
    }
  }'
```

#### **Option 3: JavaScript**
```javascript
const response = await fetch('/api/remaster', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    html: yourHTML,
    options: { addMeauxBranding: true, addCLI: true }
  })
});
const { remastered } = await response.json();
```

### **What Gets Added:**
- ? MeauxCloud branding
- ? Cloudflare optimizations
- ? Responsive design
- ? Dark mode
- ? Optional: CLI terminal
- ? Optional: Chat assistant
- ? Optional: Browser preview
- ? Image optimization
- ? Performance enhancements

---

## ?? Safe Expansion Checklist

Before adding new features:

- [ ] Test locally first
- [ ] Use remaster API for HTML
- [ ] Store in R2 (100% Cloudflare)
- [ ] No external redirects
- [ ] Maintain branding
- [ ] Responsive design
- [ ] Test on mobile
- [ ] Document changes
- [ ] Update this guide

---

## ? Current Status

- ? Learning platform deployed
- ? Course content created
- ? Interactive tools added
- ? SSH keys generated
- ? HTML remaster system ready
- ? All URLs documented
- ? Team access configured

**Platform is ready for expansion!** ??

---

## ?? Documentation Files

1. **COMPLETE_PLATFORM_REFERENCE.md** - Full platform reference
2. **PLATFORM_COMPLETE_GUIDE.md** - Complete setup guide
3. **SSH_KEYS_SETUP.md** - SSH installation guide
4. **QUICK_START_REMASTER.md** - Remaster quick start
5. **ALL_URLS_AND_ACCESS.md** - This file

**Everything is documented and ready!** ??
