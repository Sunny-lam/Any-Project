async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const userMessage = userInput.value.trim();

    if (userMessage) {
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

        // Tokenize user message
        const promptTokens = tokenize(userMessage);

        // Load the model (if not already loaded)
        const model = await loadModel();

        // Generate bot response
        const botResponseTokens = await generate(model, [promptTokens], 50, -1, 1.0);
        const botResponse = detokenize(botResponseTokens[0]);

        const botMessageElement = document.createElement('div');
        botMessageElement.className = 'chat-message bot';
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

// Helper function to tokenize messages
function tokenize(message) {
    return message.split(' ').map(word => word.charCodeAt(0));
}

// Helper function to detokenize messages
function detokenize(tokens) {
    return tokens.map(token => String.fromCharCode(token)).join(' ');
}

// Placeholder function to load and initialize the model
async function loadModel() {
    const model = {
        maxSeqLen: 512,
        forward: async (tokens, position) => {
            return tokens.map(token => token + 1);
        }
    };
    return model;
}

// Sample function
function sample(logits, temperature = 1.0) {
    logits = logits.map(logit => logit / Math.max(temperature, 1e-5));
    let probs = softmax(logits);
    return probs.map(prob => prob / Math.random()).indexOf(Math.max(...probs));
}

function softmax(logits) {
    let maxLogit = Math.max(...logits);
    let exps = logits.map(logit => Math.exp(logit - maxLogit));
    let sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(exp => exp / sumExps);
}

// Generate function
async function generate(model, promptTokens, maxNewTokens, eosId, temperature = 1.0) {
    const promptLens = promptTokens.map(t => t.length);
    const maxPromptLen = Math.max(...promptLens);
    const totalLen = Math.min(model.maxSeqLen, maxNewTokens + maxPromptLen);
    let tokens = Array(promptTokens.length).fill().map(() => Array(totalLen).fill(-1));
    
    promptTokens.forEach((t, i) => {
        tokens[i] = [...t, ...Array(totalLen - t.length).fill(-1)];
    });

    let prevPos = 0;
    let finished = Array(promptTokens.length).fill(false);

    for (let curPos = maxPromptLen; curPos < totalLen; curPos++) {
        let logits = await model.forward(tokens.map(t => t.slice(prevPos, curPos)), prevPos);
        let nextToken;
        
        if (temperature > 0) {
            nextToken = sample(logits, temperature);
        } else {
            nextToken = logits.map(logit => logit.indexOf(Math.max(...logit)));
        }

        tokens.forEach((t, i) => {
            if (t[curPos] === -1) {
                t[curPos] = nextToken[i];
            }
            if (t[curPos] === eosId) {
                finished[i] = true;
            }
        });

        prevPos = curPos;
        if (finished.every(f => f)) {
            break;
        }
    }

    return tokens.map((t, i) => t.slice(promptLens[i], promptLens[i] + maxNewTokens).filter(token => token !== eosId));
}
