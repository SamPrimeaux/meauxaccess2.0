/**
 * Southern Pets Animal Rescue - Dashboard HTML
 * Mobile-first admin dashboard for managing animals, analytics, emails, and settings
 */

export default function getSouthernPetsDashboardHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="light">
  <meta name="theme-color" content="#10B981">
  <title>SPAR Dashboard - Southern Pets Animal Rescue</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    /* Minimal scrollbars */
    * {
      scrollbar-width: thin;
      scrollbar-color: #E2E8F0 transparent;
    }
    *::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    *::-webkit-scrollbar-track {
      background: transparent;
    }
    *::-webkit-scrollbar-thumb {
      background: #E2E8F0;
      border-radius: 2px;
    }

    :root {
      /* SPAR Brand Colors */
      --bg-primary: #F9FAFB;
      --bg-secondary: #FFFFFF;
      --card-bg: #FFFFFF;
      
      /* Rescue Green Theme */
      --accent: #10B981;
      --accent-hover: #059669;
      --accent-light: #D1FAE5;
      --accent-soft: rgba(16, 185, 129, 0.1);
      
      /* Status Colors */
      --status-success: #10B981;
      --status-warning: #F59E0B;
      --status-info: #3B82F6;
      --status-danger: #EF4444;
      
      /* Text */
      --text-primary: #111827;
      --text-secondary: #4B5563;
      --text-muted: #9CA3AF;
      --text-inverse: #FFFFFF;
      
      /* Borders */
      --border: #E5E7EB;
      --border-medium: #D1D5DB;
      
      /* Shadows */
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
      --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
      
      /* Spacing */
      --space-xs: 6px;
      --space-sm: 12px;
      --space-md: 16px;
      --space-lg: 24px;
      --space-xl: 32px;
      
      /* Layout */
      --bottom-nav-height: 72px;
      --top-bar-height: 64px;
    }

    html {
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
      height: 100%;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.5;
      height: 100%;
      overflow: hidden;
    }

    /* ============================================
       APP CONTAINER
       ============================================ */
    .app {
      display: flex;
      flex-direction: column;
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
    }

    /* ============================================
       HEADER (Matching Website Style)
       ============================================ */
    .header {
      background-color: white;
      border-bottom: 1px solid #e0e0e0;
      position: sticky;
      top: 0;
      z-index: 1000;
      transition: box-shadow 0.3s ease;
    }

    .header.scrolled {
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: #000;
      font-weight: 600;
      font-size: 20px;
    }

    .logo-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .logo-icon img {
      width: 48px;
      height: 48px;
      object-fit: contain;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
      transition: transform 0.2s ease;
    }
    
    .logo:hover .logo-icon img {
      transform: scale(1.05);
    }

    .nav-menu {
      display: flex;
      list-style: none;
      gap: 16px;
      align-items: center;
    }

    .nav-link {
      text-decoration: none;
      color: #000;
      padding: 10px 16px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 15px;
      transition: all 0.2s ease;
    }

    .nav-link:hover {
      background-color: #f8f9fa;
    }

    .nav-link.active {
      color: #2ecc71;
      background-color: #f0fdf4;
    }

    .mobile-menu-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
    }

    .hamburger {
      width: 24px;
      height: 18px;
      position: relative;
    }

    .hamburger span {
      display: block;
      height: 2px;
      width: 100%;
      background-color: #000;
      position: absolute;
      transition: all 0.3s ease;
    }

    .hamburger span:nth-child(1) { top: 0; }
    .hamburger span:nth-child(2) { top: 8px; }
    .hamburger span:nth-child(3) { top: 16px; }

    .mobile-menu {
      display: none;
      background-color: white;
      border-top: 1px solid #e0e0e0;
      padding: 20px;
    }

    .mobile-menu.active {
      display: block;
    }

    .mobile-nav-link {
      display: block;
      text-decoration: none;
      color: #000;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      font-weight: 500;
    }

    .mobile-nav-link:last-child {
      border-bottom: none;
    }

    .mobile-nav-link.active {
      color: #2ecc71;
      font-weight: 600;
    }

    @media (max-width: 980px) {
      .nav-menu {
        display: none;
      }
      .mobile-menu-toggle {
        display: block;
      }
    }

    /* ============================================
       MAIN CONTENT
       ============================================ */
    .main-content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: var(--space-md);
      padding-top: var(--space-md);
      padding-bottom: calc(var(--bottom-nav-height) + var(--space-md) + env(safe-area-inset-bottom));
      -webkit-overflow-scrolling: touch;
    }

    .page {
      display: none;
      animation: fadeIn 0.2s ease;
    }

    .page.active {
      display: block;
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

    /* ============================================
       SEARCH & FILTERS
       ============================================ */
    .search-container {
      position: relative;
      margin-bottom: var(--space-md);
    }

    .search-input {
      width: 100%;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px 16px 12px 44px;
      color: var(--text-primary);
      font-size: 0.9375rem;
      transition: all 0.2s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-soft);
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
    }

    .filter-row {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      margin-bottom: var(--space-md);
      padding-bottom: 4px;
    }

    .filter-row::-webkit-scrollbar {
      display: none;
    }

    .chip {
      padding: 8px 16px;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.15s ease;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .chip:active {
      transform: scale(0.95);
    }

    .chip.active {
      background: var(--accent);
      border-color: var(--accent);
      color: white;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    }

    /* ============================================
       GRID SYSTEM
       ============================================ */
    .animals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-md);
    }

    @media (min-width: 640px) {
      .animals-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .animals-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (min-width: 1280px) {
      .animals-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    /* ============================================
       ANIMAL CARD
       ============================================ */
    .animal-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      overflow: hidden;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
    }

    .animal-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .animal-image-container {
      position: relative;
      width: 100%;
      padding-top: 100%;
      background: var(--bg-primary);
      overflow: hidden;
    }

    .animal-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .animal-card:hover .image-overlay {
      opacity: 1;
    }

    .image-action-btn {
      width: 44px;
      height: 44px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
      color: var(--text-primary);
    }

    .image-action-btn:active {
      transform: scale(0.9);
    }

    .status-badge-corner {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: capitalize;
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.95);
      color: var(--text-primary);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .status-badge-corner.available {
      background: rgba(16, 185, 129, 0.95);
      color: white;
    }

    .status-badge-corner.pending {
      background: rgba(245, 158, 11, 0.95);
      color: white;
    }

    .animal-info {
      padding: var(--space-md);
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .animal-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .animal-subtitle {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .animal-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 0.8125rem;
      color: var(--text-secondary);
      margin-bottom: 12px;
    }

    .health-icons {
      display: flex;
      gap: 6px;
      margin-bottom: 12px;
    }

    .health-icon {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border);
    }

    .health-icon.yes {
      background: rgba(16, 185, 129, 0.1);
      color: var(--status-success);
      border-color: var(--status-success);
    }

    .health-icon.no {
      background: rgba(156, 163, 175, 0.1);
      color: var(--text-muted);
    }

    .animal-actions {
      display: flex;
      gap: 8px;
      margin-top: auto;
    }

    .action-btn {
      flex: 1;
      padding: 10px;
      background: var(--bg-primary);
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .action-btn:active {
      background: var(--accent-soft);
      color: var(--accent);
    }

    .action-btn.primary {
      background: var(--accent);
      color: white;
      border-color: var(--accent);
    }

    /* ============================================
       STATS GRID
       ============================================ */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-sm);
      margin-bottom: var(--space-lg);
    }

    @media (min-width: 640px) {
      .stats-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: var(--space-md);
      box-shadow: var(--shadow-sm);
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
    }

    .stat-icon.success {
      background: rgba(16, 185, 129, 0.1);
      color: var(--status-success);
    }

    .stat-icon.info {
      background: rgba(59, 130, 246, 0.1);
      color: var(--status-info);
    }

    .stat-icon.warning {
      background: rgba(245, 158, 11, 0.1);
      color: var(--status-warning);
    }

    .stat-icon.danger {
      background: rgba(239, 68, 68, 0.1);
      color: var(--status-danger);
    }

    .stat-value {
      font-size: 1.875rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    .stat-trend {
      font-size: 0.75rem;
      color: var(--status-success);
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* ============================================
       EMAIL INBOX
       ============================================ */
    .email-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .email-item {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: var(--space-md);
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-sm);
    }

    .email-item:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .email-item.unread {
      border-left: 4px solid var(--accent);
    }

    .email-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .email-sender {
      font-weight: 700;
      color: var(--text-primary);
      font-size: 0.9375rem;
    }

    .email-time {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .email-subject {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 4px;
      font-size: 0.9375rem;
    }

    .email-preview {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .email-tags {
      display: flex;
      gap: 6px;
      margin-top: 8px;
    }

    .email-tag {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .email-tag.application {
      background: rgba(59, 130, 246, 0.1);
      color: var(--status-info);
    }

    .email-tag.tnr {
      background: rgba(245, 158, 11, 0.1);
      color: var(--status-warning);
    }

    .email-tag.inquiry {
      background: rgba(16, 185, 129, 0.1);
      color: var(--status-success);
    }

    /* ============================================
       ANALYTICS CHARTS
       ============================================ */
    .chart-container {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: var(--space-lg);
      box-shadow: var(--shadow-sm);
      margin-bottom: var(--space-md);
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-md);
    }

    .chart-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .chart-period {
      font-size: 0.8125rem;
      color: var(--text-muted);
      padding: 6px 12px;
      background: var(--bg-primary);
      border-radius: 8px;
      border: 1px solid var(--border);
    }

    .chart-bar-wrapper {
      height: 200px;
      display: flex;
      align-items: flex-end;
      gap: 12px;
      margin-bottom: var(--space-md);
    }

    .chart-bar {
      flex: 1;
      background: linear-gradient(to top, var(--accent), var(--accent-light));
      border-radius: 8px 8px 0 0;
      position: relative;
      min-height: 20px;
      transition: all 0.3s ease;
    }

    .chart-bar:hover {
      opacity: 0.8;
    }

    .chart-bar-label {
      position: absolute;
      bottom: -24px;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .chart-bar-value {
      position: absolute;
      top: -24px;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .chart-legend {
      display: flex;
      gap: var(--space-md);
      flex-wrap: wrap;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 3px;
    }

    /* ============================================
       SECTION HEADER
       ============================================ */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-md);
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .section-action {
      font-size: 0.875rem;
      color: var(--accent);
      font-weight: 600;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 10px;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .section-action:active {
      background: var(--accent-soft);
    }

    /* ============================================
       FAB
       ============================================ */
    .fab {
      position: fixed;
      bottom: calc(var(--bottom-nav-height) + var(--space-lg) + env(safe-area-inset-bottom));
      right: var(--space-md);
      width: 56px;
      height: 56px;
      background: var(--accent);
      color: white;
      border-radius: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
      transition: all 0.2s ease;
      z-index: 999;
    }

    .fab:active {
      transform: scale(0.9);
    }

    /* ============================================
       BOTTOM NAVIGATION
       ============================================ */
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--bg-secondary);
      border-top: 1px solid var(--border);
      height: calc(var(--bottom-nav-height) + env(safe-area-inset-bottom));
      padding-top: 10px;
      padding-bottom: env(safe-area-inset-bottom);
      display: flex;
      justify-content: space-around;
      align-items: flex-start;
      z-index: 1000;
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
    }

    .nav-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 8px;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s ease;
      position: relative;
      max-width: 80px;
    }

    .nav-item.active {
      color: var(--accent);
    }

    .nav-item.active::before {
      content: '';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 4px;
      background: var(--accent);
      border-radius: 0 0 4px 4px;
    }

    .nav-icon {
      width: 24px;
      height: 24px;
      transition: all 0.15s ease;
    }

    .nav-item.active .nav-icon {
      transform: scale(1.1);
    }

    .nav-label {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    /* ============================================
       MODAL
       ============================================ */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: var(--space-md);
    }

    .modal.active {
      display: flex;
    }

    .modal-content {
      background: var(--bg-secondary);
      border-radius: 20px;
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
    }

    .modal-header {
      padding: var(--space-lg);
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .modal-close {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--text-muted);
      transition: all 0.15s ease;
    }

    .modal-close:hover {
      background: var(--bg-primary);
    }

    .modal-body {
      padding: var(--space-lg);
    }

    .form-group {
      margin-bottom: var(--space-md);
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 6px;
    }

    .form-input,
    .form-textarea,
    .form-select {
      width: 100%;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 0.9375rem;
      color: var(--text-primary);
      background: var(--bg-secondary);
      transition: all 0.2s ease;
    }

    .form-input:focus,
    .form-textarea:focus,
    .form-select:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-soft);
    }

    .form-textarea {
      min-height: 100px;
      resize: vertical;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 0.9375rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
      border: none;
      white-space: nowrap;
    }

    .btn-primary {
      background: var(--accent);
      color: white;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .btn-primary:active {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
    }

    .btn-secondary {
      background: var(--bg-primary);
      color: var(--text-secondary);
      border: 1px solid var(--border);
    }

    .btn-secondary:active {
      background: var(--border);
    }

    /* ============================================
       IMAGE UPLOAD MODAL
       ============================================ */
    .image-upload-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: var(--space-md);
    }

    .image-upload-modal.active {
      display: flex;
    }

    .image-upload-content {
      background: var(--bg-secondary);
      border-radius: 20px;
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
    }

    .image-preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: var(--space-sm);
      margin-top: var(--space-md);
    }

    .image-preview-item {
      position: relative;
      aspect-ratio: 1;
      border-radius: 10px;
      overflow: hidden;
      border: 2px solid var(--border);
    }

    .image-preview-item.primary {
      border-color: var(--accent);
      border-width: 3px;
    }

    .image-preview-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-preview-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .image-preview-item:hover .image-preview-overlay {
      opacity: 1;
    }

    .image-preview-btn {
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
      color: var(--text-primary);
      border: none;
    }

    .image-preview-btn:active {
      transform: scale(0.9);
    }

    .primary-badge {
      position: absolute;
      top: 6px;
      left: 6px;
      background: var(--accent);
      color: white;
      font-size: 0.625rem;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 12px;
    }

    .upload-area {
      border: 2px dashed var(--border);
      border-radius: 12px;
      padding: var(--space-xl);
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: var(--bg-primary);
      margin-bottom: var(--space-md);
    }

    .upload-area:hover {
      border-color: var(--accent);
      background: var(--accent-soft);
    }

    .upload-area.dragover {
      border-color: var(--accent);
      background: var(--accent-soft);
    }

    .upload-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto var(--space-md);
      color: var(--text-muted);
    }

    .upload-text {
      color: var(--text-secondary);
      font-weight: 600;
      margin-bottom: 4px;
    }

    .upload-hint {
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .file-input-hidden {
      display: none;
    }

    /* ============================================
       RESPONSIVE
       ============================================ */
    @media (min-width: 768px) {
      .main-content {
        padding: var(--space-lg);
        padding-bottom: calc(var(--bottom-nav-height) + var(--space-lg) + env(safe-area-inset-bottom));
      }
    }
  </style>
</head>
<body>
  <div class="app">
    <!-- HEADER (Matching Website) -->
    <header class="header" id="header">
      <nav class="nav-container">
        <a href="/" class="logo">
          <div class="logo-icon">
            <img src="https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/be0043cf-6599-4d18-67a7-02a7a1e49000/thumbnail" 
                 alt="Southern Pets Animal Rescue Logo" 
                 width="48" 
                 height="48"
                 style="width: 48px; height: 48px; object-fit: contain; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;"
                 loading="eager"
                 fetchpriority="high"
                 onerror="this.src='https://static.wixstatic.com/media/33e096_671c6a950ec34c81b4e787ad92066c26~mv2.png'">
          </div>
          <span>Southern Pets Animal Rescue</span>
        </a>
        
        <ul class="nav-menu">
          <li><a href="/" class="nav-link">Home</a></li>
          <li><a href="/adopt" class="nav-link">Adopt</a></li>
          <li><a href="/gallery" class="nav-link">Gallery</a></li>
          <li><a href="/services" class="nav-link">Services</a></li>
        </ul>

        <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle mobile menu">
          <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </nav>

      <div class="mobile-menu" id="mobileMenu">
        <a href="/" class="mobile-nav-link">Home</a>
        <a href="/adopt" class="mobile-nav-link">Adopt</a>
        <a href="/gallery" class="mobile-nav-link">Gallery</a>
        <a href="/services" class="mobile-nav-link">Services</a>
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <div class="main-content">
      <!-- PAGE 1: ANIMALS -->
      <div class="page active" id="animals-page">
        <!-- Search -->
        <div class="search-container">
          <div class="search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
          <input type="text" class="search-input" placeholder="Search by name, breed..." id="animalSearch">
        </div>

        <!-- Filters -->
        <div class="filter-row">
          <div class="chip active" data-filter="all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            All (<span id="allCount">0</span>)
          </div>
          <div class="chip" data-filter="dogs">Dogs (<span id="dogsCount">0</span>)</div>
          <div class="chip" data-filter="cats">Cats (<span id="catsCount">0</span>)</div>
        </div>

        <div class="filter-row">
          <div class="chip active" data-status="available">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Available
          </div>
          <div class="chip" data-status="pending">Pending</div>
          <div class="chip" data-status="adopted">Adopted</div>
          <div class="chip" data-status="medical">Medical</div>
        </div>

        <!-- Animals Grid -->
        <div class="section-header">
          <div class="section-title">All Animals</div>
          <div class="section-action" onclick="openAddAnimal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New
          </div>
        </div>

        <div class="animals-grid" id="animalsGrid">
          <!-- Animals will be loaded here via API -->
          <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-xl); color: var(--text-muted);">
            Loading animals...
          </div>
        </div>
      </div>

      <!-- PAGE 2: ANALYTICS -->
      <div class="page" id="analytics-page">
        <!-- Stats Overview -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <div class="stat-value" id="visitorsCount">0</div>
            <div class="stat-label">Site Visitors</div>
            <div class="stat-trend">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              <span id="visitorsTrend">Loading...</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon info">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div class="stat-value" id="applicationsCount">0</div>
            <div class="stat-label">Applications</div>
            <div class="stat-trend">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              <span id="applicationsTrend">Loading...</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon warning">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
            </div>
            <div class="stat-value" id="adoptionsCount">0</div>
            <div class="stat-label">Adoptions YTD</div>
            <div class="stat-trend">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              <span id="adoptionsTrend">Loading...</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon danger">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <div class="stat-value" id="tnrCount">0</div>
            <div class="stat-label">TNR Cats Helped</div>
            <div class="stat-trend">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              <span id="tnrTrend">Loading...</span>
            </div>
          </div>
        </div>

        <!-- Charts will be loaded here -->
        <div id="analyticsCharts">
          <div style="text-align: center; padding: var(--space-xl); color: var(--text-muted);">
            Loading analytics...
          </div>
        </div>
      </div>

      <!-- PAGE 3: EMAILS -->
      <div class="page" id="emails-page">
        <!-- Email Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon info">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div class="stat-value" id="totalEmails">0</div>
            <div class="stat-label">Total Emails</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
            </div>
            <div class="stat-value" id="unreadEmails">0</div>
            <div class="stat-label">Unread</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon warning">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div class="stat-value" id="weekEmails">0</div>
            <div class="stat-label">This Week</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon danger">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div class="stat-value" id="urgentEmails">0</div>
            <div class="stat-label">Urgent</div>
          </div>
        </div>

        <!-- Filter -->
        <div class="filter-row">
          <div class="chip active" data-email-filter="all">All</div>
          <div class="chip" data-email-filter="unread">Unread (<span id="unreadCount">0</span>)</div>
          <div class="chip" data-email-filter="application">Applications</div>
          <div class="chip" data-email-filter="tnr">TNR</div>
          <div class="chip" data-email-filter="inquiry">Inquiries</div>
        </div>

        <!-- Email List -->
        <div class="email-list" id="emailList">
          <div style="text-align: center; padding: var(--space-xl); color: var(--text-muted);">
            Loading emails...
          </div>
        </div>
      </div>

      <!-- PAGE 4: SETTINGS -->
      <div class="page" id="settings-page">
        <div class="section-header">
          <div class="section-title">Settings</div>
        </div>

        <!-- Coming Soon -->
        <div style="text-align: center; padding: var(--space-xl); color: var(--text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 16px; opacity: 0.5;">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6m8.66-13.66l-4.24 4.24m-4.24 4.24-4.24 4.24M1 12h6m6 0h6m-1.34 8.66l-4.24-4.24m-4.24-4.24L2.34 2.34"></path>
          </svg>
          <div style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px;">Settings Panel</div>
          <div>Configure your rescue preferences, team members, and integrations</div>
        </div>
      </div>
    </div>

    <!-- FAB -->
    <div class="fab" onclick="openAddAnimal()">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </div>

    <!-- BOTTOM NAVIGATION -->
    <div class="bottom-nav">
      <div class="nav-item active" onclick="navigateTo('animals')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="10" r="3"></circle>
          <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"></path>
        </svg>
        <div class="nav-label">Animals</div>
      </div>
      <div class="nav-item" onclick="navigateTo('analytics')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="20" x2="12" y2="10"></line>
          <line x1="18" y1="20" x2="18" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="16"></line>
        </svg>
        <div class="nav-label">Analytics</div>
      </div>
      <div class="nav-item" onclick="navigateTo('emails')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
        <div class="nav-label">Emails</div>
      </div>
      <div class="nav-item" onclick="navigateTo('settings')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m8.66-13.66l-4.24 4.24m-4.24 4.24-4.24 4.24M1 12h6m6 0h6m-1.34 8.66l-4.24-4.24m-4.24-4.24L2.34 2.34"></path>
        </svg>
        <div class="nav-label">Settings</div>
      </div>
    </div>
  </div>

  <!-- IMAGE UPLOAD MODAL -->
  <div class="image-upload-modal" id="imageUploadModal">
    <div class="image-upload-content">
      <div class="modal-header">
        <div class="modal-title">Manage Photos - <span id="imageModalAnimalName">Animal</span></div>
        <div class="modal-close" onclick="closeImageModal()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
      </div>
      <div class="modal-body">
        <div class="upload-area" id="uploadArea" onclick="document.getElementById('fileInput').click()">
          <div class="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <div class="upload-text">Click to upload or drag and drop</div>
          <div class="upload-hint">PNG, JPG, GIF up to 10MB (multiple files supported)</div>
          <input type="file" id="fileInput" class="file-input-hidden" accept="image/*" multiple>
        </div>

        <div id="currentImagesContainer">
          <div class="form-label" style="margin-bottom: var(--space-sm);">Current Photos</div>
          <div class="image-preview-grid" id="currentImagesGrid">
            <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-lg); color: var(--text-muted);">
              No photos yet. Upload photos above.
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 12px; margin-top: var(--space-lg);">
          <button class="btn btn-secondary" style="flex: 1;" onclick="closeImageModal()">Close</button>
        </div>
      </div>
    </div>
  </div>

  <!-- EDIT ANIMAL MODAL -->
  <div class="modal" id="editModal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">Edit Animal</div>
        <div class="modal-close" onclick="closeModal()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" id="editAnimalName" placeholder="Animal name">
        </div>
        <div class="form-group">
          <label class="form-label">Species</label>
          <select class="form-select" id="editAnimalSpecies">
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Breed</label>
          <input type="text" class="form-input" id="editAnimalBreed" placeholder="Breed">
        </div>
        <div class="form-group">
          <label class="form-label">Age</label>
          <input type="text" class="form-input" id="editAnimalAge" placeholder="e.g. 1 year old">
        </div>
        <div class="form-group">
          <label class="form-label">Adoption Fee</label>
          <input type="text" class="form-input" id="editAnimalFee" placeholder="$250">
        </div>
        <div class="form-group">
          <label class="form-label">Bio</label>
          <textarea class="form-textarea" id="editAnimalBio" placeholder="Tell this animal's story..."></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" id="editAnimalStatus">
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="adopted">Adopted</option>
            <option value="medical">Medical</option>
            <option value="foster">Foster</option>
          </select>
        </div>
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-secondary" style="flex: 1;" onclick="closeModal()">Cancel</button>
          <button class="btn btn-primary" style="flex: 1;" onclick="saveAnimal()">Save Changes</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    // API Base URL
    const API_BASE = window.location.origin;

    // Navigation
    const pages = {
      animals: 'Animals',
      analytics: 'Analytics',
      emails: 'Emails',
      settings: 'Settings'
    };

    function navigateTo(pageName) {
      document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
      });

      document.getElementById(\`\${pageName}-page\`).classList.add('active');

      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
      });
      event.target.closest('.nav-item').classList.add('active');

      document.getElementById('currentPageName').textContent = pages[pageName];

      // Load data for the page
      if (pageName === 'animals') {
        loadAnimals();
      } else if (pageName === 'analytics') {
        loadAnalytics();
      } else if (pageName === 'emails') {
        loadEmails();
      }

      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }

    // Load animals from API
    async function loadAnimals() {
      try {
        const response = await fetch(\`\${API_BASE}/api/animals\`);
        const data = await response.json();
        
        if (data.success && data.animals) {
          renderAnimals(data.animals);
          updateCounts(data.animals);
        } else {
          document.getElementById('animalsGrid').innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: var(--space-xl); color: var(--text-muted);">No animals found</div>';
        }
      } catch (error) {
        console.error('Error loading animals:', error);
        document.getElementById('animalsGrid').innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: var(--space-xl); color: var(--status-danger);">Error loading animals. Please try again.</div>';
      }
    }

    // Render animals grid
    function renderAnimals(animals) {
      const grid = document.getElementById('animalsGrid');
      if (!animals || animals.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: var(--space-xl); color: var(--text-muted);">No animals available</div>';
        return;
      }

      grid.innerHTML = animals.map(animal => {
        const primaryPhoto = animal.photos && animal.photos.length > 0 ? animal.photos[0].url : 'https://via.placeholder.com/400?text=No+Photo';
        const statusClass = animal.status || 'available';
        const isSpayed = animal.spayed_neutered === 'yes' || animal.spayed_neutered === true;
        const isVaccinated = animal.vaccinated === 'yes' || animal.vaccinated === true;
        const isMicrochipped = animal.microchipped === 'yes' || animal.microchipped === true;
        const adoptionFee = animal.adoption_fee || (animal.species === 'dog' ? 250 : 150);

        return \`
          <div class="animal-card">
            <div class="animal-image-container">
              <img src="\${primaryPhoto}" class="animal-image" alt="\${animal.name}" onerror="this.src='https://via.placeholder.com/400?text=No+Photo'">
              <div class="image-overlay">
                <div class="image-action-btn" onclick="openImageManager(\${animal.id}, '\${animal.name || 'Animal'}')" title="Manage Photos">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
                <div class="image-action-btn" onclick="editAnimal(\${animal.id})" title="Edit Animal">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </div>
              </div>
              <div class="status-badge-corner \${statusClass}">\${statusClass.charAt(0).toUpperCase() + statusClass.slice(1)}</div>
            </div>
            <div class="animal-info">
              <div class="animal-title">\${animal.name || 'Unnamed'}</div>
              <div class="animal-subtitle">\${animal.breed || 'Mixed'} � \${animal.gender || 'Unknown'} � \${animal.age || 'Unknown age'}</div>
              <div class="animal-meta">
                <span>$\${adoptionFee}</span>
              </div>
              <div class="health-icons">
                <div class="health-icon \${isSpayed ? 'yes' : 'no'}" title="\${isSpayed ? 'Spayed/Neutered' : 'Not Spayed/Neutered'}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    \${isSpayed ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'}
                  </svg>
                </div>
                <div class="health-icon \${isVaccinated ? 'yes' : 'no'}" title="\${isVaccinated ? 'Vaccinated' : 'Not Vaccinated'}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    \${isVaccinated ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'}
                  </svg>
                </div>
                <div class="health-icon \${isMicrochipped ? 'yes' : 'no'}" title="\${isMicrochipped ? 'Microchipped' : 'Not Microchipped'}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    \${isMicrochipped ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'}
                  </svg>
                </div>
              </div>
              <div class="animal-actions">
                <button class="action-btn" onclick="editAnimal(\${animal.id})">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit
                </button>
                <button class="action-btn primary" onclick="viewAnimal(\${animal.id})">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  View
                </button>
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    // Update filter counts
    function updateCounts(animals) {
      const allCount = animals.length;
      const dogsCount = animals.filter(a => a.species === 'dog').length;
      const catsCount = animals.filter(a => a.species === 'cat').length;

      document.getElementById('allCount').textContent = allCount;
      document.getElementById('dogsCount').textContent = dogsCount;
      document.getElementById('catsCount').textContent = catsCount;
    }

    // Load analytics
    async function loadAnalytics() {
      try {
        // Load stats
        const statsResponse = await fetch(\`\${API_BASE}/api/analytics/stats\`);
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
          document.getElementById('visitorsCount').textContent = statsData.visitors || 0;
          document.getElementById('applicationsCount').textContent = statsData.applications || 0;
          document.getElementById('adoptionsCount').textContent = statsData.adoptions || 0;
          document.getElementById('tnrCount').textContent = statsData.tnr || 0;
        }
      } catch (error) {
        console.error('Error loading analytics:', error);
      }
    }

    // Load emails
    async function loadEmails() {
      try {
        const response = await fetch(\`\${API_BASE}/api/emails\`);
        const data = await response.json();
        
        if (data.success && data.emails) {
          renderEmails(data.emails);
          updateEmailStats(data.emails);
        } else {
          document.getElementById('emailList').innerHTML = '<div style="text-align: center; padding: var(--space-xl); color: var(--text-muted);">No emails found</div>';
        }
      } catch (error) {
        console.error('Error loading emails:', error);
        document.getElementById('emailList').innerHTML = '<div style="text-align: center; padding: var(--space-xl); color: var(--status-danger);">Error loading emails. Please try again.</div>';
      }
    }

    // Render emails
    function renderEmails(emails) {
      const list = document.getElementById('emailList');
      if (!emails || emails.length === 0) {
        list.innerHTML = '<div style="text-align: center; padding: var(--space-xl); color: var(--text-muted);">No emails available</div>';
        return;
      }

      list.innerHTML = emails.map(email => {
        const tagClass = email.type === 'application' ? 'application' : email.type === 'tnr' ? 'tnr' : 'inquiry';
        const unreadClass = email.read ? '' : 'unread';
        
        return \`
          <div class="email-item \${unreadClass}" onclick="viewEmail('\${email.id}')">
            <div class="email-header">
              <div class="email-sender">\${email.sender || 'Unknown'}</div>
              <div class="email-time">\${formatTime(email.date)}</div>
            </div>
            <div class="email-subject">\${email.subject || 'No Subject'}</div>
            <div class="email-preview">\${email.preview || email.body || ''}</div>
            <div class="email-tags">
              <div class="email-tag \${tagClass}">\${email.type?.toUpperCase() || 'INQUIRY'}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    // Update email stats
    function updateEmailStats(emails) {
      const total = emails.length;
      const unread = emails.filter(e => !e.read).length;
      const thisWeek = emails.filter(e => {
        const emailDate = new Date(e.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return emailDate > weekAgo;
      }).length;
      const urgent = emails.filter(e => e.urgent).length;

      document.getElementById('totalEmails').textContent = total;
      document.getElementById('unreadEmails').textContent = unread;
      document.getElementById('weekEmails').textContent = thisWeek;
      document.getElementById('urgentEmails').textContent = urgent;
      document.getElementById('unreadCount').textContent = unread;
    }

    // Format time
    function formatTime(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);

      if (days > 0) return \`\${days} day\${days > 1 ? 's' : ''} ago\`;
      if (hours > 0) return \`\${hours} hour\${hours > 1 ? 's' : ''} ago\`;
      return 'Just now';
    }

    // Modal functions
    let currentAnimalId = null;

    function openAddAnimal() {
      currentAnimalId = null;
      document.getElementById('editAnimalName').value = '';
      document.getElementById('editAnimalBreed').value = '';
      document.getElementById('editAnimalAge').value = '';
      document.getElementById('editAnimalFee').value = '';
      document.getElementById('editAnimalBio').value = '';
      document.getElementById('editAnimalSpecies').value = 'dog';
      document.getElementById('editAnimalStatus').value = 'available';
      document.getElementById('editModal').classList.add('active');
    }

    async function editAnimal(id) {
      currentAnimalId = id;
      try {
        const response = await fetch(\`\${API_BASE}/api/animals/\${id}\`);
        const data = await response.json();
        
        if (data.success && data.animal) {
          const animal = data.animal;
          document.getElementById('editAnimalName').value = animal.name || '';
          document.getElementById('editAnimalBreed').value = animal.breed || '';
          document.getElementById('editAnimalAge').value = animal.age || '';
          document.getElementById('editAnimalFee').value = animal.adoption_fee || '';
          document.getElementById('editAnimalBio').value = animal.bio || '';
          document.getElementById('editAnimalSpecies').value = animal.species || 'dog';
          document.getElementById('editAnimalStatus').value = animal.status || 'available';
          document.getElementById('editModal').classList.add('active');
        }
      } catch (error) {
        console.error('Error loading animal:', error);
        alert('Error loading animal details');
      }
    }

    function closeModal() {
      document.getElementById('editModal').classList.remove('active');
      currentAnimalId = null;
    }

    async function saveAnimal() {
      const animalData = {
        name: document.getElementById('editAnimalName').value,
        breed: document.getElementById('editAnimalBreed').value,
        age: document.getElementById('editAnimalAge').value,
        adoption_fee: document.getElementById('editAnimalFee').value.replace('$', ''),
        bio: document.getElementById('editAnimalBio').value,
        species: document.getElementById('editAnimalSpecies').value,
        status: document.getElementById('editAnimalStatus').value
      };

      try {
        const url = currentAnimalId 
          ? \`\${API_BASE}/api/animals/\${currentAnimalId}\`
          : \`\${API_BASE}/api/animals\`;
        
        const method = currentAnimalId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(animalData)
        });

        const data = await response.json();
        
        if (data.success) {
          closeModal();
          loadAnimals();
          alert(currentAnimalId ? 'Animal updated!' : 'Animal added!');
        } else {
          alert('Error: ' + (data.error || 'Failed to save'));
        }
      } catch (error) {
        console.error('Error saving animal:', error);
        alert('Error saving animal');
      }
    }

    function viewAnimal(id) {
      window.open(\`/adopt#animal-\${id}\`, '_blank');
    }

    function viewEmail(id) {
      // Open email in new window or show modal
      console.log('View email:', id);
    }

    // Image Management
    let currentImageAnimalId = null;
    let currentImageAnimalName = '';

    async function openImageManager(animalId, animalName) {
      currentImageAnimalId = animalId;
      currentImageAnimalName = animalName;
      document.getElementById('imageModalAnimalName').textContent = animalName;
      document.getElementById('imageUploadModal').classList.add('active');
      
      // Load current images
      await loadAnimalImages(animalId);
    }

    function closeImageModal() {
      document.getElementById('imageUploadModal').classList.remove('active');
      currentImageAnimalId = null;
      currentImageAnimalName = '';
    }

    async function loadAnimalImages(animalId) {
      try {
        const response = await fetch(\`\${API_BASE}/api/gallery?animalId=\${animalId}\`);
        const data = await response.json();
        
        const grid = document.getElementById('currentImagesGrid');
        if (data.success && data.images && data.images.length > 0) {
          // Map to expected format
          const images = data.images.map(img => ({
            id: img.id,
            url: img.url || img.photo_url,
            isPrimary: img.isPrimary === 1 || img.isPrimary === true || img.is_primary === 1
          }));
          grid.innerHTML = images.map((image: any, index: number) => {
            return \`
              <div class="image-preview-item \${image.isPrimary ? 'primary' : ''}">
                <img src="\${image.url}" alt="Photo \${index + 1}" onerror="this.src='https://via.placeholder.com/200?text=Error'">
                \${image.isPrimary ? '<div class="primary-badge">Primary</div>' : ''}
                <div class="image-preview-overlay">
                  <button class="image-preview-btn" onclick="setPrimaryImage('\${image.id}', \${animalId})" title="Set as Primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                  <button class="image-preview-btn" onclick="deleteImage('\${image.id}', \${animalId})" title="Delete" style="color: var(--status-danger);">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            \`;
          }).join('');
        } else {
          grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: var(--space-lg); color: var(--text-muted);">No photos yet. Upload photos above.</div>';
        }
      } catch (error) {
        console.error('Error loading images:', error);
        document.getElementById('currentImagesGrid').innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: var(--space-lg); color: var(--status-danger);">Error loading images</div>';
      }
    }

    async function setPrimaryImage(imageId, animalId) {
      try {
        const response = await fetch(\`\${API_BASE}/api/gallery/update\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: imageId,
            isPrimary: true,
            animalId: animalId.toString()
          })
        });

        const data = await response.json();
        if (data.success) {
          await loadAnimalImages(animalId);
          loadAnimals(); // Refresh main list
        } else {
          alert('Error: ' + (data.error || 'Failed to set primary image'));
        }
      } catch (error) {
        console.error('Error setting primary image:', error);
        alert('Error setting primary image');
      }
    }

    async function deleteImage(imageId, animalId) {
      if (!confirm('Are you sure you want to delete this image?')) return;

      try {
        const url = new URL(\`\${API_BASE}/api/gallery/delete\`);
        url.searchParams.set('id', imageId);
        const response = await fetch(url.toString(), {
          method: 'DELETE'
        });

        const data = await response.json();
        if (data.success) {
          await loadAnimalImages(animalId);
          loadAnimals(); // Refresh main list
        } else {
          alert('Error: ' + (data.error || 'Failed to delete image'));
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Error deleting image');
      }
    }

    // File upload handler
    document.getElementById('fileInput').addEventListener('change', async function(e) {
      const files = Array.from(e.target.files);
      if (files.length === 0 || !currentImageAnimalId) return;

      const uploadArea = document.getElementById('uploadArea');
      uploadArea.style.opacity = '0.5';
      uploadArea.style.pointerEvents = 'none';

      try {
        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('animalId', currentImageAnimalId.toString());
          formData.append('animalName', currentImageAnimalName);
          formData.append('isPrimary', (document.getElementById('currentImagesGrid').children.length === 0 || 
            (document.getElementById('currentImagesGrid').children.length === 1 && 
             document.getElementById('currentImagesGrid').textContent.includes('No photos'))) ? 'true' : 'false');

          const response = await fetch(\`\${API_BASE}/api/gallery/upload\`, {
            method: 'POST',
            body: formData
          });

          const data = await response.json();
          if (!data.success) {
            throw new Error(data.error || 'Upload failed');
          }
        }

        // Reload images
        await loadAnimalImages(currentImageAnimalId);
        loadAnimals(); // Refresh main list
        
        // Reset file input
        e.target.value = '';
      } catch (error) {
        console.error('Error uploading images:', error);
        alert('Error uploading images: ' + error.message);
      } finally {
        uploadArea.style.opacity = '1';
        uploadArea.style.pointerEvents = 'auto';
      }
    });

    // Drag and drop
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (files.length > 0 && currentImageAnimalId) {
        const fileInput = document.getElementById('fileInput');
        const dataTransfer = new DataTransfer();
        files.forEach(f => dataTransfer.items.add(f));
        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Close image modal on background click
    document.getElementById('imageUploadModal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeImageModal();
      }
    });

    // Mobile menu toggle
    document.getElementById('mobileMenuToggle')?.addEventListener('click', function() {
      const menu = document.getElementById('mobileMenu');
      const hamburger = this.querySelector('.hamburger');
      menu.classList.toggle('active');
      hamburger?.classList.toggle('open');
    });

    // Header scroll effect
    const header = document.getElementById('header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    // Filter handlers
    document.querySelectorAll('.chip[data-filter]').forEach(chip => {
      chip.addEventListener('click', function() {
        this.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        // TODO: Filter animals
      });
    });

    document.querySelectorAll('.chip[data-status]').forEach(chip => {
      chip.addEventListener('click', function() {
        this.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        // TODO: Filter by status
      });
    });

    document.querySelectorAll('.chip[data-email-filter]').forEach(chip => {
      chip.addEventListener('click', function() {
        this.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        // TODO: Filter emails
      });
    });

    // Search handler
    document.getElementById('animalSearch').addEventListener('input', function(e) {
      // TODO: Implement search
      console.log('Search:', e.target.value);
    });

    // Close modal on background click
    document.getElementById('editModal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });

    // Haptic feedback
    document.querySelectorAll('.chip, .btn, .top-btn, .section-action, .animal-card, .email-item').forEach(el => {
      el.addEventListener('click', () => {
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      });
    });

    // Load initial data
    loadAnimals();
  </script>
</body>
</html>`;
}
