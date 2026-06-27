// js/chatbot.js
document.addEventListener('DOMContentLoaded', function() {
    // Inject Chatbot UI
    const chatHTML = `
        <div id="aiChatbotWidget" style="position:fixed;bottom:20px;right:20px;z-index:9999;">
            <!-- Chat Window -->
            <div id="aiChatWindow" style="display:none;width:320px;height:400px;background:#fff;border-radius:15px;box-shadow:0 10px 30px rgba(0,0,0,0.2);flex-direction:column;overflow:hidden;border:1px solid #eee;">
                <!-- Header -->
                <div style="background:linear-gradient(135deg, #11998e, #38ef7d);color:#fff;padding:15px;display:flex;justify-content:space-between;align-items:center;">
                    <div style="font-weight:700;font-size:1.1rem;"><i class="fas fa-robot me-2"></i> Ezy-AI Support</div>
                    <button onclick="toggleChat()" style="background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer;"><i class="fas fa-times"></i></button>
                </div>
                <!-- Messages -->
                <div id="aiChatMessages" style="flex:1;padding:15px;overflow-y:auto;background:#f9f9fc;display:flex;flex-direction:column;gap:10px;">
                    <div style="background:#e8f5e9;padding:10px 15px;border-radius:15px 15px 15px 0;align-self:flex-start;max-width:85%;font-size:0.9rem;color:#333;">
                        Hi! I am Ezy-AI. How can I help you with your parking today?
                    </div>
                </div>
                <!-- Input -->
                <div style="padding:10px;background:#fff;border-top:1px solid #eee;display:flex;gap:10px;">
                    <input type="text" id="aiChatInput" placeholder="Ask a question..." style="flex:1;border:1px solid #ddd;border-radius:20px;padding:8px 15px;outline:none;font-size:0.9rem;" onkeypress="if(event.key==='Enter') sendChatMessage()">
                    <button onclick="sendChatMessage()" style="background:linear-gradient(135deg, #11998e, #38ef7d);color:#fff;border:none;border-radius:50%;width:35px;height:35px;display:flex;align-items:center;justify-content:center;cursor:pointer;"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            
            <!-- Floating Button -->
            <button id="aiChatToggle" onclick="toggleChat()" style="position:absolute;bottom:0;right:0;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg, #11998e, #38ef7d);color:#fff;border:none;box-shadow:0 5px 15px rgba(17,153,142,0.4);font-size:1.8rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform 0.3s;">
                <i class="fas fa-comment-dots"></i>
            </button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatHTML);
});

function toggleChat() {
    const win = document.getElementById('aiChatWindow');
    const toggle = document.getElementById('aiChatToggle');
    if(win.style.display === 'none') {
        win.style.display = 'flex';
        toggle.style.transform = 'scale(0)';
    } else {
        win.style.display = 'none';
        toggle.style.transform = 'scale(1)';
    }
}

function sendChatMessage() {
    const input = document.getElementById('aiChatInput');
    const msg = input.value.trim();
    if(!msg) return;
    
    appendMessage(msg, 'user');
    input.value = '';
    
    // Simulate thinking delay
    setTimeout(() => {
        const reply = generateAIResponse(msg);
        appendMessage(reply, 'ai');
    }, 600);
}

function appendMessage(text, sender) {
    const container = document.getElementById('aiChatMessages');
    const msgDiv = document.createElement('div');
    if(sender === 'user') {
        msgDiv.style.cssText = 'background:linear-gradient(135deg, #007bff, #0056b3);color:#fff;padding:10px 15px;border-radius:15px 15px 0 15px;align-self:flex-end;max-width:85%;font-size:0.9rem;word-wrap:break-word;';
    } else {
        msgDiv.style.cssText = 'background:#e8f5e9;color:#333;padding:10px 15px;border-radius:15px 15px 15px 0;align-self:flex-start;max-width:85%;font-size:0.9rem;word-wrap:break-word;';
    }
    msgDiv.innerHTML = text;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

// Mock AI Logic based on EzyParking local data
function generateAIResponse(query) {
    query = query.toLowerCase();
    
    if(query.includes('hello') || query.includes('hi')) return "Hello! I can help you find parking, check prices, or explain how the smart gate works.";
    if(query.includes('how to book') || query.includes('book')) return "To book a slot, go to the <b>Book a Slot</b> page, select a lot, enter your vehicle details, and confirm to get a Booking ID.";
    if(query.includes('gate') || query.includes('entry')) return "At the Smart Gate, you can either enter your Booking ID/Vehicle Registration manually, or use our new <b>AI Vision Camera</b> to scan your license plate!";
    if(query.includes('recommend') || query.includes('best spot')) return "Go to the <b>Find Parking</b> page and click the <b>AI Recommend</b> button. I'll automatically find the best spot based on price and rating!";
    if(query.includes('price') || query.includes('cost')) {
        let cheapest = EzyParking.PARKING_LOTS.reduce((min, p) => p.pricePerHour < min.pricePerHour ? p : min, EzyParking.PARKING_LOTS[0]);
        return \`Parking prices vary by location. Our cheapest lot right now is <b>\${cheapest.name}</b> at ₹\${cheapest.pricePerHour}/hr.\`;
    }
    if(query.includes('lost') || query.includes('find my car') || query.includes('vehicle')) return "Can't remember where you parked? Use the <b>Find Vehicle</b> feature from the menu to locate it by your registration number.";
    
    // Default fallback
    return "I'm sorry, I didn't quite catch that. You can ask me about parking prices, how to book, or how the smart gate works. <br><br><i>(Note: In a production environment, this would connect to the Gemini API using an API Key)</i>";
}
