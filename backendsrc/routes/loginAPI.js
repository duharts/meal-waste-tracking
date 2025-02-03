const express = require('express');
const router = express.Router();
const moment = require('moment-timezone')
const { v4: uuidv4 } = require('uuid'); // To generate unique file names
const path = require('path');
const fs = require('fs');

const AWS = require('aws-sdk');

// Configure the SDK with your AWS region
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: 'us-east-1'
});

module.exports = (db) => {
    // POST endpoint to create a new order
    router.post('/login', async (req, res) => {

        console.log(req.body.data)
        const { username, password } = req.body.data;

        // Check credentials (replace with your own logic)
        if (username === demoUser.username && password === demoUser.password) {
            // Create a JWT payload
            const payload = { id: demoUser.id, username: demoUser.username };

            // Sign the token (expires in 1 hour)
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

            return res.json({ token });
        }

        return res.status(401).json({ error: 'Invalid credentials' });
    });

    return router;
};