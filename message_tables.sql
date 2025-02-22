-- Create Messages Table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,       -- Auto-incremented ID for each message
    content TEXT NOT NULL,       -- Message content
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of when message was posted
);

-- Create Replies Table
CREATE TABLE replies (
    id SERIAL PRIMARY KEY,         -- Auto-incremented ID for each reply
    content TEXT NOT NULL,         -- Reply content
    message_id INT,                -- ID of the original message being replied to
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of when reply was posted
    FOREIGN KEY (message_id) REFERENCES messages(id) -- Foreign key linking to the messages table
);


-- Insert a test message
INSERT INTO messages (content) VALUES ('This is a test message.');

-- Insert a reply to the message (replace message_id with the ID of the message you inserted)
INSERT INTO replies (content, message_id) VALUES ('This is a reply to the test message.', 1);
