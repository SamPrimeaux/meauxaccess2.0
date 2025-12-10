import { MEAUXSTACK_STYLES } from '../ui/meauxstack-style';

export function renderBaseLayout(title: string, content: string, activePage: string = 'home'): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="light">
  <meta name="theme-color" content="#FFFFFF">
  <title>${title} | InnerAnimalMedia MCP</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>${MEAUXSTACK_STYLES}</style>
</head>
<body>
  <div class="app-backdrop"></div>
  
  <div class="app-container">
    ${renderSidebar(activePage)}
    
    <main class="main-content">
      ${renderTopHeader()}
      
      <div class="page-content">
        <div class="content-wrapper">
          ${content}
        </div>
      </div>
    </main>
  </div>

  <script>
    // Haptic feedback
    if ('vibrate' in navigator) {
      document.querySelectorAll('.nav-item, .btn, .card, .tab, .header-btn, .user-card').forEach(el => {
        el.addEventListener('click', () => navigator.vibrate(10));
      });
    }
  </script>
</body>
</html>`;
}

function renderSidebar(activePage: string): string {
  const isActive = (page: string) => activePage === page ? 'active' : '';

  return `
<aside class="sidebar">
  <div class="sidebar-header">
    <a href="/" class="brand">
      <div class="brand-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="brand-text">
        <div class="brand-name">MeauxStack</div>
        <div class="brand-subtitle">MCP Platform</div>
      </div>
    </a>
  </div>

  <div class="sidebar-content">
    <nav class="nav-section">
      <div class="nav-section-header">
        <span class="nav-section-title">Platform</span>
        <div class="nav-section-line"></div>
      </div>
      <a href="/" class="nav-item ${isActive('home')}">
        <div class="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1.5"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5"/>
          </svg>
        </div>
        <span>Workspace</span>
      </a>
      <a href="/analytics" class="nav-item ${isActive('analytics')}">
        <div class="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        </div>
        <span>Analytics</span>
      </a>
      <a href="/projects" class="nav-item ${isActive('projects')}">
        <div class="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <span>Projects</span>
        <div class="nav-badge">5</div>
      </a>
      <a href="/projects-25" class="nav-item ${isActive('projects-25')}">
        <div class="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <span>Last 25 Workers</span>
        <div class="nav-badge">25</div>
      </a>
    </nav>

    <nav class="nav-section">
      <div class="nav-section-header">
        <span class="nav-section-title">Resources</span>
        <div class="nav-section-line"></div>
      </div>
      <a href="/zones" class="nav-item ${isActive('zones')}">
        <div class="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </div>
        <span>Zones</span>
      </a>
      <a href="/workers" class="nav-item ${isActive('workers')}">
        <div class="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <span>Workers</span>
      </a>
      <a href="/storage" class="nav-item ${isActive('storage')}">
        <div class="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </div>
        <span>Storage</span>
      </a>
    </nav>

    <nav class="nav-section">
      <div class="nav-section-header">
        <span class="nav-section-title">Tools</span>
        <div class="nav-section-line"></div>
      </div>
      <a href="/api-docs" class="nav-item ${isActive('api-docs')}">
        <div class="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
        </div>
        <span>API Docs</span>
      </a>
      <a href="/settings" class="nav-item ${isActive('settings')}">
        <div class="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </div>
        <span>Settings</span>
      </a>
    </nav>
  </div>

  <div class="sidebar-footer">
      <div class="user-card" onclick="handleLogout()">
        <div class="user-avatar">SP</div>
        <div class="user-info">
          <div class="user-name">Sam Primeaux</div>
          <div class="user-role">Platform Admin</div>
        </div>
        <div class="user-dropdown">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
      <script>
        function handleLogout() {
          sessionStorage.removeItem('mcp_authenticated');
          sessionStorage.removeItem('mcp_user');
          document.cookie = 'mcp_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          window.location.href = '/login';
        }
      </script>
  </div>
</aside>
`;
}

function renderTopHeader(): string {
  return `
<header class="top-header">
  <div class="search-wrapper">
    <div class="search-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
    </div>
    <input type="text" class="search-input" placeholder="Search projects, zones, workers...">
  </div>
  <div class="header-actions">
    <button class="header-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      <span class="notification-badge">3</span>
    </button>
    <button class="header-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
    <button class="header-btn active">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6"/>
      </svg>
    </button>
    <div class="user-avatar">SP</div>
  </div>
</header>
`;
}
