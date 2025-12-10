import { renderBaseLayout } from './base-layout';

export function renderProjectsPage(): string {
  const content = `
<header class="page-header">
  <div class="page-header-top">
    <div>
      <h1 class="page-title">Active Projects</h1>
      <p class="page-subtitle">Workspace for sites, apps, and Cloudflare deployments</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-secondary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        Configure
      </button>
      <button class="btn btn-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Project
      </button>
    </div>
  </div>
</header>

<div class="tabs">
  <a href="/projects" class="tab active">All Projects</a>
  <a href="/projects?type=websites" class="tab">Websites</a>
  <a href="/projects?type=workers" class="tab">Workers</a>
  <a href="/projects?type=automations" class="tab">Automations</a>
</div>

<div style="display: grid; gap: var(--space-4);" id="projects-grid">
  <article class="card" style="cursor: pointer;" onclick="window.location.href='/projects/meauxbility'">
    <div style="display: flex; align-items: flex-start; gap: var(--space-4); margin-bottom: var(--space-4);">
      <div style="width: 52px; height: 52px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--bg-elevated), var(--bg-hover)); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); transition: all var(--transition-base); flex-shrink: 0;">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 20V10"/>
          <path d="M12 20V4"/>
          <path d="M6 20v-6"/>
        </svg>
      </div>
      <div style="flex: 1; min-width: 0;">
        <h3 style="font-size: 1.0625rem; font-weight: 700; color: var(--text-primary); margin-bottom: var(--space-1); letter-spacing: -0.01em; line-height: 1.3;">Meauxbility.org</h3>
        <div style="font-size: 0.875rem; color: var(--text-tertiary); font-weight: 500; font-family: 'JetBrains Mono', monospace;">nonprofit � meduc/*</div>
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
        Live
      </div>
      <div style="font-size: 0.875rem; color: var(--text-tertiary); font-weight: 500;">Updated 2d ago</div>
    </footer>
  </article>

  <article class="card" style="cursor: pointer;" onclick="window.location.href='/projects/inneranimalmedia'">
    <div style="display: flex; align-items: flex-start; gap: var(--space-4); margin-bottom: var(--space-4);">
      <div style="width: 52px; height: 52px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--bg-elevated), var(--bg-hover)); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); transition: all var(--transition-base); flex-shrink: 0;">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/>
          <polyline points="2 17 12 22 22 17"/>
          <polyline points="2 12 12 17 22 12"/>
        </svg>
      </div>
      <div style="flex: 1; min-width: 0;">
        <h3 style="font-size: 1.0625rem; font-weight: 700; color: var(--text-primary); margin-bottom: var(--space-1); letter-spacing: -0.01em; line-height: 1.3;">InnerAnimalMedia.com</h3>
        <div style="font-size: 0.875rem; color: var(--text-tertiary); font-weight: 500; font-family: 'JetBrains Mono', monospace;">media � inneranimalmedia.com/*</div>
      </div>
      <div style="color: var(--text-tertiary); transition: all var(--transition-base); flex-shrink: 0;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </div>
    <footer style="display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-4); border-top: 1px solid var(--border-subtle);">
      <div style="padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; text-transform: capitalize; letter-spacing: 0.02em; display: inline-flex; align-items: center; gap: var(--space-2); background: rgba(245, 158, 11, 0.1); color: var(--warning);">
        <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: pulse 2s infinite;"></span>
        In Progress
      </div>
      <div style="font-size: 0.875rem; color: var(--text-tertiary); font-weight: 500;">Updated 5d ago</div>
    </footer>
  </article>

  <article class="card" style="cursor: pointer;" onclick="window.location.href='/projects/iautodidact'">
    <div style="display: flex; align-items: flex-start; gap: var(--space-4); margin-bottom: var(--space-4);">
      <div style="width: 52px; height: 52px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--bg-elevated), var(--bg-hover)); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); transition: all var(--transition-base); flex-shrink: 0;">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      </div>
      <div style="flex: 1; min-width: 0;">
        <h3 style="font-size: 1.0625rem; font-weight: 700; color: var(--text-primary); margin-bottom: var(--space-1); letter-spacing: -0.01em; line-height: 1.3;">iAutodidact.org</h3>
        <div style="font-size: 0.875rem; color: var(--text-tertiary); font-weight: 500; font-family: 'JetBrains Mono', monospace;">education � iautodidact.org/*</div>
      </div>
      <div style="color: var(--text-tertiary); transition: all var(--transition-base); flex-shrink: 0;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </div>
    <footer style="display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-4); border-top: 1px solid var(--border-subtle);">
      <div style="padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; text-transform: capitalize; letter-spacing: 0.02em; display: inline-flex; align-items: center; gap: var(--space-2); background: rgba(245, 158, 11, 0.1); color: var(--warning);">
        <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: pulse 2s infinite;"></span>
        In Progress
      </div>
      <div style="font-size: 0.875rem; color: var(--text-tertiary); font-weight: 500;">Updated 1w ago</div>
    </footer>
  </article>
</div>

<script>
async function loadProjects() {
  try {
    const response = await fetch('/api/projects');
    const data = await response.json();
    // Projects loaded from API
  } catch (error) {
    console.error('Failed to load projects:', error);
  }
}
loadProjects();
</script>
`;

  return renderBaseLayout('Projects', content, 'projects');
}
