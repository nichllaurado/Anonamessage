const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

// Dummy database
let messages = [];

app.use(bodyParser.json());
app.use(express.static('public'));

// Post a new message
app.post('/api/messages', (req, res) => {
    const { message } = req.body;
    const newMessage = { id: messages.length + 1, message, replies: [] };
    messages.push(newMessage);
    res.status(201).json(newMessage);
});

// Get a random message chain
app.get('/api/messages/random', (req, res) => {
    if (messages.length === 0) return res.status(404).send('No messages found.');
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    res.json(randomMessage);
});

// Reply to a message
app.post('/api/messages/:messageId/reply', (req, res) => {
    const { messageId } = req.params;
    const { reply } = req.body;
    
    const parentMessage = messages.find(msg => msg.id === parseInt(messageId));
    if (!parentMessage) return res.status(404).send('Message not found.');

    const newReply = { message: reply };
    parentMessage.replies.push(newReply);
    res.status(201).json(newReply);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
