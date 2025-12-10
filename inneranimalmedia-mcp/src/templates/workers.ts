import { renderBaseLayout } from './base-layout';

export function renderWorkersPage(workers: any[] = []): string {
  const content = `
<header class="page-header">
  <div class="page-header-top">
    <div>
      <h1 class="page-title">Cloudflare Workers</h1>
      <p class="page-subtitle">Serverless functions deployed across the edge network</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Deploy Worker
      </button>
    </div>
  </div>
</header>

<div class="tabs">
  <a href="/workers" class="tab active">All Workers</a>
  <a href="/workers?status=active" class="tab">Active</a>
  <a href="/workers?type=production" class="tab">Production</a>
</div>

<div style="display: grid; gap: var(--space-4);" id="workers-grid">
  ${workers.length > 0 ? workers.map((worker: any) => `
    <article class="card" style="cursor: pointer;" onclick="window.location.href='/workers/${worker.id}'">
      <div style="display: flex; align-items: flex-start; gap: var(--space-4); margin-bottom: var(--space-4);">
        <div style="width: 52px; height: 52px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--accent-light), var(--bg-elevated)); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <div style="flex: 1; min-width: 0;">
          <h3 style="font-size: 1.0625rem; font-weight: 700; color: var(--text-primary); margin-bottom: var(--space-1); letter-spacing: -0.01em; line-height: 1.3;">${worker.id || worker.name || 'Unnamed Worker'}</h3>
          <div style="font-size: 0.875rem; color: var(--text-tertiary); font-weight: 500; font-family: 'JetBrains Mono', monospace;">${worker.created_on ? new Date(worker.created_on).toLocaleDateString() : 'Unknown date'}</div>
        </div>
        <div style="color: var(--text-tertiary); transition: all var(--transition-base); flex-shrink: 0;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>
      </div>
      <footer style="display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-4); border-top: 1px solid var(--border-subtle);">
        <div style="padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; text-transform: capitalize; letter-spacing: 0.02em; display: inline-flex; align-items: center; gap: var(--space-2); background: rgba(16, 185, 129, 0.1); color: var(--success);">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: pulse 2s infinite;"></span>
          Active
        </div>
        <div style="font-size: 0.875rem; color: var(--text-tertiary); font-weight: 500;">View Details</div>
      </footer>
    </article>
  `).join('') : `
    <div class="card" style="text-align: center; padding: var(--space-8);">
      <div style="font-size: 3rem; margin-bottom: var(--space-4); opacity: 0.5;">?</div>
      <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-2);">No workers deployed</h3>
      <p style="color: var(--text-secondary); margin-bottom: var(--space-4);">Deploy your first worker to get started</p>
      <button class="btn btn-primary">Deploy Your First Worker</button>
    </div>
  `}
</div>

<script>
async function loadWorkers() {
  try {
    const response = await fetch('/api/workers');
    const data = await response.json();
    if (data.workers && data.workers.length > 0) {
      // Workers loaded, page will refresh with data
      window.location.reload();
    }
  } catch (error) {
    console.error('Failed to load workers:', error);
  }
}
loadWorkers();
</script>
`;

  return renderBaseLayout('Workers', content, 'workers');
}
