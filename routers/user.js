const express = require('express')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

router.post('/login', (req,res)=> {
    //Check DB
    //OK
    const username = req.body.username;
    const user = {name:username};

    const token = jwt.sign(user,process.env.TOKEN_KEY)
    res.send ({token});


})

module.exports =router