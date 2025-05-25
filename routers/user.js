const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

let refreshTokens = []; // Store refresh tokens (use DB in production)

// Sign In
router.post('/signin', (req, res) => {
    // Check DB for user (replace with real logic)
    const username = req.body.username;
    const user = { name: username };

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
        const accessToken = jwt.sign({ name: user.name }, process.env.TOKEN_KEY, { expiresIn: '15m' });
        res.json({ accessToken });
    });
});

// Logout
router.post('/logout', (req, res) => {
    const { refreshToken } = req.body;
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.sendStatus(204);
});

module.exports = router;