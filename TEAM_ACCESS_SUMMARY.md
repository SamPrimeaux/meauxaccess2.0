# 👥 Team Access Summary - GCP & Cloudflare

**Date:** January 7, 2025  
**Status:** Active

---

## 🔗 **Email Mapping**

### **GCP ↔ Team Email Mapping:**

| GCP Email | Team Email | Name | GCP Role | Team Role |
|-----------|-----------|------|----------|-----------|
| `meauxbility@gmail.com` | `sam@meauxbility.org` | Sam Primeaux | Owner/Admin | Admin |
| `ConnorDMcNeely@gmail.com` | `connor@meauxbility.org` | Connor | Dev Ops | Developer |
| `williamsfred336@gmail.com` | `fred@meauxbility.org` | Fred | Dev Ops | Developer |
| *Not in GCP* | `amber@meauxbility.org` | Amber | None | Developer |

---

## 🎯 **Access Levels**

### **1. Sam Primeaux (Owner)**
- **GCP:** Full administrative access
- **Cloudflare:** Full access (Pro account owner)
- **Dashboard:** Admin role
- **SSH:** Enabled
- **Responsibilities:**
  - GCP organization management
  - Gemini API key management
  - Cloudflare account management
  - Team access control

### **2. Connor (Dev Ops)**
- **GCP:** Dev Ops role (deployment, monitoring)
- **Cloudflare:** Access via dashboard
- **Dashboard:** Developer role
- **SSH:** Enabled
- **Responsibilities:**
  - Deployment tasks
  - Monitoring and logs
  - Development work

### **3. Fred (Dev Ops)**
- **GCP:** Dev Ops role (deployment, monitoring)
- **Cloudflare:** Access via dashboard
- **Dashboard:** Developer role
- **SSH:** Enabled
- **Responsibilities:**
  - Deployment tasks
  - Monitoring and logs
  - Development work

### **4. Amber (Team Member)**
- **GCP:** No access (not configured)
- **Cloudflare:** Access via dashboard
- **Dashboard:** Developer role
- **SSH:** Enabled
- **Note:** Consider adding to GCP if DevOps access needed

---

## 🔐 **Platform Access**

### **Google Cloud Platform (GCP):**
- **Owner:** Sam (full access)
- **Dev Ops:** Connor, Fred (limited access)
- **Team:** Amber (no GCP access)

### **Cloudflare:**
- **All Team Members:** Dashboard access
- **Owner:** Full account access
- **Features:**
  - Workers deployment
  - R2 storage
  - D1 databases
  - KV namespaces
  - Email routing
  - DNS management

### **Dashboard (inneranimalmedia.com):**
- **All Team Members:** Full access
- **Features:**
  - R2 file management
  - D1 database queries
  - KV namespace management
  - Workers monitoring
  - SSH access
  - Ecosystem chat
  - Gemini API (via proxy)

---

## 📋 **Permission Summary**

### **GCP Permissions:**
| User | Organization Admin | Owner | Dev Ops | Project Access |
|------|-------------------|-------|---------|----------------|
| Sam | ✅ | ✅ | ✅ | ✅ Full |
| Connor | ❌ | ❌ | ✅ | ✅ Limited |
| Fred | ❌ | ❌ | ✅ | ✅ Limited |
| Amber | ❌ | ❌ | ❌ | ❌ None |

### **Cloudflare Access:**
| User | Dashboard | Workers | R2 | D1 | KV | Email | DNS |
|------|-----------|---------|----|----|----|----|-----|
| Sam | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Connor | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Fred | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Amber | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

---

## 🚀 **Key Resources**

### **GCP:**
- **Organization:** meauxbility-org
- **Project:** Gemini API integration
- **API Key:** Configured for Gemini API
- **IAM:** Role-based access control

### **Cloudflare:**
- **Account:** Cloudflare Pro
- **Workers:** Multiple deployed
- **R2 Buckets:** 20+ buckets
- **D1 Databases:** Multiple databases
- **Custom Domain:** inneranimalmedia.com

---

## 🔄 **Access Requests**

### **To Add GCP Access:**
1. Contact Sam (Owner)
2. Specify required role (Dev Ops recommended)
3. Provide GCP email address
4. Access will be granted by Owner

### **To Add Cloudflare Access:**
1. Already accessible via dashboard
2. Login with team email
3. Access granted based on team role

---

## 📝 **Notes**

### **Current Configuration:**
- ✅ GCP IAM properly configured
- ✅ Team emails mapped correctly
- ✅ Role separation implemented
- ✅ Dashboard access for all team members
- ⚠️ Amber not in GCP (consider if needed)

### **Security:**
- ✅ Principle of least privilege
- ✅ Role-based access control
- ✅ Separate GCP and Cloudflare access
- ✅ SSH access enabled for developers

---

**Last Updated:** January 7, 2025  
**Maintained By:** Sam Primeaux (Owner)

---

*This document provides a quick reference for team access across GCP and Cloudflare platforms.*
