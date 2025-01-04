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

        // Send user message to backend and display bot response
        fetch('http://your-backend-url/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => response.json())
        .then(data => {
            // Display bot message with profile picture and timestamp
            const botMessageElement = document.createElement('div');
            botMessageElement.className = 'chat-message bot';
            const timestamp = new Date().toLocaleTimeString();
            botMessageElement.innerHTML = `
                <div class="profile-pic">
                    <img src="bot/profile-pic.jpg" alt="Bot Profile Picture">
                </div>
                <div class="message-text">
                    ${data.response}
                    <div class="timestamp">${timestamp}</div>
                </div>
            `;
            chatBox.appendChild(botMessageElement);
            chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}