/**
 * Team Meauxbility Page
 * Remastered and optimized with board member data structure
 */

// Board Members Data Structure (Easy to manage and track)
export const BOARD_MEMBERS = [
  {
    id: 'sam-primeaux',
    name: 'Sam Primeaux',
    role: 'Founder & President',
    image: 'https://cdn.shopify.com/s/files/1/0685/1654/4672/files/IMG_1048.jpg?v=1752908933',
    quote: 'From paralysis to purpose—building the support system I needed',
    bio: 'Founded Meauxbility after his 2017 spinal cord injury, transforming personal experience into systemic change for SCI survivors.',
    portrait: false,
  },
  {
    id: 'scott-mcbride',
    name: 'Scott McBride',
    role: 'Vice President',
    image: 'https://cdn.shopify.com/s/files/1/0685/1654/4672/files/screenshot-2025-08-01-at-80320-am.png?v=1754053444',
    quote: 'Building bridges between survivors and solutions',
    bio: 'Dedicated to connecting people with the resources and support they need for recovery.',
    portrait: false,
  },
  {
    id: 'todd-leblanc',
    name: 'Todd Leblanc',
    role: 'Treasurer',
    image: 'https://cdn.shopify.com/s/files/1/0685/1654/4672/files/todd.png?v=1752769540',
    quote: 'Every dollar directed toward maximum impact',
    bio: 'Ensuring financial transparency and strategic resource allocation for maximum community impact.',
    portrait: false,
  },
  {
    id: 'mandy-pejean',
    name: 'Mandy Pejean',
    role: 'Secretary',
    image: 'https://cdn.shopify.com/s/files/1/0685/1654/4672/files/img-2283.jpg?v=1754570120',
    quote: 'Organizing hope into actionable change',
    bio: 'Keeping our organization structured and focused on delivering real results for the community.',
    portrait: true, // 9:16 aspect ratio
  },
  {
    id: 'lb-broussard',
    name: 'LB Broussard',
    role: 'Board Member',
    image: 'https://cdn.shopify.com/s/files/1/0685/1654/4672/files/lb.png?v=1752769421',
    quote: 'Community is the cornerstone of recovery',
    bio: 'Building strong community connections that support long-term recovery and independence.',
    portrait: false,
  },
];

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Generate team member HTML from data
export function generateTeamMemberHTML(member: typeof BOARD_MEMBERS[0], imageUrl?: string): string {
  const finalImageUrl = imageUrl || member.image;
  const portraitAttr = member.portrait ? ' data-portrait="true"' : '';
  
  return `
        <div class="team-member scroll-animate"${portraitAttr}>
          <img src="${escapeHtml(finalImageUrl)}" alt="${escapeHtml(member.name)}" class="team-image">
          <div class="team-info">
            <h3 class="team-name">${escapeHtml(member.name)}</h3>
            <p class="team-role">${escapeHtml(member.role)}</p>
            <p class="team-quote">"${escapeHtml(member.quote)}"</p>
          </div>
        </div>`;
}

// Base HTML template (will be enhanced with logo, SEO, and migrated images)
export const TEAM_PAGE_HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Team Meauxbility - Meet Our Board | Meauxbility</title>
  <meta name="description" content="Meet the passionate leaders building Meauxbility from the ground up. Join our founding team creating real change for spinal cord injury survivors.">
  <meta name="keywords" content="Meauxbility, team, board members, spinal cord injury, nonprofit, recovery, community">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://www.meauxbility.org/pages/team-meauxbility">
  <meta property="og:title" content="Team Meauxbility - Meet Our Board">
  <meta property="og:description" content="Meet the passionate leaders building Meauxbility from the ground up. Join our founding team creating real change for spinal cord injury survivors.">
  <meta property="og:image" content="https://www.meauxbility.org/assets/meauxbility-team-og.jpg">
  <meta property="og:site_name" content="Meauxbility">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://www.meauxbility.org/pages/team-meauxbility">
  <meta property="twitter:title" content="Team Meauxbility - Meet Our Board">
  <meta property="twitter:description" content="Meet the passionate leaders building Meauxbility from the ground up.">
  <meta property="twitter:image" content="https://www.meauxbility.org/assets/meauxbility-team-og.jpg">
  
  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Team Meauxbility",
    "description": "Meet the passionate leaders building Meauxbility from the ground up",
    "url": "https://www.meauxbility.org/pages/team-meauxbility",
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Meauxbility",
      "url": "https://www.meauxbility.org"
    },
    "about": {
      "@type": "Organization",
      "name": "Meauxbility",
      "description": "Empowering mobility and independence for spinal cord injury survivors"
    }
  }
  </script>
  
  <link rel="canonical" href="https://www.meauxbility.org/pages/team-meauxbility">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
    /* CSS Reset & Variables */
    :root {
      /* Core Brand Colors */
      --meaux-orange: #FF7619;
      --meaux-teal: #1F97A9;
      --meaux-green: #21c48c;
      
      /* Extended Palette */
      --meaux-dark-teal: #0F7A8A;
      --meaux-light-orange: #FFB380;
      --meaux-light-teal: #4aabb8;
      
      /* Background System */
      --meaux-white: #FFFFFF;
      --meaux-light-gray: #F8FAFB;
      --meaux-soft-blue: #E8F4F6;
      
      /* Text Colors */
      --meaux-text-primary: #0C2D31;
      --meaux-text-secondary: #4A5568;
      --meaux-text-muted: #718096;
      
      /* Borders & Shadows */
      --meaux-border: rgba(31, 151, 169, 0.15);
      --meaux-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
      --meaux-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
      --meaux-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12);
      --meaux-shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.16);
      --meaux-shadow-glow: 0 0 40px rgba(255, 118, 25, 0.15);
      
      /* Layout */
      --max-width: 1400px;
      --radius: 24px;
      --radius-sm: 12px;
      --transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--meaux-text-primary);
      background: var(--meaux-white);
      line-height: 1.7;
      font-size: 18px;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Container */
    .container {
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 0 24px;
    }

    /* GLB Background - Full viewport */
    .glb-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 0;
      opacity: 0;
      animation: fadeInBackground 1.5s ease forwards;
      pointer-events: none;
    }

    @keyframes fadeInBackground {
      to { opacity: 0.35; }
    }

    .glb-background model-viewer {
      width: 100%;
      height: 100%;
      --poster-color: transparent;
      --progress-bar-color: var(--meaux-orange);
    }

    /* Hero Section with frosted overlay */
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 80px 0;
      z-index: 1;
    }

    .hero-container {
      position: relative;
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(12px);
      border-radius: var(--radius);
      padding: 80px;
      box-shadow: var(--meaux-shadow-xl);
      max-width: 1200px;
      margin: 0 auto;
      animation: slideUp 0.8s ease forwards;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .hero-content {
      max-width: 800px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: rgba(255, 118, 25, 0.1);
      border: 1px solid rgba(255, 118, 25, 0.2);
      border-radius: 100px;
      font-size: 16px;
      font-weight: 600;
      color: var(--meaux-orange);
      margin-bottom: 32px;
    }

    .hero-title {
      font-size: clamp(3rem, 6vw, 5rem);
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 32px;
      letter-spacing: -0.03em;
      color: var(--meaux-text-primary);
    }

    .hero-title .gradient-text {
      background: linear-gradient(135deg, var(--meaux-orange) 0%, var(--meaux-teal) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      color: var(--meaux-text-secondary);
      margin-bottom: 48px;
      line-height: 1.7;
    }

    .hero-cta {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 20px 40px;
      background: var(--meaux-orange);
      color: white;
      text-decoration: none;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 18px;
      letter-spacing: 0.5px;
      transition: var(--transition);
      box-shadow: var(--meaux-shadow-md), var(--meaux-shadow-glow);
      border: none;
      cursor: pointer;
    }

    .hero-cta:hover {
      transform: translateY(-3px);
      box-shadow: var(--meaux-shadow-lg), 0 0 60px rgba(255, 118, 25, 0.3);
    }

    .hero-cta .arrow {
      transition: transform 0.3s ease;
      font-size: 20px;
    }

    .hero-cta:hover .arrow {
      transform: translateX(4px);
    }

    /* Founder Story Section */
    .founder-story {
      padding: 140px 0;
      background: var(--meaux-light-gray);
      position: relative;
      overflow: hidden;
      z-index: 1;
    }

    .founder-story::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(255, 118, 25, 0.05) 0%, transparent 70%);
      border-radius: 50%;
    }

    .story-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 100px;
      align-items: center;
    }

    .story-content {
      opacity: 0;
      transform: translateX(-30px);
    }

    .story-content.in-view {
      animation: slideInLeft 0.8s ease forwards;
    }

    @keyframes slideInLeft {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .story-badge {
      display: inline-block;
      padding: 8px 16px;
      background: var(--meaux-teal);
      color: white;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 24px;
    }

    .story-title {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 32px;
      letter-spacing: -0.02em;
      color: var(--meaux-text-primary);
    }

    .story-quote {
      font-size: 1.75rem;
      font-weight: 300;
      font-style: italic;
      color: var(--meaux-teal);
      margin-bottom: 32px;
      padding-left: 32px;
      border-left: 4px solid var(--meaux-orange);
      line-height: 1.5;
    }

    .story-text {
      font-size: 1.25rem;
      color: var(--meaux-text-secondary);
      line-height: 1.8;
    }

    .story-visual {
      position: relative;
      opacity: 0;
      transform: translateX(30px);
    }

    .story-visual.in-view {
      animation: slideInRight 0.8s ease forwards;
    }

    @keyframes slideInRight {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .story-image {
      width: 100%;
      height: 500px;
      object-fit: cover;
      border-radius: var(--radius);
      box-shadow: var(--meaux-shadow-xl);
    }

    /* Trust Metrics */
    .trust-metrics {
      padding: 100px 0;
      background: white;
      border-top: 1px solid var(--meaux-border);
      border-bottom: 1px solid var(--meaux-border);
      position: relative;
      z-index: 1;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 40px;
      text-align: center;
    }

    .metric {
      opacity: 0;
      transform: translateY(20px);
    }

    .metric.in-view {
      animation: fadeInUp 0.6s ease forwards;
    }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .metric-number {
      display: block;
      font-size: 3.5rem;
      font-weight: 900;
      color: var(--meaux-orange);
      margin-bottom: 12px;
      letter-spacing: -0.02em;
    }

    .metric-label {
      font-size: 1.125rem;
      color: var(--meaux-text-secondary);
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    /* Team Section */
    .team-section {
      padding: 140px 0;
      background: var(--meaux-white);
      position: relative;
      z-index: 1;
    }

    .section-header {
      text-align: center;
      max-width: 800px;
      margin: 0 auto 80px;
    }

    .section-title {
      font-size: 3.5rem;
      font-weight: 900;
      margin-bottom: 24px;
      letter-spacing: -0.02em;
      color: var(--meaux-text-primary);
    }

    .section-subtitle {
      font-size: 1.5rem;
      color: var(--meaux-text-secondary);
      line-height: 1.6;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 40px;
      margin-bottom: 60px;
    }

    .team-member {
      position: relative;
      border-radius: var(--radius);
      overflow: hidden;
      background: white;
      box-shadow: var(--meaux-shadow-md);
      transition: var(--transition);
      cursor: pointer;
      opacity: 0;
      transform: translateY(30px);
    }

    .team-member.in-view {
      animation: fadeInUp 0.6s ease forwards;
    }

    .team-member:nth-child(1) { animation-delay: 0.1s; }
    .team-member:nth-child(2) { animation-delay: 0.2s; }
    .team-member:nth-child(3) { animation-delay: 0.3s; }
    .team-member:nth-child(4) { animation-delay: 0.4s; }
    .team-member:nth-child(5) { animation-delay: 0.5s; }

    .team-member:hover {
      transform: translateY(-8px);
      box-shadow: var(--meaux-shadow-xl);
    }

    .team-image {
      width: 100%;
      height: 320px;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    /* Fix for portrait image (Mandy Pejean - 9:16 aspect) */
    .team-member[data-portrait="true"] .team-image {
      aspect-ratio: 9/16;
      height: auto;
      max-height: 450px;
      object-position: center top;
    }

    .team-member:hover .team-image {
      transform: scale(1.05);
    }

    .team-info {
      padding: 28px;
      background: white;
    }

    .team-name {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--meaux-text-primary);
      margin-bottom: 6px;
      letter-spacing: -0.01em;
    }

    .team-role {
      font-size: 1rem;
      color: var(--meaux-orange);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }

    .team-quote {
      font-size: 1.125rem;
      color: var(--meaux-text-secondary);
      font-style: italic;
      opacity: 0;
      max-height: 0;
      overflow: hidden;
      transition: all 0.3s ease;
      line-height: 1.6;
    }

    .team-member:hover .team-quote {
      opacity: 1;
      max-height: 100px;
    }

    /* Join Section */
    .join-section {
      padding: 140px 0 100px;
      background: linear-gradient(135deg, var(--meaux-light-gray) 0%, var(--meaux-soft-blue) 100%);
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .join-content {
      max-width: 900px;
      margin: 0 auto;
    }

    .join-title {
      font-size: 3.5rem;
      font-weight: 900;
      margin-bottom: 32px;
      letter-spacing: -0.02em;
      color: var(--meaux-text-primary);
    }

    .join-text {
      font-size: 1.5rem;
      color: var(--meaux-text-secondary);
      margin-bottom: 56px;
      line-height: 1.7;
    }

    /* Opportunities Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      padding: 20px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .modal-overlay.active {
      display: flex;
      opacity: 1;
    }

    .modal {
      background: white;
      border-radius: var(--radius);
      max-width: 900px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      transform: scale(0.9);
      transition: transform 0.3s ease;
    }

    .modal-overlay.active .modal {
      transform: scale(1);
    }

    .modal-header {
      background: linear-gradient(135deg, var(--meaux-orange) 0%, var(--meaux-teal) 100%);
      padding: 48px;
      color: white;
      text-align: center;
      position: relative;
    }

    .modal-close {
      position: absolute;
      top: 24px;
      right: 24px;
      width: 44px;
      height: 44px;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
    }

    .modal-close:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(90deg);
    }

    .modal-close::before,
    .modal-close::after {
      content: '';
      position: absolute;
      width: 24px;
      height: 2px;
      background: white;
    }

    .modal-close::before {
      transform: rotate(45deg);
    }

    .modal-close::after {
      transform: rotate(-45deg);
    }

    .modal-title {
      font-size: 2.5rem;
      font-weight: 900;
      margin-bottom: 12px;
      letter-spacing: -0.02em;
    }

    .modal-subtitle {
      font-size: 1.25rem;
      opacity: 0.95;
    }

    .modal-body {
      padding: 48px;
    }

    /* Position Accordion */
    .positions-accordion {
      margin-bottom: 48px;
    }

    .position-item {
      border: 1px solid var(--meaux-border);
      border-radius: var(--radius-sm);
      margin-bottom: 20px;
      overflow: hidden;
      transition: var(--transition);
    }

    .position-item.active {
      box-shadow: var(--meaux-shadow-md);
      border-color: var(--meaux-orange);
    }

    .position-toggle {
      width: 100%;
      padding: 24px 28px;
      background: white;
      border: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: var(--transition);
    }

    .position-toggle:hover {
      background: var(--meaux-light-gray);
    }

    .position-title-wrapper {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .position-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, rgba(255, 118, 25, 0.1) 0%, rgba(31, 151, 169, 0.1) 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
    }

    .position-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--meaux-text-primary);
    }

    .expand-icon {
      font-size: 1.75rem;
      color: var(--meaux-text-muted);
      transition: transform 0.3s ease;
    }

    .position-item.active .expand-icon {
      transform: rotate(45deg);
    }

    .position-details {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .position-item.active .position-details {
      max-height: 500px;
    }

    .position-content {
      padding: 0 28px 28px;
    }

    .position-description {
      color: var(--meaux-text-secondary);
      line-height: 1.8;
      margin-bottom: 20px;
      font-size: 1.125rem;
    }

    .position-requirements {
      list-style: none;
      padding: 0;
    }

    .position-requirements li {
      padding: 10px 0;
      padding-left: 28px;
      position: relative;
      color: var(--meaux-text-secondary);
      font-size: 1.125rem;
      line-height: 1.6;
    }

    .position-requirements li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--meaux-green);
      font-weight: bold;
      font-size: 1.25rem;
    }

    /* Application Form */
    .application-form {
      background: var(--meaux-light-gray);
      padding: 40px;
      border-radius: var(--radius);
    }

    .form-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--meaux-text-primary);
      margin-bottom: 32px;
    }

    .form-grid {
      display: grid;
      gap: 28px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-size: 1rem;
      font-weight: 600;
      color: var(--meaux-text-primary);
      margin-bottom: 10px;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 14px 18px;
      border: 1px solid var(--meaux-border);
      border-radius: var(--radius-sm);
      font-size: 1.125rem;
      font-family: inherit;
      transition: var(--transition);
      background: white;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--meaux-orange);
      box-shadow: 0 0 0 3px rgba(255, 118, 25, 0.1);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 140px;
      line-height: 1.6;
    }

    .form-submit {
      width: 100%;
      padding: 20px 40px;
      background: linear-gradient(135deg, var(--meaux-orange) 0%, var(--meaux-teal) 100%);
      color: white;
      border: none;
      border-radius: var(--radius-sm);
      font-size: 1.25rem;
      font-weight: 700;
      cursor: pointer;
      transition: var(--transition);
      margin-top: 20px;
      letter-spacing: 0.5px;
    }

    .form-submit:hover {
      transform: translateY(-2px);
      box-shadow: var(--meaux-shadow-lg);
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      body {
        font-size: 16px;
      }

      .hero-container {
        padding: 60px 40px;
      }

      .hero-title {
        font-size: 3rem;
      }

      .hero-subtitle {
        font-size: 1.25rem;
      }

      .section-title {
        font-size: 2.5rem;
      }

      .story-container {
        grid-template-columns: 1fr;
        gap: 60px;
      }

      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .hero-container {
        padding: 40px 24px;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .team-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .modal {
        max-height: 100vh;
        border-radius: 0;
      }

      .modal-header {
        padding: 36px 24px;
      }

      .modal-body {
        padding: 36px 24px;
      }
    }

    @media (max-width: 480px) {
      .hero {
        min-height: 90vh;
        padding: 40px 0;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .metric-number {
        font-size: 3rem;
      }

      .team-grid {
        grid-template-columns: 1fr;
      }

      .join-title {
        font-size: 2.5rem;
      }

      .join-text {
        font-size: 1.25rem;
      }
    }

    /* Scroll animations trigger */
    .scroll-animate {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s ease;
    }

    .scroll-animate.in-view {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
</head>
<body>

  <!-- GLB Background - Full viewport -->
  <div class="glb-background" id="glbBackground">
    <model-viewer 
      id="helpingHands"
      src="https://cdn.shopify.com/3d/models/2f72b763d930043c/Helping_Hand_0820204901_texture.glb"
      alt="Helping hands sculpture representing support and community"
      camera-orbit="0deg 65deg 4m"
      shadow-intensity="0.2"
      exposure="0.7"
      environment-image="neutral"
      loading="eager"
      disable-zoom
      disable-pan
      auto-rotate-delay="0"
      rotation-per-second="0deg">
    </model-viewer>
  </div>

  <!-- Hero Section -->
  <section class="hero">
    <div class="container">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span>⚡</span>
            <span>Now Recruiting Founding Team</span>
          </div>
          <h1 class="hero-title">
            Build The <span class="gradient-text">Foundation</span><br>
            With Us
          </h1>
          <p class="hero-subtitle">
            Join the founding team creating real change for spinal cord injury survivors. 
            Your skills can transform lives and build a movement that matters.
          </p>
          <button class="hero-cta" onclick="openOpportunitiesModal()">
            View Opportunities
            <span class="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Founder Story -->
  <section class="founder-story">
    <div class="container">
      <div class="story-container">
        <div class="story-content scroll-animate">
          <span class="story-badge">Founder's Journey</span>
          <h2 class="story-title">From Paralysis to Purpose</h2>
          <blockquote class="story-quote">
            "Every barrier I've faced has become a bridge for others"
          </blockquote>
          <p class="story-text">
            Sam Primeaux's journey from a life-changing spinal cord injury to founding Meauxbility 
            isn't just a story of personal triumph—it's a blueprint for systemic change. After experiencing 
            firsthand the gaps in support, resources, and community for SCI survivors, Sam transformed 
            frustration into action, creating the organization he wished had existed during his own recovery.
          </p>
        </div>
        <div class="story-visual scroll-animate">
          <img 
            src="PLACEHOLDER_STORY_IMAGE" 
            alt="Sam Primeaux, Founder of Meauxbility" 
            class="story-image"
          >
        </div>
      </div>
    </div>
  </section>

  <!-- Trust Metrics -->
  <section class="trust-metrics">
    <div class="container">
      <div class="metrics-grid">
        <div class="metric scroll-animate">
          <span class="metric-number" data-target="500">0</span>
          <span class="metric-label">Lives Impacted</span>
        </div>
        <div class="metric scroll-animate">
          <span class="metric-number" data-target="50">0</span>
          <span class="metric-label">Partner Organizations</span>
        </div>
        <div class="metric scroll-animate">
          <span class="metric-number" data-target="100">0</span>
          <span class="metric-label">Resources Connected</span>
        </div>
        <div class="metric scroll-animate">
          <span class="metric-number" data-target="2025">0</span>
          <span class="metric-label">Founded</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Team Section -->
  <section class="team-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Meet Our Board</h2>
        <p class="section-subtitle">
          The passionate leaders building Meauxbility from the ground up
        </p>
      </div>
      
      <div class="team-grid">
        PLACEHOLDER_TEAM_MEMBERS
      </div>
    </div>
  </section>

  <!-- Join Section -->
  <section class="join-section">
    <div class="container">
      <div class="join-content">
        <h2 class="join-title">Ready to Make a Difference?</h2>
        <p class="join-text">
          We're looking for passionate individuals to join our founding team. 
          Whether you bring creative skills, organizational expertise, or simply a desire to help, 
          there's a place for you in our movement.
        </p>
        <button class="hero-cta" onclick="openOpportunitiesModal()">
          Explore Opportunities
          <span class="arrow">→</span>
        </button>
      </div>
    </div>
  </section>

  <!-- Opportunities Modal -->
  <div class="modal-overlay" id="modalOverlay">
    <div class="modal">
      <div class="modal-header">
        <button class="modal-close" onclick="closeModal()"></button>
        <h2 class="modal-title">Join Our Founding Team</h2>
        <p class="modal-subtitle">Shape the future of spinal cord injury recovery</p>
      </div>
      
      <div class="modal-body">
        <!-- Position Accordion -->
        <div class="positions-accordion">
          <!-- Content Creator -->
          <div class="position-item" data-position="content">
            <button class="position-toggle" onclick="togglePosition('content')">
              <div class="position-title-wrapper">
                <div class="position-icon">🎥</div>
                <span class="position-name">Content Creator</span>
              </div>
              <span class="expand-icon">+</span>
            </button>
            <div class="position-details">
              <div class="position-content">
                <p class="position-description">
                  Tell powerful stories that inspire action. Help us document journeys from injury to independence, 
                  creating content that educates, motivates, and builds community.
                </p>
                <ul class="position-requirements">
                  <li>Experience with video production and editing</li>
                  <li>Strong storytelling and writing skills</li>
                  <li>Passion for disability advocacy</li>
                  <li>5-10 hours per week commitment</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Social Media Lead -->
          <div class="position-item" data-position="social">
            <button class="position-toggle" onclick="togglePosition('social')">
              <div class="position-title-wrapper">
                <div class="position-icon">📱</div>
                <span class="position-name">Social Media Lead</span>
              </div>
              <span class="expand-icon">+</span>
            </button>
            <div class="position-details">
              <div class="position-content">
                <p class="position-description">
                  Amplify our message across digital platforms. Build and engage communities that support 
                  and celebrate recovery milestones while expanding our reach.
                </p>
                <ul class="position-requirements">
                  <li>Proven social media management experience</li>
                  <li>Understanding of accessibility in digital content</li>
                  <li>Community building expertise</li>
                  <li>10-15 hours per week commitment</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Fundraising Coordinator -->
          <div class="position-item" data-position="fundraising">
            <button class="position-toggle" onclick="togglePosition('fundraising')">
              <div class="position-title-wrapper">
                <div class="position-icon">💰</div>
                <span class="position-name">Fundraising Coordinator</span>
              </div>
              <span class="expand-icon">+</span>
            </button>
            <div class="position-details">
              <div class="position-content">
                <p class="position-description">
                  Secure the resources that change lives. Connect donors to real impact stories and 
                  develop sustainable funding strategies for our programs.
                </p>
                <ul class="position-requirements">
                  <li>Grant writing or fundraising experience</li>
                  <li>Strong communication and relationship skills</li>
                  <li>Knowledge of nonprofit funding landscape</li>
                  <li>10-20 hours per week commitment</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Admin & Outreach -->
          <div class="position-item" data-position="admin">
            <button class="position-toggle" onclick="togglePosition('admin')">
              <div class="position-title-wrapper">
                <div class="position-icon">🎯</div>
                <span class="position-name">Admin & Outreach</span>
              </div>
              <span class="expand-icon">+</span>
            </button>
            <div class="position-details">
              <div class="position-content">
                <p class="position-description">
                  Be the backbone of our operations. Connect people to life-changing resources while 
                  ensuring smooth day-to-day operations of our growing organization.
                </p>
                <ul class="position-requirements">
                  <li>Strong organizational and administrative skills</li>
                  <li>Experience with CRM or database management</li>
                  <li>Excellent written and verbal communication</li>
                  <li>15-20 hours per week commitment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Application Form -->
        <form class="application-form" id="applicationForm">
          <h3 class="form-title">Apply to Join Our Team</h3>
          
          <div class="form-grid">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name *</label>
                <input type="text" id="firstName" name="firstName" required>
              </div>
              <div class="form-group">
                <label for="lastName">Last Name *</label>
                <input type="text" id="lastName" name="lastName" required>
              </div>
            </div>
            
            <div class="form-group">
              <label for="email">Email Address *</label>
              <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone">
              </div>
              <div class="form-group">
                <label for="position">Position Interest *</label>
                <select id="position" name="position" required>
                  <option value="">Select a position</option>
                  <option value="content">Content Creator</option>
                  <option value="social">Social Media Lead</option>
                  <option value="fundraising">Fundraising Coordinator</option>
                  <option value="admin">Admin & Outreach</option>
                  <option value="multiple">Multiple Positions</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="availability">Weekly Availability *</label>
              <select id="availability" name="availability" required>
                <option value="">Select hours per week</option>
                <option value="1-5">1-5 hours</option>
                <option value="6-10">6-10 hours</option>
                <option value="11-15">11-15 hours</option>
                <option value="16-20">16-20 hours</option>
                <option value="20+">20+ hours</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="experience">Relevant Experience</label>
              <textarea id="experience" name="experience" placeholder="Tell us about your skills and experience..."></textarea>
            </div>
            
            <div class="form-group">
              <label for="motivation">Why Meauxbility? *</label>
              <textarea id="motivation" name="motivation" required placeholder="What drives you to help people with spinal cord injuries?"></textarea>
            </div>
            
            <button type="submit" class="form-submit">Submit Application</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <script>
    // Load Model Viewer
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    document.head.appendChild(script);

    // GLB Parallax Scroll Animation
    let glbModel;
    let ticking = false;
    
    window.addEventListener('load', () => {
      glbModel = document.getElementById('helpingHands');
    });

    // Parallax effect for GLB background
    function updateGLBPosition() {
      if (!glbModel) return;
      
      const scrolled = window.pageYOffset;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollProgress = scrolled / maxScroll;
      
      // Subtle rotation based on scroll (0 to 360 degrees)
      const rotation = scrollProgress * 360;
      
      // Subtle vertical movement for parallax
      const yOffset = 65 + (scrollProgress * 10); // 65deg to 75deg
      
      glbModel.setAttribute('camera-orbit', \`\${rotation}deg \${yOffset}deg 4m\`);
      
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(updateGLBPosition);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          
          // Trigger counter animation for metrics
          if (entry.target.classList.contains('metric')) {
            animateCounter(entry.target.querySelector('.metric-number'));
          }
        }
      });
    }, observerOptions);

    // Observe all scroll-animate elements
    document.querySelectorAll('.scroll-animate').forEach(el => {
      observer.observe(el);
    });

    // Counter animation
    function animateCounter(element) {
      if (!element || element.animated) return;
      element.animated = true;
      
      const target = parseInt(element.getAttribute('data-target'));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
      }, 16);
    }

    // Modal functionality
    function openOpportunitiesModal() {
      const modal = document.getElementById('modalOverlay');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      const modal = document.getElementById('modalOverlay');
      modal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Reset form
      document.getElementById('applicationForm').reset();
      
      // Close all accordion items
      document.querySelectorAll('.position-item').forEach(item => {
        item.classList.remove('active');
      });
    }

    // Position accordion toggle
    function togglePosition(position) {
      const item = document.querySelector(\`[data-position="\${position}"]\`);
      const isActive = item.classList.contains('active');
      
      // Close all positions
      document.querySelectorAll('.position-item').forEach(p => {
        p.classList.remove('active');
      });
      
      // Open clicked position if it wasn't active
      if (!isActive) {
        item.classList.add('active');
      }
    }

    // Form submission
    document.getElementById('applicationForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // Add metadata
      data.timestamp = new Date().toISOString();
      data.source = 'team_page_v2';
      
      // TODO: Replace with actual API endpoint
      console.log('Application submitted:', data);
      
      // Show success message
      alert('Thank you for applying! We\\'ll review your application and get back to you within 48 hours.');
      
      // Close modal
      closeModal();
    });

    // Close modal on outside click
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        closeModal();
      }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Performance optimization: Debounce resize events
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Handle any resize-dependent updates here
      }, 250);
    });
  </script>

</body>
</html>`;
