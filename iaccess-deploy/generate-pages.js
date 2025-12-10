// Page Generator for iAccess SaaS Platform
// Generates all 13 pages from template

const fs = require('fs');
const path = require('path');

const pages = [
  {
    file: 'analytics.html',
    title: 'Analytics',
    route: '/analytics',
    activeNav: 'analytics',
    content: 'analytics-content'
  },
  {
    file: 'workers.html',
    title: 'Workers',
    route: '/workers',
    activeNav: 'workers',
    content: 'workers-content'
  },
  {
    file: 'databases.html',
    title: 'D1 Databases',
    route: '/databases',
    activeNav: 'databases',
    content: 'databases-content'
  },
  {
    file: 'storage.html',
    title: 'R2 Storage',
    route: '/storage',
    activeNav: 'storage',
    content: 'storage-content'
  },
  {
    file: 'kv.html',
    title: 'KV Namespaces',
    route: '/kv',
    activeNav: 'kv',
    content: 'kv-content'
  },
  {
    file: 'vectorize.html',
    title: 'Vectorize',
    route: '/vectorize',
    activeNav: 'vectorize',
    content: 'vectorize-content'
  },
  {
    file: 'workflows.html',
    title: 'Workflows',
    route: '/workflows',
    activeNav: 'workflows',
    content: 'workflows-content'
  },
  {
    file: 'queues.html',
    title: 'Queues',
    route: '/queues',
    activeNav: 'queues',
    content: 'queues-content'
  },
  {
    file: 'email.html',
    title: 'Email Routing',
    route: '/email',
    activeNav: 'email',
    content: 'email-content'
  },
  {
    file: 'integrations.html',
    title: 'Integrations',
    route: '/integrations',
    activeNav: 'integrations',
    content: 'integrations-content'
  },
  {
    file: 'settings.html',
    title: 'Settings',
    route: '/settings',
    activeNav: 'settings',
    content: 'settings-content'
  }
];

// Read the base dashboard HTML
const baseHtml = fs.readFileSync(path.join(__dirname, 'index-updated.html'), 'utf8');

// Generate each page
pages.forEach(page => {
  let html = baseHtml;

  // Update title
  html = html.replace(/<title>.*?<\/title>/, `<title>iAccess - ${page.title}</title>`);

  // Update active nav item
  html = html.replace(/nav-item active/g, 'nav-item');
  html = html.replace(
    new RegExp(`<span>${page.title.replace('D1 ', '').replace('R2 ', '')}<\/span>`, 'i'),
    `<span>${page.title.replace('D1 ', '').replace('R2 ', '')}</span>`
  );

  // Add navigation click handlers
  const navScript = `
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        // Set active nav
        document.querySelectorAll('.nav-item').forEach(item => {
          if (item.textContent.includes('${page.title.replace('D1 ', '').replace('R2 ', '')}')) {
            item.classList.add('active');
          }
        });
        
        // Add click handlers
        document.querySelectorAll('.nav-item').forEach(item => {
          item.addEventListener('click', (e) => {
            const text = e.currentTarget.textContent.trim();
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
              'D1 Databases': '/databases',
              'R2 Storage': '/storage',
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

  // Insert page-specific content placeholder
  html = html.replace(
    /<!-- Page Content -->[\s\S]*?<div class="content-wrapper">/,
    `<!-- Page Content -->\n      <div class="page-content">\n        <div class="content-wrapper">\n          <div class="page-header">\n            <div class="page-header-left">\n              <h1>${page.title}</h1>\n              <p>Manage and monitor your ${page.title.toLowerCase()} resources</p>\n            </div>\n          </div>\n          <div id="${page.content}">Loading...</div>`
  );

  // Add page-specific script
  html = html.replace('</body>', navScript + '</body>');

  // Write file
  fs.writeFileSync(path.join(__dirname, page.file), html);
  console.log(`✅ Generated ${page.file}`);
});

console.log(`\n✅ Generated ${pages.length} pages!`);
