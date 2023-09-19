const express = require('express');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Sample user data (replace with a database in a real project)
const users = [
    { id: 1, username: 'admin', password: 'admin' },
    { id: 2, username: 'user', password: 'user' },
];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = user;
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        }
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
