/**
 * MeauxStack UI Styling - Premium Dashboard Design System
 */

export const MEAUXSTACK_STYLES = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  :root {
    /* Premium Light Palette */
    --bg-canvas: #F8FAFB;
    --bg-surface: #FFFFFF;
    --bg-elevated: #FAFBFC;
    --bg-hover: #F1F4F7;
    --bg-active: #E8EDF2;
    
    /* Refined Color System */
    --primary: #0EA5E9;
    --primary-dark: #0284C7;
    --primary-light: #7DD3FC;
    --primary-subtle: #E0F2FE;
    
    --accent: #14B8A6;
    --accent-dark: #0D9488;
    --accent-light: #5EEAD4;
    
    --success: #10B981;
    --warning: #F59E0B;
    --error: #EF4444;
    --info: #6366F1;
    
    /* Typography Scale */
    --text-primary: #0F172A;
    --text-secondary: #475569;
    --text-tertiary: #94A3B8;
    --text-muted: #CBD5E1;
    --text-inverse: #FFFFFF;
    
    /* Borders & Dividers */
    --border-subtle: #E2E8F0;
    --border-default: #CBD5E1;
    --border-strong: #94A3B8;
    
    /* Shadows - Layered Depth */
    --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.05);
    --shadow-sm: 0 2px 4px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.03);
    --shadow-md: 0 4px 8px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04);
    --shadow-lg: 0 8px 16px rgba(15, 23, 42, 0.1), 0 4px 8px rgba(15, 23, 42, 0.05);
    --shadow-xl: 0 16px 32px rgba(15, 23, 42, 0.12), 0 8px 16px rgba(15, 23, 42, 0.06);
    
    /* Spacing Scale */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --space-8: 32px;
    --space-10: 40px;
    --space-12: 48px;
    --space-16: 64px;
    
    /* Border Radius */
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 14px;
    --radius-xl: 20px;
    --radius-full: 9999px;
    
    /* Layout */
    --sidebar-width: 280px;
    --header-height: 68px;
    --mobile-nav-height: 72px;
    
    /* Transitions */
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    height: 100%;
  }

  body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-canvas);
    color: var(--text-primary);
    line-height: 1.6;
    height: 100%;
    overflow: hidden;
  }

  /* Glass Morphism Backdrop */
  .app-backdrop {
    position: fixed;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.06) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  /* Layout */
  .app-container {
    display: flex;
    height: 100vh;
    position: relative;
    z-index: 1;
  }

  /* Sidebar */
  .sidebar {
    width: var(--sidebar-width);
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-right: 1px solid var(--border-subtle);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }

  .sidebar-header {
    padding: var(--space-6);
    border-bottom: 1px solid var(--border-subtle);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    cursor: pointer;
    transition: all var(--transition-base);
    text-decoration: none;
    color: inherit;
  }

  .brand:hover {
    transform: translateX(2px);
  }

  .brand-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
    position: relative;
    overflow: hidden;
  }

  .brand-icon::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.2));
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  .brand:hover .brand-icon::before {
    opacity: 1;
  }

  .brand-icon svg {
    width: 22px;
    height: 22px;
    fill: white;
    position: relative;
    z-index: 1;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
  }

  .brand-name {
    font-size: 1.125rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2;
  }

  .brand-subtitle {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-tertiary);
    margin-top: 2px;
  }

  /* Navigation */
  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: var(--space-4);
  }

  .sidebar-content::-webkit-scrollbar {
    width: 6px;
  }

  .sidebar-content::-webkit-scrollbar-thumb {
    background: var(--border-default);
    border-radius: 3px;
  }

  .nav-section {
    margin-bottom: var(--space-6);
  }

  .nav-section-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: 0 var(--space-3);
    margin-bottom: var(--space-2);
  }

  .nav-section-title {
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-tertiary);
  }

  .nav-section-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--border-subtle), transparent);
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-3);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
    margin-bottom: var(--space-1);
    font-size: 0.9375rem;
    font-weight: 500;
    position: relative;
    user-select: none;
    text-decoration: none;
  }

  .nav-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    background: linear-gradient(180deg, var(--primary), var(--accent));
    border-radius: 0 2px 2px 0;
    transition: height var(--transition-base);
  }

  .nav-item:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
    transform: translateX(2px);
  }

  .nav-item.active {
    background: linear-gradient(90deg, var(--primary-subtle) 0%, transparent 100%);
    color: var(--primary);
    font-weight: 600;
  }

  .nav-item.active::before {
    height: 20px;
  }

  .nav-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .nav-icon svg {
    width: 18px;
    height: 18px;
    stroke-width: 2;
  }

  .nav-badge {
    margin-left: auto;
    background: var(--primary);
    color: white;
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: var(--radius-full);
    box-shadow: 0 2px 8px rgba(14, 165, 233, 0.25);
  }

  /* Sidebar Footer */
  .sidebar-footer {
    padding: var(--space-4);
    border-top: 1px solid var(--border-subtle);
  }

  .user-card {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .user-card:hover {
    background: var(--bg-hover);
    border-color: var(--border-default);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--primary), var(--accent));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.875rem;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
  }

  .user-info {
    flex: 1;
    min-width: 0;
  }

  .user-name {
    font-weight: 700;
    font-size: 0.9375rem;
    color: var(--text-primary);
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-role {
    font-size: 0.75rem;
    color: var(--text-tertiary);
    font-weight: 500;
  }

  /* Main Content */
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Top Header */
  .top-header {
    height: var(--header-height);
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid var(--border-subtle);
    padding: 0 var(--space-6);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    box-shadow: var(--shadow-sm);
  }

  /* Search */
  .search-wrapper {
    flex: 1;
    max-width: 560px;
    position: relative;
  }

  .search-input {
    width: 100%;
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: var(--space-3) var(--space-4) var(--space-3) calc(var(--space-10) + var(--space-2));
    color: var(--text-primary);
    font-size: 0.9375rem;
    font-weight: 500;
    transition: all var(--transition-base);
    font-family: inherit;
  }

  .search-input:focus {
    outline: none;
    background: var(--bg-surface);
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--primary-subtle);
  }

  .search-input::placeholder {
    color: var(--text-tertiary);
  }

  .search-icon {
    position: absolute;
    left: var(--space-4);
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: var(--text-tertiary);
    pointer-events: none;
  }

  .search-icon svg {
    width: 100%;
    height: 100%;
  }

  /* Header Actions */
  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .header-btn {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--text-secondary);
    position: relative;
  }

  .header-btn:hover {
    background: var(--bg-hover);
    border-color: var(--border-default);
    color: var(--text-primary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  .header-btn:active {
    transform: translateY(0);
  }

  .header-btn svg {
    width: 20px;
    height: 20px;
  }

  .header-btn.active {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  }

  .notification-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: var(--error);
    color: white;
    font-size: 0.625rem;
    font-weight: 800;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--bg-surface);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  /* Page Content */
  .page-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-8);
    background: transparent;
  }

  .content-wrapper {
    max-width: 1440px;
    margin: 0 auto;
    animation: fadeIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Page Header */
  .page-header {
    margin-bottom: var(--space-8);
  }

  .page-header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-6);
    margin-bottom: var(--space-4);
  }

  .page-title {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    line-height: 1.2;
    margin-bottom: var(--space-2);
  }

  .page-subtitle {
    font-size: 1.0625rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .page-actions {
    display: flex;
    gap: var(--space-3);
    flex-shrink: 0;
  }

  /* Buttons */
  .btn {
    padding: var(--space-3) var(--space-5);
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all var(--transition-fast);
    border: none;
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-family: inherit;
    white-space: nowrap;
    user-select: none;
    text-decoration: none;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(14, 165, 233, 0.25);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(14, 165, 233, 0.35);
  }

  .btn-primary:active {
    transform: translateY(0);
  }

  .btn-secondary {
    background: var(--bg-surface);
    color: var(--text-primary);
    border: 1px solid var(--border-subtle);
    box-shadow: var(--shadow-xs);
  }

  .btn-secondary:hover {
    background: var(--bg-hover);
    border-color: var(--border-default);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  .btn svg {
    width: 18px;
    height: 18px;
  }

  /* Tabs */
  .tabs {
    display: flex;
    gap: var(--space-2);
    margin-bottom: var(--space-6);
    border-bottom: 2px solid var(--border-subtle);
    position: relative;
  }

  .tab {
    padding: var(--space-3) var(--space-5);
    color: var(--text-secondary);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all var(--transition-fast);
    font-weight: 600;
    font-size: 0.9375rem;
    position: relative;
    text-decoration: none;
  }

  .tab:hover {
    color: var(--text-primary);
    background: var(--bg-hover);
    border-radius: var(--radius-md) var(--radius-md) 0 0;
  }

  .tab.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
  }

  /* Cards */
  .card {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-xl);
    padding: var(--space-6);
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
  }

  .card:hover {
    border-color: var(--border-default);
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  /* Mobile Layout */
  @media (max-width: 1024px) {
    .sidebar {
      display: none;
    }

    .top-header {
      display: none;
    }

    .page-content {
      padding: var(--space-4);
    }

    .page-title {
      font-size: 1.5rem;
    }

    .page-header-top {
      flex-direction: column;
      gap: var(--space-4);
    }

    .page-actions {
      width: 100%;
      flex-wrap: wrap;
    }

    .btn {
      flex: 1;
      justify-content: center;
      min-width: 140px;
    }
  }
`;
