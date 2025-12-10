# 🔐 Google Cloud Platform - IAM Permissions

**Date:** January 7, 2025  
**Project:** Gemini API Integration  
**Organization:** meauxbility-org

---

## 👥 **Principal Access Overview**

### **View by Principals**

| Principal | Name | Role(s) | Inheritance |
|-----------|------|---------|-------------|
| `ConnorDMcNeely@gmail.com` | connor | Dev Ops | No inheritance |
| `meauxbility@gmail.com` | samuel primeaux | Multiple (see below) | Organization level |
| `williamsfred336@gmail.com` | YRNCK TV | Dev Ops | No inheritance |

---

## 🔑 **Detailed Permissions**

### **1. ConnorDMcNeely@gmail.com (connor)**
- **GCP Email:** ConnorDMcNeely@gmail.com
- **Team Email:** connor@meauxbility.org
- **Name:** Connor
- **Role:** Dev Ops
- **Inheritance:** No inheritance, direct role assignment
- **Access Level:** Development and operations access
- **Use Case:** DevOps tasks, deployment, monitoring
- **Team Role:** Developer

---

### **2. meauxbility@gmail.com (samuel primeaux)**
- **GCP Email:** meauxbility@gmail.com
- **Team Email:** sam@meauxbility.org
- **Name:** Sam Primeaux
- **Roles:** Multiple administrative roles
- **Inheritance:** Organization level (`meauxbility-org`)
- **Team Role:** Admin

#### **Assigned Roles:**
1. **Cloud KMS Admin**
   - Manage encryption keys
   - Key rotation and access control
   - Security for sensitive data

2. **Organization Administrator**
   - Full organization management
   - User and project management
   - Billing and resource oversight

3. **Owner**
   - Full project ownership
   - All permissions
   - Billing and resource management

4. **Project Mover**
   - Move projects between organizations
   - Resource migration
   - Organizational restructuring

5. **Pub/Sub Admin**
   - Manage Pub/Sub topics and subscriptions
   - Message publishing and consumption
   - Event-driven architecture

6. **Security Center Admin**
   - Security monitoring and alerts
   - Threat detection
   - Compliance management

7. **Service Usage Admin**
   - Enable/disable APIs
   - Service quota management
   - API access control

**Access Level:** Full administrative access

---

### **3. williamsfred336@gmail.com (YRNCK TV)**
- **GCP Email:** williamsfred336@gmail.com
- **Team Email:** fred@meauxbility.org
- **Name:** Fred (YRNCK TV)
- **Role:** Dev Ops
- **Inheritance:** No inheritance, direct role assignment
- **Access Level:** Development and operations access
- **Use Case:** DevOps tasks, deployment, monitoring
- **Team Role:** Developer

---

## 🏢 **Organization Structure**

### **Organization:**
- **Name:** meauxbility-org
- **Admin:** samuel primeaux (meauxbility@gmail.com)
- **Structure:** Organization-level permissions for owner

---

## 🔐 **Security Insights**

### **Current Configuration:**
- ✅ **Principle of Least Privilege:** Dev Ops roles assigned separately
- ✅ **Owner Access:** Restricted to organization admin
- ✅ **Role Separation:** Dev Ops vs Admin roles distinct
- ⚠️ **Multiple Admin Roles:** Owner has extensive permissions (expected for admin)

### **Recommendations:**
1. **Review Dev Ops Access:**
   - Ensure Dev Ops role has appropriate permissions
   - Consider custom roles for specific needs
   - Regular access reviews

2. **Monitor Owner Access:**
   - Owner role has full access (expected)
   - Monitor for unusual activity
   - Use audit logs

3. **API Key Security:**
   - Gemini API key currently unrestricted
   - Consider restricting to specific IPs/domains
   - Regular key rotation

---

## 🎯 **Gemini API Access**

### **API Key Owner:**
- **Principal:** meauxbility@gmail.com (samuel primeaux)
- **Role:** Owner (full access)
- **Key:** `AIzaSyAfx_Rba4PQFWJnJEnzOLCfVQvJujy-9pQ`
- **Status:** Unrestricted (recommend restricting)

### **Authorized Domains:**
- ✅ `https://www.meauxbility.org`
- ✅ `https://meauxbility.org`
- ✅ `https://inneranimalmedia.com`
- ✅ `https://www.inneranimalmedia.com`

### **Authorized Redirect URIs:**
- ✅ `https://www.meauxbility.org/api/auth/google/callback`
- ✅ `https://meauxbility.org/api/auth/google/callback`
- ✅ `https://inneranimalmedia.com/api/auth/google/callback`
- ✅ `https://www.inneranimalmedia.com/api/auth/google/callback`

---

## 📋 **Role Descriptions**

### **Dev Ops Role:**
- **Purpose:** Development and operations tasks
- **Typical Permissions:**
  - Deploy applications
  - Monitor services
  - Manage resources
  - View logs and metrics
  - Limited admin access

### **Owner Role:**
- **Purpose:** Full project control
- **Permissions:**
  - All project permissions
  - Billing management
  - User management
  - Resource management
  - Service configuration

### **Organization Administrator:**
- **Purpose:** Organization-wide management
- **Permissions:**
  - Manage organization structure
  - User and project management
  - Billing oversight
  - Policy enforcement

---

## 🔄 **Access Management**

### **Current Team:**

#### **1. samuel primeaux (Owner/Admin)**
- **GCP Email:** meauxbility@gmail.com
- **Team Email:** sam@meauxbility.org
- **GCP Role:** Owner, Organization Administrator, Multiple Admin Roles
- **Team Role:** Admin
- **Access:** Full administrative access
- **Responsibilities:**
  - Organization management
  - Security oversight
  - Billing management
  - API key management
  - IAM configuration

#### **2. connor (Dev Ops)**
- **GCP Email:** ConnorDMcNeely@gmail.com
- **Team Email:** connor@meauxbility.org
- **GCP Role:** Dev Ops
- **Team Role:** Developer
- **Access:** Development and operations
- **Responsibilities:**
  - Deployment access
  - Monitoring capabilities
  - Development tasks

#### **3. fred (Dev Ops)**
- **GCP Email:** williamsfred336@gmail.com
- **Team Email:** fred@meauxbility.org
- **GCP Role:** Dev Ops
- **Team Role:** Developer
- **Access:** Development and operations
- **Responsibilities:**
  - Deployment access
  - Monitoring capabilities
  - Development tasks

#### **4. amber (Team Member)**
- **GCP Email:** Not yet configured in GCP
- **Team Email:** amber@meauxbility.org
- **GCP Role:** None (not in GCP IAM)
- **Team Role:** Developer
- **Access:** Team dashboard access only
- **Note:** Consider adding to GCP if DevOps access needed

---

## 📊 **Access Matrix**

| Resource | Owner (sam) | Dev Ops (connor, fred) | Team (amber) | Notes |
|----------|-------------|------------------------|-------------|-------|
| Gemini API | ✅ Full | ✅ Read/Use | ❌ None | API key access |
| GCP Projects | ✅ Full | ✅ Limited | ❌ None | Based on role |
| Billing | ✅ Full | ❌ None | ❌ None | Owner only |
| IAM | ✅ Full | ❌ None | ❌ None | Owner only |
| Logs | ✅ Full | ✅ Read | ❌ None | Dev Ops can view |
| Resources | ✅ Full | ✅ Manage | ❌ None | Dev Ops can deploy |
| Dashboard | ✅ Full | ✅ Full | ✅ Full | All team members |
| R2 Storage | ✅ Full | ✅ Full | ✅ Full | Via dashboard |
| D1 Databases | ✅ Full | ✅ Full | ✅ Full | Via dashboard |
| Workers | ✅ Full | ✅ Full | ✅ Full | Via dashboard |

---

## 🛡️ **Security Best Practices**

### **✅ Implemented:**
- Role-based access control (RBAC)
- Separate Dev Ops roles
- Organization-level admin
- Authorized domains configured

### **⚠️ Recommendations:**
1. **Restrict API Key:**
   - Limit to specific APIs (Generative Language API)
   - Restrict to Cloudflare Workers IPs
   - Add application restrictions

2. **Regular Audits:**
   - Review access logs monthly
   - Check for unused permissions
   - Verify role assignments

3. **Key Rotation:**
   - Rotate API keys every 90 days
   - Update Worker secrets
   - Revoke old keys

4. **Monitoring:**
   - Set up alerts for unusual activity
   - Monitor API usage
   - Track access patterns

---

## 📝 **Notes**

### **Inheritance:**
- **Owner (samuel primeaux):** Organization-level inheritance
- **Dev Ops (connor, fred):** No inheritance, direct role assignment

### **Access Levels:**
- **Owner:** Full administrative access
- **Dev Ops:** Operational access for development and deployment

---

## ✅ **Status**

**IAM Configuration:** ✅ Documented  
**Access Control:** ✅ Configured  
**Security:** ⚠️ API key unrestricted (recommend restricting)  
**Team Access:** ✅ Properly assigned

---

**Last Updated:** January 7, 2025  
**Maintained By:** samuel primeaux (Owner)

---

*This document reflects the current IAM configuration for the Gemini API project.*
