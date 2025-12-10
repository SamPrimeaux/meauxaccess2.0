/**
 * Meauxbility Header Component
 * Refined header with navigation, sidenav, and auth modal
 * Glassmorphic design with dual theme support
 */

export default function getMeauxbilityHeaderHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Meauxbility</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/25392bd4-989e-4207-fb2b-c3a8f22eeb00/avatar" type="image/webp">
<style>
:root{--teal:#339999;--orange:#FF6B35;--orange-dark:#E85D00;--purple:#9B59B6;--mint:#4AECDC;--nav-h:72px;--nav-hs:60px;--max-w:1440px;--sidenav-w:320px;--tr:all .3s cubic-bezier(.4,0,.2,1)}

[data-theme=light]{--nav-bg:rgba(255,255,255,.75);--nav-bg-scrolled:rgba(255,255,255,.85);--nav-border:rgba(255,107,53,.15);--nav-text:#0C2D31;--nav-link:#FF6B35;--nav-hover:#E85D00;--nav-hover-bg:rgba(255,107,53,.08);--sidenav-bg:rgba(255,255,255,.95);--sidenav-overlay:rgba(0,0,0,.4);--btn-bg:#FF6B35;--btn-hover:#E85D00;--accent:#FF6B35;--divider:rgba(12,45,49,.1);--modal-bg:rgba(255,255,255,.85);--input-bg:rgba(255,255,255,.6);--input-border:rgba(255,107,53,.2);--input-focus:rgba(255,107,53,.4)}

[data-theme=dark]{--nav-bg:rgba(12,45,49,.75);--nav-bg-scrolled:rgba(12,45,49,.85);--nav-border:rgba(74,236,220,.2);--nav-text:rgba(255,255,255,.95);--nav-link:#4AECDC;--nav-hover:#5FDDDC;--nav-hover-bg:rgba(74,236,220,.1);--sidenav-bg:rgba(12,45,49,.95);--sidenav-overlay:rgba(0,0,0,.6);--btn-bg:#9B59B6;--btn-hover:#8E44AD;--accent:#4AECDC;--divider:rgba(74,236,220,.15);--modal-bg:rgba(12,45,49,.85);--input-bg:rgba(20,60,65,.6);--input-border:rgba(74,236,220,.2);--input-focus:rgba(74,236,220,.4)}

*{margin:0;padding:0;box-sizing:border-box;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}

body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;padding-top:var(--nav-h);color:#0C2D31;line-height:1.6;min-height:100vh;background:#fafafa}
[data-theme=dark] body{background:#0a1f22;color:rgba(255,255,255,.95)}
body.modal-open{overflow:hidden}

.skip-link{position:absolute;top:-100px;left:16px;padding:12px 24px;background:var(--accent);color:#fff;text-decoration:none;font-weight:600;border-radius:8px;z-index:10001;transition:var(--tr)}.skip-link:focus{top:16px}

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

/* Auth Modal Styles - Glassmorphic iOS Vibe */
.auth-modal-overlay{position:fixed;inset:0;background:var(--sidenav-overlay);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;visibility:hidden;transition:opacity .4s ease,visibility .4s ease;z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px}
.auth-modal-overlay.open{opacity:1;visibility:visible}

.auth-modal{width:100%;max-width:420px;background:var(--modal-bg);backdrop-filter:blur(40px);-webkit-backdrop-filter:blur(40px);border-radius:24px;border:1px solid var(--nav-border);box-shadow:0 20px 60px rgba(0,0,0,.3);transform:scale(.9) translateY(20px);opacity:0;transition:transform .4s cubic-bezier(.34,1.56,.64,1),opacity .4s ease;overflow:hidden}
.auth-modal-overlay.open .auth-modal{transform:scale(1) translateY(0);opacity:1}

.auth-modal-header{padding:32px 32px 24px;text-align:center;border-bottom:1px solid var(--divider)}

.auth-modal-logo{width:80px;height:80px;margin:0 auto 20px;border-radius:20px;box-shadow:0 4px 20px rgba(0,0,0,.15);object-fit:cover}

.auth-modal-title{font-size:28px;font-weight:800;color:var(--nav-text);margin-bottom:8px;letter-spacing:-.5px}

.auth-modal-subtitle{font-size:15px;color:var(--nav-text);opacity:.7;font-weight:500}

.auth-modal-body{padding:32px}

.auth-tabs{display:flex;gap:8px;margin-bottom:32px;background:var(--input-bg);padding:6px;border-radius:12px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}

.auth-tab{flex:1;padding:12px 20px;background:transparent;border:none;border-radius:8px;font-size:15px;font-weight:700;color:var(--nav-text);opacity:.5;cursor:pointer;transition:var(--tr);letter-spacing:.2px}

.auth-tab.active{background:var(--btn-bg);color:#fff;opacity:1;box-shadow:0 2px 8px rgba(255,107,53,.3)}
[data-theme=dark] .auth-tab.active{box-shadow:0 2px 8px rgba(155,89,182,.3)}

.auth-form{display:none}
.auth-form.active{display:block}

.auth-input-group{margin-bottom:20px}

.auth-label{display:block;font-size:13px;font-weight:700;color:var(--nav-text);margin-bottom:8px;letter-spacing:.3px;text-transform:uppercase;opacity:.8}

.auth-input{width:100%;padding:16px 18px;background:var(--input-bg);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1.5px solid var(--input-border);border-radius:12px;font-size:15px;font-weight:500;color:var(--nav-text);transition:var(--tr);font-family:'Inter',sans-serif}

.auth-input::placeholder{color:var(--nav-text);opacity:.4}

.auth-input:focus{outline:none;border-color:var(--input-focus);background:var(--input-bg);box-shadow:0 0 0 3px rgba(255,107,53,.1)}
[data-theme=dark] .auth-input:focus{box-shadow:0 0 0 3px rgba(74,236,220,.1)}

.auth-button{width:100%;padding:18px;background:var(--btn-bg);color:#fff;border:none;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;transition:var(--tr);letter-spacing:.5px;margin-top:24px;box-shadow:0 4px 16px rgba(255,107,53,.3);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}

.auth-button:hover{background:var(--btn-hover);transform:translateY(-2px);box-shadow:0 6px 24px rgba(255,107,53,.4)}
[data-theme=dark] .auth-button{box-shadow:0 4px 16px rgba(155,89,182,.3)}
[data-theme=dark] .auth-button:hover{box-shadow:0 6px 24px rgba(155,89,182,.4)}

.auth-button:active{transform:translateY(0)}

.auth-divider{display:flex;align-items:center;gap:16px;margin:28px 0;color:var(--nav-text);opacity:.5;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.5px}

.auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:var(--divider)}

.auth-social{display:flex;gap:12px}

.auth-social-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:10px;padding:14px;background:var(--input-bg);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1.5px solid var(--input-border);border-radius:12px;font-size:15px;font-weight:700;color:var(--nav-text);cursor:pointer;transition:var(--tr)}

.auth-social-btn:hover{background:var(--nav-hover-bg);border-color:var(--input-focus);transform:translateY(-2px)}

.auth-social-icon{width:20px;height:20px}

.auth-footer{padding:24px 32px 32px;text-align:center;font-size:13px;color:var(--nav-text);opacity:.7}

.auth-footer a{color:var(--nav-link);font-weight:700;text-decoration:none;transition:var(--tr)}

.auth-footer a:hover{color:var(--nav-hover)}

.auth-close{position:absolute;top:20px;right:20px;width:40px;height:40px;background:var(--input-bg);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:none;border-radius:10px;cursor:pointer;transition:var(--tr);display:flex;align-items:center;justify-content:center}

.auth-close:hover{background:var(--nav-hover-bg);transform:rotate(90deg)}

.auth-close-icon{width:20px;height:20px;position:relative}
.auth-close-icon::before,.auth-close-icon::after{content:'';position:absolute;top:50%;left:0;width:100%;height:2px;background:var(--nav-link);border-radius:2px}
.auth-close-icon::before{transform:translateY(-50%) rotate(45deg)}
.auth-close-icon::after{transform:translateY(-50%) rotate(-45deg)}

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
  .auth-modal{max-width:calc(100vw - 32px);border-radius:20px}
  .auth-modal-header{padding:28px 24px 20px}
  .auth-modal-logo{width:64px;height:64px;margin-bottom:16px}
  .auth-modal-title{font-size:24px}
  .auth-modal-body{padding:24px}
  .auth-social{flex-direction:column}
  .auth-footer{padding:20px 24px 28px}
}

@media(max-width:380px){
  .nav-logo-img{width:40px;height:40px}
  .nav.scrolled .nav-logo-img{width:36px;height:36px}
}

@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
}

*:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:4px}
</style>
</head>
<body data-theme="light">
<a href="#main" class="skip-link">Skip to main content</a>

<header class="nav" id="nav" role="banner">
<div class="nav-container">
<a class="nav-logo" id="navLogo" aria-label="Meauxbility">
<img src="https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/25392bd4-989e-4207-fb2b-c3a8f22eeb00/avatar" 
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
<img src="https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/25392bd4-989e-4207-fb2b-c3a8f22eeb00/avatar" 
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

<!-- Auth Modal -->
<div class="auth-modal-overlay" id="authModal" aria-hidden="true" role="dialog" aria-labelledby="authModalTitle">
<div class="auth-modal">
<button class="auth-close" id="authClose" aria-label="Close login modal">
<span class="auth-close-icon"></span>
</button>

<div class="auth-modal-header">
<img src="https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/25392bd4-989e-4207-fb2b-c3a8f22eeb00/avatar" 
     alt="Meauxbility" 
     class="auth-modal-logo">
<h2 class="auth-modal-title" id="authModalTitle">Welcome to Meauxbility</h2>
<p class="auth-modal-subtitle">Access your dashboard and programs</p>
</div>

<div class="auth-modal-body">
<div class="auth-tabs">
<button class="auth-tab active" data-tab="login">Log In</button>
<button class="auth-tab" data-tab="signup">Sign Up</button>
</div>

<!-- Login Form -->
<form class="auth-form active" id="loginForm">
<div class="auth-input-group">
<label class="auth-label" for="loginEmail">Email Address</label>
<input type="email" id="loginEmail" class="auth-input" placeholder="your.email@example.com" required>
</div>

<div class="auth-input-group">
<label class="auth-label" for="loginPassword">Password</label>
<input type="password" id="loginPassword" class="auth-input" placeholder="••••••••" required>
</div>

<button type="submit" class="auth-button">Log In to Dashboard</button>

<div class="auth-divider">or continue with</div>

<div class="auth-social">
<button type="button" class="auth-social-btn" id="googleLogin">
<svg class="auth-social-icon" viewBox="0 0 24 24" fill="currentColor">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
</svg>
Google
</button>
</div>
</form>

<!-- Sign Up Form -->
<form class="auth-form" id="signupForm">
<div class="auth-input-group">
<label class="auth-label" for="signupName">Full Name</label>
<input type="text" id="signupName" class="auth-input" placeholder="John Doe" required>
</div>

<div class="auth-input-group">
<label class="auth-label" for="signupEmail">Email Address</label>
<input type="email" id="signupEmail" class="auth-input" placeholder="your.email@example.com" required>
</div>

<div class="auth-input-group">
<label class="auth-label" for="signupPassword">Password</label>
<input type="password" id="signupPassword" class="auth-input" placeholder="••••••••" required>
</div>

<button type="submit" class="auth-button">Create Account</button>

<div class="auth-divider">or sign up with</div>

<div class="auth-social">
<button type="button" class="auth-social-btn" id="googleSignup">
<svg class="auth-social-icon" viewBox="0 0 24 24" fill="currentColor">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
</svg>
Google
</button>
</div>
</form>
</div>

<div class="auth-footer">
<p>By continuing, you agree to our <a href="/pages/policies">Terms of Service</a> and <a href="/pages/data-sharing-opt-out">Privacy Policy</a></p>
</div>
</div>
</div>

<main id="main">
<!-- Your page content goes here -->
</main>

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
if(isDashboardPage()){
dashSection.style.display='block';
}else{
dashSection.style.display='none';
}
}
updateDashboardVisibility();

// Scroll effect
const nav=$('#nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',pageYOffset>50),{passive:true});

// Logo click handler
const navLogo=$('#navLogo');
const sidenavLogo=$('#sidenavLogo');
const authModal=$('#authModal');

function handleLogoClick(e){
e.preventDefault();
if(isDashboardPage()){
// If on dashboard, go to dashboard
location.href='/dashboard';
}else{
// If not on dashboard, open auth modal
openAuthModal();
}
}

navLogo.addEventListener('click',handleLogoClick);
sidenavLogo.addEventListener('click',handleLogoClick);

// Auth Modal Controls
const authClose=$('#authClose');
const authTabs=$$('.auth-tab');
const authForms=$$('.auth-form');

function openAuthModal(){
authModal.classList.add('open');
authModal.setAttribute('aria-hidden','false');
body.classList.add('modal-open');
}

function closeAuthModal(){
authModal.classList.remove('open');
authModal.setAttribute('aria-hidden','true');
body.classList.remove('modal-open');
}

authClose.addEventListener('click',closeAuthModal);
authModal.addEventListener('click',e=>{
if(e.target===authModal)closeAuthModal();
});

// Tab switching
authTabs.forEach(tab=>{
tab.addEventListener('click',()=>{
const target=tab.dataset.tab;
authTabs.forEach(t=>t.classList.remove('active'));
authForms.forEach(f=>f.classList.remove('active'));
tab.classList.add('active');
$(\`#\${target}Form\`).classList.add('active');
});
});

// Form submissions (replace with your actual auth logic)
$('#loginForm').addEventListener('submit',e=>{
e.preventDefault();
console.log('Login form submitted');
// Add your Google OAuth login logic here
// Example: window.location.href = '/api/auth/google';
});

$('#signupForm').addEventListener('submit',e=>{
e.preventDefault();
console.log('Signup form submitted');
// Add your signup logic here
});

// Google OAuth buttons
$('#googleLogin').addEventListener('click',()=>{
console.log('Google login clicked');
// Add your Google OAuth logic here
// Example: window.location.href = '/api/auth/google';
});

$('#googleSignup').addEventListener('click',()=>{
console.log('Google signup clicked');
// Add your Google OAuth logic here
});

// Sidenav controls
const burger=$('#burger');
const sidenav=$('#sidenav');
const overlay=$('#sidenavOverlay');
const closeBtn=$('#sidenavClose');

function openSidenav(){
burger.classList.add('open');
burger.setAttribute('aria-expanded','true');
burger.setAttribute('aria-label','Close navigation menu');
sidenav.classList.add('open');
overlay.classList.add('open');
overlay.setAttribute('aria-hidden','false');
body.classList.add('modal-open');
sidenav.setAttribute('aria-hidden','false');
}

function closeSidenav(){
burger.classList.remove('open');
burger.setAttribute('aria-expanded','false');
burger.setAttribute('aria-label','Open navigation menu');
sidenav.classList.remove('open');
overlay.classList.remove('open');
overlay.setAttribute('aria-hidden','true');
body.classList.remove('modal-open');
sidenav.setAttribute('aria-hidden','true');
}

burger.addEventListener('click',()=>{
const isOpen=burger.classList.contains('open');
isOpen?closeSidenav():openSidenav();
});

closeBtn.addEventListener('click',closeSidenav);
overlay.addEventListener('click',closeSidenav);

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
if(authModal.classList.contains('open')){
closeAuthModal();
}else if(sidenav.classList.contains('open')){
closeSidenav();
burger.focus();
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

// Focus trap for auth modal
authModal.addEventListener('keydown',e=>{
if(e.key!=='Tab'||!authModal.classList.contains('open'))return;
const focusables=authModal.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])');
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

// Focus trap for sidenav
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
})();
</script>
</body>
</html>`;
}
