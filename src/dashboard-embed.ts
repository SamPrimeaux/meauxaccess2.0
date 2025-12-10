export default `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="light">
  <meta name="theme-color" content="#FFFFFF">
  <title>Cloudflare MCP Dashboard</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    * {
      scrollbar-width: thin;
      scrollbar-color: #E0E7F1 transparent;
    }

    *::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    *::-webkit-scrollbar-track {
      background: transparent;
    }

    *::-webkit-scrollbar-thumb {
      background: #E0E7F1;
      border-radius: 3px;
    }

    *::-webkit-scrollbar-thumb:hover {
      background: #CBD5E1;
    }

    :root {
      /* Fortune 500 Color Palette */
      --bg-primary: #F8FAFC;
      --bg-secondary: #FFFFFF;
      --bg-elevated: #F1F5F9;
      --bg-hover: #E2E8F0;
      --bg-sidebar: #FFFFFF;
      --bg-sidebar-hover: #F8FAFC;
      --platinum: #E2E8F0;
      --platinum-dark: #CBD5E1;
      --steel: #64748B;
      --steel-light: #94A3B8;
      --accent: #0EA5E9;
      --accent-hover: #0284C7;
      --accent-light: #E0F2FE;
      --accent-soft: rgba(14, 165, 233, 0.1);
      --accent-gradient: linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%);
      --text-primary: #0F172A;
      --text-secondary: #475569;
      --text-muted: #94A3B8;
      --text-inverse: #FFFFFF;
      --status-success: #10B981;
      --status-warning: #F59E0B;
      --status-error: #EF4444;
      --status-info: #3B82F6;
      --border: #E2E8F0;
      --border-medium: #CBD5E1;
      --border-hover: #0EA5E9;
      --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
      --shadow-sm: 0 2px 4px rgba(15, 23, 42, 0.06);
      --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08);
      --shadow-lg: 0 8px 24px rgba(15, 23, 42, 0.12);
      --shadow-xl: 0 16px 48px rgba(15, 23, 42, 0.16);
      --shadow-2xl: 0 24px 64px rgba(15, 23, 42, 0.2);
      --space-xs: 4px;
      --space-sm: 8px;
      --space-md: 16px;
      --space-lg: 24px;
      --space-xl: 32px;
      --space-2xl: 48px;
      --space-3xl: 64px;
      --radius-sm: 6px;
      --radius-md: 8px;
      --radius-lg: 12px;
      --radius-xl: 16px;
      --radius-2xl: 20px;
      --sidebar-width: 280px;
      --sidebar-collapsed: 72px;
      --header-height: 72px;
      --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
      --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
      --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    html {
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      height: 100%;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      height: 100%;
      overflow: hidden;
      letter-spacing: -0.01em;
    }

    .app-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .sidebar {
      width: var(--sidebar-width);
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      overflow-y: auto;
      overflow-x: hidden;
      box-shadow: 2px 0 8px rgba(15, 23, 42, 0.04);
      position: relative;
      transition: transform var(--transition-base), width var(--transition-base);
      z-index: 1000;
    }

    .sidebar.collapsed {
      width: var(--sidebar-collapsed);
    }

    /* Mobile Sidebar Overlay */
    .sidebar-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(4px);
      z-index: 999;
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    .sidebar-overlay.active {
      display: block;
      opacity: 1;
    }

    /* Mobile Hamburger Menu */
    .mobile-menu-btn {
      display: none;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
      margin-right: var(--space-md);
      flex-shrink: 0;
    }

    .mobile-menu-btn:hover {
      background: var(--bg-hover);
      border-color: var(--border-medium);
    }

    .mobile-menu-btn svg {
      width: 20px;
      height: 20px;
      stroke: var(--text-primary);
      stroke-width: 2;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .mobile-menu-btn {
        display: flex;
      }

      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: var(--sidebar-width);
        transform: translateX(-100%);
        z-index: 1000;
        box-shadow: 4px 0 24px rgba(15, 23, 42, 0.15);
      }

      .sidebar.mobile-open {
        transform: translateX(0);
      }

      .sidebar.collapsed {
        width: var(--sidebar-width);
        transform: translateX(-100%);
      }

      .sidebar.collapsed.mobile-open {
        transform: translateX(0);
      }

      .main-area {
        width: 100%;
      }

      .top-header {
        padding: 0 var(--space-md);
      }

      .search-container {
        max-width: none;
      }

      .page-content {
        padding: var(--space-md);
      }

      .content-wrapper {
        max-width: 100%;
      }

      body.menu-open {
        overflow: hidden;
      }
    }

    .sidebar-header {
      padding: var(--space-lg) var(--space-md);
      border-bottom: 1px solid var(--border);
      background: var(--bg-sidebar);
      position: sticky;
      top: 0;
      z-index: 10;
      backdrop-filter: blur(8px);
      background: rgba(255, 255, 255, 0.95);
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .brand-logo:hover {
      opacity: 0.8;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: var(--accent-gradient);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
      flex-shrink: 0;
      transition: all var(--transition-base);
    }

    .logo-icon:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(14, 165, 233, 0.35);
    }

    .logo-icon svg {
      width: 22px;
      height: 22px;
      fill: white;
    }

    .brand-text {
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      transition: opacity var(--transition-base);
    }

    .sidebar.collapsed .brand-text {
      opacity: 0;
      width: 0;
    }

    .brand-text .highlight {
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .sidebar-nav {
      flex: 1;
      padding: var(--space-md) var(--space-sm);
      overflow-y: auto;
      overflow-x: hidden;
    }

    .sidebar-toggle {
      position: absolute;
      top: var(--space-lg);
      right: var(--space-md);
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
      z-index: 20;
    }

    .sidebar-toggle:hover {
      background: var(--bg-hover);
      border-color: var(--border-medium);
    }

    .sidebar-toggle svg {
      width: 16px;
      height: 16px;
      stroke: var(--text-secondary);
      transition: transform var(--transition-base);
    }

    .sidebar.collapsed .sidebar-toggle svg {
      transform: rotate(180deg);
    }

    .nav-section {
      margin-bottom: var(--space-lg);
    }

    .nav-section-title {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      padding: var(--space-md) var(--space-md) var(--space-sm);
      margin-bottom: var(--space-xs);
      transition: opacity var(--transition-base);
    }

    .sidebar.collapsed .nav-section-title {
      opacity: 0;
      height: 0;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: 12px var(--space-md);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-base);
      margin-bottom: 4px;
      font-size: 0.9375rem;
      font-weight: 500;
      position: relative;
      white-space: nowrap;
    }

    .nav-item:hover {
      background: var(--bg-sidebar-hover);
      color: var(--text-primary);
      transform: translateX(2px);
    }

    .nav-item.active {
      background: var(--accent-light);
      color: var(--accent);
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(14, 165, 233, 0.15);
    }

    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 24px;
      background: var(--accent);
      border-radius: 0 3px 3px 0;
      box-shadow: 0 0 8px rgba(14, 165, 233, 0.4);
    }

    .sidebar.collapsed .nav-item span {
      opacity: 0;
      width: 0;
      overflow: hidden;
    }

    .sidebar.collapsed .nav-item {
      justify-content: center;
      padding: 12px;
    }

    .nav-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .nav-icon svg {
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08));
      transition: all var(--transition-base);
    }

    .nav-item:hover .nav-icon svg {
      filter: drop-shadow(0 2px 4px rgba(14, 165, 233, 0.2));
      transform: scale(1.05);
    }

    .nav-item.active .nav-icon svg {
      filter: drop-shadow(0 2px 6px rgba(14, 165, 233, 0.3));
    }

    justify-content: center;
    flex-shrink: 0;
    transition: all var(--transition-base);
    }

    .nav-item.active .nav-icon {
      transform: scale(1.1);
    }

    .nav-icon svg {
      width: 20px;
      height: 20px;
      stroke-width: 2;
      stroke: currentColor;
      fill: none;
    }

    .nav-item.active .nav-icon svg {
      stroke-width: 2.5;
    }

    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .top-header {
      height: var(--header-height);
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border);
      padding: 0 var(--space-xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(12px);
      background: rgba(255, 255, 255, 0.98);
    }

    .search-container {
      flex: 1;
      max-width: 480px;
      position: relative;
    }

    .search-input {
      width: 100%;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 10px 16px 10px 40px;
      color: var(--text-primary);
      font-size: 0.9375rem;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--accent);
      background: var(--bg-secondary);
      box-shadow: 0 0 0 3px var(--accent-soft);
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      pointer-events: none;
    }

    .page-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-xl);
      background: var(--bg-primary);
    }

    .content-wrapper {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: var(--space-xl);
    }

    .page-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
      line-height: 1.2;
      margin-bottom: 6px;
    }

    .page-subtitle {
      font-size: 1rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .page-actions {
      display: flex;
      gap: var(--space-sm);
      margin-top: var(--space-md);
    }

    .btn {
      padding: 10px 18px;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 0.9375rem;
      cursor: pointer;
      transition: all 0.15s ease;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      letter-spacing: -0.01em;
      white-space: nowrap;
    }

    .btn-primary {
      background: var(--accent);
      color: white;
      box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);
    }

    .btn-primary:hover {
      background: var(--accent-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(14, 165, 233, 0.3);
    }

    .btn-secondary {
      background: var(--bg-secondary);
      color: var(--text-secondary);
      border: 1px solid var(--border);
    }

    .btn-secondary:hover {
      background: var(--bg-hover);
      border-color: var(--border-medium);
      color: var(--text-primary);
    }

    /* Drag and Drop Zone */
    .drop-zone {
      border: 2px dashed var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-2xl);
      text-align: center;
      background: var(--bg-secondary);
      transition: all 0.3s ease;
      margin-bottom: var(--space-xl);
      cursor: pointer;
    }

    .drop-zone.drag-over {
      border-color: var(--accent);
      background: var(--accent-light);
      transform: scale(1.02);
    }

    .drop-zone-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto var(--space-md);
      background: var(--bg-elevated);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
    }

    .drop-zone-icon svg {
      width: 32px;
      height: 32px;
    }

    .drop-zone-text {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-xs);
    }

    .drop-zone-hint {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    /* Buckets Grid */
    .buckets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--space-lg);
      margin-top: var(--space-xl);
    }

    .bucket-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      transition: all var(--transition-base);
      cursor: pointer;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .bucket-card:hover {
      border-color: var(--accent);
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .bucket-icon {
      width: 80px;
      height: 80px;
      margin-bottom: var(--space-md);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--accent-gradient);
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
    }

    .bucket-icon svg {
      width: 48px;
      height: 48px;
      fill: white;
      stroke: white;
    }

    .bucket-name {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: var(--space-xs);
      word-break: break-word;
    }

    .bucket-binding {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-bottom: var(--space-sm);
      font-family: 'Monaco', 'Courier New', monospace;
    }

    .bucket-stats {
      display: flex;
      gap: var(--space-md);
      margin-top: var(--space-sm);
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .bucket-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .bucket-stat-value {
      font-weight: 700;
      color: var(--text-primary);
      font-size: 0.9375rem;
    }

    .bucket-stat-label {
      font-size: 0.6875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }

    /* File Grid */
    .files-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-md);
    }

    .file-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      transition: all 0.2s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .file-card:hover {
      border-color: var(--border-medium);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .file-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto var(--space-md);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-elevated);
      position: relative;
    }

    .file-icon img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: var(--radius-md);
    }

    .file-icon svg {
      width: 32px;
      height: 32px;
      color: var(--text-secondary);
    }

    .file-name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-primary);
      text-align: center;
      margin-bottom: var(--space-xs);
      word-break: break-word;
    }

    .file-meta {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-align: center;
    }

    .file-type-badge {
      position: absolute;
      top: var(--space-sm);
      right: var(--space-sm);
      background: var(--accent);
      color: white;
      font-size: 0.625rem;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    /* Modal */
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.6);
      z-index: 1000;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl);
      backdrop-filter: blur(4px);
    }

    .modal.active {
      display: flex;
    }

    .modal-content {
      background: var(--bg-secondary);
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 1200px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--border);
      animation: modalSlideIn 0.3s ease;
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }

      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .modal-header {
      padding: var(--space-lg);
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .modal-close {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
      color: var(--text-secondary);
    }

    .modal-close:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }

    .modal-close svg {
      width: 18px;
      height: 18px;
    }

    .modal-body {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-iframe {
      width: 100%;
      flex: 1;
      border: none;
      background: white;
    }

    .modal-actions {
      padding: var(--space-lg);
      border-top: 1px solid var(--border);
      display: flex;
      gap: var(--space-sm);
      justify-content: flex-end;
      flex-shrink: 0;
    }

    .bucket-selector {
      margin-bottom: var(--space-lg);
    }

    .bucket-select {
      width: 100%;
      max-width: 400px;
      padding: 10px 16px;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--bg-secondary);
      color: var(--text-primary);
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .bucket-select:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-soft);
    }

    .loading {
      text-align: center;
      padding: var(--space-2xl);
      color: var(--text-muted);
    }

    .error {
      background: rgba(239, 68, 68, 0.1);
      color: var(--status-error);
      padding: var(--space-md);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-md);
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .success {
      background: rgba(16, 185, 129, 0.1);
      color: var(--status-success);
      padding: var(--space-md);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-md);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    input[type="file"] {
      display: none;
    }
  </style>
</head>

<body>
  <div class="app-container">
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="brand-logo">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" />
            </svg>
          </div>
          <div class="brand-text">
            <span>Meaux</span><span class="highlight">MCP</span>
          </div>
        </div>
        <button class="sidebar-toggle" onclick="toggleSidebar()" title="Toggle Sidebar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
      <div class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title">Cloud Resources</div>
          <div class="nav-item" data-view="deployment" data-tooltip="Deployment" style="display: none;"
            id="deploymentNavItem">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path
                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span>Deployment</span>
          </div>
          <div class="nav-item active" data-view="r2" data-tooltip="R2 Storage">
            <div class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path
                  d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <span>R2 Storage</span>
          </div>
          <div class="nav-item" data-view="d1" data-tooltip="D1 Databases">
            <div class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
            </div>
            <span>D1 Databases</span>
          </div>
          <div class="nav-item" data-view="kv" data-tooltip="KV Namespaces">
            <div class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="9" x2="15" y2="9" />
                <line x1="9" y1="15" x2="15" y2="15" />
                <line x1="12" y1="3" x2="12" y2="21" />
              </svg>
            </div>
            <span>KV Namespaces</span>
          </div>
          <div class="nav-item" data-view="workers" data-tooltip="Cloudflare Workers">
            <div class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span>Workers</span>
          </div>
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Team & Access</div>
          <div class="nav-item" data-view="team" data-tooltip="Team Management">
            <div class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span>Team</span>
          </div>
          <div class="nav-item" data-view="ssh" data-tooltip="SSH Terminal">
            <div class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <span>SSH Terminal</span>
          </div>
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Automation</div>
          <div class="nav-item" data-view="iaccess" data-tooltip="iAccess / GODMODE">
            <div class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <rect x="3" y="12" width="18" height="10" rx="2" ry="2" />
                <path d="M7 12V7a5 5 0 0 1 10 0v5" />
                <circle cx="12" cy="17" r="1" />
              </svg>
            </div>
            <span>iAccess</span>
          </div>
          <div class="nav-item" data-view="messageboard" data-tooltip="Message Board">
            <div class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <line x1="9" y1="10" x2="15" y2="10" />
                <line x1="9" y1="14" x2="13" y2="14" />
              </svg>
            </div>
            <span>Message Board</span>
          </div>
          <div class="nav-item" data-view="meauxmedia" data-tooltip="MeauxMedia Editor">
            <div class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="url(#mediaGradient)" opacity="0.1" />
                <path d="M9 9h6v6H9z" fill="currentColor" opacity="0.3" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2" />
                <defs>
                  <linearGradient id="mediaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:var(--accent);stop-opacity:0.2" />
                    <stop offset="100%" style="stop-color:var(--accent-hover);stop-opacity:0.4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span>MeauxMedia</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeMobileSidebar()"></div>

    <div class="main-area">
      <div class="top-header">
        <button class="mobile-menu-btn" onclick="toggleMobileSidebar()" title="Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div class="search-container">
          <div class="search-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input type="text" class="search-input" id="searchInput" placeholder="Search files...">
        </div>
        <div style="display: flex; align-items: center; gap: var(--space-md);">
          <div id="userInfo" style="display: none; align-items: center; gap: var(--space-sm);">
            <span id="userName" style="font-weight: 600; color: var(--text-secondary); font-size: 0.875rem;"></span>
            <button class="btn btn-secondary" onclick="handleLogout()" style="padding: 8px 16px; font-size: 0.875rem;">
              Logout
            </button>
          </div>
          <button id="loginBtn" class="btn btn-primary" onclick="openLoginModal()"
            style="padding: 8px 16px; font-size: 0.875rem;">
            Login
          </button>
        </div>
      </div>

      <div class="page-content">
        <div class="content-wrapper">
          <!-- R2 Storage View -->
          <div id="r2View" class="view-panel">
            <div class="page-header">
              <h1 class="page-title">R2 Storage</h1>
              <p class="page-subtitle">View and manage all your R2 buckets</p>
              <div class="page-actions" style="display: flex; align-items: center; gap: var(--space-md);">
                <!-- Storage Mode Toggle -->
                <div id="storageModeToggle"
                  style="display: none; align-items: center; gap: var(--space-sm); padding: 8px 16px; background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border);">
                  <span style="font-size: 0.875rem; color: var(--text-secondary); font-weight: 500;">Storage:</span>
                  <div
                    style="display: flex; gap: 4px; background: var(--bg-secondary); padding: 2px; border-radius: 6px;">
                    <button class="storage-mode-btn active" data-mode="local" onclick="setStorageMode('local')"
                      style="padding: 4px 12px; font-size: 0.75rem; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; border-radius: 4px; transition: all 0.2s;">Local</button>
                    <button class="storage-mode-btn" data-mode="remote" onclick="setStorageMode('remote')"
                      style="padding: 4px 12px; font-size: 0.75rem; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; border-radius: 4px; transition: all 0.2s;">Remote</button>
                    <button class="storage-mode-btn" data-mode="both" onclick="setStorageMode('both')"
                      style="padding: 4px 12px; font-size: 0.75rem; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; border-radius: 4px; transition: all 0.2s;">Both</button>
                  </div>
                </div>
                <button class="btn btn-secondary" onclick="refreshAllBuckets()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 4 23 10 17 10" />
                    <polyline points="1 20 1 14 7 14" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                  Refresh All
                </button>
              </div>
            </div>

            <div id="messageArea"></div>

            <div id="bucketsGrid" class="buckets-grid"></div>
          </div>

          <!-- D1 Databases View -->
          <div id="d1View" class="view-panel" style="display: none;">
            <div class="page-header">
              <h1 class="page-title">D1 Databases</h1>
              <p class="page-subtitle">Query and manage your D1 databases</p>
            </div>

            <div class="bucket-selector">
              <select class="bucket-select" id="d1DatabaseSelect">
                <option value="">Loading databases...</option>
              </select>
            </div>

            <div id="d1MessageArea"></div>

            <div style="margin-top: var(--space-lg);">
              <textarea id="d1QueryInput" placeholder="SELECT * FROM table_name LIMIT 10;"
                style="width: 100%; min-height: 120px; padding: var(--space-md); border: 1px solid var(--border); border-radius: var(--radius-md); font-family: 'Monaco', 'Courier New', monospace; font-size: 0.875rem;"></textarea>
              <div class="page-actions" style="margin-top: var(--space-md);">
                <button class="btn btn-primary" onclick="executeD1Query()">Execute Query</button>
                <button class="btn btn-secondary" onclick="getD1Schema()">Get Schema</button>
              </div>
            </div>

            <div id="d1Results" style="margin-top: var(--space-xl);"></div>
          </div>

          <!-- Deployment View -->
          <div id="deploymentView" class="view-panel" style="display: none;">
            <div class="page-header">
              <h1 class="page-title">Deployment</h1>
              <p class="page-subtitle">Manage deployments and review user configurations</p>
              <div class="page-actions">
                <button class="btn btn-primary" onclick="showDeploymentConfirmation()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path
                      d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  Review & Deploy
                </button>
              </div>
            </div>
            <div id="deploymentContent" style="margin-top: var(--space-xl);">
              <div
                style="padding: var(--space-xl); background: var(--bg-elevated); border-radius: var(--radius-lg); text-align: center;">
                <h3 style="margin-bottom: var(--space-md); font-size: 1.25rem; font-weight: 600;">Ready to Deploy</h3>
                <p style="color: var(--text-secondary); margin-bottom: var(--space-lg);">Click "Review & Deploy" to
                  review user R2 bucket assignments and confirm deployment.</p>
                <div style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;">
                  <div
                    style="padding: var(--space-md); background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--border); min-width: 200px;">
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 4px;">Sandbox
                      Environment</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent);">
                      sandbox.meauxbility.workers.dev</div>
                  </div>
                  <div
                    style="padding: var(--space-md); background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--border); min-width: 200px;">
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 4px;">Production
                      Environment</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent);">
                      meauxmcp.meauxbility.workers.dev</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- KV Namespaces View -->
          <div id="kvView" class="view-panel" style="display: none;">
            <div class="page-header">
              <h1 class="page-title">KV Namespaces</h1>
              <p class="page-subtitle">Read and write key-value pairs</p>
            </div>

            <div class="bucket-selector">
              <select class="bucket-select" id="kvNamespaceSelect">
                <option value="">Loading namespaces...</option>
              </select>
            </div>

            <div id="kvMessageArea"></div>

            <div
              style="margin-top: var(--space-lg); display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg);">
              <div>
                <h3 style="margin-bottom: var(--space-md); font-size: 1rem; font-weight: 600;">Read Key</h3>
                <input type="text" id="kvReadKey" placeholder="key-name"
                  style="width: 100%; padding: var(--space-md); border: 1px solid var(--border); border-radius: var(--radius-md); margin-bottom: var(--space-sm);">
                <button class="btn btn-primary" onclick="readKV()">Read</button>
                <div id="kvReadResult"
                  style="margin-top: var(--space-md); padding: var(--space-md); background: var(--bg-elevated); border-radius: var(--radius-md); min-height: 100px; font-family: monospace; white-space: pre-wrap;">
                </div>
              </div>
              <div>
                <h3 style="margin-bottom: var(--space-md); font-size: 1rem; font-weight: 600;">Write Key</h3>
                <input type="text" id="kvWriteKey" placeholder="key-name"
                  style="width: 100%; padding: var(--space-md); border: 1px solid var(--border); border-radius: var(--radius-md); margin-bottom: var(--space-sm);">
                <textarea id="kvWriteValue" placeholder="value"
                  style="width: 100%; min-height: 100px; padding: var(--space-md); border: 1px solid var(--border); border-radius: var(--radius-md); margin-bottom: var(--space-sm); font-family: monospace;"></textarea>
                <button class="btn btn-primary" onclick="writeKV()">Write</button>
              </div>
            </div>
          </div>

          <!-- Workers View -->
          <div id="workersView" class="view-panel" style="display: none;">
            <div class="page-header">
              <h1 class="page-title">Cloudflare Workers</h1>
              <p class="page-subtitle">Manage and monitor your Workers</p>
              <div class="page-actions">
                <button class="btn btn-secondary" onclick="loadWorkers()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 4 23 10 17 10" />
                    <polyline points="1 20 1 14 7 14" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            <div id="workersMessageArea"></div>
            <div id="workersList" style="margin-top: var(--space-lg);"></div>
          </div>

          <!-- Team Management View -->
          <div id="teamView" class="view-panel" style="display: none;">
            <div class="page-header">
              <h1 class="page-title">Team Management</h1>
              <p class="page-subtitle">Manage team members, send notifications, and configure access</p>
              <div class="page-actions">
                <button class="btn btn-primary" onclick="sendWelcomeNotifications()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    style="width: 16px; height: 16px;">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Notify All Team
                </button>
              </div>
            </div>

            <div id="teamMembersList" style="margin-top: var(--space-xl);"></div>

            <div style="margin-top: var(--space-2xl);">
              <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-lg);">Send Notification</h2>
              <div
                style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-xl);">
                <div style="margin-bottom: var(--space-md);">
                  <label style="display: block; font-weight: 600; margin-bottom: var(--space-xs);">Recipient</label>
                  <select id="notificationRecipient" class="bucket-select" style="width: 100%; max-width: 400px;">
                    <option value="all">All Team Members</option>
                    <option value="sam@meauxbility.org">Sam Primeaux</option>
                    <option value="connor@meauxbility.org">Connor</option>
                    <option value="fred@meauxbility.org">Fred</option>
                    <option value="amber@meauxbility.org">Amber</option>
                    <option value="info@inneranimals.com">Inner Animals Info</option>
                    <option value="meauxbility@gmail.com">Meauxbility Gmail</option>
                  </select>
                </div>
                <div style="margin-bottom: var(--space-md);">
                  <label style="display: block; font-weight: 600; margin-bottom: var(--space-xs);">Title</label>
                  <input type="text" id="notificationTitle" placeholder="Notification title"
                    style="width: 100%; padding: var(--space-md); border: 1px solid var(--border); border-radius: var(--radius-md);">
                </div>
                <div style="margin-bottom: var(--space-md);">
                  <label style="display: block; font-weight: 600; margin-bottom: var(--space-xs);">Message</label>
                  <textarea id="notificationMessage" placeholder="Notification message"
                    style="width: 100%; min-height: 120px; padding: var(--space-md); border: 1px solid var(--border); border-radius: var(--radius-md);"></textarea>
                </div>
                <button class="btn btn-primary" onclick="sendNotification()">Send Notification</button>
              </div>
            </div>
          </div>

          <!-- Message Board View -->
          <div id="messageboardView" class="view-panel" style="display: none;">
            <div class="page-header">
              <h1 class="page-title">Message Board</h1>
              <p class="page-subtitle">Team communication with email notifications</p>
            </div>

            <div id="messageBoardArea" style="margin-top: var(--space-lg);">
              <div
                style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-xl);">
                <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: var(--space-md);">Send Message</h3>
                <div style="margin-bottom: var(--space-md);">
                  <label style="display: block; font-weight: 600; margin-bottom: var(--space-xs);">Recipient</label>
                  <select id="messageRecipient" class="bucket-select" style="width: 100%;">
                    <option value="all">All Team Members</option>
                    <option value="sam@meauxbility.org">Sam Primeaux</option>
                    <option value="connor@meauxbility.org">Connor</option>
                    <option value="fred@meauxbility.org">Fred</option>
                    <option value="amber@meauxbility.org">Amber</option>
                    <option value="info@inneranimals.com">Inner Animals Info</option>
                    <option value="meauxbility@gmail.com">Meauxbility Gmail</option>
                  </select>
                </div>
                <div style="margin-bottom: var(--space-md);">
                  <label style="display: block; font-weight: 600; margin-bottom: var(--space-xs);">Subject</label>
                  <input type="text" id="messageSubject" placeholder="Message subject"
                    style="width: 100%; padding: var(--space-md); border: 1px solid var(--border); border-radius: var(--radius-md);">
                </div>
                <div style="margin-bottom: var(--space-md);">
                  <label style="display: block; font-weight: 600; margin-bottom: var(--space-xs);">Message</label>
                  <textarea id="messageContent" placeholder="Type your message here..."
                    style="width: 100%; min-height: 150px; padding: var(--space-md); border: 1px solid var(--border); border-radius: var(--radius-md); font-family: inherit;"></textarea>
                </div>
                <button class="btn btn-primary" onclick="sendMessage()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    style="width: 16px; height: 16px;">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  Send Message
                </button>
              </div>

              <div id="messagesList" style="display: grid; gap: var(--space-md);">
                <!-- Messages will be loaded here -->
              </div>
            </div>
          </div>

          <!-- SSH Terminal View -->
          <div id="sshView" class="view-panel" style="display: none;">
            <div class="page-header">
              <h1 class="page-title">SSH Terminal</h1>
              <p class="page-subtitle">Secure SSH access for running dev projects</p>
            </div>

            <div id="sshMessageArea"></div>

            <div style="margin-top: var(--space-lg);">
              <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: var(--space-md);">SSH Connections</h3>
              <div id="sshConnectionsList" style="margin-bottom: var(--space-xl);"></div>

              <div
                style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-xl);">
                <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: var(--space-md);">Execute Command</h3>
                <div style="margin-bottom: var(--space-md);">
                  <label style="display: block; font-weight: 600; margin-bottom: var(--space-xs);">Connection</label>
                  <select id="sshConnectionSelect" class="bucket-select" style="width: 100%;">
                    <option value="">Select SSH connection...</option>
                  </select>
                </div>
                <div style="margin-bottom: var(--space-md);">
                  <label style="display: block; font-weight: 600; margin-bottom: var(--space-xs);">Command</label>
                  <input type="text" id="sshCommand" placeholder="ls -la"
                    style="width: 100%; padding: var(--space-md); border: 1px solid var(--border); border-radius: var(--radius-md); font-family: 'Monaco', 'Courier New', monospace;">
                </div>
                <div style="margin-bottom: var(--space-md);">
                  <label style="display: block; font-weight: 600; margin-bottom: var(--space-xs);">Working Directory
                    (optional)</label>
                  <input type="text" id="sshWorkingDir" placeholder="/path/to/project"
                    style="width: 100%; padding: var(--space-md); border: 1px solid var(--border); border-radius: var(--radius-md); font-family: 'Monaco', 'Courier New', monospace;">
                </div>
                <button class="btn btn-primary" onclick="executeSSHCommand()">Execute</button>
              </div>

              <div id="sshOutput"
                style="margin-top: var(--space-xl); background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-lg); min-height: 200px; font-family: 'Monaco', 'Courier New', monospace; font-size: 0.875rem; white-space: pre-wrap; overflow-x: auto;">
              </div>
            </div>
          </div>

          <!-- iAccess / GODMODE View -->
          <div id="iaccessView" class="view-panel" style="display: none; padding: 0; overflow: hidden;">
            <iframe id="iaccessFrame" src="/iaccess"
              style="width: 100%; height: calc(100vh - var(--header-height)); border: none; background: var(--bg-primary);"></iframe>
          </div>

          <!-- MeauxMedia Editor View -->
          <div id="meauxmediaView" class="view-panel" style="display: none;">
            <div class="page-header">
              <h1 class="page-title">MeauxMedia Editor</h1>
              <p class="page-subtitle">Professional video & image editor with Cloudflare Stream integration</p>
              <div class="page-actions">
                <button class="btn btn-primary" onclick="openMediaEditor()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" style="width: 16px; height: 16px; margin-right: 8px;">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  Open Editor
                </button>
              </div>
            </div>

            <div style="margin-top: var(--space-xl);">
              <!-- Quick Stats -->
              <div
                style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-lg); margin-bottom: var(--space-xl);">
                <div
                  style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-lg);">
                  <div
                    style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: var(--space-xs);">
                    Templates</div>
                  <div style="font-size: 2rem; font-weight: 700; color: var(--accent);" id="meauxmediaTemplatesCount">-
                  </div>
                </div>
                <div
                  style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-lg);">
                  <div
                    style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: var(--space-xs);">
                    Projects</div>
                  <div style="font-size: 2rem; font-weight: 700; color: var(--accent);" id="meauxmediaProjectsCount">-
                  </div>
                </div>
                <div
                  style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-lg);">
                  <div
                    style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: var(--space-xs);">
                    Stream Videos</div>
                  <div style="font-size: 2rem; font-weight: 700; color: var(--accent);" id="meauxmediaStreamCount">-
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div
                style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-lg); margin-bottom: var(--space-xl);">
                <div
                  style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-lg); cursor: pointer; transition: all var(--transition-base);"
                  onmouseover="this.style.borderColor='var(--accent)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-md)'"
                  onmouseout="this.style.borderColor='var(--border)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                  onclick="openMediaEditor('image')">
                  <div
                    style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                    <div
                      style="width: 48px; height: 48px; background: linear-gradient(135deg, var(--accent), var(--accent-hover)); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" style="width: 24px; height: 24px;">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" fill="white" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                    <div>
                      <div style="font-weight: 600; font-size: 1.125rem; margin-bottom: 4px;">Image Editor</div>
                      <div style="font-size: 0.875rem; color: var(--text-secondary);">Edit images with Fabric.js</div>
                    </div>
                  </div>
                </div>

                <div
                  style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-lg); cursor: pointer; transition: all var(--transition-base);"
                  onmouseover="this.style.borderColor='var(--accent)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-md)'"
                  onmouseout="this.style.borderColor='var(--border)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                  onclick="openMediaEditor('video')">
                  <div
                    style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                    <div
                      style="width: 48px; height: 48px; background: linear-gradient(135deg, var(--accent), var(--accent-hover)); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" style="width: 24px; height: 24px;">
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                    </div>
                    <div>
                      <div style="font-weight: 600; font-size: 1.125rem; margin-bottom: 4px;">Video Editor</div>
                      <div style="font-size: 0.875rem; color: var(--text-secondary);">Trim, split, merge videos</div>
                    </div>
                  </div>
                </div>

                <div
                  style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-lg); cursor: pointer; transition: all var(--transition-base);"
                  onmouseover="this.style.borderColor='var(--accent)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-md)'"
                  onmouseout="this.style.borderColor='var(--border)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                  onclick="loadTemplates()">
                  <div
                    style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                    <div
                      style="width: 48px; height: 48px; background: linear-gradient(135deg, var(--accent), var(--accent-hover)); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" style="width: 24px; height: 24px;">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <div>
                      <div style="font-weight: 600; font-size: 1.125rem; margin-bottom: 4px;">Templates</div>
                      <div style="font-size: 0.875rem; color: var(--text-secondary);">Browse saved templates</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Projects -->
              <div
                style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-xl);">
                <div
                  style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
                  <h3 style="font-size: 1.25rem; font-weight: 600;">Recent Projects</h3>
                  <button class="btn btn-secondary" onclick="loadMediaProjects()"
                    style="padding: 8px 16px; font-size: 0.875rem;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                      style="width: 14px; height: 14px; margin-right: 6px;">
                      <polyline points="23 4 23 10 17 10" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                    Refresh
                  </button>
                </div>
                <div id="meauxmediaProjectsList" style="display: grid; gap: var(--space-md);">
                  <div class="loading">Loading projects...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bucket Details Modal -->
  <div class="modal" id="bucketModal">
    <div class="modal-content" style="max-width: 1400px;">
      <div class="modal-header">
        <div>
          <div class="modal-title" id="bucketModalTitle">Bucket Details</div>
          <div style="font-size: 0.875rem; color: var(--text-muted); margin-top: 4px;" id="bucketModalSubtitle"></div>
        </div>
        <button class="modal-close" onclick="closeBucketModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="modal-body" style="padding: var(--space-xl); overflow-y: auto;">
        <div id="bucketStats"
          style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-lg); margin-bottom: var(--space-xl);">
        </div>
        <div class="drop-zone" id="bucketDropZone" style="margin-bottom: var(--space-xl);">
          <div class="drop-zone-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div class="drop-zone-text">Drop files here or click to upload</div>
          <div class="drop-zone-hint">Supports HTML, images, documents, and more</div>
          <input type="file" id="bucketFileInput" multiple>
        </div>
        <div id="bucketFilesContainer" class="files-grid"></div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="closeBucketModal()">Close</button>
        <button class="btn btn-primary" onclick="refreshBucketModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            style="width: 16px; height: 16px;">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>
  </div>

  <!-- HTML Preview Modal -->
  <div class="modal" id="htmlModal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title" id="modalTitle">Preview</div>
        <button class="modal-close" onclick="closeModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <iframe class="modal-iframe" id="previewIframe" sandbox="allow-scripts allow-same-origin"></iframe>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        <button class="btn btn-primary" onclick="openInNewTab()">Open in New Tab</button>
      </div>
    </div>
  </div>

  <script>
    const API_BASE = '/mcp';
    let currentBucket = '';
    let currentFiles = [];
    let previewUrl = '';

    // Initialize
    document.addEventListener('DOMContentLoaded', async () => {
      restoreSidebarState();
      setupNavigation();
      await loadBuckets();
      await loadD1Databases();
      await loadKVNamespaces();
      setupDragAndDrop();
      setupFileInput();
      setupBucketModalDragAndDrop();
      setupBucketFileInput();
      setupSearch();
    });

    // Storage Mode Management
    let currentStorageMode = 'b;

    async function loadUserPreferences() {
      try {
        const response = await fetch('/api/user/preferences');
        if (response.ok) {
          const prefs = await response.json();
          if (prefs && prefs.storageMode) {
            setStorageMode(prefs.storageMode, false);
          }
        }
      } catch (error) {
        console.error('Failed to load user preferences:', error);
      }
      function setStorageMode(mode, save = true) {
        currentStorageMode = mode;

        // Update UI
        document.querySelectorAll('.storage-mode-btn').forEach(btn => {
          if (btn.dataset.mode === mode) {
            btn.classList.add('active');
            btn.style.background = 'var(--accent)';
            btn.style.color = 'white';
          } else {
            btn.classList.remove('active');
            btn.style.background = 'transparent';
            btn.style.color = 'var(--text-secondary)';
          }
        });

        // Save preferences if requested
        if (save) {
          saveUserPreferences({ storageMode: mode });
        }

        // Update based on mode
        updateStorageModeUI();
      }

      function updateStorageModeUI() {
        // This will be called when storage mode changes
        // You can add logic here to show/hide local vs remote options
        console.log('Storage mode:', currentStorageMode);
      }

      async function savePreferences(prefs) {
        try {
          const response = await fetch('/api/user/preferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prefs),
          });
          if (!response.ok) {
            console.error('Failed to save preferences');
          }
        } catch (error) {
          console.error('Error saving preferences:', error);
        }
      }

      // Deployment Confirmat    async function showDeploymentConfirmation() {
      try {
        const response = await fetch('/api/deployment/confirm');
        if (!response.ok) {
          alert('Failed to load deployment confirmation. Admin access required.');
          return;
        }

        const data = await response.json();

        // Create modal
        const mocument.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;';
        modal.innerHTML = \`
          <div style="background: white; border-radius: 12px; padding: 32px; max-width: 800px; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
            <h2 style="margin-bottom: 24px; font-size: 24px; font-weight: 700;">Deployment Confirmation</h2>
            <p style="margin-bottom: 24px; color: var(--text-secondary);">Review user R2 bucket assignments before deploying:</p>
            <div style="margin-bottom: 24px;">
              \${data.users.map(user => \`
                <div style="padding: 16px; margin-bottom: 12px; background: var(--bg-elevated); border-radius: 8px; border: 1px solid var(--border);">
                  <div style="font-weight: 600; margin-bottom: 8px;">\${user.name} (\${user.email})</div>
                  <div style="font-size: 0.875rem; color: var(--text-secondary);">
                    <div>R2 Bucket: <strong>\${user.preferredR2Bucket}</strong> (\${user.preferredR2BucketName})</div>
                    <div>Storage Mode: <strong>\${user.storageMode}</strong></div>
                    <div>Deployment Mode: <strong>\${user.deploymentMode}</strong></div>
                  </div>
                </div>
              \`).join('')}
            </div>
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button onclick="this.closest('div[style*=\\"position: fixed\\"]').remove()" style="padding: 12px 24px; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 8px; cursor: pointer; font-weight: 600;">Cancel</button>
              <button onclick="confirmDeployment()" style="padding: 12px 24px; background: var(--accent); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Confirm & Deploy</button>
            </div>
          </div>
        \`;
        document.body.appendChild(modal);

        // Store data for confirmation
        eploymentData = data;
      } catch (error) {
        alert('Error loading deployment confirmation: ' + error.message);
      }
    }

    async function confirmDeployment() {
      try {
        const response = await fetch('/api/deployment/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            confirmed: true,
            deploymentType: 'production',
          }),
        });

        const data = await response.json();

        if (data.success) {
          alert('Deployment confirmed! Run "wrangler deploy" to execute.');
          document.querySelector('div[style*="position: fixed"]')?.remove();
        } else {
          alert('Deployment failed: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        alert('Error confirming deployment: ' + error.message);
      }
    }

    // Sidebar toggle (desktop)
    function toggleSidebar() {
      const sidebar = document.querySelector('.sidebar');
      sidebar.classList.toggle('collapsed');
      localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    }

    // Restore sidebar state
    function restoreSidebarState() {
      const collapsed = localStorage.getItem('sidebarCollapsed') === 'true';
      const sidebar = document.querySelector('.sidebar');
      // Only restore collapsed state on desktop
      if (collapsed && window.innerWidth > 768) {
        sidebar.classList.add('collapsed');
      }
    }

    // D1 Database Functions
    async function loadD1Databases() {
      try {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 10,
            method: 'tools/call',
            params: { name: 'list_d1_databases', arguments: {} }
          })
        });
        const data = await response.json();
        if (data.result && data.result.content) {
          const databases = JSON.parse(data.result.content[0].text);
          const select = document.getElementById('d1DatabaseSelect');
          select.innerHTML = '<option value="">Select a database...</option>';
          databases.forEach(db => {
            const option = document.createElement('option');
            option.value = db.binding;
            option.textContent = db.name;
            select.appendChild(option);
          });
        }
      } catch (error) {
        console.error('Error loading databases:', error);
      }
    }

    async function executeD1Query() {
      const dbName = document.getElementById('d1DatabaseSelect').value;
      const query = document.getElementById('d1QueryInput').value;
      if (!dbName || !query) {
        showD1Message('Please select a database and enter a query', 'error');
        return;
      }
      const resultsDiv = document.getElementById('d1Results');
      resultsDiv.innerHTML = '<div class="loading">Executing query...</div>';
      try {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 11,
            method: 'tools/call',
            params: {
              name: 'query_d1_database',
              arguments: { database: dbName, query }
            }
          })
        });
        const data = await response.json();
        if (data.error) {
          showD1Message('Error: ' + data.error.message, 'error');
          resultsDiv.innerHTML = '';
          return;
        }
        if (data.result && data.result.content) {
          const result = JSON.parse(data.result.content[0].text);
          renderD1Results(result);
        }
      } catch (error) {
        showD1Message('Error: ' + error.message, 'error');
        resultsDiv.innerHTML = '';
      }
    }

    async function getD1Schema() {
      const dbName = document.getElementById('d1DatabaseSelect').value;
      if (!dbName) {
        showD1Message('Please select a database', 'error');
        return;
      }
      const resultsDiv = document.getElementById('d1Results');
      resultsDiv.innerHTML = '<div class="loading">Loading schema...</div>';
      try {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 12,
            method: 'tools/call',
            params: {
              name: 'get_d1_schema',
              arguments: { database: dbName }
            }
          })
        });
        const data = await response.json();
        if (data.error) {
          showD1Message('Error: ' + data.error.message, 'error');
          resultsDiv.innerHTML = '';
          return;
        }
        if (data.result && data.result.content) {
          const schema = JSON.parse(data.result.content[0].text);
          resultsDiv.innerHTML = '<pre style="background: var(--bg-elevated); padding: var(--space-md); border-radius: var(--radius-md); overflow-x: auto;">' + JSON.stringify(schema, null, 2) + '</pre>';
        }
      } catch (error) {
        showD1Message('Error: ' + error.message, 'error');
        resultsDiv.innerHTML = '';
      }
    }

    function renderD1Results(result) {
      const resultsDiv = document.getElementById('d1Results');
      if (!result.results || result.results.length === 0) {
        resultsDiv.innerHTML = '<div class="loading">No results</div>';
        return;
      }
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.background = 'var(--bg-secondary)';
      table.style.borderRadius = 'var(--radius-md)';
      table.style.overflow = 'hidden';

      // Header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      Object.keys(result.results[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        th.style.padding = 'var(--space-md)';
        th.style.background = 'var(--bg-elevated)';
        th.style.textAlign = 'left';
        th.style.fontWeight = '600';
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Body
      const tbody = document.createElement('tbody');
      result.results.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(value => {
          const td = document.createElement('td');
          td.textContent = value === null ? 'NULL' : String(value);
          td.style.padding = 'var(--space-md)';
          td.style.borderTop = '1px solid var(--border)';
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      resultsDiv.innerHTML = '';
      resultsDiv.appendChild(table);
    }

    function showD1Message(message, type) {
      const area = document.getElementById('d1MessageArea');
      const div = document.createElement('div');
      div.className = type;
      div.textContent = message;
      area.innerHTML = '';
      area.appendChild(div);
      setTimeout(() => div.remove(), 5000);
    }

    // KV Functions
    async function loadKVNamespaces() {
      try {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 20,
            method: 'tools/call',
            params: { name: 'list_kv_namespaces', arguments: {} }
          })
        });
        const data = await response.json();
        if (data.result && data.result.content) {
          const namespaces = JSON.parse(data.result.content[0].text);
          const select = document.getElementById('kvNamespaceSelect');
          select.innerHTML = '<option value="">Select a namespace...</option>';
          namespaces.forEach(ns => {
            const option = document.createElement('option');
            option.value = ns;
            option.textContent = ns;
            select.appendChild(option);
          });
        }
      } catch (error) {
        console.error('Error loading KV namespaces:', error);
      }
    }

    async function readKV() {
      const namespace = document.getElementById('kvNamespaceSelect').value;
      const key = document.getElementById('kvReadKey').value;
      if (!namespace || !key) {
        alert('Please select a namespace and enter a key');
        return;
      }
      const resultDiv = document.getElementById('kvReadResult');
      resultDiv.textContent = 'Loading...';
      try {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 21,
            method: 'tools/call',
            params: {
              name: 'read_kv',
              arguments: { namespace, key }
            }
          })
        });
        const data = await response.json();
        if (data.error) {
          resultDiv.textContent = 'Error: ' + data.error.message;
          return;
        }
        if (data.result && data.result.content) {
          resultDiv.textContent = data.result.content[0].text || '(empty)';
        }
      } catch (error) {
        resultDiv.textContent = 'Error: ' + error.message;
      }
    }

    async function writeKV() {
      const namespace = document.getElementById('kvNamespaceSelect').value;
      const key = document.getElementById('kvWriteKey').value;
      const value = document.getElementById('kvWriteValue').value;
      if (!namespace || !key || !value) {
        alert('Please fill in all fields');
        return;
      }
      try {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 22,
            method: 'tools/call',
            params: {
              name: 'write_kv',
              arguments: { namespace, key, value }
            }
          })
        });
        const data = await response.json();
        if (data.error) {
          alert('Error: ' + data.error.message);
          return;
        }
        alert('Key written successfully!');
        document.getElementById('kvWriteKey').value = '';
        document.getElementById('kvWriteValue').value = '';
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }

    // Workers Functions
    async function loadWorkers() {
      const listDiv = document.getElementById('workersList');
      listDiv.innerHTML = '<div class="loading">Loading workers...</div>';
      try {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 30,
            method: 'tools/call',
            params: { name: 'list_workers', arguments: {} }
          })
        });
        const data = await response.json();
        if (data.error) {
          showWorkersMessage('Error: ' + data.error.message, 'error');
          listDiv.innerHTML = '';
          return;
        }
        if (data.result && data.result.content) {
          const workers = JSON.parse(data.result.content[0].text);
          if (workers.length === 0) {
            listDiv.innerHTML = '<div class="loading">No workers found</div>';
            return;
          }
          listDiv.innerHTML = workers.map(worker => \`
            <div style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-lg); margin-bottom: var(--space-md);">
              <div style="font-weight: 600; font-size: 1.125rem; margin-bottom: var(--space-xs);">\${worker.id || worker.name || 'Unknown'}</div>
              <div style="color: var(--text-secondary); font-size: 0.875rem;">\${worker.created_on ? 'Created: ' + new Date(worker.created_on * 1000).toLocaleDateString() : ''}</div>
            </div>
          \`).join('');
        }
      } catch (error) {
        showWorkersMessage('Error: ' + error.message, 'error');
        listDiv.innerHTML = '';
      }
    }

    function showWorkersMessage(message, type) {
      const area = document.getElementById('workersMessageArea');
      const div = document.createElement('div');
      div.className = type;
      div.textContent = message;
      area.innerHTML = '';
      area.appendChild(div);
      setTimeout(() => div.remove(), 5000);
    }

    // Load R2 buckets
    async function loadBuckets() {
      try {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/call',
            params: {
              name: 'list_r2_buckets',
              arguments: {}
            }
          })
        });
        const data = await response.json();
        console.log('Buckets response:', data);

        if (data.error) {
          showMessage('Error: ' + data.error.message, 'error');
          console.error('MCP Error:', data.error);
          return;
        }

        if (data.result && data.result.content && data.result.content[0]) {
          const buckets = JSON.parse(data.result.content[0].text);
          console.log('Parsed buckets:', buckets);
          renderBuckets(buckets);
        } else {
          showMessage('Unexpected response format. Check console for details.', 'error');
          console.error('Unexpected response:', data);
        }
      } catch (error) {
        showMessage('Error loading buckets: ' + error.message, 'error');
        console.error('Load buckets error:', error);
      }
    }

    // Render buckets as icons with stats
    async function renderBuckets(buckets) {
      const grid = document.getElementById('bucketsGrid');
      if (buckets.length === 0) {
        grid.innerHTML = '<div class="loading">No buckets found.</div>';
        return;
      }

      // Show loading state
      grid.innerHTML = buckets.map(bucket => {
        const hasBinding = bucket.binding && bucket.isBound !== false;
        const bindingText = bucket.binding || 'Not bound';
        const onClick = hasBinding ? \`openBucketModal('\${bucket.binding || bucket.name}', '\${bucket.name}')\` : 'showUnboundBucketInfo(\\'' + bucket.name + '\\')';
        const badge = hasBinding ? '' : '<div style="position: absolute; top: 8px; right: 8px; background: var(--warning); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">API Only</div>';

        return \`
        <div class="bucket-card" onclick="\${onClick}" style="p relative; \${!hasBinding ? 'opacity: 0.8;' : ''}">
          \${badge}
          <div class="bucket-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div class="bucket-name">\${bucket.name}</div>
          <div class="bucket-binding" style="font-size: 0.75rem; color: \${hasBinding ? 'var(--text-secondary)' : 'var(--warning)'};">\${bindingText}</div>
          <div class="bucket-stats">
            <div class="bucket-stat">
              <div class="bucket-stat-value">...</div>
              <div class="bucket-stat-label">Size</div>
            </div>
            <div class="bucket-stat">
              <div class="bucket-stat-value">...</div>
              <div class="bucket-stat-label">Files</div>
            </div>
          </div>
        </div>
      \`;
      }).join('');

      // Load stats for each bucket (only if bound)
      for (const bucket of buckets) {
        if (!bucket.binding || bucket.isBound === false) {
          // For unbound buckets, show placeholder or fetch via API if needed
          const card = Array.from(grid.children).find(card =>
            card.textContent.includes(bucket.name)
          );
          if (card) {
            const statsDiv = card.querySelector('.bucket-stats');
            statsDiv.innerHTML = \`
              <div class="bucket-stat">
                <div class="bucket-stat-value">—</div>
                <div class="bucket-stat-label">Size</div>
              </div>
              <div class="bucket-stat">
                <div class="bucket-stat-value">—</div>
                <div class="bucket-stat-label">Files</div>
              </div>
            \`;
          }
          continue;
        }

        try {
          const stats = await getBucketStats(bucket.binding || bucket.name);
          const card = Array.from(grid.children).find(card =>
            card.textContent.includes(bucket.name)
          );
          if (card) {
            const statsDiv = card.querySelector('.bucket-stats');
            statsDiv.innerHTML = \`
              <div class="bucket-stat">
                <div class="bucket-stat-value">\${formatBytes(stats.totalSize)}</div>
                <div class="bucket-stat-label">Size</div>
              </div>
              <div class="bucket-stat">
                <div class="bucket-stat-value">\${stats.objectCount.toLocaleString()}</div>
                <div class="bucket-stat-label">Files</div>
              </div>
            \`;
          }
        } catch (error) {
          console.error(\`Error loading stats for \${bucket.binding || bucket.name}:\`, error);
        }
      }
    }

    // Show info for unbound buckets
    function showUnboundBucketInfo(bucketName) {
      alert(\`Bucket "\${bucketName}" is not bound to this worker.\\n\\nTo access this bucket:\\n1. Add it to wrangler.toml bindings\\n2. Or use Cloudflare API directly\\n\\nS3 API: https://ede6590ac0d2fb7daf155b35653457b2.r2.cloudflarestorage.com/\${bucketName}\`);
    }

    // Get bucket statistics
    async function getBucketStats(bucketName) {
      try {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 100,
            method: 'tools/call',
            params: {
              name: 'get_r2_bucket_stats',
              arguments: { bucket: bucketName }
            }
          })
        });
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message);
        }
        if (data.result && data.result.content) {
          return JSON.parse(data.result.content[0].text);
        }
        return { totalSize: 0, objectCount: 0 };
      } catch (error) {
        console.error('Error getting bucket stats:', error);
        return { totalSize: 0, objectCount: 0 };
      }
    }

    // Open bucket modal
    async function openBucketModal(binding, name) {
      currentBucket = binding;
      const modal = document.getElementById('bucketModal');
      document.getElementById('bucketModalTitle').textContent = name;
      document.getElementById('bucketModalSubtitle').textContent = binding;
      modal.classList.add('active');

      // Load stats
      const statsDiv = document.getElementById('bucketStats');
      statsDiv.innerHTML = '<div class="loading">Loading statistics...</div>';
      const stats = await getBucketStats(binding);
      statsDiv.innerHTML = \`
        <div style="background: var(--bg-elevated); padding: var(--space-lg); border-radius: var(--radius-lg);">
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: var(--space-xs);">Total Size</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">\${formatBytes(stats.totalSize)}</div>
        </div>
        <div style="background: var(--bg-elevated); padding: var(--space-lg); border-radius: var(--radius-lg);">
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: var(--space-xs);">Object Count</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">\${stats.objectCount.toLocaleString()}</div>
        </div>
        <div style="background: var(--bg-elevated); padding: var(--space-lg); border-radius: var(--radius-lg);">
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: var(--space-xs);">Last Modified</div>
          <div style="font-size: 1rem; font-weight: 600; color: var(--text-primary);">\${stats.lastModified ? new Date(stats.lastModified).toLocaleString() : 'N/A'}</div>
        </div>
      \`;

      // Load files
      await loadBucketFiles();
    }

    // Close bucket modal
    function closeBucketModal() {
      document.getElementById('bucketModal').classList.remove('active');
      currentBucket = '';
    }

    // Refresh bucket modal
    async function refreshBucketModal() {
      if (currentBucket) {
        await openBucketModal(currentBucket, document.getElementById('bucketModalTitle').textContent);
      }
    }

    // Load files for bucket modal
    async function loadBucketFiles() {
      if (!currentBucket) return;
      const container = document.getElementById('bucketFilesContainer');
      container.innerHTML = '<div class="loading">Loading files...</div>';

      try {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/call',
            params: {
              name: 'list_r2_objects',
              arguments: {
                bucket: currentBucket,
                limit: 1000
              }
            }
          })
        });
        const data = await response.json();

        if (data.error) {
          container.innerHTML = '<div class="error">Error: ' + data.error.message + '</div>';
          return;
        }

        if (data.result && data.result.content && data.result.content[0]) {
          const result = JSON.parse(data.result.content[0].text);
          currentFiles = result.objects || [];
          renderBucketFiles(currentFiles);
        } else {
          container.innerHTML = '';
        }
      } catch (error) {
        container.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
      }
    }

    // Render files in bucket modal
    function renderBucketFiles(files) {
      const container = document.getElementById('bucketFilesContainer');
      if (files.length === 0) {
        container.innerHTML = '<div class="loading">No files in this bucket</div>';
        return;
      }
      container.innerHTML = files.map(file => {
        const ext = file.key.split('.').pop().toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
        const isHTML = ext === 'html' || ext === 'htm';
        const icon = getFileIcon(ext);
        return \`
          <div class="file-card" onclick="\${isHTML ? \`previewHTML('\${file.key}')\` : \`downloadFile('\${file.key}')\`}">
            \${isHTML ? '<div class="file-type-badge">HTML</div>' : ''}
            <div class="file-icon">
              \${isImage ? \`<img src="/api/file/\${currentBucket}/\${encodeURIComponent(file.key)}" alt="\${file.key}" onerror="this.parentElement.innerHTML='\${icon}'">\` : icon}
            </div>
            <div class="file-name">\${file.key.split('/').pop()}</div>
            <div class="file-meta">\${formatBytes(file.size)} • \${formatDate(file.uploaded)}</div>
          </div>
        \`;
      }).join('');
    }

    // Refresh all buckets
    async function refreshAllBuckets() {
      await loadBuckets();
    }

    // Setup bucket modal drag and drop
    function setupBucketModalDragAndDrop() {
      const dropZone = document.getElementById('bucketDropZone');
      if (!dropZone) return;

      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
      });
      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'), false);
      });
      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'), false);
      });
      dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleBucketFiles(files);
      }, false);
      dropZone.addEventListener('click', () => document.getElementById('bucketFileInput').click());
    }

    function setupBucketFileInput() {
      const input = document.getElementById('bucketFileInput');
      if (input) {
        input.addEventListener('change', (e) => {
          handleBucketFiles(e.target.files);
        });
      }
    }

    async function handleBucketFiles(files) {
      if (!currentBucket) {
        showMessage('Please select a bucket first', 'error');
        return;
      }
      for (const file of files) {
        await uploadFile(file);
      }
      await loadBucketFiles();
      await refreshBucketModal();
    }

    // Load files from bucket
    async function loadFiles() {
      if (!currentBucket) return;
      const container = document.getElementById('filesContainer');
      container.innerHTML = '<div class="loading">Loading files...</div>';

      try {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/call',
            params: {
              name: 'list_r2_objects',
              arguments: {
                bucket: currentBucket,
                limit: 1000
              }
            }
          })
        });
        const data = await response.json();
        console.log('Files response:', data);

        if (data.error) {
          showMessage('Error: ' + data.error.message, 'error');
          console.error('MCP Error:', data.error);
          container.innerHTML = '<div class="error">Error: ' + data.error.message + '</div>';
          return;
        }

        if (data.result && data.result.content && data.result.content[0]) {
          const result = JSON.parse(data.result.content[0].text);
          currentFiles = result.objects || [];
          renderFiles(currentFiles);
        } else {
          showMessage('Unexpected response format', 'error');
          console.error('Unexpected response:', data);
          container.innerHTML = '';
        }
      } catch (error) {
        showMessage('Error loading files: ' + error.message, 'error');
        console.error('Load files error:', error);
        container.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
      }
    }

    // Render files
    function renderFiles(files) {
      const container = document.getElementById('filesContainer');
      if (files.length === 0) {
        container.innerHTML = '<div class="loading">No files in this bucket</div>';
        return;
      }
      container.innerHTML = files.map(file => {
        const ext = file.key.split('.').pop().toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
        const isHTML = ext === 'html' || ext === 'htm';
        const icon = getFileIcon(ext);
        return \`
          <div class="file-card" onclick="\${isHTML ? \`previewHTML('\${file.key}')\` : \`downloadFile('\${file.key}')\`}">
            \${isHTML ? '<div class="file-type-badge">HTML</div>' : ''}
            <div class="file-icon">
              \${isImage ? \`<img src="/api/file/\${currentBucket}/\${encodeURIComponent(file.key)}" alt="\${file.key}" onerror="this.parentElement.innerHTML='\${icon}'">\` : icon}
            </div>
            <div class="file-name">\${file.key.split('/').pop()}</div>
            <div class="file-meta">\${formatBytes(file.size)} � \${formatDate(file.uploaded)}</div>
          </div>
        \`;
      }).join('');
    }

    // Get file icon
    function getFileIcon(ext) {
      const icons = {
        html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
        js: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>',
        css: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
        json: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
        pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
      };
      return icons[ext] || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
    }

    // Preview HTML file
    async function previewHTML(key) {
      try {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 3,
            method: 'tools/call',
            params: {
              name: 'read_r2_object',
              arguments: {
                bucket: currentBucket,
                key: key
              }
            }
          })
        });
        const data = await response.json();
        if (data.result) {
          const html = data.result.content[0].text;
          const blob = new Blob([html], { type: 'text/html' });
          previewUrl = URL.createObjectURL(blob);
          document.getElementById('previewIframe').src = previewUrl;
          document.getElementById('modalTitle').textContent = key;
          document.getElementById('htmlModal').classList.add('active');
        }
      } catch (error) {
        showMessage('Error loading HTML: ' + error.message, 'error');
      }
    }

    // Close modal
    function closeModal() {
      document.getElementById('htmlModal').classList.remove('active');
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        previewUrl = '';
      }
    }

    // Open in new tab
    function openInNewTab() {
      if (previewUrl) {
        window.open(previewUrl, '_blank');
      }
    }

    // Download file
    function downloadFile(key) {
      window.open(\`/api/file/\${currentBucket}/\${encodeURIComponent(key)}\`, '_blank');
    }

    // Setup drag and drop
    function setupDragAndDrop() {
      const dropZone = document.getElementById('dropZone');
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
      });
      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'), false);
      });
      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'), false);
      });
      dropZone.addEventListener('drop', handleDrop, false);
      dropZone.addEventListener('click', () => document.getElementById('fileInput').click());
    }

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      handleFiles(files);
    }

    function setupFileInput() {
      document.getElementById('fileInput').addEventListener('change', (e) => {
        handleFiles(e.target.files);
      });
    }

    async function handleFiles(files) {
      if (!currentBucket) {
        showMessage('Please select a bucket first', 'error');
        return;
      }
      for (const file of files) {
        await uploadFile(file);
      }
      loadFiles();
    }

    async function uploadFile(file) {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const content = e.target.result;
          const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 4,
              method: 'tools/call',
              params: {
                name: 'upload_r2_object',
                arguments: {
                  bucket: currentBucket,
                  key: file.name,
                  content: content,
                  contentType: file.type || 'application/octet-stream'
                }
              }
            })
          });
          const data = await response.json();
          console.log('Upload response:', data);

          if (data.error) {
            showMessage(\`Error uploading \${file.name}: \${data.error.message}\`, 'error');
            console.error('Upload error:', data.error);
          } else if (data.result) {
            showMessage(\`Uploaded: \${file.name}\`, 'success');
          } else {
            showMessage(\`Unexpected response for \${file.name}\`, 'error');
            console.error('Unexpected upload response:', data);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        showMessage(\`Error uploading \${file.name}: \${error.message}\`, 'error');
      }
    }

    function setupSearch() {
      document.getElementById('searchInput').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = currentFiles.filter(f => f.key.toLowerCase().includes(query));
        renderFiles(filtered);
      });
    }

    function refreshFiles() {
      if (currentBucket) loadFiles();
    }

    function showMessage(message, type) {
      const area = document.getElementById('messageArea');
      const div = document.createElement('div');
      div.className = type;
      div.textContent = message;
      area.innerHTML = '';
      area.appendChild(div);
      console.log(\`[\${type.toUpperCase()}]\`, message);
      setTimeout(() => div.remove(), 5000);
    }

    function formatBytes(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    }

    // Close modals on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
        closeBucketModal();
        closeHelperModal();
        closeMobileSidebar();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMobileSidebar();
      }
    });

    // Team Management Functions
    async function loadTeamMembers() {
      try {
        const response = await fetch('/api/team/members');
        const members = await response.json();
        renderTeamMembers(members);
      } catch (error) {
        console.error('Error loading team members:', error);
      }
    }

    function renderTeamMembers(members) {
      const container = document.getElementById('teamMembersList');
      if (!container) return;

      container.innerHTML = members.map(member => \`
        <div style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-lg); margin-bottom: var(--space-md); display: flex; align-items: center; justify-content: space-between;">
          <div style="flex: 1;">
            <div style="font-size: 1.125rem; font-weight: 700; margin-bottom: var(--space-xs);">\${member.name}</div>
            <div style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-xs);">\${member.email}</div>
            <div style="display: flex; gap: var(--space-md); margin-top: var(--space-sm);">
              <span style="background: \${member.role === 'admin' ? 'var(--accent-light)' : 'var(--bg-elevated)'}; color: \${member.role === 'admin' ? 'var(--accent)' : 'var(--text-secondary)'}; padding: 4px 12px; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">
                \${member.role}
              </span>
              <span style="background: \${member.sshAccess ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-elevated)'}; color: \${member.sshAccess ? 'var(--status-success)' : 'var(--text-muted)'}; padding: 4px 12px; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 600;">
                SSH: \${member.sshAccess ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      \`).join('');
    }

    async function sendNotification() {
      const recipient = document.getElementById('notificationRecipient').value;
      const title = document.getElementById('notificationTitle').value;
      const message = document.getElementById('notificationMessage').value;

      if (!title || !message) {
        alert('Please fill in title and message');
        return;
      }

      try {
        const response = await fetch('/api/team/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipient, title, message, type: 'update' })
        });
        const data = await response.json();
        if (data.success) {
          alert(\`Notification sent\${data.sent ? \` to \${data.sent} team members\` : ''}!\`);
          document.getElementById('notificationTitle').value = '';
          document.getElementById('notificationMessage').value = '';
        }
      } catch (error) {
        alert('Error sending notification: ' + error.message);
      }
    }

    async function sendWelcomeNotifications() {
      if (!confirm('Send welcome notifications to all team members?')) return;

      try {
        const response = await fetch('/api/team/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient: 'all',
            title: 'Welcome to MeauxMCP Dashboard! 🚀',
            message: \`Hi there!

You now have access to the MeauxMCP Dashboard with:
• Secure SSH access for running dev projects
• R2 Storage management (13+ buckets)
• D1 Database query interface
• KV Namespace management
• Cloudflare Workers monitoring

Access your dashboard: https://meauxmcp.meauxbility.workers.dev

Your SSH access is enabled, and you can start running commands to finish launching apps!

Let's build something amazing! 🎉\`,
            type: 'welcome'
          })
        });
        const data = await response.json();
        alert(\`Welcome notifications sent to \${data.sent || 3} team members!\`);
      } catch (error) {
        alert('Error sending notifications: ' + error.message);
      }
    }

    // SSH Functions
    async function loadSSHConnections() {
      try {
        const response = await fetch('/api/ssh/connections?email=sam@meauxbility.org');
        const connections = await response.json();
        renderSSHConnections(connections);
      } catch (error) {
        console.error('Error loading SSH connections:', error);
      }
    }

    function renderSSHConnections(connections) {
      const select = document.getElementById('sshConnectionSelect');
      if (!select) return;

      select.innerHTML = '<option value="">Select SSH connection...</option>';
      if (connections.length === 0) {
        select.innerHTML += '<option value="" disabled>No connections configured. Add one via API.</option>';
        return;
      }

      connections.forEach(conn => {
        const option = document.createElement('option');
        option.value = conn.id;
        option.textContent = \`\${conn.name} (\${conn.host}:\${conn.port})\`;
        select.appendChild(option);
      });
    }

    async function executeSSHCommand() {
      const connectionId = document.getElementById('sshConnectionSelect').value;
      const command = document.getElementById('sshCommand').value;
      const workingDir = document.getElementById('sshWorkingDir').value;

      if (!connectionId || !command) {
        alert('Please select a connection and enter a command');
        return;
      }

      const outputDiv = document.getElementById('sshOutput');
      outputDiv.textContent = 'Executing command...';

      try {
        const response = await fetch('/api/ssh/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            connectionId,
            command,
            workingDirectory: workingDir || undefined,
            email: 'sam@meauxbility.org'
          })
        });
        const data = await response.json();

        if (data.error) {
          outputDiv.textContent = \`Error: \${data.error}\`;
        } else {
          outputDiv.textContent = data.output || data.message || 'Command executed successfully';
        }
      } catch (error) {
        outputDiv.textContent = \`Error: \${error.message}\`;
      }
    }
    // Mobile Sidebar Functions
    function toggleMobileSidebar() {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      const isOpen = sidebar.classList.contains('mobile-open');

      if (isOpen) {
        closeMobileSidebar();
      } else {
        sidebar.classList.add('mobile-open');
        overlay.classList.add('active');
        document.body.classList.add('menu-open');
      }
    }

    function closeMobileSidebar() {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    }

    // Update navigation to close mobile sidebar
    function setupNavigation() {
      document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
          const view = item.dataset.view;
          // Update active state
          document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
          item.classList.add('active');

          // Hide all views
          document.querySelectorAll('.view-panel').forEach(panel => {
            panel.style.display = 'none';
          });

          // Show selected view
          const viewPanel = document.getElementById(view + 'View');
          if (viewPanel) {
            viewPanel.style.display = 'block';

            // Load data when switching to specific views
            if (view === 'ssh') {
              loadSSHConnections();
            } else if (view === 'messageboard') {
              loadMessages();
            } else if (view === 'team') {
              loadTeamMembers();
            } else if (view === 'workers') {
              loadWorkers();
            } else if (view === 'r2') {
              loadBuckets();
            } else if (view === 'd1') {
              loadD1Databases();
            } else if (view === 'kv') {
              loadKVNamespaces();
            } else if (view === 'meauxmedia') {
              loadMeauxMediaData();
            }
          }

          // Close mobile sidebar after selection
          closeMobileSidebar();
        });
      });
    }

    // Team Management Functions
    async function loadTeamMembers() {
      try {
        const response = await fetch('/api/team/members');
        const members = await response.json();
        renderTeamMembers(members);
      } catch (error) {
        console.error('Error loading team members:', error);
        const container = document.getElementById('teamMembersList');
        if (container) {
          container.innerHTML = '<div class="error">Error loading team members</div>';
        }
      }
    }

    function renderTeamMembers(members) {
      const container = document.getElementById('teamMembersList');
      if (!container) return;

      if (!members || members.length === 0) {
        container.innerHTML = '<div class="loading">No team members found</div>';
        return;
      }

      container.innerHTML = members.map(member => \`
        <div style="padding: var(--space-lg); background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-lg); margin-bottom: var(--space-md);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
            <div>
              <div style="font-weight: 600; font-size: 1.125rem;">\${member.name || member.email}</div>
              <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px;">\${member.email}</div>
            </div>
            <div style="padding: 4px 12px; background: var(--bg-secondary); border-radius: var(--radius-md); font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">
              \${member.role || 'member'}
            </div>
          </div>
          \${member.preferredR2Bucket ? \`<div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: var(--space-sm);">R2 Bucket: <strong>\${member.preferredR2Bucket}</strong></div>\` : ''}
        </div>
      \`).join('');
    }

    // Message Board Functions
    async function sendMessage() {
      const recipient = document.getElementById('messageRecipient').value;
      const subject = document.getElementById('messageSubject').value;
      const message = document.getElementById('messageContent').value;

      if (!subject || !message) {
        alert('Please enter a subject and message');
        return;
      }

      try {
        const response = await fetch('/api/team/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient: recipient,
            title: subject,
            message: message
          })
        });

        const data = await response.json();
        if (data.success) {
          alert('Message sent successfully!');
          document.getElementById('messageSubject').value = '';
          document.getElementById('messageContent').value = '';
          loadMessages();
        } else {
          alert('Error sending message: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }

    async function loadMessages() {
      // Load recent messages/notifications
      try {
        const response = await fetch('/api/team/members');
        const members = await response.json();
        // Could extend to show message history
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }

    // Universal Helper Functions
    function openHelperModal() {
      document.getElementById('helperModal').classList.add('active');
    }

    function closeHelperModal() {
      document.getElementById('helperModal').classList.remove('active');
    }

    async function executeHelperCommand(tool, command) {
      const outputDiv = document.getElementById('helperOutput');
      outputDiv.textContent = 'Executing...';

      try {
        let response;
        if (tool === 'chatgpt') {
          // ChatGPT integration via API
          response = await fetch('/api/helper/chatgpt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: command })
          });
        } else if (tool === 'claude') {
          // Claude integration via API
          response = await fetch('/api/helper/claude', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: command })
          });
        } else if (tool === 'cloudflare-ai') {
          // Cloudflare AI integration
          response = await fetch('/api/helper/cloudflare-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: command })
          });
        } else if (tool === 'wrangler') {
          // Wrangler CLI commands
          response = await fetch('/api/helper/wrangler', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: command })
          });
        } else {
          outputDiv.textContent = 'Unknown tool';
          return;
        }

        if (response.status === 401) {
          const errorData = await response.json();
          outputDiv.textContent = 'Authentication required. Please log in.';
          openLoginModal();
          return;
        }

        const data = await response.json();
        outputDiv.textContent = data.output || data.message || JSON.stringify(data, null, 2);
      } catch (error) {
        outputDiv.textContent = 'Error: ' + error.message;
      }
    }

    // Authentication Functions
    let currentUser = null;

    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();

        if (data.authenticated && data.user) {
          currentUser = data.user;
          document.getElementById('userInfo').style.display = 'flex';
          document.getElementById('userName').textContent = data.user.name || data.user.email;
          document.getElementById('loginBtn').style.display = 'none';
          document.getElementById('storageModeToggle').style.display = 'flex';

          // Show deployment nav for admins
          if (data.user.role === 'admin' || data.user.role === 'owner') {
            document.getElementById('deploymentNavItem').style.display = 'flex';
          }

          loadUserPreferences();
        } else {
          document.getElementById('userInfo').style.display = 'none';
          document.getElementById('loginBtn').style.display = 'block';
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('loginBtn').style.display = 'block';
      }
    }

    function openLoginModal() {
      document.getElementById('loginModal').classList.add('active');
    }

    function closeLoginModal() {
      document.getElementById('loginModal').classList.remove('active');
    }

    async function handleLogin() {
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      if (!email || !password) {
        alert('Please enter email and password');
        return;
      }

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
          closeLoginModal();
          await checkAuth();
          alert('Login successful!');
        } else {
          alert('Login failed: ' + (data.error || 'Invalid credentials'));
        }
      } catch (error) {
        alert('Login error: ' + error.message);
      }
    }

    async function handleLogout() {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        currentUser = null;
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('loginBtn').style.display = 'block';
        alert('Logged out successfully');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // MeauxMedia Functions
    const MEDIA_API_BASE = 'https://www.meauxbility.org';

    function openMediaEditor(mode = null) {
      const url = mode ? \`\${MEDIA_API_BASE}/dashboard/media-editor?mode=\${mode}\` : \`\${MEDIA_API_BASE}/dashboard/media-editor\`;
      window.open(url, '_blank');
    }

    async function loadMeauxMediaData() {
      await Promise.all([
        loadMediaTemplates(),
        loadMediaProjects(),
        loadStreamVideos()
      ]);
    }

    async function loadMediaTemplates() {
      try {
        const response = await fetch(\`\${MEDIA_API_BASE}/api/media/templates\`);
        const data = await response.json();
        if (data.success) {
          document.getElementById('meauxmediaTemplatesCount').textContent = (data.templates || []).length;
        }
      } catch (error) {
        console.error('Error loading templates:', error);
        document.getElementById('meauxmediaTemplatesCount').textContent = '?';
      }
    }

    async function loadMediaProjects() {
      try {
        const response = await fetch(\`\${MEDIA_API_BASE}/api/media/projects\`);
        const data = await response.json();
        if (data.success) {
          const projects = data.projects || [];
          document.getElementById('meauxmediaProjectsCount').textContent = projects.length;
          renderMediaProjects(projects.slice(0, 5)); // Show recent 5
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('meauxmediaProjectsCount').textContent = '?';
      }
    }

    function renderMediaProjects(projects) {
      const container = document.getElementById('meauxmediaProjectsList');
      if (!container) return;

      if (projects.length === 0) {
        container.innerHTML = '<div class="loading">No projects yet. Create your first project!</div>';
        return;
      }

      container.innerHTML = projects.map(project => {
        const createdDate = new Date(project.created_at * 1000).toLocaleDateString();
        return \`
          <div style="padding: var(--space-lg); background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all var(--transition-base);"
               onmouseover="this.style.borderColor='var(--accent)'; this.style.transform='translateX(4px)'"
               onmouseout="this.style.borderColor='var(--border)'; this.style.transform='translateX(0)'"
               onclick="openMediaEditor('\${project.type}')">
            <div>
              <div style="font-weight: 600; margin-bottom: 4px;">\${project.name}</div>
              <div style="font-size: 0.875rem; color: var(--text-secondary);">
                \${project.type === 'image' ? 'Image' : 'Video'} • \${createdDate}
              </div>
            </div>
            <div style="padding: 6px 12px; background: \${project.status === 'exported' ? 'var(--status-success)' : 'var(--bg-secondary)'}; color: \${project.status === 'exported' ? 'white' : 'var(--text-secondary)'}; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">
              \${project.status || 'draft'}
            </div>
          </div>
        \`;
      }).join('');
    }

    async function loadStreamVideos() {
      try {
        const response = await fetch(\`\${MEDIA_API_BASE}/api/cloudflare/stream/videos\`);
        const data = await response.json();
        if (data.success && data.result) {
          const videos = Array.isArray(data.result) ? data.result : (data.result.result || []);
          document.getElementById('meauxmediaStreamCount').textContent = videos.length;
        }
      } catch (error) {
        console.error('Error loading Stream videos:', error);
        document.getElementById('meauxmediaStreamCount').textContent = '?';
      }
    }

    // Initialize helper on page load
    document.addEventListener('DOMContentLoaded', () => {
      loadMessages();
      checkAuth();
      // Check auth every 5 minutes
      setInterval(checkAuth, 5 * 60 * 1000);
    });
  </script>

  <!-- Login Modal -->
  <div class="modal" id="loginModal">
    <div class="modal-content" style="max-width: 400px;">
      <div class="modal-header">
        <div class="modal-title">Login to MeauxMCP</div>
        <button class="modal-close" onclick="closeLoginModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="modal-body" style="padding: var(--space-xl);">
        <div style="margin-bottom: var(--space-md);">
          <label style="display: block; font-weight: 600; margin-bottom: var(--space-xs);">Email</label>
          <input type="email" id="loginEmail" placeholder="sam@meauxbility.org"
            style="width: 100%; padding: var(--space-md); border: 1px solid var(--border); border-radius: var(--radius-md);">
        </div>
        <div style="margin-bottom: var(--space-md);">
          <label style="display: block; font-weight: 600; margin-bottom: var(--space-xs);">Password</label>
          <input type="password" id="loginPassword" placeholder="Enter password"
            style="width: 100%; padding: var(--space-md); border: 1px solid var(--border); border-radius: var(--radius-md);"
            onkeydown="if(event.key==='Enter') handleLogin()">
        </div>
        <button class="btn btn-primary" onclick="handleLogin()" style="width: 100%;">
          Login
        </button>
        <div style="margin-top: var(--space-md); font-size: 0.875rem; color: var(--text-muted); text-align: center;">
          Valid users: sam@meauxbility.org, connor@meauxbility.org, fred@meauxbility.org, amber@meauxbility.org,
          info@inneranimals.com, meauxbility@gmail.com
        </div>
      </div>
    </div>
  </div>

  <!-- Universal Helper Icon (Floating Button) -->
  <button class="helper-icon" onclick="openHelperModal()" title="Development Helper">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  </button>

  <!-- Helper Modal -->
  <div class="modal" id="helperModal">
    <div class="modal-content" style="max-width: 900px;">
      <div class="modal-header">
        <div class="modal-title">Development Helper</div>
        <button class="modal-close" onclick="closeHelperModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="modal-body" style="padding: var(--space-xl);">
        <div
          style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-md); margin-bottom: var(--space-xl);">
          <div class="helper-tool-card"
            onclick="document.getElementById('helperTool').value='chatgpt'; document.getElementById('helperCommand').focus();">
            <div class="helper-tool-icon" style="background: linear-gradient(135deg, #10A37F 0%, #1a7f64 100%);">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path
                  d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                </path>
              </svg>
            </div>
            <h3>ChatGPT</h3>
            <p>AI assistant for code help and questions</p>
          </div>
          <div class="helper-tool-card"
            onclick="document.getElementById('helperTool').value='claude'; document.getElementById('helperCommand').focus();">
            <div class="helper-tool-icon" style="background: linear-gradient(135deg, #D97757 0%, #B85C3C 100%);">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3>Claude</h3>
            <p>Anthropic Claude AI assistant</p>
          </div>
          <div class="helper-tool-card"
            onclick="document.getElementById('helperTool').value='cloudflare-ai'; document.getElementById('helperCommand').focus();">
            <div class="helper-tool-icon" style="background: linear-gradient(135deg, #F6821F 0%, #d66a0f 100%);">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3>Cloudflare AI</h3>
            <p>Cloudflare Workers AI integration</p>
          </div>
          <div class="helper-tool-card"
            onclick="document.getElementById('helperTool').value='wrangler'; document.getElementById('helperCommand').focus();">
            <div class="helper-tool-icon" style="background: linear-gradient(135deg, #F6821F 0%, #d66a0f 100%);">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <h3>Wrangler CLI</h3>
            <p>Execute Wrangler commands</p>
          </div>
        </div>

        <div
          style="background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-lg);">
          <div style="margin-bottom: var(--space-md);">
            <label style="display: block; font-weight: 600; margin-bottom: var(--space-xs);">Tool</label>
            <select id="helperTool" class="bucket-select" style="width: 100%;">
              <option value="chatgpt">ChatGPT</option>
              <option value="claude">Claude (Anthropic)</option>
              <option value="cloudflare-ai">Cloudflare AI</option>
              <option value="wrangler">Wrangler CLI</option>
            </select>
          </div>
          <div style="margin-bottom: var(--space-md);">
            <label style="display: block; font-weight: 600; margin-bottom: var(--space-xs);">Command / Prompt</label>
            <textarea id="helperCommand" placeholder="Enter your command or question..."
              style="width: 100%; min-height: 120px; padding: var(--space-md); border: 1px solid var(--border); border-radius: var(--radius-md); font-family: 'Monaco', 'Courier New', monospace; font-size: 0.875rem;"></textarea>
          </div>
          <button class="btn btn-primary"
            onclick="executeHelperCommand(document.getElementById('helperTool').value, document.getElementById('helperCommand').value)">
            Execute
          </button>
        </div>

        <div style="margin-top: var(--space-xl);">
          <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: var(--space-md);">Output</h3>
          <div id="helperOutput"
            style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-md); min-height: 200px; font-family: 'Monaco', 'Courier New', monospace; font-size: 0.875rem; white-space: pre-wrap; overflow-x: auto;">
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="closeHelperModal()">Close</button>
      </div>
    </div>
  </div>

  <style>
    /* Universal Helper Icon (Floating) */
    .helper-icon {
      position: fixed;
      bottom: var(--space-xl);
      right: var(--space-xl);
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--accent-gradient);
      border: none;
      box-shadow: 0 8px 24px rgba(14, 165, 233, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      transition: all var(--transition-base);
    }

    .helper-icon:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 12px 32px rgba(14, 165, 233, 0.5);
    }

    .helper-icon svg {
      width: 28px;
      height: 28px;
      stroke: white;
      stroke-width: 2.5;
    }

    /* Helper Tool Cards */
    .helper-tool-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      cursor: pointer;
      transition: all var(--transition-base);
      text-align: center;
    }

    .helper-tool-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--accent);
    }

    .helper-tool-icon {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-md);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .helper-tool-icon svg {
      width: 32px;
      height: 32px;
    }

    .helper-tool-card h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: var(--space-xs);
      color: var(--text-primary);
    }

    .helper-tool-card p {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .helper-icon {
        bottom: var(--space-md);
        right: var(--space-md);
        width: 48px;
        height: 48px;
      }

      .helper-icon svg {
        width: 24px;
        height: 24px;
      }

      .modal-content {
        max-width: 95vw !important;
        margin: var(--space-md);
      }
    }
  </style>
</body>

</html>`;