// Import required modules
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

// Create an Express app
const app = express();
const port = 3000;


// Set up body-parser middleware
app.use(bodyParser.json());

// Set up PostgreSQL connection
const pool = new Pool({
    user: 'postgres',         // Your PostgreSQL username
    host: 'localhost',        // Database server address
    database: 'anonamessage', // The database you created earlier
    password: 'your_password',  // Your PostgreSQL password
    port: 5432,               // Default PostgreSQL port
});

// Endpoint to post a new message
app.post('/api/messages', async (req, res) => {
    const { message } = req.body;
    
    try {
        // Insert new message into the database
        const result = await pool.query('INSERT INTO messages(content) VALUES($1) RETURNING *', [message]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error posting message:', err);
        res.status(500).json({ error: 'Error posting message' });
    }
});

// Endpoint to get a random message
app.get('/api/messages/random', async (req, res) => {
    try {
        // Query for a random message
        const result = await pool.query('SELECT * FROM messages ORDER BY RANDOM() LIMIT 1');
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No messages found' });
        }
        const message = result.rows[0];
        
        // Fetch replies for this message
        const repliesResult = await pool.query('SELECT * FROM replies WHERE message_id = $1', [message.id]);
        message.replies = repliesResult.rows;
        
        res.json(message);
    } catch (err) {
        console.error('Error fetching message:', err);
        res.status(500).json({ error: 'Error fetching message' });
    }
});

// Endpoint to post a reply to a message
app.post('/api/messages/:messageId/reply', async (req, res) => {
    const { messageId } = req.params;
    const { reply } = req.body;
    
    try {
        // Insert a reply into the database
        const result = await pool.query('INSERT INTO replies(content, message_id) VALUES($1, $2) RETURNING *', [reply, messageId]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error posting reply:', err);
        res.status(500).json({ error: 'Error posting reply' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
