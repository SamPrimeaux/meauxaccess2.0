/**
 * HTML Remaster & Optimization System
 * Automatically remasters and optimizes HTML files for MeauxCloud platform
 */

export interface RemasterOptions {
  brandName?: string;
  addMeauxBranding?: boolean;
  optimizeForCloudflare?: boolean;
  addCLI?: boolean;
  addChat?: boolean;
  addBrowser?: boolean;
  responsive?: boolean;
  darkMode?: boolean;
}

/**
 * Remaster HTML content
 */
export function remasterHTML(html: string, options: RemasterOptions = {}): string {
  const {
    brandName = 'MeauxCloud',
    addMeauxBranding = true,
    optimizeForCloudflare = true,
    addCLI = false,
    addChat = false,
    addBrowser = false,
    responsive = true,
    darkMode = true
  } = options;

  // Parse HTML
  let remastered = html;

  // Add MeauxCloud branding if requested
  if (addMeauxBranding) {
    // Add meta tags
    if (!remastered.includes('<meta name="generator"')) {
      remastered = remastered.replace(
        '</head>',
        `<meta name="generator" content="${brandName} Learning Platform">
        <meta name="theme-color" content="#8B5CF6">
        </head>`
      );
    }

    // Add MeauxCloud footer if not present
    if (!remastered.includes('MeauxCloud') && remastered.includes('</body>')) {
      remastered = remastered.replace(
        '</body>',
        `<footer style="text-align: center; padding: 40px 20px; background: #1a1a1a; color: #999; margin-top: 60px;">
          <p>Powered by ${brandName} Learning Platform</p>
          <p style="margin-top: 8px; font-size: 12px;">Built with Cloudflare Workers • 100% Cloudflare Stored</p>
        </footer>
        </body>`
      );
    }
  }

  // Optimize for Cloudflare
  if (optimizeForCloudflare) {
    // Add Cloudflare-specific optimizations
    if (!remastered.includes('cf-ray')) {
      remastered = remastered.replace(
        '</head>',
        `<script>
          // Cloudflare optimizations
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
          }
        </script>
        </head>`
      );
    }
  }

  // Add responsive meta if missing
  if (responsive && !remastered.includes('viewport')) {
    remastered = remastered.replace(
      '<head>',
      `<head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">`
    );
  }

  // Add dark mode styles if requested
  if (darkMode && !remastered.includes('prefers-color-scheme')) {
    const darkModeCSS = `
      @media (prefers-color-scheme: dark) {
        body {
          background: #0a0a0a;
          color: #ffffff;
        }
      }
    `;
    remastered = remastered.replace('</head>', `<style>${darkModeCSS}</style></head>`);
  }

  // Add CLI terminal if requested
  if (addCLI && !remastered.includes('terminal-panel')) {
    const cliHTML = `
      <div class="terminal-panel" id="terminalPanel" style="position: fixed; bottom: 0; right: 0; width: 400px; height: 300px; background: #1e1e1e; border-top: 1px solid #333; display: none; flex-direction: column; z-index: 1000;">
        <div style="padding: 12px; background: #2d2d2d; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #4ade80;">?? Terminal</span>
          <button onclick="document.getElementById('terminalPanel').style.display='none'" style="background: transparent; border: none; color: #999; cursor: pointer;">?</button>
        </div>
        <div id="terminalBody" style="flex: 1; padding: 16px; font-family: monospace; font-size: 14px; overflow-y: auto; color: #d4d4d4;">
          <div>Welcome to ${brandName} Terminal</div>
          <div style="margin-top: 16px; display: flex; align-items: center; gap: 8px;">
            <span style="color: #4ade80;">$</span>
            <input type="text" id="terminalInput" style="flex: 1; background: transparent; border: none; color: #fff; outline: none; font-family: monospace;" placeholder="Enter command...">
          </div>
        </div>
      </div>
      <script>
        document.getElementById('terminalInput')?.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            const cmd = this.value;
            const body = document.getElementById('terminalBody');
            body.innerHTML += '<div>$ ' + cmd + '</div>';
            body.innerHTML += '<div>Command executed</div>';
            this.value = '';
            body.scrollTop = body.scrollHeight;
          }
        });
      </script>
    `;
    remastered = remastered.replace('</body>', `${cliHTML}</body>`);
  }

  // Add chat if requested
  if (addChat && !remastered.includes('chat-panel')) {
    const chatHTML = `
      <div class="chat-panel" id="chatPanel" style="position: fixed; bottom: 20px; right: 20px; width: 350px; height: 500px; background: #1a1a1a; border: 1px solid #333; border-radius: 12px; display: none; flex-direction: column; z-index: 1000; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
        <div style="padding: 16px; border-bottom: 1px solid #333; font-weight: 600;">?? ${brandName} Assistant</div>
        <div id="chatMessages" style="flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
          <div style="padding: 12px; background: #252525; border-radius: 8px; max-width: 80%;">Hi! How can I help you learn today?</div>
        </div>
        <div style="padding: 16px; border-top: 1px solid #333; display: flex; gap: 8px;">
          <input type="text" id="chatInput" style="flex: 1; padding: 8px; background: #252525; border: 1px solid #333; border-radius: 6px; color: #fff; outline: none;" placeholder="Ask a question...">
          <button onclick="sendChat()" style="padding: 8px 16px; background: #8B5CF6; border: none; border-radius: 6px; color: white; cursor: pointer;">Send</button>
        </div>
      </div>
      <script>
        function sendChat() {
          const input = document.getElementById('chatInput');
          const messages = document.getElementById('chatMessages');
          if (input.value.trim()) {
            messages.innerHTML += '<div style="padding: 12px; background: #8B5CF6; border-radius: 8px; max-width: 80%; align-self: flex-end;">' + input.value + '</div>';
            input.value = '';
            messages.scrollTop = messages.scrollHeight;
          }
        }
        document.getElementById('chatInput')?.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') sendChat();
        });
      </script>
    `;
    remastered = remastered.replace('</body>', `${chatHTML}</body>`);
  }

  // Add browser preview if requested
  if (addBrowser && !remastered.includes('browser-panel')) {
    const browserHTML = `
      <div class="browser-panel" id="browserPanel" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0a0a0a; z-index: 2000; display: none; flex-direction: column;">
        <div style="padding: 12px; background: #1a1a1a; border-bottom: 1px solid #333; display: flex; gap: 12px; align-items: center;">
          <button onclick="document.getElementById('browserPanel').style.display='none'" style="padding: 8px 16px; background: #ef4444; border: none; border-radius: 6px; color: white; cursor: pointer;">Close</button>
          <input type="text" id="browserUrl" value="https://iautodidact.org" style="flex: 1; padding: 8px 12px; background: #252525; border: 1px solid #333; border-radius: 6px; color: #fff; outline: none;">
          <button onclick="loadBrowser()" style="padding: 8px 16px; background: #8B5CF6; border: none; border-radius: 6px; color: white; cursor: pointer;">Go</button>
        </div>
        <iframe id="browserFrame" style="flex: 1; border: none; background: white;" src="https://iautodidact.org"></iframe>
      </div>
      <script>
        function loadBrowser() {
          const url = document.getElementById('browserUrl').value;
          const frame = document.getElementById('browserFrame');
          frame.src = url.startsWith('http') ? url : 'https://' + url;
        }
        document.getElementById('browserUrl')?.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') loadBrowser();
        });
      </script>
    `;
    remastered = remastered.replace('</body>', `${browserHTML}</body>`);
  }

  // Optimize images
  remastered = remastered.replace(
    /<img([^>]*?)src="([^"]+)"([^>]*?)>/gi,
    (match, before, src, after) => {
      // Add loading="lazy" if not present
      if (!match.includes('loading=')) {
        return `<img${before}src="${src}"${after} loading="lazy">`;
      }
      return match;
    }
  );

  // Add performance optimizations
  if (!remastered.includes('preconnect')) {
    remastered = remastered.replace(
      '</head>',
      `<link rel="preconnect" href="https://api.cloudflare.com">
       <link rel="dns-prefetch" href="https://api.cloudflare.com">
       </head>`
    );
  }

  return remastered;
}

/**
 * Upload remastered HTML to R2
 */
export async function uploadRemasteredHTML(
  env: { R2_IAUTODIDACT?: R2Bucket },
  originalFilename: string,
  remasteredHTML: string
): Promise<string> {
  if (!env.R2_IAUTODIDACT) {
    throw new Error('R2_IAUTODIDACT bucket not configured');
  }

  const filename = originalFilename.replace('.html', '-remastered.html');
  await env.R2_IAUTODIDACT.put(filename, remasteredHTML, {
    httpMetadata: {
      contentType: 'text/html; charset=utf-8',
    },
  });

  return filename;
}
