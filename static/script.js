const botResponses = [
    "Hi there! How can I help you today?",
    "I'm here to assist you with any questions you have.",
    "Can you please provide more details?",
    "Thank you for reaching out!",
    "I'm sorry, I don't understand. Can you rephrase?"
];

function getBotResponse() {
    const randomIndex = Math.floor(Math.random() * botResponses.length);
    return botResponses[randomIndex];
}

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const userMessage = userInput.value.trim();

    if (userMessage) {
        // Display user message with profile picture and timestamp
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'chat-message user';
        const timestamp = new Date().toLocaleTimeString();
        userMessageElement.innerHTML = `
            <div class="message-text">
                ${userMessage}
                <div class="timestamp">${timestamp}</div>
            </div>
            <div class="profile-pic">
                <img src="/user_pic.webp" alt="User Profile Picture">
            </div>
        `;
        chatBox.appendChild(userMessageElement);
        userInput.value = '';

        // Display bot response
        const botMessageElement = document.createElement('div');
        botMessageElement.className = 'chat-message bot';
        const botResponse = getBotResponse();
        botMessageElement.innerHTML = `
            <div class="profile-pic">
                <img src="bot/profile-pic.jpg" alt="Bot Profile Picture">
            </div>
            <div class="message-text">
                ${botResponse}
                <div class="timestamp">${timestamp}</div>
            </div>
        `;
        chatBox.appendChild(botMessageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
