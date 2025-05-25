const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
    const user = req.user;
    res.json(user);
    res.send('Student route working!');
});

module.exports = router;