let currentMessageId = null;
        
// Post message to backend
function postMessage() {
    const message = document.getElementById('messageInput').value;
    fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Message posted:', data);
        alert('Message posted successfully!');
    })
    .catch(error => {
        console.error('Error posting message:', error);
    });
}

function replyToMessage() {
    const reply = document.getElementById('replyInput').value;

    if (!currentMessageId) {
        alert('Please load a message to reply to first.');
        return;
    }

    // Send the reply to the backend
    fetch(`/api/messages/${currentMessageId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Reply posted:', data);
        alert('Reply posted successfully!');
        // Optionally, refresh the message chain to display the new reply
        loadRandomMessageChain();
    })
    .catch(error => {
        console.error('Error posting reply:', error);
    });
}


// Load random message chain
function loadRandomMessageChain() {
    fetch('/api/messages/random')
    .then(response => response.json())
    .then(data => {
        // Save the message ID
        currentMessageId = data.id;  // Assuming 'data.id' contains the message ID from the backend

        // Display the message
        document.getElementById('messageChain').textContent = data.message;

        // Optionally, display the replies
        displayReplies(data.replies);
    })
    .catch(error => {
        console.error('Error loading message:', error);
    });
}


// Function to display the message replies
function displayReplies(replies) {
    const repliesContainer = document.getElementById('messageChain');
    repliesContainer.innerHTML = '';  // Clear current replies

    replies.forEach(reply => {
        const replyElement = document.createElement('div');
        replyElement.textContent = reply.content;
        repliesContainer.appendChild(replyElement);
    });
}


function getMessageIdFromDisplayedMessage() {
    return currentMessageId;
}


// Show the loading indicator before fetching data
function showLoading() {
    document.getElementById('loadingIndicator').style.display = 'block';
}

// Hide the loading indicator after fetching is done
function hideLoading() {
    document.getElementById('loadingIndicator').style.display = 'none';
}

function loadRandomMessageChain() {
    showLoading();
    fetch('/api/messages/random')
    .then(response => response.json())
    .then(data => {
        hideLoading();
        currentMessageId = data.id;
        document.getElementById('messageChain').textContent = data.message;
        displayReplies(data.replies);
    })
    .catch(error => {
        hideLoading();
        console.error('Error loading message:', error);
    });
}