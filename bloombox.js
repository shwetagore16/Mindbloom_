// New Bloombox Chat JS for new-chat-widget
// New Bloombox Chat JS for new-chat-widget
const BLOOMBOX_WELCOME = "Hi! I'm Bloombox, your friendly AI. How can I help you today?";

function addNewChatMessage(text, sender) {
    const chatMessages = document.getElementById('new-chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'new-chat-msg user' : 'new-chat-msg ai';
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function aiResponse(userMsg) {
    addNewChatMessage('...', 'ai');
    try {
        const response = await fetch('https://api.cohere.ai/v1/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer RZMbdYZKghLPCX75Fk4JPbYE3P0ue2j0COtIO69Q'
            },
            body: JSON.stringify({
                model: 'command-r-plus',
                message: userMsg
            })
        });
        const data = await response.json();
        const reply = data.text || data.reply || "Sorry, I couldn't process that.";
        return reply;
    } catch (err) {
        return "Sorry, I'm having trouble connecting to AI right now.";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const chatWidget = document.getElementById('new-chat-widget');
    if (!chatWidget) return;
    addNewChatMessage(BLOOMBOX_WELCOME, 'ai');
    const form = document.getElementById('new-chat-form');
    const input = document.getElementById('new-chat-input');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const userMsg = input.value.trim();
        if (!userMsg) return;
        addNewChatMessage(userMsg, 'user');
        aiResponse(userMsg).then(reply => {
            // Remove loading indicator (last AI message is ...)
            const chatMessages = document.getElementById('new-chat-messages');
            const lastMsg = chatMessages.lastChild;
            if (lastMsg && lastMsg.classList.contains('ai') && lastMsg.textContent === '...') {
                chatMessages.removeChild(lastMsg);
            }
            addNewChatMessage(reply, 'ai');
        });
        input.value = '';
    });
});
