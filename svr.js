// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();

const PORT = 4000;
const dbPath = './articles.db';

// Create a new SQLite database and articles table
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT
            )
        `, (err) => {
            if (err) {
                console.error('Error creating articles table:', err.message);
            }
        });
    }
});

app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files (HTML, CSS, etc.)

const { body, validationResult } = require('express-validator');

app.post('/submit-article', [
    body('title').notEmpty().withMessage('제목이 필요합니다'),
    body('content').notEmpty().withMessage('내용이 필요합니다')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    // 데이터베이스에 삽입하는 코드
    db.run('INSERT INTO articles (title, content) VALUES (?, ?)', [articleTitle, content], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: '기사 제출 완료' });
    });
});


// Endpoint to get all articles
app.get('/articles', (req, res) => {
    db.all('SELECT title, content FROM articles', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
