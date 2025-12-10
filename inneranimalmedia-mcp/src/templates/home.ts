import { renderBaseLayout } from './base-layout';

export function renderHomePage(env: any): string {
  const content = `
<header class="page-header">
  <div class="page-header-top">
    <div>
      <h1 class="page-title">MCP Workspace</h1>
      <p class="page-subtitle">Manage your Cloudflare infrastructure with Model Context Protocol</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-secondary" onclick="window.location.href='/settings'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        Configure
      </button>
      <button class="btn btn-primary" onclick="window.location.href='/projects'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Deployment
      </button>
    </div>
  </div>
</header>

<div class="tabs">
  <a href="/" class="tab active">Overview</a>
  <a href="/projects" class="tab">Projects</a>
  <a href="/zones" class="tab">Zones</a>
  <a href="/workers" class="tab">Workers</a>
</div>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-6); margin-bottom: var(--space-8);">
  <div class="card">
    <div style="display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-4);">
      <div style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--primary-subtle), var(--bg-elevated)); display: flex; align-items: center; justify-content: center; color: var(--primary);">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
      </div>
      <div style="flex: 1;">
        <div style="font-size: 0.875rem; color: var(--text-tertiary); margin-bottom: 4px;">Total Zones</div>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);" id="zones-count">Loading...</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div style="display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-4);">
      <div style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--accent-light), var(--bg-elevated)); display: flex; align-items: center; justify-content: center; color: var(--accent);">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      </div>
      <div style="flex: 1;">
        <div style="font-size: 0.875rem; color: var(--text-tertiary); margin-bottom: 4px;">Active Workers</div>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);" id="workers-count">Loading...</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div style="display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-4);">
      <div style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), var(--bg-elevated)); display: flex; align-items: center; justify-content: center; color: var(--success);">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      </div>
      <div style="flex: 1;">
        <div style="font-size: 0.875rem; color: var(--text-tertiary); margin-bottom: 4px;">API Requests</div>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);" id="requests-count">Loading...</div>
      </div>
    </div>
  </div>
</div>

    <div style="margin-bottom: var(--space-6); padding: var(--space-5); background: linear-gradient(135deg, var(--primary-subtle), var(--bg-elevated)); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
      <div style="display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-4);">
        <div style="width: 56px; height: 56px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--primary), var(--accent)); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3); flex-shrink: 0;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </div>
        <div style="flex: 1;">
          <div style="font-size: 1.125rem; font-weight: 700; margin-bottom: var(--space-1); color: var(--text-primary);">Connected to Inner Animal Media</div>
          <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: var(--space-3);">
            Your MCP platform is connected to <a href="https://inner-animal-media.pages.dev/" target="_blank" style="color: var(--primary); font-weight: 600; text-decoration: none;">Inner Animal Media</a> creative agency.
          </div>
          <a href="/projects-25" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: var(--space-2);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            View Last 25 Workers
          </a>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom: var(--space-6);">
      <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-4);">Quick Start</h2>
      <div style="display: grid; gap: var(--space-4);">
        <div style="padding: var(--space-4); background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="display: flex; align-items: start; gap: var(--space-3);">
            <div style="width: 32px; height: 32px; border-radius: var(--radius-md); background: var(--primary-subtle); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; flex-shrink: 0;">1</div>
            <div style="flex: 1;">
              <div style="font-weight: 600; margin-bottom: var(--space-1);">Connect to Claude Desktop</div>
              <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">
                Add this MCP server to your Claude Desktop configuration to manage Cloudflare via conversation.
                <a href="/api-docs" style="color: var(--primary); text-decoration: underline; margin-left: 4px;">View setup guide →</a>
              </div>
            </div>
          </div>
        </div>
    <div style="padding: var(--space-4); background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
      <div style="display: flex; align-items: start; gap: var(--space-3);">
        <div style="width: 32px; height: 32px; border-radius: var(--radius-md); background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; flex-shrink: 0;">2</div>
        <div style="flex: 1;">
          <div style="font-weight: 600; margin-bottom: var(--space-1);">Use MCP Tools</div>
          <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">
            Ask Claude to list zones, deploy workers, or manage your infrastructure using natural language.
            <a href="/api-docs" style="color: var(--primary); text-decoration: underline; margin-left: 4px;">See all tools ?</a>
          </div>
        </div>
      </div>
    </div>
    <div style="padding: var(--space-4); background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
      <div style="display: flex; align-items: start; gap: var(--space-3);">
        <div style="width: 32px; height: 32px; border-radius: var(--radius-md); background: rgba(16, 185, 129, 0.1); color: var(--success); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; flex-shrink: 0;">3</div>
        <div style="flex: 1;">
          <div style="font-weight: 600; margin-bottom: var(--space-1);">Monitor & Deploy</div>
          <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">
            View analytics, manage projects, and deploy new workers directly from the dashboard.
            <a href="/analytics" style="color: var(--primary); text-decoration: underline; margin-left: 4px;">View analytics ?</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="card">
  <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-4);">Available MCP Tools</h2>
  <div style="display: grid; gap: var(--space-3);">
    <div style="padding: var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-md); border-left: 3px solid var(--primary);">
      <div style="font-weight: 600; margin-bottom: var(--space-1);">list_all_zones</div>
      <div style="font-size: 0.875rem; color: var(--text-secondary);">List all zones in your Cloudflare account</div>
    </div>
    <div style="padding: var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-md); border-left: 3px solid var(--accent);">
      <div style="font-weight: 600; margin-bottom: var(--space-1);">deploy_worker_to_zone</div>
      <div style="font-size: 0.875rem; color: var(--text-secondary);">Deploy a Cloudflare Worker to a specific zone</div>
    </div>
    <div style="padding: var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-md); border-left: 3px solid var(--success);">
      <div style="font-weight: 600; margin-bottom: var(--space-1);">list_all_workers</div>
      <div style="font-size: 0.875rem; color: var(--text-secondary);">List all workers across all zones</div>
    </div>
    <div style="padding: var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-md); border-left: 3px solid var(--info);">
      <div style="font-weight: 600; margin-bottom: var(--space-1);">get_zone_analytics</div>
      <div style="font-size: 0.875rem; color: var(--text-secondary);">Get analytics for a specific zone</div>
    </div>
    <div style="padding: var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-md); border-left: 3px solid var(--warning);">
      <div style="font-weight: 600; margin-bottom: var(--space-1);">create_zone_route</div>
      <div style="font-size: 0.875rem; color: var(--text-secondary);">Create a route for a worker in a zone</div>
    </div>
  </div>
  <div style="margin-top: var(--space-4);">
    <a href="/api-docs" class="btn btn-secondary" style="width: 100%; justify-content: center;">
      View All Tools Documentation
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </a>
  </div>
</div>

<script>
async function loadStats() {
  try {
    const response = await fetch('/api/stats');
    const data = await response.json();
    document.getElementById('zones-count').textContent = data.zones || '0';
    document.getElementById('workers-count').textContent = data.workers || '0';
    document.getElementById('requests-count').textContent = data.requests || '0';
  } catch (error) {
    console.error('Failed to load stats:', error);
    document.getElementById('zones-count').textContent = 'Error';
    document.getElementById('workers-count').textContent = 'Error';
    document.getElementById('requests-count').textContent = 'Error';
  }
}
loadStats();
</script>
`;

  return renderBaseLayout('MCP Workspace', content, 'home');
}
