export default `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GODMODE Development Acceleration System</title>
    <style>
        :root {
            --primary: #2d4a3e;
            --secondary: #4a6b3a;
            --accent: #8b4513;
            --text: #f4f1e8;
            --bg: #120b07;
            --surface: #20150f;
            --border: rgba(139,115,85,.22);
            --success: #4ade80;
            --warning: #f59e0b;
            --error: #ef4444;
            --shadow: 0 10px 28px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.06);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, var(--bg) 0%, #1a120b 100%);
            color: var(--text);
            min-height: 100vh;
            overflow-x: hidden;
        }

        .container {
            max-width: 1440px;
            margin: 0 auto;
            padding: 2rem;
        }

        .header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .title {
            font-size: clamp(2rem, 5vw, 4rem);
            font-weight: 900;
            background: linear-gradient(135deg, var(--text), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }

        .subtitle {
            font-size: 1.2rem;
            color: var(--secondary);
            margin-bottom: 2rem;
        }

        .command-input {
            width: 100%;
            max-width: 600px;
            margin: 0 auto 2rem;
            position: relative;
        }

        .command-field {
            width: 100%;
            padding: 1rem 1.5rem;
            font-size: 1.1rem;
            background: var(--surface);
            border: 2px solid var(--border);
            border-radius: 12px;
            color: var(--text);
            outline: none;
            transition: all 0.3s ease;
        }

        .command-field:focus {
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
        }

        .command-field::placeholder {
            color: rgba(244, 241, 232, 0.6);
        }

        .command-suggestions {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            max-height: 300px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        }

        .suggestion {
            padding: 0.75rem 1rem;
            cursor: pointer;
            border-bottom: 1px solid var(--border);
            transition: background 0.2s ease;
        }

        .suggestion:hover {
            background: rgba(139, 69, 19, 0.1);
        }

        .suggestion:last-child {
            border-bottom: none;
        }

        .command-code {
            font-family: 'Monaco', 'Menlo', monospace;
            background: var(--bg);
            color: var(--accent);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.9rem;
        }

        .command-desc {
            color: var(--text);
            font-size: 0.9rem;
            margin-left: 0.5rem;
        }

        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }

        .card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: var(--shadow);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(0,0,0,.4);
        }

        .card-title {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--accent);
        }

        .status-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 0.5rem;
        }

        .status-active { background: var(--success); }
        .status-warning { background: var(--warning); }
        .status-error { background: var(--error); }

        .spending-meter {
            background: var(--bg);
            border-radius: 8px;
            height: 12px;
            margin: 0.5rem 0;
            overflow: hidden;
            position: relative;
        }

        .spending-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--success), var(--warning), var(--error));
            transition: width 0.5s ease;
            border-radius: 8px;
        }

        .spending-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
            margin-top: 1rem;
            font-size: 0.9rem;
        }

        .stat-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem;
            background: var(--bg);
            border-radius: 6px;
        }

        .stat-label {
            color: var(--secondary);
        }

        .stat-value {
            font-weight: 700;
            color: var(--accent);
        }

        .command-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }

        .command-item {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .command-item:hover {
            border-color: var(--accent);
            transform: translateY(-1px);
        }

        .command-item .code {
            font-family: 'Monaco', 'Menlo', monospace;
            font-weight: 700;
            color: var(--accent);
            margin-bottom: 0.5rem;
        }

        .command-item .name {
            font-weight: 600;
            margin-bottom: 0.25rem;
        }

        .command-item .description {
            font-size: 0.9rem;
            color: rgba(244, 241, 232, 0.7);
        }

        .execution-log {
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 1rem;
            margin-top: 2rem;
            max-height: 400px;
            overflow-y: auto;
        }

        .log-entry {
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border);
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9rem;
        }

        .log-entry:last-child {
            border-bottom: none;
        }

        .log-timestamp {
            color: var(--secondary);
            margin-right: 1rem;
        }

        .log-command {
            color: var(--accent);
            font-weight: 600;
        }

        .log-status {
            margin-left: 1rem;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .log-success {
            background: rgba(74, 222, 128, 0.2);
            color: var(--success);
        }

        .log-error {
            background: rgba(239, 68, 68, 0.2);
            color: var(--error);
        }

        .log-warning {
            background: rgba(245, 158, 11, 0.2);
            color: var(--warning);
        }

        .model-breakdown {
            margin-top: 1rem;
            font-size: 0.85rem;
        }

        .model-item {
            display: flex;
            justify-content: space-between;
            padding: 0.25rem 0;
            border-bottom: 1px solid var(--border);
        }

        .model-item:last-child {
            border-bottom: none;
        }

        .loading {
            opacity: 0.6;
            pointer-events: none;
        }

        .refresh-btn {
            background: var(--accent);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            margin-top: 0.5rem;
            transition: all 0.3s ease;
        }

        .refresh-btn:hover {
            background: #6b3410;
            transform: scale(1.05);
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .dashboard {
                grid-template-columns: 1fr;
            }
            
            .command-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">GODMODE</h1>
            <p class="subtitle">Development Acceleration System - Real-Time OpenAI Spending Tracking</p>
        </div>

        <div class="dashboard">
            <div class="card">
                <h3 class="card-title">System Status</h3>
                <div class="status-indicator status-active"></div>
                <span>GODMODE Active</span>
                <div style="margin-top: 1rem;">
                    <div>Commands Available: <strong>100</strong></div>
                    <div>AI Safeguards: <strong>Active</strong></div>
                    <div>Tracking: <strong>Real-Time</strong></div>
                </div>
            </div>

            <div class="card">
                <h3 class="card-title">OpenAI Spending (This Week)</h3>
                <div class="spending-meter">
                    <div class="spending-fill" id="spendingFill" style="width: 0%"></div>
                </div>
                <div style="font-size: 0.9rem; color: var(--secondary); margin-top: 0.5rem;" id="spendingText">
                    Loading...
                </div>
                <div class="spending-stats" id="spendingStats">
                    <div class="stat-item">
                        <span class="stat-label">Weekly Budget:</span>
                        <span class="stat-value" id="weeklyBudget">$9.23</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Monthly Budget:</span>
                        <span class="stat-value">$40.00</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Requests:</span>
                        <span class="stat-value" id="totalRequests">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Tokens:</span>
                        <span class="stat-value" id="totalTokens">0</span>
                    </div>
                </div>
                <button class="refresh-btn" onclick="loadSpendingData()">🔄 Refresh</button>
            </div>

            <div class="card">
                <h3 class="card-title">Usage by Model</h3>
                <div id="modelBreakdown" class="model-breakdown">
                    <div style="color: var(--secondary);">Loading model usage...</div>
                </div>
            </div>

            <div class="card">
                <h3 class="card-title">Usage by User</h3>
                <div id="userBreakdown" class="model-breakdown">
                    <div style="color: var(--secondary);">Loading user usage...</div>
                </div>
            </div>
        </div>

        <div class="execution-log" id="executionLog">
            <h3 style="margin-bottom: 1rem; color: var(--accent);">Recent Activity</h3>
            <div id="logEntries">
                <div class="log-entry">
                    <span class="log-timestamp">[Loading...]</span>
                    <span>Fetching spending data...</span>
                </div>
            </div>
        </div>
    </div>

    <script>
        const WEEKLY_BUDGET = 9.23; // $40/month / 4.33 weeks
        const MONTHLY_BUDGET = 40.00;

        async function loadSpendingData() {
            try {
                const response = await fetch('/api/openai/summary');
                const data = await response.json();
                
                if (data.error) {
                    updateSpendingDisplay({
                        totalCost: 0,
                        totalRequests: 0,
                        totalTokens: 0,
                        byModel: {},
                        byUser: {}
                    });
                    addLogEntry('INFO', 'No usage data available yet. Start using ChatGPT to see tracking!');
                    return;
                }

                updateSpendingDisplay(data);
                addLogEntry('SUCCESS', \`Loaded spending data: $\${data.totalCost.toFixed(4)} spent this week\`);
            } catch (error) {
                console.error('Error loading spending data:', error);
                addLogEntry('ERROR', \`Failed to load spending data: \${error.message}\`);
            }
        }

        function updateSpendingDisplay(summary) {
            const percentage = (summary.totalCost / WEEKLY_BUDGET) * 100;
            const fill = document.getElementById('spendingFill');
            fill.style.width = \`\${Math.min(percentage, 100)}%\`;
            
            // Update color based on percentage
            if (percentage < 50) {
                fill.style.background = 'linear-gradient(90deg, var(--success), var(--success))';
            } else if (percentage < 80) {
                fill.style.background = 'linear-gradient(90deg, var(--warning), var(--warning))';
            } else {
                fill.style.background = 'linear-gradient(90deg, var(--error), var(--error))';
            }

            document.getElementById('spendingText').textContent = 
                \`$\${summary.totalCost.toFixed(4)} / $\${WEEKLY_BUDGET.toFixed(2)} (\${percentage.toFixed(1)}%)\`;
            
            document.getElementById('totalRequests').textContent = summary.totalRequests.toLocaleString();
            document.getElementById('totalTokens').textContent = summary.totalTokens.toLocaleString();

            // Model breakdown
            const modelBreakdown = document.getElementById('modelBreakdown');
            if (Object.keys(summary.byModel).length === 0) {
                modelBreakdown.innerHTML = '<div style="color: var(--secondary);">No model usage yet</div>';
            } else {
                modelBreakdown.innerHTML = Object.entries(summary.byModel)
                    .sort((a, b) => b[1].cost - a[1].cost)
                    .map(([model, data]) => \`
                        <div class="model-item">
                            <span>\${model}</span>
                            <span style="color: var(--accent);">$\${data.cost.toFixed(4)} (\${data.requests} req)</span>
                        </div>
                    \`).join('');
            }

            // User breakdown
            const userBreakdown = document.getElementById('userBreakdown');
            if (Object.keys(summary.byUser).length === 0) {
                userBreakdown.innerHTML = '<div style="color: var(--secondary);">No user usage yet</div>';
            } else {
                userBreakdown.innerHTML = Object.entries(summary.byUser)
                    .sort((a, b) => b[1].cost - a[1].cost)
                    .map(([user, data]) => \`
                        <div class="model-item">
                            <span>\${user}</span>
                            <span style="color: var(--accent);">$\${data.cost.toFixed(4)} (\${data.requests} req)</span>
                        </div>
                    \`).join('');
            }
        }

        function addLogEntry(status, message) {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.innerHTML = \`
                <span class="log-timestamp">[\${timestamp}]</span>
                <span class="log-status log-\${status.toLowerCase()}">\${status}</span>
                <span>\${message}</span>
            \`;
            
            const log = document.getElementById('logEntries');
            log.insertBefore(logEntry, log.firstChild);
            
            // Keep only last 20 entries
            while (log.children.length > 20) {
                log.removeChild(log.lastChild);
            }
        }

        // Load data on page load and refresh every 30 seconds
        loadSpendingData();
        setInterval(loadSpendingData, 30000);
    </script>
</body>
</html>
`;