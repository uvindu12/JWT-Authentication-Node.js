const jwt = require('jsonwebtoken');
const express = require('express');
require('dotenv').config();

const router = express.Router();

let refreshTokens = []; // Use plural and array for clarity

// Sign In
router.post('/signin', (req, res) => {
    const { username, password } = req.body;
    // Simple authentication (replace with DB check in production)
    if (username !== 'user' || password !== 'pass') {
        return res.status(401).send('Username or password is incorrect');
    }

    const user = { username };
    const accessToken = jwt.sign(user, process.env.TOKEN_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_KEY, { expiresIn: '7d' });
    refreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken });
});

// Refresh Token
router.post('/token', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken || !refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = jwt.sign({ username: user.username }, process.env.TOKEN_KEY, { expiresIn: '15m' });
        res.json({ accessToken });
    });
});

// Logout
router.post('/logout', (req, res) => {
    const { refreshToken } = req.body;
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.status(204).send('Logged out successfully');
});

module.exports = router;