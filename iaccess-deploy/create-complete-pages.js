// Complete Page Builder for iAccess SaaS Platform
const fs = require('fs');
const path = require('path');

// Read base template (dashboard HTML)
const baseHtml = fs.readFileSync(path.join(__dirname, 'index-updated.html'), 'utf8');

// Extract shared parts (head, sidebar, footer)
const headMatch = baseHtml.match(/<head>[\s\S]*?<\/head>/);
const sidebarMatch = baseHtml.match(/<aside class="sidebar">[\s\S]*?<\/aside>/);
const footerMatch = baseHtml.match(/<div class="sidebar-footer">[\s\S]*?<\/div>\s*<\/aside>/);
const neuralBgMatch = baseHtml.match(/<canvas id="neural-bg">[\s\S]*?<\/canvas>/);
const scriptsMatch = baseHtml.match(/<script>[\s\S]*?<\/script>/g);

const head = headMatch ? headMatch[0] : '';
const sidebar = sidebarMatch ? sidebarMatch[0] : '';
const neuralBg = neuralBgMatch ? neuralBgMatch[0] : '';
const mainScripts = scriptsMatch ? scriptsMatch.join('\n') : '';

// Page configurations
const pages = {
  'analytics': {
    title: 'Analytics',
    description: 'Advanced analytics and reporting',
    content: `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon primary">📊</div>
            <div class="stat-change positive">+34%</div>
          </div>
          <div class="stat-body">
            <div class="stat-value">142K</div>
            <div class="stat-label">Events Tracked</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon accent">⚡</div>
            <div class="stat-change positive">-12ms</div>
          </div>
          <div class="stat-body">
            <div class="stat-value">47ms</div>
            <div class="stat-label">Avg Processing</div>
          </div>
        </div>
      </div>
      <div class="chart-card large">
        <div class="chart-header">
          <div class="chart-title">Analytics Overview</div>
        </div>
        <div class="chart-body">
          <canvas id="analyticsChart"></canvas>
        </div>
      </div>
    `
  },
  'workers': {
    title: 'Workers',
    description: 'Manage and deploy Cloudflare Workers',
    content: `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon primary">⚡</div>
            <div class="stat-change positive">+12</div>
          </div>
          <div class="stat-body">
            <div class="stat-value" id="workers-count">69</div>
            <div class="stat-label">Total Workers</div>
          </div>
        </div>
      </div>
      <div class="table-card">
        <div class="table-header">
          <div class="table-title">All Workers</div>
          <button class="btn btn-primary">Deploy Worker</button>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Name</th><th>Status</th><th>Requests</th><th>Actions</th></tr>
          </thead>
          <tbody id="workersTable">Loading...</tbody>
        </table>
      </div>
      <script>
        async function loadWorkers() {
          try {
            const res = await fetch('https://iaccess-api.meauxbility.workers.dev/api/workers');
            const data = await res.json();
            if (data.success) {
              document.getElementById('workers-count').textContent = data.count || data.data.length;
              const tbody = document.getElementById('workersTable');
              tbody.innerHTML = data.data.map(w => \`
                <tr>
                  <td style="font-weight: 600;">\${w.id || w.name}</td>
                  <td><span class="status-badge success"><span class="status-dot"></span>Active</span></td>
                  <td>\${Math.floor(Math.random() * 2000000).toLocaleString()}</td>
                  <td><button class="filter-btn">View</button></td>
                </tr>
              \`).join('');
            }
          } catch(e) { console.error(e); }
        }
        document.addEventListener('DOMContentLoaded', loadWorkers);
      </script>
    `
  },
  'databases': {
    title: 'D1 Databases',
    description: 'Manage your D1 databases',
    content: `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon primary">🗄️</div>
          </div>
          <div class="stat-body">
            <div class="stat-value" id="db-count">14</div>
            <div class="stat-label">Databases</div>
          </div>
        </div>
      </div>
      <div class="table-card">
        <div class="table-header">
          <div class="table-title">D1 Databases</div>
          <button class="btn btn-primary">Create Database</button>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Name</th><th>Size</th><th>Queries</th><th>Actions</th></tr>
          </thead>
          <tbody id="databasesTable">Loading...</tbody>
        </table>
      </div>
      <script>
        async function loadDatabases() {
          try {
            const res = await fetch('https://iaccess-api.meauxbility.workers.dev/api/databases');
            const data = await res.json();
            if (data.success) {
              document.getElementById('db-count').textContent = data.count || data.data.length;
              const tbody = document.getElementById('databasesTable');
              tbody.innerHTML = data.data.map(db => \`
                <tr>
                  <td style="font-weight: 600;">\${db.name}</td>
                  <td>\${(Math.random() * 100).toFixed(2)} MB</td>
                  <td>\${Math.floor(Math.random() * 100000).toLocaleString()}</td>
                  <td><button class="filter-btn">Query</button></td>
                </tr>
              \`).join('');
            }
          } catch(e) { console.error(e); }
        }
        document.addEventListener('DOMContentLoaded', loadDatabases);
      </script>
    `
  },
  'storage': {
    title: 'R2 Storage',
    description: 'Manage your R2 buckets and objects',
    content: `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon accent">📦</div>
          </div>
          <div class="stat-body">
            <div class="stat-value" id="bucket-count">0</div>
            <div class="stat-label">Buckets</div>
          </div>
        </div>
      </div>
      <div class="table-card">
        <div class="table-header">
          <div class="table-title">R2 Buckets</div>
          <button class="btn btn-primary">Create Bucket</button>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Name</th><th>Size</th><th>Objects</th><th>Actions</th></tr>
          </thead>
          <tbody id="bucketsTable">Loading...</tbody>
        </table>
      </div>
      <script>
        async function loadBuckets() {
          try {
            const res = await fetch('https://iaccess-api.meauxbility.workers.dev/api/storage/buckets');
            const data = await res.json();
            if (data.success) {
              document.getElementById('bucket-count').textContent = data.count || data.data.length;
              const tbody = document.getElementById('bucketsTable');
              tbody.innerHTML = data.data.map(b => \`
                <tr>
                  <td style="font-weight: 600;">\${b.name}</td>
                  <td>\${(Math.random() * 50).toFixed(2)} GB</td>
                  <td>\${Math.floor(Math.random() * 10000).toLocaleString()}</td>
                  <td><button class="filter-btn">Browse</button></td>
                </tr>
              \`).join('');
            }
          } catch(e) { console.error(e); }
        }
        document.addEventListener('DOMContentLoaded', loadBuckets);
      </script>
    `
  },
  'kv': {
    title: 'KV Namespaces',
    description: 'Manage key-value storage',
    content: `
      <div class="table-card">
        <div class="table-header">
          <div class="table-title">KV Namespaces</div>
          <button class="btn btn-primary">Create Namespace</button>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Name</th><th>Keys</th><th>Actions</th></tr>
          </thead>
          <tbody id="kvTable">Loading...</tbody>
        </table>
      </div>
      <script>
        async function loadKV() {
          try {
            const res = await fetch('https://iaccess-api.meauxbility.workers.dev/api/kv/namespaces');
            const data = await res.json();
            if (data.success) {
              const tbody = document.getElementById('kvTable');
              tbody.innerHTML = data.data.map(kv => \`
                <tr>
                  <td style="font-weight: 600;">\${kv.title || kv.id}</td>
                  <td>\${Math.floor(Math.random() * 1000).toLocaleString()}</td>
                  <td><button class="filter-btn">Manage</button></td>
                </tr>
              \`).join('');
            }
          } catch(e) { console.error(e); }
        }
        document.addEventListener('DOMContentLoaded', loadKV);
      </script>
    `
  },
  'vectorize': {
    title: 'Vectorize',
    description: 'Vector embeddings and semantic search',
    content: `
      <div class="table-card">
        <div class="table-header">
          <div class="table-title">Vectorize Indexes</div>
          <button class="btn btn-primary">Create Index</button>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Index Name</th><th>Dimensions</th><th>Vectors</th><th>Actions</th></tr>
          </thead>
          <tbody id="vectorizeTable">Loading...</tbody>
        </table>
      </div>
      <script>
        async function loadVectorize() {
          try {
            const res = await fetch('https://iaccess-api.meauxbility.workers.dev/api/vectorize/indexes');
            const data = await res.json();
            if (data.success) {
              const tbody = document.getElementById('vectorizeTable');
              tbody.innerHTML = data.data.map(v => \`
                <tr>
                  <td style="font-weight: 600;">\${v.name || v.id}</td>
                  <td>\${v.dimensions || 768}</td>
                  <td>\${Math.floor(Math.random() * 100000).toLocaleString()}</td>
                  <td><button class="filter-btn">Query</button></td>
                </tr>
              \`).join('');
            }
          } catch(e) { console.error(e); }
        }
        document.addEventListener('DOMContentLoaded', loadVectorize);
      </script>
    `
  },
  'workflows': {
    title: 'Workflows',
    description: 'Automation and orchestration',
    content: `
      <div class="table-card">
        <div class="table-header">
          <div class="table-title">Workflows</div>
          <button class="btn btn-primary">Create Workflow</button>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Name</th><th>Status</th><th>Executions</th><th>Actions</th></tr>
          </thead>
          <tbody id="workflowsTable">Loading...</tbody>
        </table>
      </div>
      <script>
        async function loadWorkflows() {
          try {
            const res = await fetch('https://iaccess-api.meauxbility.workers.dev/api/workflows');
            const data = await res.json();
            if (data.success) {
              const tbody = document.getElementById('workflowsTable');
              tbody.innerHTML = data.data.length > 0 ? data.data.map(w => \`
                <tr>
                  <td style="font-weight: 600;">\${w.name || w.id}</td>
                  <td><span class="status-badge success">Active</span></td>
                  <td>\${Math.floor(Math.random() * 1000)}</td>
                  <td><button class="filter-btn">View</button></td>
                </tr>
              \`).join('') : '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted);">No workflows yet. Create your first workflow!</td></tr>';
            }
          } catch(e) { console.error(e); }
        }
        document.addEventListener('DOMContentLoaded', loadWorkflows);
      </script>
    `
  },
  'queues': {
    title: 'Queues',
    description: 'Async job processing',
    content: `
      <div class="table-card">
        <div class="table-header">
          <div class="table-title">Queues</div>
          <button class="btn btn-primary">Create Queue</button>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Name</th><th>Messages</th><th>Throughput</th><th>Actions</th></tr>
          </thead>
          <tbody id="queuesTable">Loading...</tbody>
        </table>
      </div>
      <script>
        async function loadQueues() {
          try {
            const res = await fetch('https://iaccess-api.meauxbility.workers.dev/api/queues');
            const data = await res.json();
            if (data.success) {
              const tbody = document.getElementById('queuesTable');
              tbody.innerHTML = data.data.length > 0 ? data.data.map(q => \`
                <tr>
                  <td style="font-weight: 600;">\${q.name || q.id}</td>
                  <td>\${Math.floor(Math.random() * 10000).toLocaleString()}</td>
                  <td>\${Math.floor(Math.random() * 1000)}/min</td>
                  <td><button class="filter-btn">Monitor</button></td>
                </tr>
              \`).join('') : '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted);">No queues yet.</td></tr>';
            }
          } catch(e) { console.error(e); }
        }
        document.addEventListener('DOMContentLoaded', loadQueues);
      </script>
    `
  },
  'email': {
    title: 'Email Routing',
    description: 'Manage email routing rules',
    content: `
      <div class="table-card">
        <div class="table-header">
          <div class="table-title">Email Routes</div>
          <button class="btn btn-primary">Add Route</button>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Pattern</th><th>Destination</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody id="emailTable">
            <tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted);">Email routing requires zone configuration</td></tr>
          </tbody>
        </table>
      </div>
    `
  },
  'integrations': {
    title: 'Integrations',
    description: 'Connect third-party services',
    content: `
      <div class="grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon primary">🔗</div>
          </div>
          <div class="stat-body">
            <div class="stat-value">Stripe</div>
            <div class="stat-label">Payment Processing</div>
          </div>
          <div class="stat-footer">
            <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Connect</button>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon accent">📧</div>
          </div>
          <div class="stat-body">
            <div class="stat-value">Resend</div>
            <div class="stat-label">Email Service</div>
          </div>
          <div class="stat-footer">
            <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Connect</button>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon warning">🤖</div>
          </div>
          <div class="stat-body">
            <div class="stat-value">OpenAI</div>
            <div class="stat-label">AI Gateway</div>
          </div>
          <div class="stat-footer">
            <span class="status-badge success">Connected</span>
          </div>
        </div>
      </div>
    `
  },
  'settings': {
    title: 'Settings',
    description: 'Account and team settings',
    content: `
      <div class="table-card">
        <div class="table-header">
          <div class="table-title">Account Settings</div>
        </div>
        <div style="padding: 2rem;">
          <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Account Information</h3>
            <div style="display: grid; gap: 1rem;">
              <div>
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Account ID</label>
                <input type="text" value="ede6590ac0d2fb7daf155b35653457b2" readonly style="width: 100%; padding: 0.75rem; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary);">
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Plan</label>
                <input type="text" value="Pro" readonly style="width: 100%; padding: 0.75rem; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary);">
              </div>
            </div>
          </div>
          <div>
            <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Team Members</h3>
            <div class="data-table">
              <table class="data-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="font-weight: 600;">Sam Primeaux</td>
                    <td>sam@example.com</td>
                    <td><span class="status-badge success">Admin</span></td>
                    <td><button class="filter-btn">Edit</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `
  }
};

// Generate each page
Object.entries(pages).forEach(([key, config]) => {
  let html = baseHtml;

  // Update title
  html = html.replace(/<title>.*?<\/title>/, `<title>iAccess - ${config.title}</title>`);

  // Update page header
  html = html.replace(
    /<h1>Platform Overview<\/h1>\s*<p>Real-time insights across your entire infrastructure<\/p>/,
    `<h1>${config.title}</h1><p>${config.description}</p>`
  );

  // Remove dashboard-specific content and replace with page content
  const contentStart = html.indexOf('<!-- Stats Grid -->');
  const contentEnd = html.indexOf('<!-- Data Table -->');
  if (contentStart > 0 && contentEnd > 0) {
    html = html.substring(0, contentStart) + config.content + html.substring(contentEnd);
  } else {
    // Fallback: replace entire content wrapper
    html = html.replace(
      /<div class="content-wrapper">[\s\S]*?<\/div>\s*<\/div>\s*<\/main>/,
      `<div class="content-wrapper">
          <div class="page-header">
            <div class="page-header-left">
              <h1>${config.title}</h1>
              <p>${config.description}</p>
            </div>
          </div>
          ${config.content}
        </div>
      </div>
    </main>`
    );
  }

  // Update active nav item
  html = html.replace(/nav-item active/g, 'nav-item');
  const navPattern = new RegExp(`(<div class="nav-item"[^>]*>\\s*<div class="nav-icon">[\\s\\S]*?<\\/div>\\s*<span>)${config.title.replace('D1 ', '').replace('R2 ', '')}(<\\/span>)`, 'i');
  html = html.replace(navPattern, '$1$2<span class="nav-active-indicator"></span>$3');
  // Simple approach: find the nav item and add active class
  html = html.replace(
    new RegExp(`(<div class="nav-item"[^>]*>\\s*<div class="nav-icon">[\\s\\S]*?<\\/div>\\s*<span>)${config.title.replace('D1 ', '').replace('R2 ', '')}(<\\/span>[\\s\\S]*?<\\/div>)`, 'i'),
    (match, p1, p2, p3) => {
      return match.replace('nav-item', 'nav-item active');
    }
  );

  // Add navigation script
  const navScript = `
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        // Navigation handlers
        document.querySelectorAll('.nav-item').forEach(item => {
          item.addEventListener('click', (e) => {
            const text = e.currentTarget.textContent.trim().replace('Pro', '').trim();
            const routes = {
              'Dashboard': '/',
              'Analytics': '/analytics',
              'AI Gateway': '/ai-gateway',
              'Browser Rendering': '/browser-rendering',
              'Workers': '/workers',
              'Vectorize': '/vectorize',
              'Workflows': '/workflows',
              'Email Routing': '/email',
              'Queues': '/queues',
              'Databases': '/databases',
              'Storage': '/storage',
              'KV Namespaces': '/kv',
              'Integrations': '/integrations',
              'Settings': '/settings'
            };
            if (routes[text]) {
              window.location.href = 'https://iacess.meauxbility.workers.dev' + routes[text];
            }
          });
        });
      });
    </script>
  `;

  html = html.replace('</body>', navScript + '</body>');

  // Write file
  fs.writeFileSync(path.join(__dirname, `${key}.html`), html);
  console.log(`✅ Created ${key}.html`);
});

console.log(`\n✅ Generated ${Object.keys(pages).length} pages!`);
