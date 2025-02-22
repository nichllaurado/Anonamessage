const { Pool } = require('pg');

// Set up the database connection
const pool = new Pool({
    user: 'postgres',        // Your PostgreSQL username
    host: 'localhost',       // Database server address (use 'localhost' if running locally)
    database: 'anonamessage', // The database you created earlier
    password: 'your_password',  // Your PostgreSQL password
    port: 5432,              // Default PostgreSQL port
});

// Example function to fetch a random message
async function getRandomMessage() {
    const result = await pool.query('SELECT * FROM messages ORDER BY RANDOM() LIMIT 1');
    return result.rows[0];
}

// Example function to post a message
async function postMessage(content) {
    const result = await pool.query('INSERT INTO messages(content) VALUES($1) RETURNING *', [content]);
    return result.rows[0];
}

// Example function to post a reply to a message
async function postReply(messageId, content) {
    const result = await pool.query('INSERT INTO replies(content, message_id) VALUES($1, $2) RETURNING *', [content, messageId]);
    return result.rows[0];
}
