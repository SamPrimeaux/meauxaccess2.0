export default `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inner Animal Media - Dashboard</title>
  <style>
    /* ===== CSS VARIABLES - LIGHT THEME (DEFAULT) ===== */
    :root {
      /* Colors - Purple Theme (Same as MeauxAccess) */
      --primary: #667eea;
      --primary-dark: #5568d3;
      --primary-light: #8b9eff;
      --primary-alpha: rgba(102, 126, 234, 0.1);
      
      /* Neutrals */
      --neutral-50: #f9fafb;
      --neutral-100: #f3f4f6;
      --neutral-200: #e5e7eb;
      --neutral-300: #d1d5db;
      --neutral-400: #9ca3af;
      --neutral-500: #6b7280;
      --neutral-600: #4b5563;
      --neutral-700: #374151;
      --neutral-800: #1f2937;
      --neutral-900: #111827;
      
      /* Semantic */
      --success: #10b981;
      --warning: #f59e0b;
      --error: #ef4444;
      --info: #3b82f6;
      
      /* Surfaces */
      --surface-primary: #ffffff;
      --surface-secondary: #f9fafb;
      --surface-elevated: #ffffff;
      --surface-overlay: rgba(0, 0, 0, 0.5);
      
      /* Text */
      --text-primary: #111827;
      --text-secondary: #6b7280;
      --text-tertiary: #9ca3af;
      
      /* Borders */
      --border-color: #e5e7eb;
      --border-radius: 8px;
      --border-radius-sm: 4px;
      --border-radius-lg: 12px;
      
      /* Shadows */
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      
      /* Spacing */
      --space-1: 0.25rem;
      --space-2: 0.5rem;
      --space-3: 0.75rem;
      --space-4: 1rem;
      --space-5: 1.25rem;
      --space-6: 1.5rem;
      --space-8: 2rem;
      --space-10: 2.5rem;
      --space-12: 3rem;
      
      /* Layout */
      --sidebar-width: 260px;
      --sidebar-collapsed: 60px;
      --header-height: 64px;
      --footer-height: 60px;
      
      /* Transitions */
      --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
      --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
      --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
      
      /* Z-index */
      --z-dropdown: 1000;
      --z-sticky: 1020;
      --z-overlay: 1030;
      --z-modal: 1040;
      --z-tooltip: 1050;
    }

    /* ===== DARK THEME ===== */
    [data-theme="dark"] {
      /* Colors - Purple Theme (Dark Mode) */
      --primary: #8b9eff;
      --primary-dark: #667eea;
      --primary-light: #a5b4fc;
      --primary-alpha: rgba(139, 158, 255, 0.15);
      
      /* Neutrals (Inverted) */
      --neutral-50: #111827;
      --neutral-100: #1f2937;
      --neutral-200: #374151;
      --neutral-300: #4b5563;
      --neutral-400: #6b7280;
      --neutral-500: #9ca3af;
      --neutral-600: #d1d5db;
      --neutral-700: #e5e7eb;
      --neutral-800: #f3f4f6;
      --neutral-900: #ffffff;
      
      /* Surfaces */
      --surface-primary: #1f2937;
      --surface-secondary: #111827;
      --surface-elevated: #374151;
      --surface-overlay: rgba(0, 0, 0, 0.7);
      
      /* Text */
      --text-primary: #ffffff;
      --text-secondary: #d1d5db;
      --text-tertiary: #9ca3af;
      
      /* Borders */
      --border-color: #374151;
      
      /* Shadows (lighter in dark mode) */
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
      --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
    }
    
    /* ===== RESETS ===== */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html {
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      background: var(--neutral-50);
      color: var(--text-primary);
      line-height: 1.5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      transition: background-color var(--transition-base), color var(--transition-base);
    }
    
    /* ===== LAYOUT STRUCTURE ===== */
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .app-header {
      position: sticky;
      top: 0;
      z-index: var(--z-sticky);
      background: var(--surface-primary);
      border-bottom: 1px solid var(--border-color);
      height: var(--header-height);
      display: flex;
      align-items: center;
      padding: 0 var(--space-6);
      box-shadow: var(--shadow-sm);
      transition: background-color var(--transition-base), border-color var(--transition-base);
    }
    
    .app-body {
      flex: 1;
      display: flex;
      overflow: hidden;
    }
    
    .app-sidebar {
      width: var(--sidebar-width);
      background: var(--surface-primary);
      border-right: 1px solid var(--border-color);
      overflow-y: auto;
      overflow-x: hidden;
      transition: transform var(--transition-base), width var(--transition-base), background-color var(--transition-base);
      position: relative;
      z-index: 100;
    }
    
    .app-sidebar.collapsed {
      width: var(--sidebar-collapsed);
    }
    
    .app-main {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      background: var(--neutral-50);
      transition: background-color var(--transition-base);
    }
    
    .app-content {
      padding: var(--space-8);
      max-width: 1600px;
      margin: 0 auto;
    }
    
    .app-footer {
      background: var(--surface-primary);
      border-top: 1px solid var(--border-color);
      padding: var(--space-4) var(--space-6);
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.875rem;
      transition: background-color var(--transition-base), border-color var(--transition-base), color var(--transition-base);
    }
    
    /* ===== HEADER COMPONENTS ===== */
    .header-left {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      flex: 1;
    }
    
    .header-center {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex: 2;
      justify-content: center;
    }
    
    .header-right {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex: 1;
      justify-content: flex-end;
    }
    
    /* Logo & Brand */
    .brand {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      text-decoration: none;
      color: var(--text-primary);
      font-weight: 600;
      font-size: 1.125rem;
      transition: color var(--transition-base);
    }
    
    .brand-icon {
      width: 36px;
      height: 36px;
    }
    
    /* Workspace Switcher */
    .workspace-switcher {
      position: relative;
      min-width: 220px;
    }
    
    .workspace-button {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      background: var(--neutral-50);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: all var(--transition-fast);
      width: 100%;
      font-size: 0.875rem;
    }
    
    .workspace-button:hover {
      background: var(--neutral-100);
      border-color: var(--neutral-300);
    }
    
    .workspace-icon {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      background: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .workspace-name {
      flex: 1;
      text-align: left;
      font-weight: 500;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    /* Command Palette Button */
    .command-button {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      background: var(--neutral-50);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: all var(--transition-fast);
      font-size: 0.875rem;
      color: var(--text-secondary);
      min-width: 200px;
    }
    
    .command-button:hover {
      background: var(--neutral-100);
      border-color: var(--neutral-300);
    }
    
    .command-shortcut {
      margin-left: auto;
      display: flex;
      gap: 2px;
    }
    
    .kbd {
      display: inline-block;
      padding: 2px 6px;
      background: var(--neutral-100);
      border: 1px solid var(--border-color);
      border-radius: 3px;
      font-size: 0.75rem;
      font-family: monospace;
      line-height: 1;
    }
    
    /* Header Icons */
    .header-icons {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    
    .icon-button {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: all var(--transition-fast);
      border: none;
      background: transparent;
      color: var(--text-secondary);
      position: relative;
    }
    
    .icon-button:hover {
      background: var(--neutral-100);
      color: var(--text-primary);
    }
    
    .icon-button.active {
      background: var(--primary-alpha);
      color: var(--primary);
    }
    
    .notification-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background: var(--error);
      border-radius: 50%;
      border: 2px solid var(--surface-primary);
    }
    
    /* Theme Toggle */
    .theme-toggle {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: all var(--transition-fast);
      border: none;
      background: transparent;
      color: var(--text-secondary);
    }
    
    .theme-toggle:hover {
      background: var(--neutral-100);
      color: var(--text-primary);
    }
    
    /* Hamburger Menu */
    .hamburger {
      display: none;
      flex-direction: column;
      gap: 4px;
      cursor: pointer;
      padding: var(--space-2);
    }
    
    .hamburger span {
      display: block;
      width: 24px;
      height: 2px;
      background: var(--text-primary);
      transition: all var(--transition-fast);
    }
    
    .hamburger.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
      opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
    
    /* ===== SIDEBAR COMPONENTS ===== */
    .sidebar-header {
      padding: var(--space-4);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: border-color var(--transition-base);
    }
    
    .sidebar-title {
      font-weight: 600;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
    }
    
    .sidebar-nav {
      padding: var(--space-4) 0;
    }
    
    .nav-section {
      margin-bottom: var(--space-6);
    }
    
    .nav-section-title {
      padding: 0 var(--space-4);
      margin-bottom: var(--space-2);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
    }
    
    .nav-items {
      list-style: none;
    }
    
    .nav-item {
      margin-bottom: 2px;
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2) var(--space-4);
      color: var(--text-secondary);
      text-decoration: none;
      transition: all var(--transition-fast);
      border-left: 3px solid transparent;
      font-size: 0.875rem;
    }
    
    .nav-link:hover {
      background: var(--neutral-50);
      color: var(--text-primary);
    }
    
    .nav-link.active {
      background: var(--primary-alpha);
      color: var(--primary);
      border-left-color: var(--primary);
      font-weight: 500;
    }
    
    .nav-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    
    .nav-label {
      flex: 1;
    }
    
    .nav-badge {
      padding: 2px 6px;
      background: var(--neutral-200);
      border-radius: 10px;
      font-size: 0.625rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    
    .nav-badge.primary {
      background: var(--primary-alpha);
      color: var(--primary);
    }
    
    /* Collapsed sidebar */
    .app-sidebar.collapsed .nav-label,
    .app-sidebar.collapsed .nav-badge,
    .app-sidebar.collapsed .nav-section-title {
      display: none;
    }
    
    .app-sidebar.collapsed .nav-link {
      justify-content: center;
      padding: var(--space-2);
    }
    
    /* ===== MAIN CONTENT ===== */
    .page-header {
      margin-bottom: var(--space-8);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--space-4);
    }
    
    .page-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }
    
    .page-subtitle {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-top: var(--space-1);
    }
    
    .page-actions {
      display: flex;
      gap: var(--space-3);
      align-items: center;
    }
    
    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      border-radius: var(--border-radius);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      border: none;
      text-decoration: none;
    }
    
    .btn-primary {
      background: var(--primary);
      color: white;
    }
    
    .btn-primary:hover {
      background: var(--primary-dark);
    }
    
    .btn-secondary {
      background: var(--neutral-100);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }
    
    .btn-secondary:hover {
      background: var(--neutral-200);
    }
    
    .btn-ghost {
      background: transparent;
      color: var(--text-secondary);
    }
    
    .btn-ghost:hover {
      background: var(--neutral-100);
    }
    
    /* Cards & Panels */
    .card {
      background: var(--surface-primary);
      border-radius: var(--border-radius-lg);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      transition: background-color var(--transition-base), border-color var(--transition-base);
    }
    
    .card-header {
      padding: var(--space-4) var(--space-6);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: border-color var(--transition-base);
    }
    
    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .card-body {
      padding: var(--space-6);
    }
    
    .card-footer {
      padding: var(--space-4) var(--space-6);
      border-top: 1px solid var(--border-color);
      background: var(--neutral-50);
      transition: background-color var(--transition-base), border-color var(--transition-base);
    }
    
    /* Grid */
    .grid {
      display: grid;
      gap: var(--space-6);
    }
    
    .grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
    .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
    .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
    .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
    
    /* Stats Cards */
    .stat-card {
      background: var(--surface-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-lg);
      padding: var(--space-6);
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      transition: background-color var(--transition-base), border-color var(--transition-base);
    }
    
    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--border-radius);
      background: var(--primary-alpha);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .stat-change {
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .stat-change.positive {
      color: var(--success);
    }
    
    .stat-change.negative {
      color: var(--error);
    }
    
    /* Ecosystem Chat Styles (same as meauxaccess) */
    .ecosystem-chat-container {
      display: flex;
      flex-direction: column;
      height: 600px;
      max-height: 80vh;
      background: var(--surface-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
    }

    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4);
      border-bottom: 1px solid var(--border-color);
      background: var(--surface-secondary);
    }

    .chat-header-left {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .chat-icon {
      width: 24px;
      height: 24px;
      color: var(--primary);
    }

    .chat-title {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary);
    }

    .chat-subtitle {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .chat-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .chat-channels {
      width: 200px;
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      background: var(--surface-secondary);
    }

    .channels-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-3) var(--space-4);
      border-bottom: 1px solid var(--border-color);
    }

    .channels-header h4 {
      font-size: 0.875rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary);
    }

    .channels-list {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-2);
    }

    .channel-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--border-radius);
      cursor: pointer;
      margin-bottom: var(--space-1);
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }

    .channel-item:hover {
      background: var(--neutral-100);
      color: var(--text-primary);
    }

    .channel-item.active {
      background: var(--primary-alpha);
      color: var(--primary);
      font-weight: 500;
    }

    .chat-messages-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-4);
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .chat-welcome {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      text-align: center;
      color: var(--text-secondary);
    }

    .chat-welcome h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 var(--space-2) 0;
      color: var(--text-primary);
    }

    .chat-message {
      display: flex;
      gap: var(--space-3);
      padding: var(--space-3);
      border-radius: var(--border-radius);
      transition: background var(--transition-fast);
    }

    .chat-message:hover {
      background: var(--neutral-50);
    }

    .chat-message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      flex-shrink: 0;
    }

    .chat-message-content {
      flex: 1;
      min-width: 0;
    }

    .chat-message-header {
      display: flex;
      align-items: baseline;
      gap: var(--space-2);
      margin-bottom: var(--space-1);
    }

    .chat-message-sender {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--text-primary);
    }

    .chat-message-time {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .chat-message-text {
      font-size: 0.875rem;
      color: var(--text-primary);
      line-height: 1.5;
      word-wrap: break-word;
    }

    .chat-input-area {
      padding: var(--space-4);
      border-top: 1px solid var(--border-color);
      background: var(--surface-secondary);
    }

    .chat-input-wrapper {
      display: flex;
      gap: var(--space-2);
      align-items: center;
    }

    .chat-input {
      flex: 1;
      padding: var(--space-3) var(--space-4);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-lg);
      font-size: 0.875rem;
      background: var(--surface-primary);
      color: var(--text-primary);
      outline: none;
      transition: all var(--transition-fast);
    }

    .chat-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-alpha);
    }

    .chat-send-btn {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: var(--border-radius);
      background: var(--primary);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
      flex-shrink: 0;
    }

    .chat-send-btn:hover {
      background: var(--primary-dark);
      transform: translateY(-1px);
    }

    .chat-send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    /* ===== SLEEP MODE (FILE BROWSER) ===== */
    .sleep-mode-trigger {
      position: fixed;
      bottom: var(--space-8);
      right: var(--space-8);
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: var(--shadow-xl);
      transition: all var(--transition-fast);
      z-index: var(--z-sticky);
    }
    
    .sleep-mode-trigger:hover {
      transform: scale(1.1);
      background: var(--primary-dark);
    }
    
    .sleep-panel {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 400px;
      background: var(--surface-primary);
      border-left: 1px solid var(--border-color);
      box-shadow: var(--shadow-xl);
      transform: translateX(100%);
      transition: transform var(--transition-base), background-color var(--transition-base), border-color var(--transition-base);
      z-index: var(--z-modal);
      display: flex;
      flex-direction: column;
    }
    
    .sleep-panel.active {
      transform: translateX(0);
    }
    
    .sleep-header {
      padding: var(--space-4);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: border-color var(--transition-base);
    }
    
    .sleep-title {
      font-weight: 600;
      font-size: 1.125rem;
      color: var(--text-primary);
    }
    
    .sleep-body {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-4);
    }
    
    .sleep-section {
      margin-bottom: var(--space-6);
    }
    
    .sleep-section-title {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      margin-bottom: var(--space-3);
    }
    
    .file-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    
    .file-item:hover {
      background: var(--neutral-50);
    }
    
    .file-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--border-radius-sm);
      background: var(--neutral-100);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }
    
    .file-info {
      flex: 1;
      min-width: 0;
    }
    
    .file-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .file-meta {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    /* ===== TOOLBAR (FLOATING) ===== */
    .toolbar-trigger {
      position: fixed;
      bottom: var(--space-8);
      left: 50%;
      transform: translateX(-50%);
      padding: var(--space-2) var(--space-4);
      background: var(--surface-primary);
      border: 1px solid var(--border-color);
      border-radius: 999px;
      box-shadow: var(--shadow-xl);
      display: flex;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
      z-index: var(--z-sticky);
      transition: background-color var(--transition-base), border-color var(--transition-base);
    }
    
    .toolbar-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      font-weight: 600;
    }
    
    /* ===== RESPONSIVE ===== */
    @media (max-width: 1199px) {
      .header-center {
        display: none;
      }
    }
    
    @media (max-width: 768px) {
      .hamburger {
        display: flex;
      }
      
      .app-sidebar {
        position: fixed;
        top: var(--header-height);
        left: 0;
        bottom: 0;
        z-index: var(--z-overlay);
        transform: translateX(-100%);
      }
      
      .app-sidebar.mobile-open {
        transform: translateX(0);
      }
      
      .sidebar-overlay {
        display: none;
        position: fixed;
        top: var(--header-height);
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--surface-overlay);
        z-index: calc(var(--z-overlay) - 1);
      }
      
      .sidebar-overlay.active {
        display: block;
      }
      
      .app-content {
        padding: var(--space-4);
      }
      
      .workspace-switcher {
        display: none;
      }
      
      .header-icons .icon-button:not(.user-button):not(.menu-button):not(.theme-toggle) {
        display: none;
      }
      
      .grid-cols-2,
      .grid-cols-3,
      .grid-cols-4 {
        grid-template-columns: 1fr;
      }
      
      .sleep-panel {
        width: 100%;
      }
      
      .sleep-mode-trigger {
        width: 50px;
        height: 50px;
        font-size: 1.25rem;
      }
    }
    
    /* ===== ANIMATIONS ===== */
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
    
    .fade-in {
      animation: fadeIn var(--transition-base) ease-out;
    }
    
    /* ===== UTILITIES ===== */
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .mt-4 { margin-top: var(--space-4); }
    .mb-4 { margin-bottom: var(--space-4); }
    .hidden { display: none; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .gap-2 { gap: var(--space-2); }
    .gap-4 { gap: var(--space-4); }
  </style>
</head>
<body>
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-left">
        <button class="hamburger" id="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <a href="/iaccess" class="brand">
          <svg class="brand-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="35" height="35" fill="#667eea" rx="4"/>
            <rect x="55" y="10" width="35" height="35" fill="#8b9eff" rx="4"/>
            <rect x="10" y="55" width="35" height="35" fill="#8b9eff" rx="4"/>
            <rect x="55" y="55" width="35" height="35" fill="#667eea" rx="4"/>
            <circle cx="50" cy="50" r="8" fill="white"/>
          </svg>
          <span>Inner Animal Media</span>
        </a>
      </div>
      
      <div class="header-center">
        <div class="workspace-switcher">
          <button class="workspace-button" id="workspaceButton">
            <div class="workspace-icon">IAM</div>
            <span class="workspace-name">Inner Animal Media</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.5 6l3.5 3.5L11.5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <button class="command-button" id="commandButton">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
            <circle cx="7" cy="7" r="6" stroke-width="2"/>
            <path d="M12 12l3 3" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Quick search...</span>
          <div class="command-shortcut">
            <span class="kbd">⌘</span>
            <span class="kbd">K</span>
          </div>
        </button>
      </div>
      
      <div class="header-right">
        <div class="header-icons">
          <button class="icon-button theme-toggle" id="themeToggle" title="Toggle theme">
            <svg id="themeIcon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-4.5 6.5a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5v1zM16 10a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zm2.12-10.607a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM17.657 14.657l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414z"/>
            </svg>
          </button>
          
          <button class="icon-button" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M10 2a6 6 0 016 6v3.586a1 1 0 00.293.707l1.414 1.414A1 1 0 0117 15H3a1 1 0 01-.707-1.707l1.414-1.414A1 1 0 004 11.586V8a6 6 0 016-6z" stroke-width="1.5"/>
              <path d="M9 17h2" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="notification-badge"></span>
          </button>
          
          <button class="icon-button" title="Help">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <circle cx="10" cy="10" r="8" stroke-width="1.5"/>
              <path d="M10 14v.01M8 8a2 2 0 014 0c0 1-2 1.5-2 3" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          
          <button class="icon-button user-button" title="Account">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.875rem;">
              S
            </div>
          </button>
        </div>
      </div>
    </header>
    
    <!-- Body -->
    <div class="app-body">
      <!-- Sidebar -->
      <aside class="app-sidebar" id="sidebar">
        <div class="sidebar-header">
          <span class="sidebar-title">Navigation</span>
          <button class="icon-button btn-ghost" id="collapseSidebar" title="Collapse sidebar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 8h12M8 2l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <nav class="sidebar-nav">
          <!-- Overview -->
          <div class="nav-section">
            <h3 class="nav-section-title">Overview</h3>
            <ul class="nav-items">
              <li class="nav-item">
                <a href="/iaccess" class="nav-link active">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                  <span class="nav-label">Dashboard</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/iaccess/analytics" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                  </svg>
                  <span class="nav-label">Analytics</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/iaccess/projects" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                  </svg>
                  <span class="nav-label">Projects</span>
                  <span class="nav-badge primary">8</span>
                </a>
              </li>
            </ul>
          </div>
          
          <!-- Content -->
          <div class="nav-section">
            <h3 class="nav-section-title">Content</h3>
            <ul class="nav-items">
              <li class="nav-item">
                <a href="/iaccess/media" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
                  </svg>
                  <span class="nav-label">Media Library</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/iaccess/assets" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                  <span class="nav-label">Assets</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/iaccess/storage" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"/>
                  </svg>
                  <span class="nav-label">Storage</span>
                </a>
              </li>
            </ul>
          </div>
          
          <!-- System -->
          <div class="nav-section">
            <h3 class="nav-section-title">System</h3>
            <ul class="nav-items">
              <li class="nav-item">
                <a href="/iaccess/databases" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z"/>
                    <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z"/>
                    <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z"/>
                  </svg>
                  <span class="nav-label">Databases</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/iaccess/workers" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
                  </svg>
                  <span class="nav-label">Workers</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/iaccess/settings" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
                  </svg>
                  <span class="nav-label">Settings</span>
                </a>
              </li>
            </ul>
          </div>
          
          <!-- Communication -->
          <div class="nav-section">
            <h3 class="nav-section-title">Communication</h3>
            <ul class="nav-items">
              <li class="nav-item">
                <a href="/iaccess/chat" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                  </svg>
                  <span class="nav-label">Ecosystem Chat</span>
                  <span class="nav-badge primary">Live</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      
      <!-- Overlay for mobile -->
      <div class="sidebar-overlay" id="sidebarOverlay"></div>
      
      <!-- Main Content -->
      <main class="app-main">
        <div class="app-content fade-in">
          <!-- Page Header -->
          <div class="page-header">
            <div>
              <h1 class="page-title">Dashboard Overview</h1>
              <p class="page-subtitle">Welcome to Inner Animal Media. Here's what's happening today.</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-secondary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                Export
              </button>
              <button class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                New Project
              </button>
            </div>
          </div>
          
          <!-- Stats Grid -->
          <div class="grid grid-cols-4" id="statsGrid">
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-label">Total Projects</div>
              <div class="stat-value">8</div>
              <div class="stat-change positive">↑ 2 new this month</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🎬</div>
              <div class="stat-label">Media Files</div>
              <div class="stat-value">1.2K</div>
              <div class="stat-change positive">↑ 15% this week</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">☁️</div>
              <div class="stat-label">Storage Used</div>
              <div class="stat-value">8.7 GB</div>
              <div class="stat-change">of 50 GB total</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">⚡</div>
              <div class="stat-label">API Requests</div>
              <div class="stat-value">12.5K</div>
              <div class="stat-change positive">↑ 5% this week</div>
            </div>
          </div>
          
          <!-- Recent Activity -->
          <div class="card mt-4">
            <div class="card-header">
              <h2 class="card-title">Recent Activity</h2>
              <button class="btn btn-ghost">View All</button>
            </div>
            <div class="card-body">
              <p style="color: var(--text-secondary); text-align: center; padding: var(--space-8);">
                Activity feed will appear here
              </p>
            </div>
          </div>
        </div>
        
        <!-- Chat View -->
        <div class="page-content" id="chatView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Ecosystem Chat</h1>
              <p class="page-subtitle">Real-time communication across all dashboards</p>
            </div>
          </div>
          
          <div id="ecosystemChatContainer" style="margin-top: var(--space-6);">
            <!-- Chat will be loaded here -->
          </div>
        </div>
      </main>
    </div>
    
    <!-- Footer -->
    <footer class="app-footer">
      © 2025 Inner Animal Media. All rights reserved. • Powered by Cloudflare
    </footer>
  </div>
  
  <!-- Sleep Mode Panel (File Browser) -->
  <div class="sleep-panel" id="sleepPanel">
    <div class="sleep-header">
      <h3 class="sleep-title">📁 File Browser</h3>
      <button class="icon-button" id="closeSleep">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </button>
    </div>
    <div class="sleep-body">
      <div class="sleep-section">
        <h4 class="sleep-section-title">📌 Pinned</h4>
        <div class="file-item">
          <div class="file-icon">📄</div>
          <div class="file-info">
            <div class="file-name">inneranimalmedia-logo.svg</div>
            <div class="file-meta">Updated 2 hours ago</div>
          </div>
        </div>
        <div class="file-item">
          <div class="file-icon">📁</div>
          <div class="file-info">
            <div class="file-name">media-assets</div>
            <div class="file-meta">1,234 files</div>
          </div>
        </div>
      </div>
      
      <div class="sleep-section">
        <h4 class="sleep-section-title">🕐 Recent</h4>
        <div class="file-item">
          <div class="file-icon">🎬</div>
          <div class="file-info">
            <div class="file-name">project-video.mp4</div>
            <div class="file-meta">Opened 5 mins ago</div>
          </div>
        </div>
        <div class="file-item">
          <div class="file-icon">📝</div>
          <div class="file-info">
            <div class="file-name">content-plan.docx</div>
            <div class="file-meta">Modified yesterday</div>
          </div>
        </div>
      </div>
      
      <div class="sleep-section">
        <h4 class="sleep-section-title">📦 R2 Buckets</h4>
        <div class="file-item">
          <div class="file-icon">🪣</div>
          <div class="file-info">
            <div class="file-name">inneranimalmedia-assets</div>
            <div class="file-meta">8.7 GB • 5,432 files</div>
          </div>
        </div>
        <div class="file-item">
          <div class="file-icon">🪣</div>
          <div class="file-info">
            <div class="file-name">meauxbility-docs</div>
            <div class="file-meta">1.2 GB • 234 files</div>
          </div>
        </div>
      </div>
      
      <div style="display: flex; gap: var(--space-2); margin-top: var(--space-4);">
        <button class="btn btn-primary" style="flex: 1;">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
          </svg>
          Upload
        </button>
        <button class="btn btn-secondary" style="flex: 1;">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
          </svg>
          New Folder
        </button>
      </div>
    </div>
  </div>
  
  <!-- Sleep Mode Trigger Button -->
  <button class="sleep-mode-trigger" id="sleepTrigger" title="File Browser (Cmd+B)">
    📁
  </button>
  
  <!-- Floating Toolbar -->
  <div class="toolbar-trigger" id="toolbarTrigger" title="Inner Animal Media Toolbar">
    <div class="toolbar-icon">IAM</div>
    <span style="font-size: 0.875rem; font-weight: 500;">Quick Tools</span>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4.5 6l3.5 3.5L11.5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </div>
  
  <script>
    // Theme Management
    function getTheme() {
      const cookie = document.cookie.match(/theme=([^;]+)/);
      return cookie ? cookie[1] : 'light';
    }
    
    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      document.cookie = \`theme=\${theme}; Path=/; Max-Age=31536000; SameSite=Lax\`;
      
      // Update theme icon
      const themeIcon = document.getElementById('themeIcon');
      if (theme === 'dark') {
        themeIcon.innerHTML = '<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>';
      } else {
        themeIcon.innerHTML = '<path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-4.5 6.5a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5v1zM16 10a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zm2.12-10.607a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM17.657 14.657l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414z"/>';
      }
    }
    
    // Initialize theme
    setTheme(getTheme());
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
      const currentTheme = getTheme();
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    });
    
    // Mobile menu
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      sidebar.classList.toggle('mobile-open');
      sidebarOverlay.classList.toggle('active');
    });
    
    sidebarOverlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      sidebar.classList.remove('mobile-open');
      sidebarOverlay.classList.remove('active');
    });
    
    // Collapse sidebar
    const collapseSidebar = document.getElementById('collapseSidebar');
    collapseSidebar.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
    
    // Sleep mode (file browser)
    const sleepTrigger = document.getElementById('sleepTrigger');
    const sleepPanel = document.getElementById('sleepPanel');
    const closeSleep = document.getElementById('closeSleep');
    
    sleepTrigger.addEventListener('click', () => {
      sleepPanel.classList.add('active');
    });
    
    closeSleep.addEventListener('click', () => {
      sleepPanel.classList.remove('active');
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        alert('Command palette would open here');
      }
      
      // Cmd/Ctrl + B for file browser
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        sleepPanel.classList.toggle('active');
      }
      
      // Escape to close panels
      if (e.key === 'Escape') {
        sleepPanel.classList.remove('active');
      }
    });
    
    // Update active nav link based on current URL
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    // Load stats from API
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        // Update stats if needed
        console.log('Stats loaded:', data);
      })
      .catch(err => console.error('Failed to load stats:', err));
    
    // Client-side routing for iAccess
    function initIAccessRouting() {
      document.querySelectorAll('a[href^="/iaccess"]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const path = new URL(link.href).pathname;
          iAccessNavigateTo(path);
        });
      });
      
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/iaccess')) {
        iAccessNavigateTo(currentPath);
      }
      
      window.addEventListener('popstate', () => {
        iAccessNavigateTo(window.location.pathname);
      });
    }
    
    function iAccessNavigateTo(path) {
      window.history.pushState({}, '', path);
      
      // Hide all views
      document.querySelectorAll('.page-content').forEach(view => {
        view.style.display = 'none';
      });
      
      // Remove active class
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
      });
      
      // Show appropriate view
      if (path === '/iaccess' || path === '/iaccess/') {
        document.querySelector('.page-content:first-of-type').style.display = 'block';
        document.querySelector('a[href="/iaccess"]')?.classList.add('active');
      } else if (path === '/iaccess/chat') {
        const chatView = document.getElementById('chatView');
        if (chatView) {
          chatView.style.display = 'block';
          document.querySelector('a[href="/iaccess/chat"]')?.classList.add('active');
          loadEcosystemChat();
        }
      } else {
        document.querySelector('.page-content:first-of-type').style.display = 'block';
      }
    }
    
    // Ecosystem Chat Functions (same as meauxaccess dashboard)
    let iAccessChatCurrentChannel = 'general';
    let iAccessChatCurrentUser = { email: 'sam@meauxbility.org', name: 'Sam Primeaux' };
    let iAccessChatPollInterval = null;
    let iAccessChatLastMessageTime = null;

    function loadEcosystemChat() {
      const container = document.getElementById('ecosystemChatContainer');
      if (!container) return;
      
      if (container.querySelector('#ecosystemChat')) {
        return; // Already loaded
      }
      
      container.innerHTML = \`
        <div id="ecosystemChat" class="ecosystem-chat-container">
          <div class="chat-header">
            <div class="chat-header-left">
              <svg class="chat-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
              </svg>
              <div>
                <h3 class="chat-title">Ecosystem Chat</h3>
                <p class="chat-subtitle" id="iAccessChatSubtitle">#general</p>
              </div>
            </div>
          </div>

          <div class="chat-body">
            <div class="chat-channels" id="iAccessChatChannelsPanel">
              <div class="channels-header">
                <h4>Channels</h4>
              </div>
              <div class="channels-list" id="iAccessChannelsList">
                <div class="channel-item active" data-channel="general">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                  </svg>
                  <span># general</span>
                </div>
                <div class="channel-item" data-channel="team">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                  </svg>
                  <span># team</span>
                </div>
                <div class="channel-item" data-channel="announcements">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                  </svg>
                  <span># announcements</span>
                </div>
              </div>
            </div>

            <div class="chat-messages-area">
              <div class="chat-messages" id="iAccessChatMessages">
                <div class="chat-welcome">
                  <svg width="48" height="48" viewBox="0 0 20 20" fill="currentColor" style="opacity: 0.5; margin-bottom: 1rem;">
                    <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                  </svg>
                  <h3>Welcome to Ecosystem Chat</h3>
                  <p>Start a conversation in #general</p>
                </div>
              </div>

              <div class="chat-input-area">
                <div class="chat-input-wrapper">
                  <input type="text" id="iAccessChatInput" class="chat-input" placeholder="Type a message..." autocomplete="off" />
                  <button class="chat-send-btn" id="iAccessChatSendBtn">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      \`;
      
      setTimeout(() => {
        initIAccessEcosystemChat();
      }, 100);
    }
    
    function initIAccessEcosystemChat() {
      const userEmail = document.cookie.match(/user=([^;]+)/)?.[1] || 'sam@meauxbility.org';
      const userName = document.cookie.match(/userName=([^;]+)/)?.[1] || 'Sam Primeaux';
      
      iAccessChatCurrentUser = { email: userEmail, name: userName };
      
      const sendBtn = document.getElementById('iAccessChatSendBtn');
      const chatInput = document.getElementById('iAccessChatInput');
      
      if (sendBtn) sendBtn.addEventListener('click', iAccessChatSendMessage);
      if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            iAccessChatSendMessage();
          }
        });
      }

      document.querySelectorAll('#iAccessChannelsList .channel-item').forEach(item => {
        item.addEventListener('click', () => {
          const channel = item.dataset.channel;
          iAccessChatSwitchChannel(channel);
        });
      });

      iAccessChatLoadMessages();
      iAccessChatStartPolling();
    }

    async function iAccessChatSendMessage() {
      const input = document.getElementById('iAccessChatInput');
      const message = input?.value.trim();
      
      if (!message || !input) return;

      const sendBtn = document.getElementById('iAccessChatSendBtn');
      if (sendBtn) sendBtn.disabled = true;

      try {
        const response = await fetch('/api/chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channel: iAccessChatCurrentChannel,
            message,
            sender: iAccessChatCurrentUser.email,
            senderName: iAccessChatCurrentUser.name,
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          if (input) input.value = '';
          iAccessChatAddMessageToUI(data.message);
          iAccessChatLastMessageTime = data.message.timestamp;
        } else {
          alert('Error sending message: ' + (data.error || 'Unknown error'));
        }
      } catch (error: any) {
        alert('Error: ' + error.message);
      } finally {
        if (sendBtn) sendBtn.disabled = false;
        if (input) input.focus();
      }
    }

    async function iAccessChatLoadMessages() {
      try {
        const response = await fetch(\`/api/chat/messages?channel=\${iAccessChatCurrentChannel}&limit=50\`);
        const data = await response.json();
        
        if (data.success) {
          const messagesContainer = document.getElementById('iAccessChatMessages');
          if (!messagesContainer) return;
          
          messagesContainer.innerHTML = '';
          
          if (data.messages.length === 0) {
            messagesContainer.innerHTML = \`
              <div class="chat-welcome">
                <svg width="48" height="48" viewBox="0 0 20 20" fill="currentColor" style="opacity: 0.5; margin-bottom: 1rem;">
                  <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                </svg>
                <h3>No messages yet</h3>
                <p>Be the first to start the conversation!</p>
              </div>
            \`;
          } else {
            data.messages.forEach(msg => iAccessChatAddMessageToUI(msg));
            iAccessChatScrollToBottom();
            iAccessChatLastMessageTime = data.messages[data.messages.length - 1]?.timestamp;
          }
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }

    function iAccessChatAddMessageToUI(message) {
      const messagesContainer = document.getElementById('iAccessChatMessages');
      if (!messagesContainer) return;
      
      const welcome = messagesContainer.querySelector('.chat-welcome');
      if (welcome) welcome.remove();

      const messageEl = document.createElement('div');
      messageEl.className = 'chat-message';
      messageEl.dataset.messageId = message.id;

      const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const initials = message.senderName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);

      messageEl.innerHTML = \`
        <div class="chat-message-avatar">\${initials}</div>
        <div class="chat-message-content">
          <div class="chat-message-header">
            <span class="chat-message-sender">\${message.senderName}</span>
            <span class="chat-message-time">\${time}</span>
          </div>
          <div class="chat-message-text">\${iAccessChatEscapeHtml(message.message)}</div>
        </div>
      \`;

      messagesContainer.appendChild(messageEl);
      iAccessChatScrollToBottom();
    }

    function iAccessChatSwitchChannel(channel) {
      iAccessChatCurrentChannel = channel;
      
      document.querySelectorAll('#iAccessChannelsList .channel-item').forEach(item => {
        item.classList.toggle('active', item.dataset.channel === channel);
      });

      const subtitle = document.getElementById('iAccessChatSubtitle');
      if (subtitle) subtitle.textContent = \`#\${channel}\`;

      iAccessChatLoadMessages();
    }

    function iAccessChatStartPolling() {
      if (iAccessChatPollInterval) clearInterval(iAccessChatPollInterval);
      
      iAccessChatPollInterval = setInterval(async () => {
        try {
          const response = await fetch(\`/api/chat/messages?channel=\${iAccessChatCurrentChannel}&limit=10\`);
          const data = await response.json();
          
          if (data.success && data.messages.length > 0) {
            const latestMessage = data.messages[data.messages.length - 1];
            
            if (!iAccessChatLastMessageTime || new Date(latestMessage.timestamp) > new Date(iAccessChatLastMessageTime)) {
              iAccessChatLoadMessages();
            }
          }
        } catch (error) {
          console.error('Error polling messages:', error);
        }
      }, 3000);
    }

    function iAccessChatScrollToBottom() {
      const messagesContainer = document.getElementById('iAccessChatMessages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }

    function iAccessChatEscapeHtml(text: string) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    // Initialize routing
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initIAccessRouting);
    } else {
      initIAccessRouting();
    }
  </script>
</body>
</html>`;
