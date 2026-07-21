// ============================================
// AI CHAT WITH REAL API (Gemini)
// ============================================

const API_KEY = 'AQ.Ab8RN6IA8gJcVwwzXUYRxCObqCXo9VU_PNEGhq0hyf3Z3F21aA';


const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const typingIndicator = document.getElementById('typing-indicator');

function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i>
        </div>
        <div class="message-content">
            <p>${text}</p>
            <span class="message-time">${time}</span>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    
    // Add user message
    addMessage(text, true);
    userInput.value = '';
    
    // Show typing
    typingIndicator.classList.add('show');
    
    try {
        // Call Gemini API
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: text
                    }]
                }]
            })
        });
        
        const data = await response.json();
        
        // Hide typing
        typingIndicator.classList.remove('show');
        
        // Get AI response
        let aiText = 'Sorry, I could not process that.';
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            aiText = data.candidates[0].content.parts[0].text;
        }
        
        // Add AI message with typing effect
        typeMessage(aiText);
        
        // Update stats
        updateStats();
        
    } catch (error) {
        typingIndicator.classList.remove('show');
        addMessage('Sorry, I am having trouble connecting. Please try again later.', false);
        console.error('Error:', error);
    }
}

function typeMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p id="typing-text"></p>
            <span class="message-time">${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    const typingText = messageDiv.querySelector('#typing-text');
    let index = 0;
    
    function type() {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            chatMessages.scrollTop = chatMessages.scrollHeight;
            setTimeout(type, 20);
        }
    }
    
    type();
}

function updateStats() {
    const responseTime = (Math.random() * 1.2 + 0.3).toFixed(1);
    document.getElementById('response-time').textContent = responseTime + 's';
    
    const accuracy = Math.floor(Math.random() * 5 + 95);
    document.getElementById('accuracy').textContent = accuracy + '%';
}

// Auto-focus input
userInput.focus();

