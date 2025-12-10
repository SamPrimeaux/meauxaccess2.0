/**
 * Glassmorphic Header Component
 * Refined header with sidenav, auth modal, and dual theme support
 * No emojis - uses inline SVG icons
 */

// Extract styles for injection into <head>
export const GLASSMORPHIC_HEADER_STYLES = `
<style>
:root{--teal:#339999;--orange:#FF6B35;--orange-dark:#E85D00;--purple:#9B59B6;--mint:#4AECDC;--nav-h:72px;--nav-hs:60px;--max-w:1440px;--sidenav-w:320px;--tr:all .3s cubic-bezier(.4,0,.2,1)}

[data-theme=light]{--nav-bg:rgba(255,255,255,.75);--nav-bg-scrolled:rgba(255,255,255,.85);--nav-border:rgba(255,107,53,.15);--nav-text:#0C2D31;--nav-link:#FF6B35;--nav-hover:#E85D00;--nav-hover-bg:rgba(255,107,53,.08);--sidenav-bg:rgba(255,255,255,.95);--sidenav-overlay:rgba(0,0,0,.4);--btn-bg:#FF6B35;--btn-hover:#E85D00;--accent:#FF6B35;--divider:rgba(12,45,49,.1);--modal-bg:rgba(255,255,255,.85);--input-bg:rgba(255,255,255,.6);--input-border:rgba(255,107,53,.2);--input-focus:rgba(255,107,53,.4)}

[data-theme=dark]{--nav-bg:rgba(12,45,49,.75);--nav-bg-scrolled:rgba(12,45,49,.85);--nav-border:rgba(74,236,220,.2);--nav-text:rgba(255,255,255,.95);--nav-link:#4AECDC;--nav-hover:#5FDDDC;--nav-hover-bg:rgba(74,236,220,.1);--sidenav-bg:rgba(12,45,49,.95);--sidenav-overlay:rgba(0,0,0,.6);--btn-bg:#9B59B6;--btn-hover:#8E44AD;--accent:#4AECDC;--divider:rgba(74,236,220,.15);--modal-bg:rgba(12,45,49,.85);--input-bg:rgba(20,60,65,.6);--input-border:rgba(74,236,220,.2);--input-focus:rgba(74,236,220,.4)}

.nav{position:fixed;top:0;left:0;right:0;height:var(--nav-h);background:var(--nav-bg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--nav-border);z-index:9999;transition:var(--tr)}

.nav.scrolled{height:var(--nav-hs);background:var(--nav-bg-scrolled);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px)}

.nav-container{max-width:var(--max-w);height:100%;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between}

.nav-logo{display:flex;align-items:center;text-decoration:none;transition:var(--tr);cursor:pointer}.nav-logo:hover{transform:scale(.98)}.nav-logo:focus-visible{outline:2px solid var(--accent);outline-offset:4px;border-radius:8px}

.nav-logo-img{width:48px;height:48px;border-radius:12px;transition:var(--tr);object-fit:cover;box-shadow:0 2px 8px rgba(0,0,0,.08)}
.nav.scrolled .nav-logo-img{width:42px;height:42px;border-radius:10px}

[data-theme=dark] .nav-logo-img{box-shadow:0 2px 12px rgba(74,236,220,.2)}

.nav-menu{display:flex;align-items:center;gap:4px;list-style:none;height:100%}

.nav-link{position:relative;padding:10px 18px;color:var(--nav-link);text-decoration:none;font-size:14px;font-weight:600;border-radius:8px;transition:var(--tr);white-space:nowrap;min-height:44px;display:flex;align-items:center;letter-spacing:0.2px}

.nav-link::after{content:'';position:absolute;bottom:8px;left:18px;right:18px;height:0;background:var(--accent);border-radius:2px;transition:height .3s cubic-bezier(.34,1.56,.64,1)}

.nav-link:hover{color:var(--nav-hover);background:var(--nav-hover-bg)}

.nav-link.active,.nav-link[aria-current=page]{color:var(--nav-hover);font-weight:700}

.nav-link.active::after,.nav-link[aria-current=page]::after{height:3px}

.nav-donate{margin-left:12px;padding:11px 26px;background:var(--btn-bg);color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;transition:var(--tr);min-height:44px;letter-spacing:.4px;text-decoration:none;display:flex;align-items:center;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 4px 16px rgba(255,107,53,.25),inset 0 1px 0 rgba(255,255,255,.2)}

.nav-donate:hover{background:var(--btn-hover);transform:translateY(-1px);box-shadow:0 6px 20px rgba(255,107,53,.35),inset 0 1px 0 rgba(255,255,255,.3)}
[data-theme=dark] .nav-donate{box-shadow:0 4px 16px rgba(155,89,182,.25),inset 0 1px 0 rgba(255,255,255,.1)}
[data-theme=dark] .nav-donate:hover{box-shadow:0 6px 20px rgba(155,89,182,.35),inset 0 1px 0 rgba(255,255,255,.15)}

.burger{display:none;background:transparent;border:0;padding:10px;cursor:pointer;position:relative;z-index:10001;min-width:48px;min-height:48px;border-radius:10px;transition:var(--tr)}.burger:hover{background:var(--nav-hover-bg)}.burger:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

.burger-inner{display:flex;flex-direction:column;gap:5px;width:24px}
.burger-line{display:block;width:100%;height:2.5px;background:var(--nav-link);transition:var(--tr);border-radius:2px}
.burger.open .burger-line:nth-child(1){transform:rotate(45deg) translate(7px,7px)}
.burger.open .burger-line:nth-child(2){opacity:0;transform:translateX(-20px)}
.burger.open .burger-line:nth-child(3){transform:rotate(-45deg) translate(7px,-7px)}

.sidenav-overlay{position:fixed;inset:0;background:var(--sidenav-overlay);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease;z-index:9997}
.sidenav-overlay.open{opacity:1;visibility:visible}

.sidenav{position:fixed;top:0;right:0;bottom:0;width:var(--sidenav-w);background:var(--sidenav-bg);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);transform:translateX(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);z-index:9998;display:flex;flex-direction:column;box-shadow:-4px 0 24px rgba(0,0,0,.1);overflow-y:auto;overflow-x:hidden}
.sidenav.open{transform:translateX(0)}

.sidenav-header{padding:24px;border-bottom:1px solid var(--divider);display:flex;align-items:center;justify-content:space-between;min-height:var(--nav-h)}

.sidenav-logo{display:flex;align-items:center;gap:12px;text-decoration:none;transition:var(--tr);cursor:pointer}
.sidenav-logo:hover{transform:scale(.98)}

.sidenav-logo-img{width:48px;height:48px;border-radius:12px;object-fit:cover;box-shadow:0 2px 8px rgba(0,0,0,.08)}
[data-theme=dark] .sidenav-logo-img{box-shadow:0 2px 12px rgba(74,236,220,.2)}

.sidenav-close{background:transparent;border:0;padding:10px;cursor:pointer;min-width:44px;min-height:44px;border-radius:8px;transition:var(--tr);display:flex;align-items:center;justify-content:center}
.sidenav-close:hover{background:var(--nav-hover-bg)}
.sidenav-close-icon{width:24px;height:24px;position:relative}
.sidenav-close-icon::before,.sidenav-close-icon::after{content:'';position:absolute;top:50%;left:0;width:100%;height:2.5px;background:var(--nav-link);border-radius:2px}
.sidenav-close-icon::before{transform:translateY(-50%) rotate(45deg)}
.sidenav-close-icon::after{transform:translateY(-50%) rotate(-45deg)}

.sidenav-content{flex:1;padding:8px 0}

.sidenav-section{padding:0 24px;margin-bottom:32px}

.sidenav-section-title{font-size:11px;font-weight:700;color:var(--nav-link);letter-spacing:1.2px;text-transform:uppercase;margin-bottom:12px;padding:0 8px}

.sidenav-nav{display:flex;flex-direction:column;gap:2px;list-style:none}

.sidenav-link{display:flex;align-items:center;gap:12px;padding:14px 16px;color:var(--nav-text);text-decoration:none;font-size:15px;font-weight:600;border-radius:10px;transition:var(--tr);letter-spacing:0.1px;min-height:52px;position:relative;overflow:hidden}

.sidenav-link::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--accent);transform:translateX(-100%);transition:transform .3s cubic-bezier(.34,1.56,.64,1);border-radius:0 4px 4px 0}

.sidenav-link:hover{background:var(--nav-hover-bg);color:var(--nav-hover)}

.sidenav-link.active{background:var(--nav-hover-bg);color:var(--nav-hover);font-weight:700}
.sidenav-link.active::before{transform:translateX(0)}

.sidenav-link-icon{width:24px;height:24px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.sidenav-link-icon svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}

.sidenav-footer{padding:24px;border-top:1px solid var(--divider)}

.sidenav-donate{display:flex;align-items:center;justify-content:center;gap:8px;padding:16px 24px;background:var(--btn-bg);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;transition:var(--tr);min-height:56px;letter-spacing:.5px;text-decoration:none;width:100%;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 4px 16px rgba(255,107,53,.3),inset 0 1px 0 rgba(255,255,255,.2)}
.sidenav-donate:hover{background:var(--btn-hover);transform:translateY(-2px);box-shadow:0 6px 20px rgba(255,107,53,.4),inset 0 1px 0 rgba(255,255,255,.3)}
[data-theme=dark] .sidenav-donate{box-shadow:0 4px 16px rgba(155,89,182,.3),inset 0 1px 0 rgba(255,255,255,.1)}
[data-theme=dark] .sidenav-donate:hover{box-shadow:0 6px 20px rgba(155,89,182,.4),inset 0 1px 0 rgba(255,255,255,.15)}

.sidenav-donate-icon{width:20px;height:20px;flex-shrink:0}
.sidenav-donate-icon svg{width:100%;height:100%;fill:currentColor}

@media(max-width:980px){
  .nav-container{padding:0 20px}
  .nav-menu,.nav-donate{display:none}
  .burger{display:flex;align-items:center;justify-content:center}
}

@media(max-width:640px){
  .nav-container{padding:0 16px}
  .nav-logo-img{width:42px;height:42px;border-radius:10px}
  .nav.scrolled .nav-logo-img{width:38px;height:38px;border-radius:8px}
  .sidenav{width:min(var(--sidenav-w),85vw)}
}

@media(max-width:380px){
  .nav-logo-img{width:40px;height:40px}
  .nav.scrolled .nav-logo-img{width:36px;height:36px}
}

@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
}
</style>
`;

// Extract markup for injection after <body> tag
export const GLASSMORPHIC_HEADER_MARKUP = (logoUrl: string) => `
<a href="#main" class="skip-link">Skip to main content</a>
<header class="nav" id="nav" role="banner">
<div class="nav-container">
<a class="nav-logo" id="navLogo" aria-label="Meauxbility">
<img src="${logoUrl}" 
     alt="Meauxbility" 
     class="nav-logo-img" 
     width="48" 
     height="48" 
     loading="eager" 
     fetchpriority="high">
</a>

<nav aria-label="Main navigation">
<ul class="nav-menu" id="mainMenu">
<li><a class="nav-link" href="/">Home</a></li>
<li><a class="nav-link" href="/pages/about-us">About</a></li>
<li><a class="nav-link" href="/pages/mobility-grants-programs">Programs</a></li>
<li><a class="nav-link" href="/pages/community">Community</a></li>
<li><a class="nav-link" href="/pages/resources">Resources</a></li>
<li><a class="nav-link" href="/pages/get-involved">Connect</a></li>
<li><a class="nav-donate" href="/pages/donate">Impact</a></li>
</ul>
</nav>

<button class="burger" id="burger" aria-label="Open navigation menu" aria-expanded="false">
<div class="burger-inner">
<span class="burger-line"></span>
<span class="burger-line"></span>
<span class="burger-line"></span>
</div>
</button>
</div>
</header>

<div class="sidenav-overlay" id="sidenavOverlay" aria-hidden="true"></div>

<nav class="sidenav" id="sidenav" aria-label="Mobile navigation">
<div class="sidenav-header">
<a class="sidenav-logo" id="sidenavLogo" aria-label="Meauxbility">
<img src="${logoUrl}" 
     alt="Meauxbility" 
     class="sidenav-logo-img" 
     width="48" 
     height="48" 
     loading="lazy">
</a>
<button class="sidenav-close" id="sidenavClose" aria-label="Close navigation menu">
<span class="sidenav-close-icon"></span>
</button>
</div>

<div class="sidenav-content">
<div class="sidenav-section">
<h2 class="sidenav-section-title">Main Menu</h2>
<ul class="sidenav-nav" id="mobileMainMenu">
<li><a href="/" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span><span>Home</span></a></li>
<li><a href="/pages/about-us" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></span><span>About</span></a></li>
<li><a href="/pages/mobility-grants-programs" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></span><span>Programs</span></a></li>
<li><a href="/pages/community" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><span>Community</span></a></li>
<li><a href="/pages/resources" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></span><span>Resources</span></a></li>
<li><a href="/pages/get-involved" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><span>Get Involved</span></a></li>
</ul>
</div>

<div class="sidenav-section" id="dashboardSection" style="display:none">
<h2 class="sidenav-section-title">Dashboard</h2>
<ul class="sidenav-nav">
<li><a href="/dashboard" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></span><span>Overview</span></a></li>
<li><a href="/meauxwork" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></span><span>MeauxWork</span></a></li>
<li><a href="/meauxstats" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></span><span>MeauxStats</span></a></li>
<li><a href="/meauxteam" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><span>MeauxTeam</span></a></li>
<li><a href="/meauxdoc" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></span><span>MeauxDocs</span></a></li>
<li><a href="/meauxphoto" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></span><span>MeauxPhoto</span></a></li>
<li><a href="/meauxmedia" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></span><span>MeauxMedia</span></a></li>
<li><a href="/meauxcloud" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg></span><span>MeauxCloud</span></a></li>
<li><a href="/meauxcad" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></span><span>MeauxCAD</span></a></li>
<li><a href="/meauxlearn" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 1-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3 3h7z"/></svg></span><span>MeauxLearn</span></a></li>
<li><a href="/meauxtalk" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span><span>MeauxTalk</span></a></li>
<li><a href="/meauxdev" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></span><span>MeauxDev</span></a></li>
<li><a href="/meauxmcp" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/></svg></span><span>MeauxMCP</span></a></li>
<li><a href="/meauxauto" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span><span>MeauxAuto</span></a></li>
<li><a href="/settings" class="sidenav-link"><span class="sidenav-link-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/></svg></span><span>Settings</span></a></li>
</ul>
</div>
</div>

<div class="sidenav-footer">
<a class="sidenav-donate" href="/pages/donate">
<span class="sidenav-donate-icon"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span>
<span>Make an Impact</span>
</a>
</div>
</nav>
`;

// Extract script for injection before </body>
export const GLASSMORPHIC_HEADER_SCRIPT = `
<script>
(()=>{
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const body=document.body;

// Check if we're on a dashboard page
const isDashboardPage=()=>{
const path=location.pathname;
return path.includes('/dashboard')||path.includes('/meaux')||path.includes('/settings');
};

// Theme initialization
const darkPages=['about','community','resources'];
function initTheme(){
const path=location.pathname;
let theme='light';
darkPages.forEach(p=>{if(path.includes(p))theme='dark'});
document.documentElement.setAttribute('data-theme',theme);
body.setAttribute('data-theme',theme);
}
initTheme();

// Show/hide dashboard section based on current page
function updateDashboardVisibility(){
const dashSection=$('#dashboardSection');
if(dashSection){
if(isDashboardPage()){
dashSection.style.display='block';
}else{
dashSection.style.display='none';
}
}
}
updateDashboardVisibility();

// Scroll effect
const nav=$('#nav');
if(nav){
addEventListener('scroll',()=>nav.classList.toggle('scrolled',pageYOffset>50),{passive:true});
}

// Logo click handler
const navLogo=$('#navLogo');
const sidenavLogo=$('#sidenavLogo');

function handleLogoClick(e){
e.preventDefault();
if(isDashboardPage()){
location.href='/dashboard';
}else{
location.href='/';
}
}

if(navLogo)navLogo.addEventListener('click',handleLogoClick);
if(sidenavLogo)sidenavLogo.addEventListener('click',handleLogoClick);

// Sidenav controls
const burger=$('#burger');
const sidenav=$('#sidenav');
const overlay=$('#sidenavOverlay');
const closeBtn=$('#sidenavClose');

function openSidenav(){
if(burger){
burger.classList.add('open');
burger.setAttribute('aria-expanded','true');
burger.setAttribute('aria-label','Close navigation menu');
}
if(sidenav)sidenav.classList.add('open');
if(overlay){
overlay.classList.add('open');
overlay.setAttribute('aria-hidden','false');
}
body.classList.add('modal-open');
if(sidenav)sidenav.setAttribute('aria-hidden','false');
}

function closeSidenav(){
if(burger){
burger.classList.remove('open');
burger.setAttribute('aria-expanded','false');
burger.setAttribute('aria-label','Open navigation menu');
}
if(sidenav)sidenav.classList.remove('open');
if(overlay){
overlay.classList.remove('open');
overlay.setAttribute('aria-hidden','true');
}
body.classList.remove('modal-open');
if(sidenav)sidenav.setAttribute('aria-hidden','true');
}

if(burger){
burger.addEventListener('click',()=>{
const isOpen=burger.classList.contains('open');
isOpen?closeSidenav():openSidenav();
});
}

if(closeBtn)closeBtn.addEventListener('click',closeSidenav);
if(overlay)overlay.addEventListener('click',closeSidenav);

// Close sidenav on navigation
$$('.sidenav-link,.sidenav-donate').forEach(l=>
l.addEventListener('click',()=>setTimeout(closeSidenav,150))
);

// Active state management
function setActive(){
const path=location.pathname;
$$('.nav-link,.sidenav-link').forEach(l=>{
l.classList.remove('active');
l.removeAttribute('aria-current');
const href=l.getAttribute('href');
if(href===path||(path==='/'&&href==='/')){
l.classList.add('active');
l.setAttribute('aria-current','page');
}
});
}

// Escape key handlers
addEventListener('keydown',e=>{
if(e.key==='Escape'){
if(sidenav&&sidenav.classList.contains('open')){
closeSidenav();
if(burger)burger.focus();
}
}
});

// Initialize
addEventListener('DOMContentLoaded',()=>{
setActive();
initTheme();
updateDashboardVisibility();
});

addEventListener('popstate',()=>{
setActive();
initTheme();
updateDashboardVisibility();
});

// Focus trap for sidenav
if(sidenav){
sidenav.addEventListener('keydown',e=>{
if(e.key!=='Tab'||!sidenav.classList.contains('open'))return;
const focusables=sidenav.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])');
const first=focusables[0];
const last=focusables[focusables.length-1];
if(e.shiftKey){
if(document.activeElement===first){
last.focus();
e.preventDefault();
}
}else{
if(document.activeElement===last){
first.focus();
e.preventDefault();
}
}
});
}
})();
</script>
`;

// Full HTML for standalone use (backwards compatibility)
export const GLASSMORPHIC_HEADER_HTML = GLASSMORPHIC_HEADER_MARKUP('https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/25392bd4-989e-4207-fb2b-c3a8f22eeb00/avatar');
