const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;


app.use(bodyParser.json());
app.use(cors());

// Signup route
app.post('/signup', (req, res) => {
    const { username, name, email, password } = req.body;
    fs.readFile('users.json', (err, data) => {
        let users = [];
        if (!err && data.length > 0) users = JSON.parse(data);
        // Duplicate check
        if (users.some(u => u.email === email || u.username === username)) {
            return res.status(400).json({ message: 'User already exists' });
        }
        users.push({ username, name, email, password });
        fs.writeFile('users.json', JSON.stringify(users, null, 2), err => {
            if (err) return res.status(500).json({ message: 'Error saving user' });
            res.json({ message: 'Signup successful' });
        });
    });
});

// Login route (optional)
app.post('/login', (req, res) => {
    const { usernameOrEmail, password } = req.body;
    fs.readFile('users.json', (err, data) => {
        if (err) return res.status(500).json({ message: 'Error reading users' });
        const users = JSON.parse(data);
        const user = users.find(u =>
            u.username === usernameOrEmail || u.email === usernameOrEmail
        );
        if (!user) {
            // Username/email galat, password check nahi karenge
            return res.json({ usernameError: 'Username/email mismatch',passwordError: 'Password incorrect' });
        }
        if (user.password !== password) {
            // Username/email sahi, password galat
            return res.json({ passwordError: 'Password incorrect' });
        }
        // Dono sahi
        res.json({ message: 'Login successful' });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:3000`));