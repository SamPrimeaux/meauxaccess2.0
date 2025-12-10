# 🔌 iAccess Integration Guide

Complete guide to connecting live Cloudflare data to your iAccess dashboard using MCP tools.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [MCP Tool Setup](#mcp-tool-setup)
3. [Worker Implementation](#worker-implementation)
4. [Dashboard Integration](#dashboard-integration)
5. [Live Data Binding](#live-data-binding)
6. [Authentication](#authentication)
7. [Testing](#testing)

---

## Prerequisites

### Required Access
- ✅ Cloudflare account with Workers enabled
- ✅ API token with appropriate permissions
- ✅ Claude with MCP tools enabled (already configured)
- ✅ Wrangler CLI installed

### Account Information
```bash
ACCOUNT_ID="ede6590ac0d2fb7daf155b35653457b2"
API_TOKEN="your-api-token"
```

---

## MCP Tool Setup

### Available MCP Tools

Claude has access to these Cloudflare MCP tools:

```typescript
// Workers
- workers_list()
- workers_get_worker(scriptName)
- workers_get_worker_code(scriptName)

// D1 Databases
- d1_databases_list()
- d1_database_get(database_id)
- d1_database_query(database_id, sql, params?)
- d1_database_create(name, primary_location_hint?)

// R2 Buckets
- r2_buckets_list(cursor?, direction?, name_contains?, per_page?, start_after?)
- r2_bucket_get(name)
- r2_bucket_create(name)

// KV Namespaces
- kv_namespaces_list(params?)
- kv_namespace_get(namespace_id)
- kv_namespace_create(title)

// Hyperdrive
- hyperdrive_configs_list(page?, per_page?, order?, direction?)
- hyperdrive_config_get(hyperdrive_id)

// Account
- accounts_list()
- set_active_account(activeAccountIdParam)

// Documentation
- search_cloudflare_documentation(query)
```

### Testing MCP Connection

```javascript
// Test in Claude
"Can you list all my Workers?"

// Expected response: Claude will call workers_list() 
// and show you all deployed workers
```

---

## Worker Implementation

### Create API Worker

Create `iaccess-api` worker to serve dashboard data:

```typescript
// src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  CLOUDFLARE_API_TOKEN: string;
  ACCOUNT_ID: string;
  DB: D1Database;
  R2: R2Bucket;
  KV: KVNamespace;
  ANALYTICS: AnalyticsEngine;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS
app.use('/*', cors({
  origin: ['https://iaccess.yourdomain.com'],
  credentials: true,
}));

// ============================================
// DASHBOARD STATS
// ============================================
app.get('/api/stats', async (c) => {
  const accountId = c.env.ACCOUNT_ID;
  const token = c.env.CLOUDFLARE_API_TOKEN;

  // Fetch Workers stats
  const workersResponse = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  const workersData = await workersResponse.json();

  // Fetch Analytics (last 30 days)
  const analyticsQuery = `
    SELECT 
      COUNT(*) as total_requests,
      AVG(duration_ms) as avg_latency
    FROM analytics
    WHERE timestamp > NOW() - INTERVAL 30 DAY
  `;
  
  const analyticsResults = await c.env.DB.prepare(analyticsQuery).first();

  // Calculate costs (example)
  const costs = {
    workers: workersData.result.length * 5, // $5 per worker/month
    storage: 45, // From R2 usage
    ai: 145, // AI Gateway costs
    total: 0
  };
  costs.total = costs.workers + costs.storage + costs.ai;

  return c.json({
    success: true,
    data: {
      requests: analyticsResults?.total_requests || 0,
      latency: analyticsResults?.avg_latency || 0,
      costs: costs,
      workers: workersData.result.length,
      lastUpdated: new Date().toISOString()
    }
  });
});

// ============================================
// AI GATEWAY STATS
// ============================================
app.get('/api/ai-gateway/stats', async (c) => {
  const query = `
    SELECT 
      COUNT(*) as total_requests,
      SUM(CASE WHEN cache_hit = 1 THEN 1 ELSE 0 END) as cache_hits,
      AVG(latency_ms) as avg_latency,
      SUM(cost_usd) as total_cost
    FROM ai_gateway_analytics
    WHERE timestamp > NOW() - INTERVAL 30 DAY
  `;

  const results = await c.env.DB.prepare(query).first();
  
  const cacheHitRate = results.cache_hits / results.total_requests * 100;
  const savedCost = results.cache_hits * 0.015; // Avg cost per request

  return c.json({
    success: true,
    data: {
      totalRequests: results.total_requests,
      cacheHitRate: cacheHitRate.toFixed(2),
      avgLatency: Math.round(results.avg_latency),
      totalCost: results.total_cost,
      savedCost: savedCost.toFixed(2),
      lastUpdated: new Date().toISOString()
    }
  });
});

// ============================================
// BROWSER RENDERING STATS
// ============================================
app.get('/api/browser-rendering/stats', async (c) => {
  const query = `
    SELECT 
      COUNT(*) as total_renders,
      AVG(duration_ms) as avg_duration,
      SUM(cost_usd) as total_cost,
      COUNT(DISTINCT DATE(timestamp)) as active_days
    FROM browser_rendering_log
    WHERE timestamp > NOW() - INTERVAL 30 DAY
  `;

  const results = await c.env.DB.prepare(query).first();

  return c.json({
    success: true,
    data: {
      totalRenders: results.total_renders,
      avgDuration: Math.round(results.avg_duration),
      totalCost: results.total_cost,
      rendersPerDay: Math.round(results.total_renders / 30),
      lastUpdated: new Date().toISOString()
    }
  });
});

// ============================================
// SERVICES LIST
// ============================================
app.get('/api/services', async (c) => {
  const services = [
    {
      name: 'damnsam-worker',
      type: 'Worker',
      status: 'healthy',
      requests: await getWorkerRequests('damnsam'),
      latency: 42,
      cost: 127
    },
    // ... more services
  ];

  return c.json({
    success: true,
    data: services
  });
});

// ============================================
// REAL-TIME CHART DATA
// ============================================
app.get('/api/charts/requests', async (c) => {
  const days = parseInt(c.req.query('days') || '7');
  
  const query = `
    SELECT 
      DATE(timestamp) as date,
      COUNT(*) as requests,
      AVG(duration_ms) as latency
    FROM analytics
    WHERE timestamp > NOW() - INTERVAL ${days} DAY
    GROUP BY DATE(timestamp)
    ORDER BY date ASC
  `;

  const results = await c.env.DB.prepare(query).all();

  return c.json({
    success: true,
    data: {
      labels: results.results.map(r => r.date),
      requests: results.results.map(r => r.requests),
      latency: results.results.map(r => Math.round(r.latency))
    }
  });
});

// ============================================
// WEBSOCKET FOR REAL-TIME UPDATES
// ============================================
app.get('/api/ws', async (c) => {
  const upgradeHeader = c.req.header('Upgrade');
  if (upgradeHeader !== 'websocket') {
    return c.text('Expected Upgrade: websocket', 426);
  }

  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  server.accept();

  // Send updates every 5 seconds
  const interval = setInterval(async () => {
    const stats = await fetchLatestStats(c.env);
    server.send(JSON.stringify(stats));
  }, 5000);

  server.addEventListener('close', () => {
    clearInterval(interval);
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
});

export default app;
```

### Deploy Worker

```bash
# Create wrangler.toml
cat > wrangler.toml << EOF
name = "iaccess-api"
main = "src/index.ts"
compatibility_date = "2024-12-07"

[[d1_databases]]
binding = "DB"
database_name = "iaccess-analytics"
database_id = "your-db-id"

[[r2_buckets]]
binding = "R2"
bucket_name = "iaccess-data"

[[kv_namespaces]]
binding = "KV"
id = "your-kv-id"

[[analytics_engine_datasets]]
binding = "ANALYTICS"
dataset = "iaccess-analytics"

[vars]
ACCOUNT_ID = "ede6590ac0d2fb7daf155b35653457b2"

# Set secrets
# wrangler secret put CLOUDFLARE_API_TOKEN
EOF

# Deploy
wrangler deploy
```

---

## Dashboard Integration

### Update Dashboard HTML

Add API client to dashboard:

```html
<!-- Add to iaccess-dashboard.html -->
<script>
// ============================================
// API CLIENT
// ============================================
const API_BASE = 'https://iaccess-api.yourdomain.workers.dev';

class IAccessAPI {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async fetch(endpoint) {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  // Dashboard stats
  async getStats() {
    return this.fetch('/api/stats');
  }

  // AI Gateway
  async getAIGatewayStats() {
    return this.fetch('/api/ai-gateway/stats');
  }

  // Browser Rendering
  async getBrowserRenderingStats() {
    return this.fetch('/api/browser-rendering/stats');
  }

  // Services list
  async getServices() {
    return this.fetch('/api/services');
  }

  // Chart data
  async getChartData(days = 7) {
    return this.fetch(`/api/charts/requests?days=${days}`);
  }
}

const api = new IAccessAPI(API_BASE);

// ============================================
// LIVE DATA UPDATES
// ============================================
async function updateDashboard() {
  try {
    // Fetch latest stats
    const stats = await api.getStats();
    
    // Update stat cards
    document.getElementById('requests-value').textContent = 
      formatNumber(stats.data.requests);
    document.getElementById('latency-value').textContent = 
      stats.data.latency + 'ms';
    document.getElementById('cost-value').textContent = 
      '$' + stats.data.costs.total;
    
    // Update charts
    await updateCharts();
    
    // Update services table
    await updateServicesTable();
    
    console.log('Dashboard updated:', new Date().toLocaleTimeString());
  } catch (error) {
    console.error('Update failed:', error);
  }
}

async function updateCharts() {
  const chartData = await api.getChartData(7);
  
  // Update request chart
  requestChart.data.labels = chartData.data.labels;
  requestChart.data.datasets[0].data = chartData.data.requests;
  requestChart.data.datasets[1].data = chartData.data.latency;
  requestChart.update();
}

async function updateServicesTable() {
  const services = await api.getServices();
  const tbody = document.getElementById('servicesTable');
  
  tbody.innerHTML = services.data.map(service => `
    <tr>
      <td style="font-weight: 600; color: var(--text-primary);">${service.name}</td>
      <td>${service.type}</td>
      <td>${formatNumber(service.requests)}</td>
      <td>${service.latency}ms</td>
      <td>
        <span class="status-badge ${service.status === 'healthy' ? 'success' : 'error'}">
          <span class="status-dot"></span>
          ${service.status === 'healthy' ? 'Healthy' : 'Error'}
        </span>
      </td>
      <td style="font-weight: 600; color: var(--text-primary);">$${service.cost}</td>
    </tr>
  `).join('');
}

// ============================================
// WEBSOCKET FOR REAL-TIME
// ============================================
function connectWebSocket() {
  const ws = new WebSocket('wss://iaccess-api.yourdomain.workers.dev/api/ws');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updateDashboardFromWebSocket(data);
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    // Retry connection
    setTimeout(connectWebSocket, 5000);
  };
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  // Initial load
  await updateDashboard();
  
  // Set up periodic updates (every 30 seconds)
  setInterval(updateDashboard, 30000);
  
  // Connect WebSocket for real-time updates
  connectWebSocket();
  
  // Set up filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      const days = {
        '24H': 1,
        '7D': 7,
        '30D': 30,
        '90D': 90
      }[e.target.textContent];
      
      await updateCharts(days);
    });
  });
});

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
</script>
```

---

## Live Data Binding

### Database Schema

Create analytics tables:

```sql
-- Analytics table
CREATE TABLE analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  service_name TEXT NOT NULL,
  request_count INTEGER DEFAULT 0,
  duration_ms REAL,
  status_code INTEGER,
  user_id TEXT,
  INDEX idx_timestamp (timestamp),
  INDEX idx_service (service_name)
);

-- AI Gateway analytics
CREATE TABLE ai_gateway_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  cache_hit BOOLEAN DEFAULT FALSE,
  latency_ms REAL,
  cost_usd REAL,
  tokens_used INTEGER,
  INDEX idx_timestamp (timestamp),
  INDEX idx_provider (provider)
);

-- Browser Rendering log
CREATE TABLE browser_rendering_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  endpoint TEXT NOT NULL,
  url TEXT,
  duration_ms REAL,
  success BOOLEAN DEFAULT TRUE,
  cost_usd REAL,
  INDEX idx_timestamp (timestamp)
);

-- Services metadata
CREATE TABLE services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Logging Worker

Create middleware to log all requests:

```typescript
// middleware/analytics.ts
export async function analyticsMiddleware(c: Context, next: Function) {
  const start = Date.now();
  
  await next();
  
  const duration = Date.now() - start;
  
  // Log to Analytics Engine
  c.env.ANALYTICS.writeDataPoint({
    blobs: [
      c.req.path,
      c.req.method,
      c.res.status.toString()
    ],
    doubles: [duration],
    indexes: [Date.now()]
  });
  
  // Also log to D1 for querying
  await c.env.DB.prepare(`
    INSERT INTO analytics (service_name, duration_ms, status_code)
    VALUES (?, ?, ?)
  `).bind('iaccess-api', duration, c.res.status).run();
}
```

---

## Authentication

### JWT-based Auth

```typescript
// auth.ts
import { sign, verify } from 'hono/jwt';

export async function authenticate(c: Context, next: Function) {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set('user', payload);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
}

// Login endpoint
app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  
  // Verify credentials (check against D1)
  const user = await c.env.DB.prepare(`
    SELECT * FROM users WHERE email = ? AND password_hash = ?
  `).bind(email, hashPassword(password)).first();
  
  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }
  
  // Generate JWT
  const token = await sign({
    sub: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  }, c.env.JWT_SECRET);
  
  return c.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});
```

### Frontend Auth

```javascript
// Add to dashboard
class Auth {
  constructor() {
    this.token = localStorage.getItem('iaccess_token');
  }
  
  async login(email, password) {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (data.success) {
      this.token = data.token;
      localStorage.setItem('iaccess_token', data.token);
      return data.user;
    }
    
    throw new Error('Login failed');
  }
  
  logout() {
    this.token = null;
    localStorage.removeItem('iaccess_token');
    window.location.href = '/login';
  }
  
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }
  
  isAuthenticated() {
    return !!this.token;
  }
}

const auth = new Auth();

// Check auth on page load
if (!auth.isAuthenticated() && !window.location.pathname.includes('login')) {
  window.location.href = '/login';
}
```

---

## Testing

### Test MCP Tools

```bash
# Ask Claude to test each tool
"Can you list all my Workers?"
"Show me the D1 databases"
"What R2 buckets do I have?"
"Query the analytics database for today's requests"
```

### Test API Endpoints

```bash
# Test stats endpoint
curl https://iaccess-api.yourdomain.workers.dev/api/stats

# Test AI Gateway stats
curl https://iaccess-api.yourdomain.workers.dev/api/ai-gateway/stats

# Test services list
curl https://iaccess-api.yourdomain.workers.dev/api/services
```

### Test Dashboard

```bash
# Serve locally
python3 -m http.server 8000

# Open in browser
open http://localhost:8000/iaccess-dashboard.html

# Check console for API calls
# Should see: "Dashboard updated: [time]" every 30 seconds
```

---

## Deployment Checklist

- [ ] Create D1 database with schema
- [ ] Deploy iaccess-api worker
- [ ] Set all secrets (API tokens, JWT secret)
- [ ] Configure CORS for dashboard domain
- [ ] Update API_BASE in dashboard HTML
- [ ] Test all API endpoints
- [ ] Verify WebSocket connection
- [ ] Enable authentication
- [ ] Set up monitoring/alerts
- [ ] Configure Stripe webhooks (IA account)
- [ ] Test end-to-end flow

---

## Troubleshooting

### Common Issues

**Issue**: API returns 401 Unauthorized
```bash
# Check API token
wrangler secret list

# Verify token has correct permissions
curl https://api.cloudflare.com/client/v4/user/tokens/verify \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Issue**: No data in charts
```bash
# Check if analytics table has data
wrangler d1 execute iaccess-analytics \
  --command="SELECT COUNT(*) FROM analytics"

# If empty, verify logging middleware is active
```

**Issue**: WebSocket won't connect
```bash
# Check worker logs
wrangler tail iaccess-api

# Verify WebSocket upgrade header
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
  https://iaccess-api.yourdomain.workers.dev/api/ws
```

---

## Next Steps

1. **Enable MCP Tools**: Ask Claude to interact with your infrastructure
2. **Deploy API Worker**: `wrangler deploy`
3. **Update Dashboard**: Add API client code
4. **Test Integration**: Verify live data flows
5. **Enable Auth**: Add login page and JWT
6. **Monitor**: Set up error tracking and alerts

---

## Support

For integration help:
- 📧 support@iautodidact.com
- 💬 [Discord Community]
- 📚 [Full Documentation]

---

**Ready to go live? Let's connect your data! 🚀**
