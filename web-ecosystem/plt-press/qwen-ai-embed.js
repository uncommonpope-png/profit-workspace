/**
 * Qwen Code AI Embed for PLT Dashboard
 * Add this to your dashboard to enable AI commands
 * 
 * Usage: Add <script src="qwen-ai-embed.js"></script> before </body>
 */

(function() {
    // Configuration
    const AI_SERVER = 'http://localhost:5002'; // Qwen Code server
    const EMBED_ID = 'qwen-ai-embed';
    
    // Create AI Panel HTML
    const panelHTML = `
<div id="${EMBED_ID}" style="display:none;position:fixed;bottom:0;right:20px;width:400px;max-width:90vw;background:linear-gradient(145deg,#0F1419 0%,#0A0F1C 100%);border:1px solid #1E2832;border-radius:16px 16px 0 0;box-shadow:0 -4px 24px rgba(0,0,0,0.4);z-index:9999;font-family:'Segoe UI',sans-serif;">
    <!-- Header -->
    <div style="display:flex;justify-content:space-between;align-items:center;padding:16px;border-bottom:1px solid #1E2832;background:rgba(0,229,255,0.05);">
        <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.2rem;">🧠</span>
            <div>
                <div style="font-weight:bold;color:#00E5FF;font-size:0.9rem;">QWEN CODE AI</div>
                <div style="font-size:0.7rem;color:#6B7280;">Command Terminal</div>
            </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
            <span id="qwen-status-dot" style="width:8px;height:8px;border-radius:50%;background:#00FF88;box-shadow:0 0 10px #00FF88;" title="Online"></span>
            <button onclick="toggleQwenAI()" style="background:none;border:none;color:#6B7280;cursor:pointer;font-size:1.2rem;padding:0 4px;">×</button>
        </div>
    </div>
    
    <!-- Terminal Output -->
    <div id="qwen-terminal-output" style="max-height:300px;overflow-y:auto;padding:16px;font-family:'Courier New',monospace;font-size:0.85rem;background:rgba(0,0,0,0.3);">
        <div style="color:#00E5FF;margin-bottom:8px;">🧠 QWEN: Hey Craig! I'm your AI assistant embedded in the dashboard. Tell me to do anything!</div>
    </div>
    
    <!-- Quick Commands -->
    <div style="padding:8px 16px;display:flex;gap:6px;flex-wrap:wrap;background:rgba(255,255,255,0.02);">
        <button onclick="qwenCmd('!ls -la')" style="background:rgba(0,229,255,0.1);border:1px solid rgba(0,229,255,0.3);color:#00E5FF;padding:4px 10px;border-radius:12px;cursor:pointer;font-size:0.7rem;">📁 Files</button>
        <button onclick="qwenCmd('!git status')" style="background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.3);color:#8B5CF6;padding:4px 10px;border-radius:12px;cursor:pointer;font-size:0.7rem;">🔀 Git</button>
        <button onclick="qwenCmd('Check revenue')" style="background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);color:#00FF88;padding:4px 10px;border-radius:12px;cursor:pointer;font-size:0.7rem;">💰 Revenue</button>
        <button onclick="qwenCmd('!ps aux | grep python')" style="background:rgba(255,184,77,0.1);border:1px solid rgba(255,184,77,0.3);color:#FFB84D;padding:4px 10px;border-radius:12px;cursor:pointer;font-size:0.7rem;">🔄 Processes</button>
    </div>
    
    <!-- Input -->
    <div style="display:flex;gap:8px;padding:16px;border-top:1px solid #1E2832;background:rgba(0,0,0,0.2);">
        <span style="color:#00FF88;font-family:'Courier New',monospace;font-size:0.9rem;">$</span>
        <input type="text" id="qwen-input" placeholder="Tell AI what to do..." onkeypress="if(event.key==='Enter')qwenSend()" style="flex:1;background:rgba(255,255,255,0.05);border:1px solid #1E2832;color:#E5E7EB;padding:8px 12px;border-radius:6px;font-family:'Courier New',monospace;font-size:0.85rem;outline:none;">
        <button onclick="qwenSend()" style="background:linear-gradient(135deg,#00FF88,#00E677);color:#000;border:none;padding:8px 16px;border-radius:6px;font-weight:bold;cursor:pointer;font-size:0.85rem;">Send</button>
    </div>
</div>

<!-- Toggle Button -->
<button id="qwen-toggle-btn" onclick="toggleQwenAI()" style="position:fixed;bottom:20px;right:20px;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#00E5FF,#00C4E6);border:none;box-shadow:0 4px 20px rgba(0,229,255,0.4);cursor:pointer;z-index:9998;font-size:1.5rem;">🧠</button>
`;
    
    // Add styles
    const styles = `
<style>
@keyframes qwenPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.1); }
}
#qwen-terminal-output::-webkit-scrollbar { width: 6px; }
#qwen-terminal-output::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
#qwen-terminal-output::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.3); border-radius: 3px; }
#qwen-toggle-btn:hover { transform: scale(1.1); box-shadow: 0 6px 30px rgba(0,229,255,0.6); }
#qwen-toggle-btn:active { transform: scale(0.95); }
</style>
`;
    
    // Inject HTML and styles
    document.body.insertAdjacentHTML('beforeend', styles + panelHTML);
    
    // Toggle visibility
    window.toggleQwenAI = function() {
        const panel = document.getElementById(EMBED_ID);
        const btn = document.getElementById('qwen-toggle-btn');
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            btn.style.display = 'none';
            document.getElementById('qwen-input').focus();
        } else {
            panel.style.display = 'none';
            btn.style.display = 'block';
        }
    };
    
    // Add output to terminal
    window.qwenOutput = function(type, text) {
        const output = document.getElementById('qwen-terminal-output');
        const div = document.createElement('div');
        div.style.marginBottom = '12px';
        div.style.whiteSpace = 'pre-wrap';
        div.style.wordBreak = 'break-word';
        
        if (type === 'user') {
            div.style.color = '#00E5FF';
            div.textContent = '$ ' + text;
        } else if (type === 'ai') {
            div.style.color = '#00FF88';
            div.textContent = text;
        } else if (type === 'error') {
            div.style.color = '#FF4757';
            div.textContent = text;
        } else if (type === 'system') {
            div.style.color = '#6B7280';
            div.style.fontStyle = 'italic';
            div.textContent = text;
        }
        
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
    };
    
    // Send command
    window.qwenSend = async function() {
        const input = document.getElementById('qwen-input');
        const cmd = input.value.trim();
        if (!cmd) return;
        
        qwenOutput('user', cmd);
        input.value = '';
        
        try {
            const r = await fetch(AI_SERVER + '/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: cmd })
            });
            const d = await r.json();
            qwenOutput('ai', d.response);
        } catch (e) {
            qwenOutput('error', '❌ AI unavailable: ' + e.message);
        }
    };
    
    // Quick command
    window.qwenCmd = function(cmd) {
        document.getElementById('qwen-input').value = cmd;
        qwenSend();
    };
    
    // Check status
    async function checkStatus() {
        try {
            await fetch(AI_SERVER + '/api/status', {mode: 'no-cors'});
            document.getElementById('qwen-status-dot').style.background = '#00FF88';
            document.getElementById('qwen-status-dot').style.boxShadow = '0 0 10px #00FF88';
        } catch(e) {
            document.getElementById('qwen-status-dot').style.background = '#FF4757';
            document.getElementById('qwen-status-dot').style.boxShadow = '0 0 10px #FF4757';
        }
    }
    
    // Initial check and periodic updates
    checkStatus();
    setInterval(checkStatus, 30000);
    
    // Auto-show on load
    setTimeout(() => {
        toggleQwenAI();
    }, 1000);
    
    console.log('🧠 Qwen Code AI Embed loaded');
})();
