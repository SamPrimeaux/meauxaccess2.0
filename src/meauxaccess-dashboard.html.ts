export default `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MeauxAccess - Intelligent Dashboard</title>
  <style>
    /* ===== CSS VARIABLES - LIGHT THEME (DEFAULT) ===== */
    :root {
      /* Colors - Purple Theme (MeauxAccess) */
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
    
    /* Ecosystem Chat Styles */
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

    .chat-header-actions {
      display: flex;
      gap: var(--space-2);
    }

    .chat-btn-icon {
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      border-radius: var(--border-radius);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }

    .chat-btn-icon:hover {
      background: var(--neutral-100);
      color: var(--text-primary);
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

    @media (max-width: 768px) {
      .ecosystem-chat-container {
        height: 500px;
        max-height: 70vh;
      }

      .chat-channels {
        position: absolute;
        left: -200px;
        top: 0;
        bottom: 0;
        z-index: 100;
        transition: left var(--transition-base);
        box-shadow: var(--shadow-lg);
      }

      .chat-channels.open {
        left: 0;
      }
    }
    
    /* ===== PROJECTS GRID ===== */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--space-6);
    }

    .project-card {
      background: var(--surface-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      transition: all var(--transition-base);
      cursor: pointer;
      display: flex;
      flex-direction: column;
    }

    .project-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary);
    }

    .project-card-header {
      position: relative;
      height: 180px;
      background: linear-gradient(135deg, var(--primary-alpha), var(--neutral-100));
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-4);
    }

    .project-card-logo {
      max-width: 120px;
      max-height: 80px;
      object-fit: contain;
    }

    .project-card-body {
      padding: var(--space-4);
      flex: 1;
    }

    .project-card-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
    }

    .project-card-description {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0 0 var(--space-4) 0;
      line-height: 1.5;
    }

    .project-card-technologies {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      margin-bottom: var(--space-4);
    }

    .project-tech-badge {
      display: inline-flex;
      align-items: center;
      padding: var(--space-1) var(--space-2);
      background: var(--primary-alpha);
      color: var(--primary);
      border-radius: var(--border-radius-sm);
      font-size: 0.75rem;
      font-weight: 500;
    }

    .project-card-clients {
      border-top: 1px solid var(--border-color);
      padding-top: var(--space-4);
      margin-top: auto;
    }

    .project-clients-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--space-3);
    }

    .project-clients-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      align-items: center;
    }

    .client-logo-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: var(--surface-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      overflow: hidden;
      transition: all var(--transition-fast);
      position: relative;
    }

    .client-logo-item:hover {
      transform: scale(1.1);
      border-color: var(--primary);
      box-shadow: var(--shadow-md);
    }

    .client-logo-item img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: var(--space-2);
    }

    .client-logo-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--neutral-100);
      color: var(--text-tertiary);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .project-card-footer {
      padding: var(--space-3) var(--space-4);
      border-top: 1px solid var(--border-color);
      background: var(--surface-secondary);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .project-status {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--border-radius-sm);
      font-size: 0.75rem;
      font-weight: 500;
    }

    .project-status.active {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .project-status.inactive {
      background: var(--neutral-200);
      color: var(--text-secondary);
    }

    .project-status.archived {
      background: var(--neutral-200);
      color: var(--text-tertiary);
    }

    .project-card-action {
      padding: var(--space-2) var(--space-3);
      background: var(--primary);
      color: white;
      border: none;
      border-radius: var(--border-radius);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .project-card-action:hover {
      background: var(--primary-dark);
    }
    
    /* ===== UNIVERSAL HELPER TOOLBAR ===== */
    .helper-icon {
      position: fixed;
      bottom: var(--space-8);
      right: var(--space-8);
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0066FF 0%, #00E5A0 100%);
      border: 3px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 102, 255, 0.4), 0 0 0 0 rgba(0, 102, 255, 0.5);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-sticky);
      transition: all 0.3s ease;
      animation: pulse-glow 2s ease-in-out infinite;
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 8px 32px rgba(0, 102, 255, 0.4), 0 0 0 0 rgba(0, 102, 255, 0.5); }
      50% { box-shadow: 0 8px 32px rgba(0, 102, 255, 0.6), 0 0 0 8px rgba(0, 102, 255, 0); }
    }

    .helper-icon:hover {
      transform: translateY(-4px) scale(1.1);
      box-shadow: 0 12px 40px rgba(0, 102, 255, 0.6), 0 0 0 4px rgba(0, 102, 255, 0.3);
      animation: none;
    }

    .helper-icon svg {
      width: 32px;
      height: 32px;
      stroke: white;
      stroke-width: 2.5;
    }

    /* Dev Search Tabs */
    .dev-search-tab {
      padding: var(--space-3) var(--space-4);
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      color: var(--text-secondary);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.9rem;
    }

    .dev-search-tab:hover {
      color: var(--text-primary);
      background: var(--surface-secondary);
    }

    .dev-search-tab.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    .dev-search-tab-content {
      display: none;
    }

    .dev-search-tab-content.active {
      display: block;
    }

    .helper-tool-card {
      background: var(--surface-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-lg);
      padding: var(--space-4);
      cursor: pointer;
      transition: all var(--transition-base);
      text-align: center;
    }

    .helper-tool-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--primary);
    }

    .helper-tool-icon {
      width: 64px;
      height: 64px;
      border-radius: var(--border-radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-3);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .helper-tool-icon svg {
      width: 32px;
      height: 32px;
    }

    .helper-tool-card h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: var(--space-1);
      color: var(--text-primary);
    }

    .helper-tool-card p {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--surface-overlay);
      z-index: var(--z-modal);
      align-items: center;
      justify-content: center;
      padding: var(--space-4);
    }

    .modal.active {
      display: flex;
    }

    .modal-content {
      background: var(--surface-primary);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-xl);
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      padding: var(--space-4) var(--space-6);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .modal-close {
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--border-radius);
      transition: background var(--transition-fast);
    }

    .modal-close:hover {
      background: var(--neutral-100);
    }

    .modal-close svg {
      width: 20px;
      height: 20px;
      stroke: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .helper-icon {
        bottom: var(--space-4);
        right: var(--space-4);
        width: 48px;
        height: 48px;
      }

      .helper-icon svg {
        width: 24px;
        height: 24px;
      }

      .modal-content {
        max-width: 95vw;
        margin: var(--space-4);
      }
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
        
        <a href="/dashboard" class="brand">
          <svg class="brand-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="35" height="35" fill="#667eea" rx="4"/>
            <rect x="55" y="10" width="35" height="35" fill="#8b9eff" rx="4"/>
            <rect x="10" y="55" width="35" height="35" fill="#8b9eff" rx="4"/>
            <rect x="55" y="55" width="35" height="35" fill="#667eea" rx="4"/>
            <circle cx="50" cy="50" r="8" fill="white"/>
          </svg>
          <span>MeauxAccess</span>
        </a>
      </div>
      
      <div class="header-center">
        <div class="workspace-switcher">
          <button class="workspace-button" id="workspaceButton">
            <div class="workspace-icon">M</div>
            <span class="workspace-name">Meauxbility Nonprofit</span>
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
          <!-- MeauxWork -->
          <div class="nav-section">
            <h3 class="nav-section-title">MeauxWork</h3>
            <ul class="nav-items">
              <li class="nav-item">
                <a href="/dashboard" class="nav-link active">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                  <span class="nav-label">Overview</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/dashboard/work/projects" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                  </svg>
                  <span class="nav-label">Projects</span>
                  <span class="nav-badge primary">12</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/dashboard/work/board" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                  </svg>
                  <span class="nav-label">Board</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/dashboard/work/library" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                  </svg>
                  <span class="nav-label">Library</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/dashboard/work/docs" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/>
                  </svg>
                  <span class="nav-label">Docs</span>
                </a>
              </li>
            </ul>
          </div>
          
          <!-- MeauxApps -->
          <div class="nav-section">
            <h3 class="nav-section-title">MeauxApps</h3>
            <ul class="nav-items">
              <li class="nav-item">
                <a href="/dashboard/apps" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                  <span class="nav-label">All Apps</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/dashboard/apps/photo" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
                  </svg>
                  <span class="nav-label">MeauxPhoto</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/dashboard/apps/cad" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clip-rule="evenodd"/>
                  </svg>
                  <span class="nav-label">MeauxCAD</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/dashboard/apps/cloud" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"/>
                  </svg>
                  <span class="nav-label">MeauxCloud</span>
                </a>
              </li>
            </ul>
          </div>
          
          <!-- MeauxDev -->
          <div class="nav-section">
            <h3 class="nav-section-title">MeauxDev</h3>
            <ul class="nav-items">
              <li class="nav-item">
                <a href="/dashboard/dev" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                  <span class="nav-label">Dev Console</span>
                  <span class="nav-badge">NEW</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/dashboard/dev/integrations" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 7H7v6h6V7z"/>
                    <path fill-rule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clip-rule="evenodd"/>
                  </svg>
                  <span class="nav-label">Integrations</span>
                </a>
              </li>
            </ul>
          </div>
          
          <!-- MeauxChat -->
          <div class="nav-section">
            <h3 class="nav-section-title">MeauxChat</h3>
            <ul class="nav-items">
              <li class="nav-item">
                <a href="/dashboard/chat" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                  </svg>
                  <span class="nav-label">Talk</span>
                  <span class="nav-badge primary">3</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/dashboard/chat/mail" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <span class="nav-label">Mail</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/dashboard/chat/calendar" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                  </svg>
                  <span class="nav-label">Calendar</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/dashboard/chat/meet" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                  </svg>
                  <span class="nav-label">Meet</span>
                </a>
              </li>
            </ul>
          </div>
          
          <!-- AutoMeaux -->
          <div class="nav-section">
            <h3 class="nav-section-title">AutoMeaux</h3>
            <ul class="nav-items">
              <li class="nav-item">
                <a href="/dashboard/auto" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
                  </svg>
                  <span class="nav-label">Automation</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/dashboard/auto/pipeline" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clip-rule="evenodd"/>
                  </svg>
                  <span class="nav-label">Pipeline</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/dashboard/auto/prompts" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
                  </svg>
                  <span class="nav-label">Prompts</span>
                </a>
              </li>
            </ul>
          </div>
          
          <!-- Resend / Email -->
          <div class="nav-section">
            <h3 class="nav-section-title">Email & Clients</h3>
            <ul class="nav-items">
              <li class="nav-item">
                <a href="/dashboard/resend/domains" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <span class="nav-label">Resend Domains</span>
                  <span class="nav-badge primary" id="resendDomainsCount">8</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/dashboard/resend/emails" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <span class="nav-label">Email Logs</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/dashboard/resend/clients" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                  </svg>
                  <span class="nav-label">Clients</span>
                </a>
              </li>
            </ul>
          </div>
          
          <!-- Account -->
          <div class="nav-section">
            <h3 class="nav-section-title">Account</h3>
            <ul class="nav-items">
              <li class="nav-item">
                <a href="/dashboard/account/settings" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
                  </svg>
                  <span class="nav-label">Settings</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/dashboard/account/vault" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="nav-label">Vault</span>
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
        <!-- Overview/Dashboard View (Default) -->
        <div class="page-content" id="overviewView" style="display: none;">
          <div class="app-content fade-in">
            <!-- Page Header -->
            <div class="page-header">
              <div>
                <h1 class="page-title">Dashboard Overview</h1>
                <p class="page-subtitle">Welcome back, Sam! Here's what's happening today.</p>
              </div>
            <div class="page-actions">
              <button class="btn btn-secondary" onclick="window.location.href='/dashboard/meauxcloud'" title="Switch to MeauxCloud Theme">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                MeauxCloud Theme
              </button>
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
                <div class="stat-value">24</div>
                <div class="stat-change positive">↑ 12% from last month</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-label">Team Members</div>
                <div class="stat-value">8</div>
                <div class="stat-change positive">↑ 2 new this week</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">☁️</div>
                <div class="stat-label">Storage Used</div>
                <div class="stat-value">2.4 GB</div>
                <div class="stat-change">of 10 GB total</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">⚡</div>
                <div class="stat-label">API Requests</div>
                <div class="stat-value">45.2K</div>
                <div class="stat-change positive">↑ 8% this week</div>
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
        
        <!-- Resend Domains View -->
        <div class="page-content" id="resendDomainsView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Resend Domains</h1>
              <p class="page-subtitle">Manage your verified email domains and clients</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-secondary" onclick="refreshResendDomains()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 3a5 5 0 104.546 2.914a1 1 0 00-1.79-.89A3 3 0 1111 8a1 1 0 102 0 5 5 0 00-5-5z"/>
                  <path d="M8 5v3l2.5 1.5"/>
                </svg>
                Refresh
              </button>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Verified Domains</h2>
              <div style="display: flex; gap: var(--space-2); align-items: center;">
                <span style="font-size: 0.875rem; color: var(--text-secondary);" id="domainsCount">Loading...</span>
              </div>
            </div>
            <div class="card-body">
              <div id="resendDomainsList" style="min-height: 200px;">
                <div style="text-align: center; padding: var(--space-8); color: var(--text-secondary);">
                  Loading domains...
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Projects View -->
        <div class="page-content" id="projectsView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Projects</h1>
              <p class="page-subtitle">Workspace for sites, apps, and Cloudflare buildouts</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-secondary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M11.536 14.01A8.473 8.473 0 0014.026 8a8.473 8.473 0 00-2.49-6.01l-.708.707A7.476 7.476 0 0113.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                  <path d="M10.121 12.596A6.48 6.48 0 0012.025 8a6.48 6.48 0 00-1.904-4.596l-.707.707A5.483 5.483 0 0111.025 8a5.483 5.483 0 01-1.611 3.89l.707.707z"/>
                  <path d="M8.707 11.182A4.486 4.486 0 0010.025 8a4.486 4.486 0 00-1.318-3.182L8 5.525A3.489 3.489 0 019.025 8a3.489 3.489 0 01-1.025 2.475l.707.707zM6.717 3.55A.5.5 0 017 4v8a.5.5 0 01-.717.45l-4-2A.5.5 0 012 10V6a.5.5 0 01.283-.45l4-2z"/>
                </svg>
                Configure view
              </button>
              <button class="btn btn-primary" onclick="showNewProjectModal()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                New Project
              </button>
            </div>
          </div>
          
          <div id="projectsGrid" class="projects-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-6); margin-top: var(--space-6);">
            <!-- Projects will be loaded here -->
          </div>
        </div>
        
        <!-- Board View -->
        <div class="page-content" id="boardView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Board</h1>
              <p class="page-subtitle">Kanban board for project management</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                New Task
              </button>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-body">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-4);">
                <div class="card" style="background: var(--surface-secondary);">
                  <div class="card-header">
                    <h3 class="card-title">To Do</h3>
                    <span style="background: var(--primary-alpha); color: var(--primary); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">0</span>
                  </div>
                  <div class="card-body" style="min-height: 200px;">
                    <p style="color: var(--text-secondary); text-align: center; padding: var(--space-4); font-size: 0.875rem;">No tasks yet</p>
                  </div>
                </div>
                <div class="card" style="background: var(--surface-secondary);">
                  <div class="card-header">
                    <h3 class="card-title">In Progress</h3>
                    <span style="background: var(--primary-alpha); color: var(--primary); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">0</span>
                  </div>
                  <div class="card-body" style="min-height: 200px;">
                    <p style="color: var(--text-secondary); text-align: center; padding: var(--space-4); font-size: 0.875rem;">No tasks yet</p>
                  </div>
                </div>
                <div class="card" style="background: var(--surface-secondary);">
                  <div class="card-header">
                    <h3 class="card-title">Done</h3>
                    <span style="background: var(--primary-alpha); color: var(--primary); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">0</span>
                  </div>
                  <div class="card-body" style="min-height: 200px;">
                    <p style="color: var(--text-secondary); text-align: center; padding: var(--space-4); font-size: 0.875rem;">No tasks yet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Library View -->
        <div class="page-content" id="libraryView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Library</h1>
              <p class="page-subtitle">Shared resources, templates, and assets</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-secondary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 3a5 5 0 104.546 2.914a1 1 0 00-1.79-.89A3 3 0 1111 8a1 1 0 102 0 5 5 0 00-5-5z"/>
                  <path d="M8 5v3l2.5 1.5"/>
                </svg>
                Refresh
              </button>
              <button class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                Upload
              </button>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-header">
              <h2 class="card-title">Resources</h2>
            </div>
            <div class="card-body">
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-4);">
                <div class="card" style="background: var(--surface-secondary); cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                  <div style="padding: var(--space-4); text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: var(--space-2);">📄</div>
                    <div style="font-weight: 600; margin-bottom: var(--space-1);">Templates</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">12 files</div>
                  </div>
                </div>
                <div class="card" style="background: var(--surface-secondary); cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                  <div style="padding: var(--space-4); text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: var(--space-2);">🖼️</div>
                    <div style="font-weight: 600; margin-bottom: var(--space-1);">Assets</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">45 files</div>
                  </div>
                </div>
                <div class="card" style="background: var(--surface-secondary); cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                  <div style="padding: var(--space-4); text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: var(--space-2);">📚</div>
                    <div style="font-weight: 600; margin-bottom: var(--space-1);">Documentation</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">8 files</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Docs View -->
        <div class="page-content" id="docsView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Docs</h1>
              <p class="page-subtitle">Documentation and knowledge base</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                New Doc
              </button>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-header">
              <h2 class="card-title">Documents</h2>
            </div>
            <div class="card-body">
              <div style="display: flex; flex-direction: column; gap: var(--space-3);">
                <div style="padding: var(--space-4); background: var(--surface-secondary); border-radius: var(--border-radius); display: flex; align-items: center; gap: var(--space-4);">
                  <div style="font-size: 1.5rem;">📄</div>
                  <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: var(--space-1);">Getting Started Guide</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">Last updated 2 days ago</div>
                  </div>
                  <button class="btn btn-ghost">Open</button>
                </div>
                <div style="padding: var(--space-4); background: var(--surface-secondary); border-radius: var(--border-radius); display: flex; align-items: center; gap: var(--space-4);">
                  <div style="font-size: 1.5rem;">📄</div>
                  <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: var(--space-1);">API Reference</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">Last updated 1 week ago</div>
                  </div>
                  <button class="btn btn-ghost">Open</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- All Apps View -->
        <div class="page-content" id="appsView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">All Apps</h1>
              <p class="page-subtitle">All MeauxApps in one place</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-6); margin-top: var(--space-6);">
            <div class="card" style="cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" onclick="navigateTo('/dashboard/apps/photo')">
              <div style="padding: var(--space-6); text-align: center;">
                <div style="font-size: 3rem; margin-bottom: var(--space-4);">📸</div>
                <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-2);">MeauxPhoto</h3>
                <p style="color: var(--text-secondary); font-size: 0.875rem;">Photo gallery and management</p>
              </div>
            </div>
            <div class="card" style="cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" onclick="navigateTo('/dashboard/apps/cad')">
              <div style="padding: var(--space-6); text-align: center;">
                <div style="font-size: 3rem; margin-bottom: var(--space-4);">📐</div>
                <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-2);">MeauxCAD</h3>
                <p style="color: var(--text-secondary); font-size: 0.875rem;">CAD design tools</p>
              </div>
            </div>
            <div class="card" style="cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" onclick="navigateTo('/dashboard/apps/cloud')">
              <div style="padding: var(--space-6); text-align: center;">
                <div style="font-size: 3rem; margin-bottom: var(--space-4);">☁️</div>
                <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-2);">MeauxCloud</h3>
                <p style="color: var(--text-secondary); font-size: 0.875rem;">Cloud storage and sync</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- MeauxPhoto View -->
        <div class="page-content" id="meauxPhotoView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">MeauxPhoto</h1>
              <p class="page-subtitle">Photo gallery and management</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-primary" onclick="window.location.href='/meauxphoto'">
                Open Gallery
              </button>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-body">
              <p style="color: var(--text-secondary); text-align: center; padding: var(--space-8);">
                Redirecting to MeauxPhoto gallery...
              </p>
              <div style="text-align: center;">
                <button class="btn btn-primary" onclick="window.location.href='/meauxphoto'">
                  Go to MeauxPhoto Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- MeauxCAD View -->
        <div class="page-content" id="meauxCADView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">MeauxCAD</h1>
              <p class="page-subtitle">CAD design and modeling tools</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                New Design
              </button>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-body">
              <p style="color: var(--text-secondary); text-align: center; padding: var(--space-8);">
                MeauxCAD coming soon...
              </p>
            </div>
          </div>
        </div>
        
        <!-- MeauxCloud View -->
        <div class="page-content" id="meauxCloudView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">MeauxCloud</h1>
              <p class="page-subtitle">Cloud storage and file synchronization</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                Upload Files
              </button>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-body">
              <p style="color: var(--text-secondary); text-align: center; padding: var(--space-8);">
                MeauxCloud coming soon...
              </p>
            </div>
          </div>
        </div>
        
        <!-- Dev Console View -->
        <div class="page-content" id="devConsoleView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Dev Console</h1>
              <p class="page-subtitle">Development tools and debugging</p>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-header">
              <h2 class="card-title">Console</h2>
            </div>
            <div class="card-body">
              <div style="background: var(--neutral-900); color: var(--neutral-100); padding: var(--space-4); border-radius: var(--border-radius); font-family: 'Courier New', monospace; font-size: 0.875rem; min-height: 300px; max-height: 500px; overflow-y: auto;">
                <div style="margin-bottom: var(--space-2);">
                  <span style="color: var(--success);">$</span> <span>Welcome to Dev Console</span>
                </div>
                <div style="margin-bottom: var(--space-2);">
                  <span style="color: var(--success);">$</span> <span>Type commands below...</span>
                </div>
              </div>
              <div style="margin-top: var(--space-4); display: flex; gap: var(--space-2);">
                <input type="text" class="search-box" placeholder="Enter command..." style="flex: 1;" id="devConsoleInput">
                <button class="btn btn-primary" onclick="executeDevCommand()">Execute</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Integrations View -->
        <div class="page-content" id="integrationsView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Integrations</h1>
              <p class="page-subtitle">Connect third-party services and APIs</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                Add Integration
              </button>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-6); margin-top: var(--space-6);">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">OpenAI</h3>
                <span style="background: var(--success); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">Connected</span>
              </div>
              <div class="card-body">
                <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-4);">AI models and image generation</p>
                <button class="btn btn-secondary" style="width: 100%;">Configure</button>
              </div>
            </div>
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Gemini</h3>
                <span style="background: var(--success); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">Connected</span>
              </div>
              <div class="card-body">
                <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-4);">Google AI models</p>
                <button class="btn btn-secondary" style="width: 100%;">Configure</button>
              </div>
            </div>
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Resend</h3>
                <span style="background: var(--success); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">Connected</span>
              </div>
              <div class="card-body">
                <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-4);">Email delivery service</p>
                <button class="btn btn-secondary" style="width: 100%;">Configure</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Mail View -->
        <div class="page-content" id="mailView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Mail</h1>
              <p class="page-subtitle">Email management and inbox</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                Compose
              </button>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-header">
              <h2 class="card-title">Inbox</h2>
            </div>
            <div class="card-body">
              <div style="display: flex; flex-direction: column; gap: var(--space-2);">
                <div style="padding: var(--space-4); background: var(--surface-secondary); border-radius: var(--border-radius); display: flex; align-items: center; gap: var(--space-4);">
                  <div style="font-size: 1.25rem;">📧</div>
                  <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: var(--space-1);">Welcome to MeauxAccess</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">from: noreply@inneranimalmedia.com</div>
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary);">2 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Calendar View -->
        <div class="page-content" id="calendarView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Calendar</h1>
              <p class="page-subtitle">Schedule and events</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                New Event
              </button>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-body">
              <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: var(--space-2);">
                <div style="text-align: center; padding: var(--space-2); font-weight: 600; color: var(--text-secondary);">Sun</div>
                <div style="text-align: center; padding: var(--space-2); font-weight: 600; color: var(--text-secondary);">Mon</div>
                <div style="text-align: center; padding: var(--space-2); font-weight: 600; color: var(--text-secondary);">Tue</div>
                <div style="text-align: center; padding: var(--space-2); font-weight: 600; color: var(--text-secondary);">Wed</div>
                <div style="text-align: center; padding: var(--space-2); font-weight: 600; color: var(--text-secondary);">Thu</div>
                <div style="text-align: center; padding: var(--space-2); font-weight: 600; color: var(--text-secondary);">Fri</div>
                <div style="text-align: center; padding: var(--space-2); font-weight: 600; color: var(--text-secondary);">Sat</div>
                <!-- Calendar days would go here -->
                <div style="text-align: center; padding: var(--space-4); background: var(--surface-secondary); border-radius: var(--border-radius);">1</div>
                <div style="text-align: center; padding: var(--space-4); background: var(--surface-secondary); border-radius: var(--border-radius);">2</div>
                <div style="text-align: center; padding: var(--space-4); background: var(--surface-secondary); border-radius: var(--border-radius);">3</div>
                <div style="text-align: center; padding: var(--space-4); background: var(--surface-secondary); border-radius: var(--border-radius);">4</div>
                <div style="text-align: center; padding: var(--space-4); background: var(--surface-secondary); border-radius: var(--border-radius);">5</div>
                <div style="text-align: center; padding: var(--space-4); background: var(--surface-secondary); border-radius: var(--border-radius);">6</div>
                <div style="text-align: center; padding: var(--space-4); background: var(--surface-secondary); border-radius: var(--border-radius);">7</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Meet View -->
        <div class="page-content" id="meetView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Meet</h1>
              <p class="page-subtitle">Video meetings and conferences</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                New Meeting
              </button>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-body">
              <p style="color: var(--text-secondary); text-align: center; padding: var(--space-8);">
                Video meetings coming soon...
              </p>
            </div>
          </div>
        </div>
        
        <!-- Automation View -->
        <div class="page-content" id="automationView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Automation</h1>
              <p class="page-subtitle">Automate workflows and tasks</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                New Automation
              </button>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-body">
              <p style="color: var(--text-secondary); text-align: center; padding: var(--space-8);">
                Automation workflows coming soon...
              </p>
            </div>
          </div>
        </div>
        
        <!-- Pipeline View -->
        <div class="page-content" id="pipelineView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Pipeline</h1>
              <p class="page-subtitle">CI/CD and deployment pipelines</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                New Pipeline
              </button>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-body">
              <p style="color: var(--text-secondary); text-align: center; padding: var(--space-8);">
                Deployment pipelines coming soon...
              </p>
            </div>
          </div>
        </div>
        
        <!-- Prompts View -->
        <div class="page-content" id="promptsView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Prompts</h1>
              <p class="page-subtitle">AI prompt library and templates</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                New Prompt
              </button>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-body">
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-4);">
                <div class="card" style="background: var(--surface-secondary);">
                  <div class="card-header">
                    <h3 class="card-title">Code Review</h3>
                  </div>
                  <div class="card-body">
                    <p style="color: var(--text-secondary); font-size: 0.875rem;">Review code for bugs and improvements</p>
                    <button class="btn btn-ghost" style="width: 100%; margin-top: var(--space-2);">Use Prompt</button>
                  </div>
                </div>
                <div class="card" style="background: var(--surface-secondary);">
                  <div class="card-header">
                    <h3 class="card-title">Documentation</h3>
                  </div>
                  <div class="card-body">
                    <p style="color: var(--text-secondary); font-size: 0.875rem;">Generate documentation from code</p>
                    <button class="btn btn-ghost" style="width: 100%; margin-top: var(--space-2);">Use Prompt</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Email Logs View -->
        <div class="page-content" id="emailLogsView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Email Logs</h1>
              <p class="page-subtitle">View sent emails and delivery status</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-secondary" onclick="refreshEmailLogs()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 3a5 5 0 104.546 2.914a1 1 0 00-1.79-.89A3 3 0 1111 8a1 1 0 102 0 5 5 0 00-5-5z"/>
                  <path d="M8 5v3l2.5 1.5"/>
                </svg>
                Refresh
              </button>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-header">
              <h2 class="card-title">Recent Emails</h2>
            </div>
            <div class="card-body">
              <div id="emailLogsList" style="min-height: 200px;">
                <p style="color: var(--text-secondary); text-align: center; padding: var(--space-8);">
                  Loading email logs...
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Clients View -->
        <div class="page-content" id="clientsView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Clients</h1>
              <p class="page-subtitle">Manage clients and their projects</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-primary" onclick="showNewClientModal()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                New Client
              </button>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-header">
              <h2 class="card-title">All Clients</h2>
            </div>
            <div class="card-body">
              <div id="clientsList" style="min-height: 200px;">
                <p style="color: var(--text-secondary); text-align: center; padding: var(--space-8);">
                  Loading clients...
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Settings View -->
        <div class="page-content" id="settingsView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Settings</h1>
              <p class="page-subtitle">Account and workspace settings</p>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-header">
              <h2 class="card-title">Account Settings</h2>
            </div>
            <div class="card-body">
              <div style="display: flex; flex-direction: column; gap: var(--space-4);">
                <div>
                  <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Email</label>
                  <input type="email" class="search-box" value="sam@meauxbility.org" readonly>
                </div>
                <div>
                  <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Name</label>
                  <input type="text" class="search-box" value="Sam Primeaux">
                </div>
                <div>
                  <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Role</label>
                  <input type="text" class="search-box" value="Admin" readonly>
                </div>
                <button class="btn btn-primary" style="align-self: flex-start;">Save Changes</button>
              </div>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-header">
              <h2 class="card-title">Preferences</h2>
            </div>
            <div class="card-body">
              <div style="display: flex; flex-direction: column; gap: var(--space-4);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: 600; margin-bottom: var(--space-1);">Dark Mode</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">Toggle dark theme</div>
                  </div>
                  <button class="btn btn-secondary" onclick="toggleTheme()">Toggle</button>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: 600; margin-bottom: var(--space-1);">Email Notifications</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">Receive email updates</div>
                  </div>
                  <input type="checkbox" checked>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Vault View -->
        <div class="page-content" id="vaultView" style="display: none;">
          <div class="page-header">
            <div>
              <h1 class="page-title">Vault</h1>
              <p class="page-subtitle">Secure storage for secrets and credentials</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                Add Secret
              </button>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-header">
              <h2 class="card-title">Secrets</h2>
            </div>
            <div class="card-body">
              <div style="display: flex; flex-direction: column; gap: var(--space-3);">
                <div style="padding: var(--space-4); background: var(--surface-secondary); border-radius: var(--border-radius); display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: var(--space-3);">
                    <div style="font-size: 1.25rem;">🔐</div>
                    <div>
                      <div style="font-weight: 600;">API_KEY_OPENAI</div>
                      <div style="font-size: 0.75rem; color: var(--text-secondary);">Last updated 3 days ago</div>
                    </div>
                  </div>
                  <button class="btn btn-ghost">View</button>
                </div>
                <div style="padding: var(--space-4); background: var(--surface-secondary); border-radius: var(--border-radius); display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: var(--space-3);">
                    <div style="font-size: 1.25rem;">🔐</div>
                    <div>
                      <div style="font-weight: 600;">RESEND_API_KEY</div>
                      <div style="font-size: 0.75rem; color: var(--text-secondary);">Last updated 1 week ago</div>
                    </div>
                  </div>
                  <button class="btn btn-ghost">View</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    
    <!-- Footer -->
    <footer class="app-footer">
      © 2025 Meauxbility. All rights reserved.
    </footer>
  </div>
  
  <!-- Universal Dev Search Assistant (Floating Button) -->
  <button class="helper-icon" onclick="openDevSearchAssistant()" title="Dev Search Assistant - Search, Debug, Brainstorm, Stream, Notes" id="helperIconBtn">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
      <line x1="11" y1="8" x2="11" y2="14"></line>
      <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>
  </button>

  <!-- Dev Search Assistant Modal -->
  <div class="modal" id="devSearchModal" style="z-index: 10000;">
    <div class="modal-content" style="max-width: 1200px; max-height: 90vh; display: flex; flex-direction: column;">
      <div class="modal-header" style="flex-shrink: 0;">
        <div class="modal-title">🔍 Dev Search Assistant</div>
        <button class="modal-close" onclick="closeDevSearchAssistant()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="modal-body" style="flex: 1; overflow-y: auto; padding: var(--space-6);">
        <!-- Tabs -->
        <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-6); border-bottom: 2px solid var(--border-color);">
          <button class="dev-search-tab active" data-tab="search" onclick="switchDevSearchTab('search')">🔍 Search</button>
          <button class="dev-search-tab" data-tab="dev" onclick="switchDevSearchTab('dev')">💻 Dev Tools</button>
          <button class="dev-search-tab" data-tab="brainstorm" onclick="switchDevSearchTab('brainstorm')">💡 Brainstorm</button>
          <button class="dev-search-tab" data-tab="notes" onclick="switchDevSearchTab('notes')">📝 Notes</button>
        </div>

        <!-- Search Tab -->
        <div id="devSearchTab-search" class="dev-search-tab-content active">
          <div style="margin-bottom: var(--space-4);">
            <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-3);">
              <input type="text" id="platformSearchInput" placeholder="Search workers, databases, buckets, photos, notes..." 
                     style="flex: 1; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--surface-primary); color: var(--text-primary);"
                     onkeypress="if(event.key==='Enter') performPlatformSearch()">
              <button class="btn btn-primary" onclick="performPlatformSearch()">Search</button>
            </div>
            <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
              <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
                <input type="radio" name="searchType" value="all" checked> All
              </label>
              <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
                <input type="radio" name="searchType" value="workers"> Workers
              </label>
              <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
                <input type="radio" name="searchType" value="databases"> Databases
              </label>
              <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
                <input type="radio" name="searchType" value="buckets"> Buckets
              </label>
              <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
                <input type="radio" name="searchType" value="photos"> Photos
              </label>
              <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
                <input type="radio" name="searchType" value="notes"> Notes
              </label>
            </div>
          </div>
          <div id="searchResults" style="min-height: 300px;">
            <div style="text-align: center; padding: var(--space-8); color: var(--text-secondary);">
              Enter a search query to find resources across your platform
            </div>
          </div>
        </div>

        <!-- Dev Tools Tab -->
        <div id="devSearchTab-dev" class="dev-search-tab-content" style="display: none;">
          <div style="margin-bottom: var(--space-4);">
            <h3 style="margin-bottom: var(--space-3);">Inspect & Debug</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-3); margin-bottom: var(--space-4);">
              <button class="btn btn-secondary" onclick="inspectResource('worker', prompt('Worker name:'))">Inspect Worker</button>
              <button class="btn btn-secondary" onclick="inspectResource('database', 'DB')">Inspect Database</button>
              <button class="btn btn-secondary" onclick="inspectResource('bucket', 'R2_ASSETS')">Inspect Bucket</button>
            </div>
            <div style="margin-bottom: var(--space-4);">
              <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">AI Provider</label>
              <select id="devToolProvider" style="width: 100%; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--surface-primary); color: var(--text-primary);">
                <option value="openai">OpenAI GPT-4o</option>
                <option value="gemini">Gemini 2.5 Flash</option>
                <option value="claude">Claude 3.5 Sonnet</option>
              </select>
            </div>
            <div style="margin-bottom: var(--space-4);">
              <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Mode</label>
              <select id="devToolMode" style="width: 100%; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--surface-primary); color: var(--text-primary);">
                <option value="dev">Development</option>
                <option value="debug">Debug</option>
                <option value="inspect">Inspect</option>
                <option value="brainstorm">Brainstorm</option>
              </select>
            </div>
            <div style="margin-bottom: var(--space-4);">
              <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Question / Code</label>
              <textarea id="devToolInput" placeholder="Ask a question, paste code to debug, or describe what to inspect..." 
                        style="width: 100%; min-height: 150px; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); font-family: 'Monaco', 'Courier New', monospace; font-size: 0.875rem; background: var(--surface-primary); color: var(--text-primary);"></textarea>
            </div>
            <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-4);">
              <button class="btn btn-primary" onclick="executeDevTool(false)" style="flex: 1;">Execute</button>
              <button class="btn btn-secondary" onclick="executeDevTool(true)" style="flex: 1;">Stream Response</button>
            </div>
            <div id="devToolOutput" style="background: var(--surface-secondary); border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: var(--space-4); min-height: 200px; font-family: 'Monaco', 'Courier New', monospace; font-size: 0.875rem; white-space: pre-wrap; overflow-x: auto; color: var(--text-primary);"></div>
          </div>
        </div>

        <!-- Brainstorm Tab -->
        <div id="devSearchTab-brainstorm" class="dev-search-tab-content" style="display: none;">
          <div style="margin-bottom: var(--space-4);">
            <h3 style="margin-bottom: var(--space-3);">💡 Brainstorming Mode</h3>
            <div style="margin-bottom: var(--space-4);">
              <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Topic / Question</label>
              <textarea id="brainstormInput" placeholder="What would you like to brainstorm? Be creative and explore ideas..." 
                        style="width: 100%; min-height: 120px; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--surface-primary); color: var(--text-primary);"></textarea>
            </div>
            <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-4);">
              <button class="btn btn-primary" onclick="startBrainstorm(false)" style="flex: 1;">Generate Ideas</button>
              <button class="btn btn-secondary" onclick="startBrainstorm(true)" style="flex: 1;">Stream Ideas</button>
            </div>
            <div id="brainstormOutput" style="background: var(--surface-secondary); border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: var(--space-4); min-height: 300px; font-family: 'Monaco', 'Courier New', monospace; font-size: 0.875rem; white-space: pre-wrap; overflow-x: auto; color: var(--text-primary);"></div>
          </div>
        </div>

        <!-- Notes Tab -->
        <div id="devSearchTab-notes" class="dev-search-tab-content" style="display: none;">
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: var(--space-4);">
            <div>
              <div style="margin-bottom: var(--space-3);">
                <button class="btn btn-primary" onclick="showNewNoteForm()" style="width: 100%;">+ New Note</button>
              </div>
              <div id="notesList" style="max-height: 500px; overflow-y: auto;">
                <div style="text-align: center; padding: var(--space-4); color: var(--text-secondary);">Loading notes...</div>
              </div>
            </div>
            <div>
              <div id="noteEditor" style="display: none;">
                <div style="margin-bottom: var(--space-3);">
                  <input type="text" id="noteTitle" placeholder="Note title..." 
                         style="width: 100%; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--surface-primary); color: var(--text-primary); font-weight: 600;">
                </div>
                <div style="margin-bottom: var(--space-3);">
                  <textarea id="noteContent" placeholder="Write your note here..." 
                            style="width: 100%; min-height: 400px; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); font-family: 'Monaco', 'Courier New', monospace; font-size: 0.875rem; background: var(--surface-primary); color: var(--text-primary);"></textarea>
                </div>
                <div style="display: flex; gap: var(--space-2);">
                  <button class="btn btn-primary" onclick="saveNote()" style="flex: 1;">Save Note</button>
                  <button class="btn btn-secondary" onclick="cancelNote()">Cancel</button>
                </div>
              </div>
              <div id="noteViewer" style="display: none;">
                <h3 id="noteViewerTitle" style="margin-bottom: var(--space-3);"></h3>
                <div id="noteViewerContent" style="white-space: pre-wrap; color: var(--text-primary);"></div>
                <div style="margin-top: var(--space-4); display: flex; gap: var(--space-2);">
                  <button class="btn btn-secondary" onclick="editCurrentNote()">Edit</button>
                  <button class="btn btn-secondary" onclick="deleteCurrentNote()">Delete</button>
                </div>
              </div>
              <div id="noteEmpty" style="text-align: center; padding: var(--space-8); color: var(--text-secondary);">
                Select a note or create a new one
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-actions" style="flex-shrink: 0; padding: var(--space-4) var(--space-6); border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: var(--space-3);">
        <button class="btn btn-secondary" onclick="closeDevSearchAssistant()">Close</button>
      </div>
    </div>
  </div>

  <!-- Dev Search Assistant Modal -->
  <div class="modal" id="devSearchModal" style="z-index: 10000;">
    <div class="modal-content" style="max-width: 1200px; max-height: 90vh; display: flex; flex-direction: column;">
      <div class="modal-header" style="flex-shrink: 0;">
        <div class="modal-title">🔍 Dev Search Assistant</div>
        <button class="modal-close" onclick="closeDevSearchAssistant()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="modal-body" style="flex: 1; overflow-y: auto; padding: var(--space-6);">
        <!-- Tabs -->
        <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-6); border-bottom: 2px solid var(--border-color);">
          <button class="dev-search-tab active" data-tab="search" onclick="switchDevSearchTab('search')">🔍 Search</button>
          <button class="dev-search-tab" data-tab="dev" onclick="switchDevSearchTab('dev')">💻 Dev Tools</button>
          <button class="dev-search-tab" data-tab="brainstorm" onclick="switchDevSearchTab('brainstorm')">💡 Brainstorm</button>
          <button class="dev-search-tab" data-tab="notes" onclick="switchDevSearchTab('notes')">📝 Notes</button>
        </div>

        <!-- Search Tab -->
        <div id="devSearchTab-search" class="dev-search-tab-content active">
          <div style="margin-bottom: var(--space-4);">
            <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-3);">
              <input type="text" id="platformSearchInput" placeholder="Search workers, databases, buckets, photos, notes..." 
                     style="flex: 1; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--surface-primary); color: var(--text-primary);"
                     onkeypress="if(event.key==='Enter') performPlatformSearch()">
              <button class="btn btn-primary" onclick="performPlatformSearch()">Search</button>
            </div>
            <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
              <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
                <input type="radio" name="searchType" value="all" checked> All
              </label>
              <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
                <input type="radio" name="searchType" value="workers"> Workers
              </label>
              <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
                <input type="radio" name="searchType" value="databases"> Databases
              </label>
              <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
                <input type="radio" name="searchType" value="buckets"> Buckets
              </label>
              <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
                <input type="radio" name="searchType" value="photos"> Photos
              </label>
              <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
                <input type="radio" name="searchType" value="notes"> Notes
              </label>
            </div>
          </div>
          <div id="searchResults" style="min-height: 300px;">
            <div style="text-align: center; padding: var(--space-8); color: var(--text-secondary);">
              Enter a search query to find resources across your platform
            </div>
          </div>
        </div>

        <!-- Dev Tools Tab -->
        <div id="devSearchTab-dev" class="dev-search-tab-content" style="display: none;">
          <div style="margin-bottom: var(--space-4);">
            <h3 style="margin-bottom: var(--space-3);">Inspect & Debug</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-3); margin-bottom: var(--space-4);">
              <button class="btn btn-secondary" onclick="inspectResource('worker', prompt('Worker name:'))">Inspect Worker</button>
              <button class="btn btn-secondary" onclick="inspectResource('database', 'DB')">Inspect Database</button>
              <button class="btn btn-secondary" onclick="inspectResource('bucket', 'R2_ASSETS')">Inspect Bucket</button>
            </div>
            <div style="margin-bottom: var(--space-4);">
              <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">AI Provider</label>
              <select id="devToolProvider" style="width: 100%; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--surface-primary); color: var(--text-primary);">
                <option value="openai">OpenAI GPT-4o</option>
                <option value="gemini">Gemini 2.5 Flash</option>
                <option value="claude">Claude 3.5 Sonnet</option>
              </select>
            </div>
            <div style="margin-bottom: var(--space-4);">
              <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Mode</label>
              <select id="devToolMode" style="width: 100%; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--surface-primary); color: var(--text-primary);">
                <option value="dev">Development</option>
                <option value="debug">Debug</option>
                <option value="inspect">Inspect</option>
                <option value="brainstorm">Brainstorm</option>
              </select>
            </div>
            <div style="margin-bottom: var(--space-4);">
              <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Question / Code</label>
              <textarea id="devToolInput" placeholder="Ask a question, paste code to debug, or describe what to inspect..." 
                        style="width: 100%; min-height: 150px; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); font-family: 'Monaco', 'Courier New', monospace; font-size: 0.875rem; background: var(--surface-primary); color: var(--text-primary);"></textarea>
            </div>
            <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-4);">
              <button class="btn btn-primary" onclick="executeDevTool(false)" style="flex: 1;">Execute</button>
              <button class="btn btn-secondary" onclick="executeDevTool(true)" style="flex: 1;">Stream Response</button>
            </div>
            <div id="devToolOutput" style="background: var(--surface-secondary); border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: var(--space-4); min-height: 200px; font-family: 'Monaco', 'Courier New', monospace; font-size: 0.875rem; white-space: pre-wrap; overflow-x: auto; color: var(--text-primary);"></div>
          </div>
        </div>

        <!-- Brainstorm Tab -->
        <div id="devSearchTab-brainstorm" class="dev-search-tab-content" style="display: none;">
          <div style="margin-bottom: var(--space-4);">
            <h3 style="margin-bottom: var(--space-3);">💡 Brainstorming Mode</h3>
            <div style="margin-bottom: var(--space-4);">
              <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Topic / Question</label>
              <textarea id="brainstormInput" placeholder="What would you like to brainstorm? Be creative and explore ideas..." 
                        style="width: 100%; min-height: 120px; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--surface-primary); color: var(--text-primary);"></textarea>
            </div>
            <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-4);">
              <button class="btn btn-primary" onclick="startBrainstorm(false)" style="flex: 1;">Generate Ideas</button>
              <button class="btn btn-secondary" onclick="startBrainstorm(true)" style="flex: 1;">Stream Ideas</button>
            </div>
            <div id="brainstormOutput" style="background: var(--surface-secondary); border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: var(--space-4); min-height: 300px; font-family: 'Monaco', 'Courier New', monospace; font-size: 0.875rem; white-space: pre-wrap; overflow-x: auto; color: var(--text-primary);"></div>
          </div>
        </div>

        <!-- Notes Tab -->
        <div id="devSearchTab-notes" class="dev-search-tab-content" style="display: none;">
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: var(--space-4);">
            <div>
              <div style="margin-bottom: var(--space-3);">
                <button class="btn btn-primary" onclick="showNewNoteForm()" style="width: 100%;">+ New Note</button>
              </div>
              <div id="notesList" style="max-height: 500px; overflow-y: auto;">
                <div style="text-align: center; padding: var(--space-4); color: var(--text-secondary);">Loading notes...</div>
              </div>
            </div>
            <div>
              <div id="noteEditor" style="display: none;">
                <div style="margin-bottom: var(--space-3);">
                  <input type="text" id="noteTitle" placeholder="Note title..." 
                         style="width: 100%; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--surface-primary); color: var(--text-primary); font-weight: 600;">
                </div>
                <div style="margin-bottom: var(--space-3);">
                  <textarea id="noteContent" placeholder="Write your note here..." 
                            style="width: 100%; min-height: 400px; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); font-family: 'Monaco', 'Courier New', monospace; font-size: 0.875rem; background: var(--surface-primary); color: var(--text-primary);"></textarea>
                </div>
                <div style="display: flex; gap: var(--space-2);">
                  <button class="btn btn-primary" onclick="saveNote()" style="flex: 1;">Save Note</button>
                  <button class="btn btn-secondary" onclick="cancelNote()">Cancel</button>
                </div>
              </div>
              <div id="noteViewer" style="display: none;">
                <h3 id="noteViewerTitle" style="margin-bottom: var(--space-3);"></h3>
                <div id="noteViewerContent" style="white-space: pre-wrap; color: var(--text-primary);"></div>
                <div style="margin-top: var(--space-4); display: flex; gap: var(--space-2);">
                  <button class="btn btn-secondary" onclick="editCurrentNote()">Edit</button>
                  <button class="btn btn-secondary" onclick="deleteCurrentNote()">Delete</button>
                </div>
              </div>
              <div id="noteEmpty" style="text-align: center; padding: var(--space-8); color: var(--text-secondary);">
                Select a note or create a new one
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-actions" style="flex-shrink: 0; padding: var(--space-4) var(--space-6); border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: var(--space-3);">
        <button class="btn btn-secondary" onclick="closeDevSearchAssistant()">Close</button>
      </div>
    </div>
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
            <div class="file-name">meauxbility-logo.svg</div>
            <div class="file-meta">Updated 2 hours ago</div>
          </div>
        </div>
        <div class="file-item">
          <div class="file-icon">📁</div>
          <div class="file-info">
            <div class="file-name">client-assets</div>
            <div class="file-meta">34 files</div>
          </div>
        </div>
      </div>
      
      <div class="sleep-section">
        <h4 class="sleep-section-title">🕐 Recent</h4>
        <div class="file-item">
          <div class="file-icon">📐</div>
          <div class="file-info">
            <div class="file-name">project-mockup.fig</div>
            <div class="file-meta">Opened 5 mins ago</div>
          </div>
        </div>
        <div class="file-item">
          <div class="file-icon">📝</div>
          <div class="file-info">
            <div class="file-name">grant-proposal.docx</div>
            <div class="file-meta">Modified yesterday</div>
          </div>
        </div>
      </div>
      
      <div class="sleep-section">
        <h4 class="sleep-section-title">📦 R2 Buckets</h4>
        <div class="file-item">
          <div class="file-icon">🪣</div>
          <div class="file-info">
            <div class="file-name">entireorganization...</div>
            <div class="file-meta">2.1 GB • 1,234 files</div>
          </div>
        </div>
        <div class="file-item">
          <div class="file-icon">🪣</div>
          <div class="file-info">
            <div class="file-name">claudcodebuilds</div>
            <div class="file-meta">345 MB • 89 files</div>
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
  <div class="toolbar-trigger" id="toolbarTrigger" title="MeauxAccess Toolbar">
    <div class="toolbar-icon">MA</div>
    <span style="font-size: 0.875rem; font-weight: 500;">Quick Tools</span>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4.5 6l3.5 3.5L11.5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </div>
  
  <script>
    // Client-side Routing
    function initRouting() {
      // Handle navigation clicks - use event delegation for better performance
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="/dashboard"], a[href="/"], a[href="/meauxaccess"]');
        if (link && link.href) {
          e.preventDefault();
          const path = new URL(link.href).pathname;
          navigateTo(path);
        }
      });
      
      // Handle initial route
      const currentPath = window.location.pathname;
      // Normalize path - handle root, /dashboard, /meauxaccess
      let normalizedPath = currentPath;
      if (normalizedPath === '/' || normalizedPath === '/meauxaccess') {
        normalizedPath = '/dashboard';
      }
      if (normalizedPath.startsWith('/dashboard') || normalizedPath === '/') {
        navigateTo(normalizedPath);
      }
      
      // Handle browser back/forward
      window.addEventListener('popstate', () => {
        let path = window.location.pathname;
        if (path === '/' || path === '/meauxaccess') {
          path = '/dashboard';
        }
        navigateTo(path);
      });
    }
    
    function navigateTo(path) {
      try {
        // Normalize path
        if (path === '/' || path === '/meauxaccess') {
          path = '/dashboard';
        }
        
        console.log('Navigating to:', path);
        
        // Update URL without reload (only if different)
        if (window.location.pathname !== path) {
          window.history.pushState({}, '', path);
        }
        
        // Hide ALL views first (including overview)
        const allViews = document.querySelectorAll('.page-content');
        allViews.forEach(view => {
          view.style.display = 'none';
        });
        
        // Remove active class from nav items
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
        });
        
        // Show appropriate view based on exact path match
        let viewShown = false;
        let targetView = null;
        
        if (path === '/dashboard' || path === '/dashboard/') {
          targetView = document.getElementById('overviewView');
          if (targetView) {
            targetView.style.display = 'block';
            viewShown = true;
          }
          document.querySelector('a[href="/dashboard"]')?.classList.add('active');
      } else if (path === '/dashboard/resend/domains') {
        const resendDomainsView = document.getElementById('resendDomainsView');
        if (resendDomainsView) {
          resendDomainsView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/resend/domains"]')?.classList.add('active');
        loadResendDomains();
      } else if (path === '/dashboard/work/projects' || path.startsWith('/dashboard/work/projects')) {
        const projectsView = document.getElementById('projectsView');
        if (projectsView) {
          projectsView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/work/projects"]')?.classList.add('active');
        loadProjects();
      } else if (path === '/dashboard/work/board') {
        const boardView = document.getElementById('boardView');
        if (boardView) {
          boardView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/work/board"]')?.classList.add('active');
      } else if (path === '/dashboard/work/library') {
        const libraryView = document.getElementById('libraryView');
        if (libraryView) {
          libraryView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/work/library"]')?.classList.add('active');
      } else if (path === '/dashboard/work/docs') {
        const docsView = document.getElementById('docsView');
        if (docsView) {
          docsView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/work/docs"]')?.classList.add('active');
      } else if (path === '/dashboard/apps/photo') {
        const meauxPhotoView = document.getElementById('meauxPhotoView');
        if (meauxPhotoView) {
          meauxPhotoView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/apps/photo"]')?.classList.add('active');
      } else if (path === '/dashboard/apps') {
        const appsView = document.getElementById('appsView');
        if (appsView) {
          appsView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/apps"]')?.classList.add('active');
      } else if (path === '/dashboard/apps/cad') {
        const meauxCADView = document.getElementById('meauxCADView');
        if (meauxCADView) {
          meauxCADView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/apps/cad"]')?.classList.add('active');
      } else if (path === '/dashboard/apps/cloud') {
        const meauxCloudView = document.getElementById('meauxCloudView');
        if (meauxCloudView) {
          meauxCloudView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/apps/cloud"]')?.classList.add('active');
      } else if (path === '/dashboard/dev') {
        const devConsoleView = document.getElementById('devConsoleView');
        if (devConsoleView) {
          devConsoleView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/dev"]')?.classList.add('active');
      } else if (path === '/dashboard/dev/integrations') {
        const integrationsView = document.getElementById('integrationsView');
        if (integrationsView) {
          integrationsView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/dev/integrations"]')?.classList.add('active');
      } else if (path === '/dashboard/chat/mail') {
        const mailView = document.getElementById('mailView');
        if (mailView) {
          mailView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/chat/mail"]')?.classList.add('active');
      } else if (path === '/dashboard/chat/calendar') {
        const calendarView = document.getElementById('calendarView');
        if (calendarView) {
          calendarView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/chat/calendar"]')?.classList.add('active');
      } else if (path === '/dashboard/chat/meet') {
        const meetView = document.getElementById('meetView');
        if (meetView) {
          meetView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/chat/meet"]')?.classList.add('active');
      } else if (path === '/dashboard/chat' || path.startsWith('/dashboard/chat/')) {
        const chatView = document.getElementById('chatView');
        if (chatView) {
          chatView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/chat"]')?.classList.add('active');
        loadEcosystemChat();
      } else if (path === '/dashboard/auto') {
        const automationView = document.getElementById('automationView');
        if (automationView) {
          automationView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/auto"]')?.classList.add('active');
      } else if (path === '/dashboard/auto/pipeline') {
        const pipelineView = document.getElementById('pipelineView');
        if (pipelineView) {
          pipelineView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/auto/pipeline"]')?.classList.add('active');
      } else if (path === '/dashboard/auto/prompts') {
        const promptsView = document.getElementById('promptsView');
        if (promptsView) {
          promptsView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/auto/prompts"]')?.classList.add('active');
      } else if (path === '/dashboard/resend/emails') {
        const emailLogsView = document.getElementById('emailLogsView');
        if (emailLogsView) {
          emailLogsView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/resend/emails"]')?.classList.add('active');
        loadEmailLogs();
      } else if (path === '/dashboard/resend/clients') {
        const clientsView = document.getElementById('clientsView');
        if (clientsView) {
          clientsView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/resend/clients"]')?.classList.add('active');
        loadClients();
      } else if (path === '/dashboard/account/settings') {
        const settingsView = document.getElementById('settingsView');
        if (settingsView) {
          settingsView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/account/settings"]')?.classList.add('active');
      } else if (path === '/dashboard/account/vault') {
        const vaultView = document.getElementById('vaultView');
        if (vaultView) {
          vaultView.style.display = 'block';
          viewShown = true;
        }
        document.querySelector('a[href="/dashboard/account/vault"]')?.classList.add('active');
        } else {
          // Default to overview if no match
          console.warn('No route match for:', path, '- defaulting to overview');
          targetView = document.getElementById('overviewView');
          if (targetView) {
            targetView.style.display = 'block';
            viewShown = true;
          }
          document.querySelector('a[href="/dashboard"]')?.classList.add('active');
        }
        
        // Ensure at least one view is shown
        if (!viewShown) {
          console.error('No view was shown for path:', path);
          targetView = document.getElementById('overviewView');
          if (targetView) {
            targetView.style.display = 'block';
          }
        }
      } catch (error) {
        console.error('Error in navigateTo:', error);
        // Fallback: show overview
        const overviewView = document.getElementById('overviewView');
        if (overviewView) {
          overviewView.style.display = 'block';
        }
      }
    }
    
    function loadEcosystemChat() {
      const container = document.getElementById('ecosystemChatContainer');
      if (!container) return;
      
      // Check if already loaded
      if (container.querySelector('#ecosystemChat')) {
        return; // Already loaded
      }
      
      // Inject chat HTML
      container.innerHTML = \`
        <div id="ecosystemChat" class="ecosystem-chat-container">
          <div class="chat-header">
            <div class="chat-header-left">
              <svg class="chat-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
              </svg>
              <div>
                <h3 class="chat-title">Ecosystem Chat</h3>
                <p class="chat-subtitle" id="chatSubtitle">#general</p>
              </div>
            </div>
            <div class="chat-header-actions">
              <button class="chat-btn-icon" id="chatChannelsBtn" title="Channels">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"/>
                  <path d="M15 7v2a4 4 0 01-4 4H9.828a2 2 0 01-1.414-.586l-1.414-1.414A2 2 0 006.172 7H4a2 2 0 00-2 2v6a2 2 0 002 2h11a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="chat-body">
            <div class="chat-channels" id="chatChannelsPanel">
              <div class="channels-header">
                <h4>Channels</h4>
                <button class="chat-btn-icon" id="closeChannelsBtn">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>
              <div class="channels-list" id="channelsList">
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
                <div class="channel-item" data-channel="support">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
                  </svg>
                  <span># support</span>
                </div>
              </div>
            </div>

            <div class="chat-messages-area">
              <div class="chat-messages" id="chatMessages">
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
                  <input type="text" id="chatInput" class="chat-input" placeholder="Type a message..." autocomplete="off" />
                  <button class="chat-send-btn" id="chatSendBtn">
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
      
      // Initialize chat after injection
      setTimeout(() => {
        initEcosystemChat();
      }, 100);
    }
    
    // Ecosystem Chat Functions
    let chatCurrentChannel = 'general';
    let chatCurrentUser = { email: 'sam@meauxbility.org', name: 'Sam Primeaux' };
    let chatPollInterval = null;
    let chatLastMessageTime = null;

    function initEcosystemChat() {
      // Get current user
      const userEmail = document.cookie.match(/user=([^;]+)/)?.[1] || 'sam@meauxbility.org';
      const userName = document.cookie.match(/userName=([^;]+)/)?.[1] || 'Sam Primeaux';
      
      chatCurrentUser = { email: userEmail, name: userName };
      
      // Setup event listeners
      const sendBtn = document.getElementById('chatSendBtn');
      const chatInput = document.getElementById('chatInput');
      
      if (sendBtn) sendBtn.addEventListener('click', chatSendMessage);
      if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatSendMessage();
          }
        });
      }

      // Channel switching
      document.querySelectorAll('.channel-item').forEach(item => {
        item.addEventListener('click', () => {
          const channel = item.dataset.channel;
          chatSwitchChannel(channel);
        });
      });

      // Channels panel toggle
      const channelsBtn = document.getElementById('chatChannelsBtn');
      const closeChannelsBtn = document.getElementById('closeChannelsBtn');
      const channelsPanel = document.getElementById('chatChannelsPanel');
      
      if (channelsBtn && channelsPanel) {
        channelsBtn.addEventListener('click', () => {
          channelsPanel.classList.toggle('open');
        });
      }
      
      if (closeChannelsBtn && channelsPanel) {
        closeChannelsBtn.addEventListener('click', () => {
          channelsPanel.classList.remove('open');
        });
      }

      // Load messages
      chatLoadMessages();
      
      // Start polling for new messages
      chatStartPolling();
    }

    async function chatSendMessage() {
      const input = document.getElementById('chatInput');
      const message = input?.value.trim();
      
      if (!message || !input) return;

      const sendBtn = document.getElementById('chatSendBtn');
      if (sendBtn) sendBtn.disabled = true;

      try {
        const response = await fetch('/api/chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channel: chatCurrentChannel,
            message,
            sender: chatCurrentUser.email,
            senderName: chatCurrentUser.name,
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          if (input) input.value = '';
          chatAddMessageToUI(data.message);
          chatLastMessageTime = data.message.timestamp;
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

    async function chatLoadMessages() {
      try {
        const response = await fetch(\`/api/chat/messages?channel=\${chatCurrentChannel}&limit=50\`);
        const data = await response.json();
        
        if (data.success) {
          const messagesContainer = document.getElementById('chatMessages');
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
            data.messages.forEach(msg => chatAddMessageToUI(msg));
            chatScrollToBottom();
            chatLastMessageTime = data.messages[data.messages.length - 1]?.timestamp;
          }
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }

    function chatAddMessageToUI(message) {
      const messagesContainer = document.getElementById('chatMessages');
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
          <div class="chat-message-text">\${chatEscapeHtml(message.message)}</div>
        </div>
      \`;

      messagesContainer.appendChild(messageEl);
      chatScrollToBottom();
    }

    function chatSwitchChannel(channel) {
      chatCurrentChannel = channel;
      
      // Update active channel
      document.querySelectorAll('.channel-item').forEach(item => {
        item.classList.toggle('active', item.dataset.channel === channel);
      });

      // Update subtitle
      const subtitle = document.getElementById('chatSubtitle');
      if (subtitle) subtitle.textContent = \`#\${channel}\`;

      // Load messages for new channel
      chatLoadMessages();
    }

    function chatStartPolling() {
      // Clear existing interval
      if (chatPollInterval) clearInterval(chatPollInterval);
      
      // Poll for new messages every 3 seconds
      chatPollInterval = setInterval(async () => {
        try {
          const response = await fetch(\`/api/chat/messages?channel=\${chatCurrentChannel}&limit=10\`);
          const data = await response.json();
          
          if (data.success && data.messages.length > 0) {
            const latestMessage = data.messages[data.messages.length - 1];
            
            // Check if we have new messages
            if (!chatLastMessageTime || new Date(latestMessage.timestamp) > new Date(chatLastMessageTime)) {
              // Reload all messages to get proper order
              chatLoadMessages();
            }
          }
        } catch (error) {
          console.error('Error polling messages:', error);
        }
      }, 3000);
    }

    function chatScrollToBottom() {
      const messagesContainer = document.getElementById('chatMessages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }

    function chatEscapeHtml(text: string) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    // Resend Domains Management
    async function loadResendDomains() {
      const listEl = document.getElementById('resendDomainsList');
      const countEl = document.getElementById('domainsCount');
      
      try {
        listEl.innerHTML = '<div style="text-align: center; padding: var(--space-8); color: var(--text-secondary);">Loading domains...</div>';
        
        const response = await fetch('/api/resend/domains');
        if (!response.ok) {
          throw new Error('Failed to load domains');
        }
        
        const data = await response.json();
        const domains = data.domains || [];
        
        // Update count
        countEl.textContent = \`\${domains.length} domain\${domains.length !== 1 ? 's' : ''}\`;
        document.getElementById('resendDomainsCount').textContent = domains.length;
        
        if (domains.length === 0) {
          listEl.innerHTML = '<div style="text-align: center; padding: var(--space-8); color: var(--text-secondary);">No domains found</div>';
          return;
        }
        
        // Render domains table
        listEl.innerHTML = \`
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-color);">
                  <th style="text-align: left; padding: var(--space-3) var(--space-4); font-weight: 600; color: var(--text-secondary); font-size: 0.875rem;">Domain</th>
                  <th style="text-align: left; padding: var(--space-3) var(--space-4); font-weight: 600; color: var(--text-secondary); font-size: 0.875rem;">Status</th>
                  <th style="text-align: left; padding: var(--space-3) var(--space-4); font-weight: 600; color: var(--text-secondary); font-size: 0.875rem;">Region</th>
                  <th style="text-align: left; padding: var(--space-3) var(--space-4); font-weight: 600; color: var(--text-secondary); font-size: 0.875rem;">Created</th>
                </tr>
              </thead>
              <tbody>
                \${domains.map(domain => \`
                  <tr style="border-bottom: 1px solid var(--border-color); transition: background var(--transition-fast);" 
                      onmouseover="this.style.background='var(--neutral-50)'" 
                      onmouseout="this.style.background='transparent'">
                    <td style="padding: var(--space-4);">
                      <div style="font-weight: 600; color: var(--text-primary);">\${domain.domain}</div>
                    </td>
                    <td style="padding: var(--space-4);">
                      <span style="display: inline-flex; align-items: center; gap: var(--space-1); padding: var(--space-1) var(--space-2); border-radius: var(--border-radius-sm); font-size: 0.75rem; font-weight: 500; 
                        \${domain.status === 'verified' || domain.status === 'active' ? 'background: rgba(16, 185, 129, 0.1); color: var(--success);' : 
                          domain.status === 'pending' ? 'background: rgba(245, 158, 11, 0.1); color: var(--warning);' : 
                          'background: var(--neutral-200); color: var(--text-secondary);'}">
                        \${domain.status === 'verified' || domain.status === 'active' ? '✓ Verified' : 
                          domain.status === 'pending' ? '⏳ Pending' : 
                          domain.status || 'Unknown'}
                      </span>
                    </td>
                    <td style="padding: var(--space-4); color: var(--text-secondary); font-size: 0.875rem;">
                      \${domain.region || 'us-east-1'}
                    </td>
                    <td style="padding: var(--space-4); color: var(--text-secondary); font-size: 0.875rem;">
                      \${domain.createdAt ? new Date(domain.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                \`).join('')}
              </tbody>
            </table>
          </div>
        \`;
      } catch (error) {
        listEl.innerHTML = \`
          <div style="text-align: center; padding: var(--space-8); color: var(--error);">
            <p>Error loading domains: \${error.message}</p>
            <button class="btn btn-primary" onclick="loadResendDomains()" style="margin-top: var(--space-4);">Retry</button>
          </div>
        \`;
      }
    }
    
    function refreshResendDomains() {
      loadResendDomains();
    }
    
    // Load Email Logs
    async function loadEmailLogs() {
      const listEl = document.getElementById('emailLogsList');
      if (!listEl) return;
      
      try {
        // TODO: Implement API endpoint for email logs
        listEl.innerHTML = \`
          <div style="text-align: center; padding: var(--space-8); color: var(--text-secondary);">
            <p>Email logs will appear here</p>
            <p style="font-size: 0.875rem; margin-top: var(--space-2);">Connect to Resend API to view sent emails</p>
          </div>
        \`;
      } catch (error) {
        listEl.innerHTML = \`
          <div style="text-align: center; padding: var(--space-8); color: var(--error);">
            <p>Error loading email logs: \${error.message}</p>
          </div>
        \`;
      }
    }
    
    function refreshEmailLogs() {
      loadEmailLogs();
    }
    
    // Load Clients
    async function loadClients() {
      const listEl = document.getElementById('clientsList');
      if (!listEl) return;
      
      try {
        const response = await fetch('/api/clients');
        const data = await response.json();
        
        if (data.success && data.clients && data.clients.length > 0) {
          listEl.innerHTML = data.clients.map((client: any) => \`
            <div style="padding: var(--space-4); background: var(--surface-secondary); border-radius: var(--border-radius); margin-bottom: var(--space-3); display: flex; align-items: center; gap: var(--space-4);">
              \${client.logoUrl ? 
                \`<img src="\${client.logoUrl}" alt="\${client.name}" style="width: 48px; height: 48px; border-radius: var(--border-radius); object-fit: cover;" onerror="this.style.display='none'">\` :
                \`<div style="width: 48px; height: 48px; background: var(--primary-alpha); border-radius: var(--border-radius); display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--primary);">\${client.name.substring(0, 2).toUpperCase()}</div>\`
              }
              <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: var(--space-1);">\${client.name}</div>
                \${client.website ? \`<div style="font-size: 0.875rem; color: var(--text-secondary);">\${client.website}</div>\` : ''}
              </div>
              <button class="btn btn-ghost">View</button>
            </div>
          \`).join('');
        } else {
          listEl.innerHTML = \`
            <div style="text-align: center; padding: var(--space-8); color: var(--text-secondary);">
              <p>No clients yet</p>
              <button class="btn btn-primary" onclick="showNewClientModal()" style="margin-top: var(--space-4);">Add First Client</button>
            </div>
          \`;
        }
      } catch (error: any) {
        listEl.innerHTML = \`
          <div style="text-align: center; padding: var(--space-8); color: var(--error);">
            <p>Error loading clients: \${error.message}</p>
            <button class="btn btn-primary" onclick="loadClients()" style="margin-top: var(--space-4);">Retry</button>
          </div>
        \`;
      }
    }
    
    function showNewClientModal() {
      let modal = document.getElementById('newClientModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'newClientModal';
        modal.className = 'modal';
        const content = document.createElement('div');
        content.className = 'modal-content';
        content.style.maxWidth = '600px';
        content.innerHTML = '<div class="modal-header"><div class="modal-title">New Client</div><button class="modal-close" onclick="closeNewClientModal()"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg></button></div><div class="card-body"><form id="newClientForm" onsubmit="handleNewClient(event)"><div style="margin-bottom: var(--space-4);"><label style="display: block; margin-bottom: var(--space-2); font-weight: 500; color: var(--text-primary);">Client Name</label><input type="text" id="clientName" required style="width: 100%; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--surface-primary); color: var(--text-primary);" placeholder="Enter client name" /></div><div style="margin-bottom: var(--space-4);"><label style="display: block; margin-bottom: var(--space-2); font-weight: 500; color: var(--text-primary);">Email</label><input type="email" id="clientEmail" required style="width: 100%; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--surface-primary); color: var(--text-primary);" placeholder="client@example.com" /></div><div style="margin-bottom: var(--space-4);"><label style="display: block; margin-bottom: var(--space-2); font-weight: 500; color: var(--text-primary);">Company</label><input type="text" id="clientCompany" style="width: 100%; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--surface-primary); color: var(--text-primary);" placeholder="Company name (optional)" /></div><div style="display: flex; gap: var(--space-3); justify-content: flex-end;"><button type="button" class="btn btn-secondary" onclick="closeNewClientModal()">Cancel</button><button type="submit" class="btn btn-primary">Create Client</button></div></form></div></div>';
        modal.appendChild(content);
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeNewClientModal();
        });
      }
      modal.classList.add('active');
    }
    
    function closeNewClientModal() {
      const modal = document.getElementById('newClientModal');
      if (modal) modal.classList.remove('active');
    }
    
    function handleNewClient(event) {
      event.preventDefault();
      const name = document.getElementById('clientName')?.value;
      const email = document.getElementById('clientEmail')?.value;
      const company = document.getElementById('clientCompany')?.value;
      console.log('Creating client:', { name, email, company });
      alert('Client "' + name + '" will be created!');
      closeNewClientModal();
    }
    
    // Execute Dev Command
    function executeDevCommand() {
      const input = document.getElementById('devConsoleInput') as HTMLInputElement;
      if (!input || !input.value.trim()) return;
      
      const command = input.value.trim();
      console.log('Executing command:', command);
      
      // TODO: Implement command execution
      alert('Command execution coming soon!');
      input.value = '';
    }
    
    // Toggle Theme
    function toggleTheme() {
      const currentTheme = getTheme();
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    }
    
    // Dev Search Assistant Functions
    function openDevSearchAssistant() {
      const modal = document.getElementById('devSearchModal');
      if (modal) {
        modal.classList.add('active');
        loadNotes();
      }
    }

    function closeDevSearchAssistant() {
      const modal = document.getElementById('devSearchModal');
      if (modal) modal.classList.remove('active');
    }

    function switchDevSearchTab(tab) {
      // Update tabs
      document.querySelectorAll('.dev-search-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.dev-search-tab-content').forEach(c => c.classList.remove('active'));
      
      document.querySelector(\`[data-tab="\${tab}"]\`)?.classList.add('active');
      document.getElementById(\`devSearchTab-\${tab}\`)?.classList.add('active');
    }

    // Platform Search
    async function performPlatformSearch() {
      const query = document.getElementById('platformSearchInput')?.value;
      const type = document.querySelector('input[name="searchType"]:checked')?.value || 'all';
      const resultsDiv = document.getElementById('searchResults');

      if (!query || !resultsDiv) return;

      resultsDiv.innerHTML = '<div style="text-align: center; padding: var(--space-4); color: var(--text-secondary);">Searching...</div>';

      try {
        const response = await fetch('/api/dev-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, type }),
        });

        const data = await response.json();

        if (data.success) {
          let html = \`<div style="margin-bottom: var(--space-4); color: var(--text-secondary);">Found \${data.total} results</div>\`;
          
          if (data.results.workers?.length > 0) {
            html += \`<h4 style="margin: var(--space-4) 0 var(--space-2) 0;">Workers (\${data.results.workers.length})</h4>\`;
            html += data.results.workers.map((w: any) => \`
              <div style="padding: var(--space-3); background: var(--surface-secondary); border-radius: var(--border-radius); margin-bottom: var(--space-2);">
                <strong>\${w.id}</strong>
              </div>
            \`).join('');
          }

          if (data.results.photos?.length > 0) {
            html += \`<h4 style="margin: var(--space-4) 0 var(--space-2) 0;">Photos (\${data.results.photos.length})</h4>\`;
            html += data.results.photos.map((p: any) => \`
              <div style="padding: var(--space-3); background: var(--surface-secondary); border-radius: var(--border-radius); margin-bottom: var(--space-2);">
                <strong>\${p.title}</strong> - \${p.description || ''}
              </div>
            \`).join('');
          }

          if (data.results.buckets?.length > 0) {
            html += \`<h4 style="margin: var(--space-4) 0 var(--space-2) 0;">R2 Buckets (\${data.results.buckets.length})</h4>\`;
            html += data.results.buckets.map((b: any) => \`
              <div style="padding: var(--space-3); background: var(--surface-secondary); border-radius: var(--border-radius); margin-bottom: var(--space-2);">
                <strong>\${b.bucket}</strong> - \${b.objects.length} objects
              </div>
            \`).join('');
          }

          if (data.results.notes?.length > 0) {
            html += \`<h4 style="margin: var(--space-4) 0 var(--space-2) 0;">Notes (\${data.results.notes.length})</h4>\`;
            html += data.results.notes.map((n: string) => \`
              <div style="padding: var(--space-3); background: var(--surface-secondary); border-radius: var(--border-radius); margin-bottom: var(--space-2);">
                \${n.substring(0, 200)}...
              </div>
            \`).join('');
          }

          if (data.total === 0) {
            html = '<div style="text-align: center; padding: var(--space-8); color: var(--text-secondary);">No results found</div>';
          }

          resultsDiv.innerHTML = html;
        } else {
          resultsDiv.innerHTML = \`<div style="color: var(--error);">Error: \${data.error}</div>\`;
        }
      } catch (error: any) {
        resultsDiv.innerHTML = \`<div style="color: var(--error);">Error: \${error.message}</div>\`;
      }
    }

    // Dev Tools
    async function executeDevTool(stream = false) {
      const provider = document.getElementById('devToolProvider')?.value || 'openai';
      const mode = document.getElementById('devToolMode')?.value || 'dev';
      const input = document.getElementById('devToolInput')?.value || '';
      const outputDiv = document.getElementById('devToolOutput');

      if (!input || !outputDiv) return;

      if (stream) {
        outputDiv.textContent = 'Streaming...';
        await streamAIResponse(input, provider, mode, outputDiv);
      } else {
        outputDiv.textContent = 'Executing...';
        try {
          const endpoint = provider === 'openai' ? '/api/helper/chatgpt' : 
                          provider === 'gemini' ? '/api/gemini/chat' : '/api/helper/claude';
          const body = provider === 'gemini' 
            ? { prompt: input, model: 'gemini-2.5-flash', userId: 'dev-tool', cache: true }
            : { prompt: \`[Mode: \${mode}] \${input}\` };

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });

          const data = await response.json();
          outputDiv.textContent = data.output || data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data, null, 2);
        } catch (error: any) {
          outputDiv.textContent = 'Error: ' + error.message;
        }
      }
    }

    async function streamAIResponse(prompt: string, provider: string, mode: string, outputDiv: HTMLElement) {
      try {
        const response = await fetch('/api/dev-search/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, provider, mode }),
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.content) {
                    fullText += data.content;
                    outputDiv.textContent = fullText;
                  }
                  if (data.error) {
                    outputDiv.textContent = 'Error: ' + data.error;
                    return;
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        }
      } catch (error: any) {
        outputDiv.textContent = 'Error: ' + error.message;
      }
    }

    async function inspectResource(type: string, id: string) {
      if (!id) return;
      const outputDiv = document.getElementById('devToolOutput');
      if (!outputDiv) return;

      outputDiv.textContent = 'Inspecting...';

      try {
        const response = await fetch(\`/api/dev-search/inspect?type=\${type}&id=\${id}\`);
        const data = await response.json();
        outputDiv.textContent = JSON.stringify(data, null, 2);
      } catch (error: any) {
        outputDiv.textContent = 'Error: ' + error.message;
      }
    }

    // Brainstorm
    async function startBrainstorm(stream = false) {
      const input = document.getElementById('brainstormInput')?.value || '';
      const outputDiv = document.getElementById('brainstormOutput');

      if (!input || !outputDiv) return;

      if (stream) {
        outputDiv.textContent = 'Generating ideas...';
        await streamAIResponse(input, 'openai', 'brainstorm', outputDiv);
      } else {
        outputDiv.textContent = 'Generating ideas...';
        try {
          const response = await fetch('/api/helper/chatgpt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              prompt: \`[Brainstorming Mode] \${input}\`,
              model: 'gpt-4o'
            }),
          });

          const data = await response.json();
          outputDiv.textContent = data.output || JSON.stringify(data, null, 2);
        } catch (error: any) {
          outputDiv.textContent = 'Error: ' + error.message;
        }
      }
    }

    // Notes
    let currentNoteId: string | null = null;

    async function loadNotes() {
      const notesList = document.getElementById('notesList');
      if (!notesList) return;

      try {
        const response = await fetch('/api/dev-search/notes');
        const data = await response.json();

        if (data.success && data.notes.length > 0) {
          notesList.innerHTML = data.notes.map((note: any) => \`
            <div style="padding: var(--space-3); background: var(--surface-secondary); border-radius: var(--border-radius); margin-bottom: var(--space-2); cursor: pointer; border: 1px solid var(--border-color);"
                 onclick="loadNote('\${note.id}')">
              <div style="font-weight: 600; margin-bottom: var(--space-1);">\${note.title}</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">\${new Date(note.createdAt).toLocaleDateString()}</div>
            </div>
          \`).join('');
        } else {
          notesList.innerHTML = '<div style="text-align: center; padding: var(--space-4); color: var(--text-secondary);">No notes yet</div>';
        }
      } catch (error: any) {
        notesList.innerHTML = '<div style="color: var(--error);">Error loading notes</div>';
      }
    }

    function showNewNoteForm() {
      currentNoteId = null;
      document.getElementById('noteEditor')!.style.display = 'block';
      document.getElementById('noteViewer')!.style.display = 'none';
      document.getElementById('noteEmpty')!.style.display = 'none';
      document.getElementById('noteTitle')!.value = '';
      document.getElementById('noteContent')!.value = '';
    }

    async function saveNote() {
      const title = document.getElementById('noteTitle')?.value;
      const content = document.getElementById('noteContent')?.value;

      if (!title || !content) {
        alert('Title and content are required');
        return;
      }

      try {
        const response = await fetch('/api/dev-search/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content }),
        });

        const data = await response.json();
        if (data.success) {
          showNewNoteForm();
          loadNotes();
          alert('Note saved!');
        }
      } catch (error: any) {
        alert('Error saving note: ' + error.message);
      }
    }

    function cancelNote() {
      document.getElementById('noteEditor')!.style.display = 'none';
      document.getElementById('noteEmpty')!.style.display = 'block';
    }

    function loadNote(noteId: string) {
      // Implementation would fetch and display note
      currentNoteId = noteId;
    }

    function editCurrentNote() {
      // Implementation would load note into editor
    }

    function deleteCurrentNote() {
      if (currentNoteId && confirm('Delete this note?')) {
        // Implementation would delete note
        loadNotes();
      }
    }

    // Close modal on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDevSearchAssistant();
      }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDevSearchAssistant();
      }
    });
    
    // Projects Management
    async function loadProjects() {
      const gridEl = document.getElementById('projectsGrid');
      if (!gridEl) return;
      
      try {
        gridEl.innerHTML = '<div style="text-align: center; padding: var(--space-8); color: var(--text-secondary);">Loading projects...</div>';
        
        const response = await fetch('/api/clients/projects?limit=5');
        if (!response.ok) {
          throw new Error('Failed to load projects');
        }
        
        const data = await response.json();
        const projects = data.projects || [];
        
        if (projects.length === 0) {
          gridEl.innerHTML = \`
            <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-12);">
              <div style="font-size: 3rem; margin-bottom: var(--space-4);">📁</div>
              <h3 style="color: var(--text-primary); margin-bottom: var(--space-2);">No projects yet</h3>
              <p style="color: var(--text-secondary); margin-bottom: var(--space-6);">Create your first project to get started</p>
              <button class="btn btn-primary" onclick="showNewProjectModal()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
                </svg>
                New Project
              </button>
            </div>
          \`;
          return;
        }
        
        // Render project cards
        gridEl.innerHTML = projects.map(project => {
          const technologies = project.technologies ? (typeof project.technologies === 'string' ? JSON.parse(project.technologies) : project.technologies) : [];
          const clients = project.clients || [];
          
          return \`
            <div class="project-card" onclick="openProject('\${project.id}')">
              <div class="project-card-header">
                \${project.logoUrl ? 
                  \`<img src="\${project.logoUrl}" alt="\${project.name}" class="project-card-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                   <div class="client-logo-placeholder" style="display: none;">\${project.name.substring(0, 2).toUpperCase()}</div>\` :
                  \`<div class="client-logo-placeholder">\${project.name.substring(0, 2).toUpperCase()}</div>\`
                }
              </div>
              
              <div class="project-card-body">
                <h3 class="project-card-title">\${project.name}</h3>
                \${project.description ? \`<p class="project-card-description">\${project.description}</p>\` : ''}
                
                \${technologies.length > 0 ? \`
                  <div class="project-card-technologies">
                    \${technologies.slice(0, 4).map(tech => \`
                      <span class="project-tech-badge">\${tech}</span>
                    \`).join('')}
                    \${technologies.length > 4 ? \`<span class="project-tech-badge">+\${technologies.length - 4}</span>\` : ''}
                  </div>
                \` : ''}
                
                \${clients.length > 0 ? \`
                  <div class="project-card-clients">
                    <div class="project-clients-label">Top Clients</div>
                    <div class="project-clients-list">
                      \${clients.map(client => \`
                        <div class="client-logo-item" title="\${client.name}\${client.website ? ' - ' + client.website : ''}" 
                             onclick="event.stopPropagation(); window.open('\${client.website || '#'}', '_blank');">
                          \${client.logoUrl ? 
                            \`<img src="\${client.logoUrl}" alt="\${client.name}" onerror="this.parentElement.innerHTML='<div class=\\\"client-logo-placeholder\\\">\${client.name.substring(0, 2).toUpperCase()}</div>'">\` :
                            \`<div class="client-logo-placeholder">\${client.name.substring(0, 2).toUpperCase()}</div>\`
                          }
                        </div>
                      \`).join('')}
                      \${clients.length > 5 ? \`
                        <div class="client-logo-item" style="background: var(--neutral-100); color: var(--text-secondary); font-size: 0.75rem; font-weight: 600;">
                          +\${clients.length - 5}
                        </div>
                      \` : ''}
                    </div>
                  </div>
                \` : \`
                  <div class="project-card-clients">
                    <div class="project-clients-label">Top Clients</div>
                    <div style="color: var(--text-tertiary); font-size: 0.875rem; font-style: italic;">
                      No clients added yet
                    </div>
                  </div>
                \`}
              </div>
              
              <div class="project-card-footer">
                <span class="project-status \${project.status || 'active'}">
                  \${project.status === 'active' ? '●' : project.status === 'inactive' ? '○' : '◌'}
                  \${(project.status || 'active').charAt(0).toUpperCase() + (project.status || 'active').slice(1)}
                </span>
                <button class="project-card-action" onclick="event.stopPropagation(); openProject('\${project.id}')">
                  Open
                </button>
              </div>
            </div>
          \`;
        }).join('');
      } catch (error) {
        gridEl.innerHTML = \`
          <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-8); color: var(--error);">
            <p>Error loading projects: \${error.message}</p>
            <button class="btn btn-primary" onclick="loadProjects()" style="margin-top: var(--space-4);">Retry</button>
          </div>
        \`;
      }
    }
    
    function openProject(projectId) {
      // Navigate to project detail page or open project
      console.log('Opening project:', projectId);
      // TODO: Implement project detail view
    }
    
    function showNewProjectModal() {
      let modal = document.getElementById('newProjectModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'newProjectModal';
        modal.className = 'modal';
        const content = document.createElement('div');
        content.className = 'modal-content';
        content.style.maxWidth = '600px';
        content.innerHTML = '<div class="modal-header"><div class="modal-title">New Project</div><button class="modal-close" onclick="closeNewProjectModal()"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg></button></div><div class="card-body"><form id="newProjectForm" onsubmit="handleNewProject(event)"><div style="margin-bottom: var(--space-4);"><label style="display: block; margin-bottom: var(--space-2); font-weight: 500; color: var(--text-primary);">Project Name</label><input type="text" id="projectName" required style="width: 100%; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--surface-primary); color: var(--text-primary);" placeholder="Enter project name" /></div><div style="margin-bottom: var(--space-4);"><label style="display: block; margin-bottom: var(--space-2); font-weight: 500; color: var(--text-primary);">Description</label><textarea id="projectDescription" rows="4" style="width: 100%; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--surface-primary); color: var(--text-primary); resize: vertical;" placeholder="Enter project description"></textarea></div><div style="display: flex; gap: var(--space-3); justify-content: flex-end;"><button type="button" class="btn btn-secondary" onclick="closeNewProjectModal()">Cancel</button><button type="submit" class="btn btn-primary">Create Project</button></div></form></div></div>';
        modal.appendChild(content);
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeNewProjectModal();
        });
      }
      modal.classList.add('active');
    }
    
    function closeNewProjectModal() {
      const modal = document.getElementById('newProjectModal');
      if (modal) modal.classList.remove('active');
    }
    
    function handleNewProject(event) {
      event.preventDefault();
      const name = document.getElementById('projectName')?.value;
      const description = document.getElementById('projectDescription')?.value;
      console.log('Creating project:', { name, description });
      alert('Project "' + name + '" will be created!');
      closeNewProjectModal();
    }
    
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
    
    // Initialize routing on page load
    function initializeApp() {
      console.log('Initializing app...');
      
      // Hide all page contents initially
      const allViews = document.querySelectorAll('.page-content');
      console.log('Found', allViews.length, 'page-content elements');
      allViews.forEach(view => {
        view.style.display = 'none';
      });
      
      // Initialize routing
      try {
        initRouting();
        console.log('Routing initialized');
      } catch (error) {
        console.error('Error initializing routing:', error);
        // Fallback: show overview
        const overviewView = document.getElementById('overviewView');
        if (overviewView) {
          overviewView.style.display = 'block';
        }
      }
      
      // Load stats from API
      fetch('/api/stats')
        .then(res => res.json())
        .then(data => {
          console.log('Stats loaded:', data);
          if (data && document.getElementById('statsGrid')) {
            // Update stat values if API returns data
            const stats = document.querySelectorAll('.stat-value');
            if (stats.length >= 4 && data.projects !== undefined) {
              stats[0].textContent = data.projects || '24';
              stats[1].textContent = data.teamMembers || '8';
              stats[2].textContent = data.storageUsed || '2.4 GB';
              stats[3].textContent = data.apiRequests ? (data.apiRequests / 1000).toFixed(1) + 'K' : '45.2K';
            }
          }
        })
        .catch(err => console.error('Failed to load stats:', err));
    }
    
    // Initialize immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
      // Use setTimeout to ensure DOM is fully ready
      setTimeout(initializeApp, 0);
    }
  </script>
</body>
</html>`;
