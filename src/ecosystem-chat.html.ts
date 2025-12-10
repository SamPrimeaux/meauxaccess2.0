export default `<!-- Ecosystem-Wide Chat Component -->
<!-- Embed this in any dashboard for real-time chat -->

<div id="ecosystemChat" class="ecosystem-chat-container">
  <div class="chat-header">
    <div class="chat-header-left">
      <svg class="chat-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
      </svg>
      <div>
        <h3 class="chat-title">Ecosystem Chat</h3>
        <p class="chat-subtitle" id="chatSubtitle">Connected</p>
      </div>
    </div>
    <div class="chat-header-actions">
      <button class="chat-btn-icon" id="chatChannelsBtn" title="Channels">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"/>
          <path d="M15 7v2a4 4 0 01-4 4H9.828a2 2 0 01-1.414-.586l-1.414-1.414A2 2 0 006.172 7H4a2 2 0 00-2 2v6a2 2 0 002 2h11a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
        </svg>
      </button>
      <button class="chat-btn-icon" id="chatMinimizeBtn" title="Minimize">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
        </svg>
      </button>
    </div>
  </div>

  <div class="chat-body">
    <!-- Channels Sidebar -->
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
      <button class="chat-btn-new-channel" id="newChannelBtn">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
        </svg>
        New Channel
      </button>
    </div>

    <!-- Messages Area -->
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
          <input 
            type="text" 
            id="chatInput" 
            class="chat-input" 
            placeholder="Type a message..."
            autocomplete="off"
          />
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

<style>
  /* Ecosystem Chat Styles */
  .ecosystem-chat-container {
    display: flex;
    flex-direction: column;
    height: 600px;
    max-height: 80vh;
    background: var(--surface-primary, #ffffff);
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: var(--border-radius-lg, 12px);
    box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
    overflow: hidden;
  }

  [data-theme="dark"] .ecosystem-chat-container {
    background: var(--surface-primary, #1f2937);
    border-color: var(--border-color, #374151);
  }

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4, 1rem);
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    background: var(--surface-secondary, #f9fafb);
  }

  [data-theme="dark"] .chat-header {
    background: var(--surface-secondary, #111827);
    border-color: var(--border-color, #374151);
  }

  .chat-header-left {
    display: flex;
    align-items: center;
    gap: var(--space-3, 0.75rem);
  }

  .chat-icon {
    width: 24px;
    height: 24px;
    color: var(--primary, #667eea);
  }

  .chat-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary, #111827);
  }

  .chat-subtitle {
    font-size: 0.75rem;
    color: var(--text-secondary, #6b7280);
    margin: 0;
  }

  .chat-header-actions {
    display: flex;
    gap: var(--space-2, 0.5rem);
  }

  .chat-btn-icon {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: var(--border-radius, 8px);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary, #6b7280);
    transition: all var(--transition-fast, 150ms);
  }

  .chat-btn-icon:hover {
    background: var(--neutral-100, #f3f4f6);
    color: var(--text-primary, #111827);
  }

  [data-theme="dark"] .chat-btn-icon:hover {
    background: var(--neutral-800, #1f2937);
  }

  .chat-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .chat-channels {
    width: 200px;
    border-right: 1px solid var(--border-color, #e5e7eb);
    display: flex;
    flex-direction: column;
    background: var(--surface-secondary, #f9fafb);
  }

  [data-theme="dark"] .chat-channels {
    background: var(--surface-secondary, #111827);
    border-color: var(--border-color, #374151);
  }

  .channels-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
    border-bottom: 1px solid var(--border-color, #e5e7eb);
  }

  .channels-header h4 {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary, #111827);
  }

  .channels-list {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-2, 0.5rem);
  }

  .channel-item {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    border-radius: var(--border-radius, 8px);
    cursor: pointer;
    margin-bottom: var(--space-1, 0.25rem);
    color: var(--text-secondary, #6b7280);
    transition: all var(--transition-fast, 150ms);
  }

  .channel-item:hover {
    background: var(--neutral-100, #f3f4f6);
    color: var(--text-primary, #111827);
  }

  .channel-item.active {
    background: var(--primary-alpha, rgba(102, 126, 234, 0.1));
    color: var(--primary, #667eea);
    font-weight: 500;
  }

  [data-theme="dark"] .channel-item:hover {
    background: var(--neutral-800, #1f2937);
  }

  .chat-btn-new-channel {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
    width: 100%;
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    margin: var(--space-2, 0.5rem);
    border: 1px dashed var(--border-color, #e5e7eb);
    border-radius: var(--border-radius, 8px);
    background: transparent;
    color: var(--text-secondary, #6b7280);
    cursor: pointer;
    font-size: 0.875rem;
    transition: all var(--transition-fast, 150ms);
  }

  .chat-btn-new-channel:hover {
    border-color: var(--primary, #667eea);
    color: var(--primary, #667eea);
    background: var(--primary-alpha, rgba(102, 126, 234, 0.05));
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
    padding: var(--space-4, 1rem);
    display: flex;
    flex-direction: column;
    gap: var(--space-3, 0.75rem);
  }

  .chat-welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    text-align: center;
    color: var(--text-secondary, #6b7280);
  }

  .chat-welcome h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 var(--space-2, 0.5rem) 0;
    color: var(--text-primary, #111827);
  }

  .chat-message {
    display: flex;
    gap: var(--space-3, 0.75rem);
    padding: var(--space-3, 0.75rem);
    border-radius: var(--border-radius, 8px);
    transition: background var(--transition-fast, 150ms);
  }

  .chat-message:hover {
    background: var(--neutral-50, #f9fafb);
  }

  [data-theme="dark"] .chat-message:hover {
    background: var(--neutral-900, #111827);
  }

  .chat-message-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary, #667eea), var(--primary-light, #8b9eff));
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
    gap: var(--space-2, 0.5rem);
    margin-bottom: var(--space-1, 0.25rem);
  }

  .chat-message-sender {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-primary, #111827);
  }

  .chat-message-time {
    font-size: 0.75rem;
    color: var(--text-tertiary, #9ca3af);
  }

  .chat-message-text {
    font-size: 0.875rem;
    color: var(--text-primary, #111827);
    line-height: 1.5;
    word-wrap: break-word;
  }

  .chat-input-area {
    padding: var(--space-4, 1rem);
    border-top: 1px solid var(--border-color, #e5e7eb);
    background: var(--surface-secondary, #f9fafb);
  }

  [data-theme="dark"] .chat-input-area {
    background: var(--surface-secondary, #111827);
    border-color: var(--border-color, #374151);
  }

  .chat-input-wrapper {
    display: flex;
    gap: var(--space-2, 0.5rem);
    align-items: center;
  }

  .chat-input {
    flex: 1;
    padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: var(--border-radius-lg, 12px);
    font-size: 0.875rem;
    background: var(--surface-primary, #ffffff);
    color: var(--text-primary, #111827);
    outline: none;
    transition: all var(--transition-fast, 150ms);
  }

  .chat-input:focus {
    border-color: var(--primary, #667eea);
    box-shadow: 0 0 0 3px var(--primary-alpha, rgba(102, 126, 234, 0.1));
  }

  [data-theme="dark"] .chat-input {
    background: var(--surface-primary, #1f2937);
    border-color: var(--border-color, #374151);
  }

  .chat-send-btn {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: var(--border-radius, 8px);
    background: var(--primary, #667eea);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast, 150ms);
    flex-shrink: 0;
  }

  .chat-send-btn:hover {
    background: var(--primary-dark, #5568d3);
    transform: translateY(-1px);
  }

  .chat-send-btn:active {
    transform: translateY(0);
  }

  .chat-send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Responsive */
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
      transition: left var(--transition-base, 250ms);
      box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
    }

    .chat-channels.open {
      left: 0;
    }

    .chat-messages {
      padding: var(--space-3, 0.75rem);
    }
  }
</style>

<script>
  // Ecosystem Chat System
  (function() {
    let currentChannel = 'general';
    let currentUser = { email: 'sam@meauxbility.org', name: 'Sam Primeaux' };
    let pollInterval = null;
    let lastMessageTime = null;

    // Initialize chat
    function initChat() {
      // Get current user from session or default
      const userEmail = document.cookie.match(/user=([^;]+)/)?.[1] || 'sam@meauxbility.org';
      const userName = document.cookie.match(/userName=([^;]+)/)?.[1] || 'Sam Primeaux';
      
      currentUser = { email: userEmail, name: userName };
      
      // Setup event listeners
      document.getElementById('chatSendBtn').addEventListener('click', sendMessage);
      document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });

      // Channel switching
      document.querySelectorAll('.channel-item').forEach(item => {
        item.addEventListener('click', () => {
          const channel = item.dataset.channel;
          switchChannel(channel);
        });
      });

      // Channels panel toggle
      document.getElementById('chatChannelsBtn').addEventListener('click', () => {
        document.getElementById('chatChannelsPanel').classList.toggle('open');
      });

      document.getElementById('closeChannelsBtn').addEventListener('click', () => {
        document.getElementById('chatChannelsPanel').classList.remove('open');
      });

      // Load messages
      loadMessages();
      
      // Start polling for new messages
      startPolling();
    }

    async function sendMessage() {
      const input = document.getElementById('chatInput');
      const message = input.value.trim();
      
      if (!message) return;

      const sendBtn = document.getElementById('chatSendBtn');
      sendBtn.disabled = true;

      try {
        const response = await fetch('/api/chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channel: currentChannel,
            message,
            sender: currentUser.email,
            senderName: currentUser.name,
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          input.value = '';
          addMessageToUI(data.message);
          lastMessageTime = data.message.timestamp;
        } else {
          alert('Error sending message: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        alert('Error: ' + error.message);
      } finally {
        sendBtn.disabled = false;
        input.focus();
      }
    }

    async function loadMessages() {
      try {
        const response = await fetch(\`/api/chat/messages?channel=\${currentChannel}&limit=50\`);
        const data = await response.json();
        
        if (data.success) {
          const messagesContainer = document.getElementById('chatMessages');
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
            data.messages.forEach(msg => addMessageToUI(msg));
            scrollToBottom();
            lastMessageTime = data.messages[data.messages.length - 1]?.timestamp;
          }
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }

    function addMessageToUI(message) {
      const messagesContainer = document.getElementById('chatMessages');
      const welcome = messagesContainer.querySelector('.chat-welcome');
      if (welcome) welcome.remove();

      const messageEl = document.createElement('div');
      messageEl.className = 'chat-message';
      messageEl.dataset.messageId = message.id;

      const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const initials = message.senderName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

      messageEl.innerHTML = \`
        <div class="chat-message-avatar">\${initials}</div>
        <div class="chat-message-content">
          <div class="chat-message-header">
            <span class="chat-message-sender">\${message.senderName}</span>
            <span class="chat-message-time">\${time}</span>
          </div>
          <div class="chat-message-text">\${escapeHtml(message.message)}</div>
        </div>
      \`;

      messagesContainer.appendChild(messageEl);
      scrollToBottom();
    }

    function switchChannel(channel) {
      currentChannel = channel;
      
      // Update active channel
      document.querySelectorAll('.channel-item').forEach(item => {
        item.classList.toggle('active', item.dataset.channel === channel);
      });

      // Update subtitle
      document.getElementById('chatSubtitle').textContent = \`#\${channel}\`;

      // Load messages for new channel
      loadMessages();
    }

    function startPolling() {
      // Poll for new messages every 3 seconds
      pollInterval = setInterval(async () => {
        try {
          const response = await fetch(\`/api/chat/messages?channel=\${currentChannel}&limit=10\`);
          const data = await response.json();
          
          if (data.success && data.messages.length > 0) {
            const latestMessage = data.messages[data.messages.length - 1];
            
            // Check if we have new messages
            if (!lastMessageTime || new Date(latestMessage.timestamp) > new Date(lastMessageTime)) {
              // Reload all messages to get proper order
              loadMessages();
            }
          }
        } catch (error) {
          console.error('Error polling messages:', error);
        }
      }, 3000);
    }

    function scrollToBottom() {
      const messagesContainer = document.getElementById('chatMessages');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initChat);
    } else {
      initChat();
    }
  })();
</script>`;
