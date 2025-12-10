import { renderBaseLayout } from './base-layout';

export function renderZonesPage(zones: any[] = []): string {
  const content = `
<header class="page-header">
  <div class="page-header-top">
    <div>
      <h1 class="page-title">Cloudflare Zones</h1>
      <p class="page-subtitle">Manage DNS, SSL, and routing for all your domains</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Zone
      </button>
    </div>
  </div>
</header>

<div class="tabs">
  <a href="/zones" class="tab active">All Zones</a>
  <a href="/zones?status=active" class="tab">Active</a>
  <a href="/zones?plan=pro" class="tab">Pro Plans</a>
</div>

<div style="display: grid; gap: var(--space-4);" id="zones-grid">
  ${zones.length > 0 ? zones.map((zone: any) => `
    <article class="card" style="cursor: pointer;" onclick="window.location.href='/zones/${zone.zoneId}'">
      <div style="display: flex; align-items: flex-start; gap: var(--space-4); margin-bottom: var(--space-4);">
        <div style="width: 52px; height: 52px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--primary-subtle), var(--bg-elevated)); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; color: var(--primary); flex-shrink: 0;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </div>
        <div style="flex: 1; min-width: 0;">
          <h3 style="font-size: 1.0625rem; font-weight: 700; color: var(--text-primary); margin-bottom: var(--space-1); letter-spacing: -0.01em; line-height: 1.3;">${zone.zoneName}</h3>
          <div style="font-size: 0.875rem; color: var(--text-tertiary); font-weight: 500; font-family: 'JetBrains Mono', monospace;">${zone.plan} � ${zone.status}</div>
        </div>
        <div style="color: var(--text-tertiary); transition: all var(--transition-base); flex-shrink: 0;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>
      </div>
      <footer style="display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-4); border-top: 1px solid var(--border-subtle);">
        <div style="padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; text-transform: capitalize; letter-spacing: 0.02em; display: inline-flex; align-items: center; gap: var(--space-2); background: ${zone.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'}; color: ${zone.status === 'active' ? 'var(--success)' : 'var(--warning)'};">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: pulse 2s infinite;"></span>
          ${zone.status}
        </div>
        <div style="font-size: 0.875rem; color: var(--text-tertiary); font-weight: 500;">Zone ID: ${zone.zoneId.substring(0, 8)}...</div>
      </footer>
    </article>
  `).join('') : `
    <div class="card" style="text-align: center; padding: var(--space-8);">
      <div style="font-size: 3rem; margin-bottom: var(--space-4); opacity: 0.5;">??</div>
      <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-2);">No zones found</h3>
      <p style="color: var(--text-secondary); margin-bottom: var(--space-4);">Click "Add Zone" to get started</p>
      <button class="btn btn-primary">Add Your First Zone</button>
    </div>
  `}
</div>

<script>
async function loadZones() {
  try {
    const response = await fetch('/api/zones');
    const data = await response.json();
    if (data.zones && data.zones.length > 0) {
      // Zones loaded, page will refresh with data
      window.location.reload();
    }
  } catch (error) {
    console.error('Failed to load zones:', error);
  }
}
loadZones();
</script>
`;

  return renderBaseLayout('Zones', content, 'zones');
}
