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

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: 'us-east-1'
});

// Create a DynamoDB DocumentClient instance
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = (db) => {
    // GET endpoint to retrieve users
    router.get('/records', async (req, res) => {
        const params = {
            TableName: 'mealwastetracker', // Replace with your DynamoDB table name
            ScanIndexForward: false,
        };

        try {
            const data = await dynamoDB.scan(params).promise(); // Fetch all records


            res.status(200).json(data.Items);
        } catch (err) {
            console.error('Error fetching records from DynamoDB:', err);
            res.status(500).json({ error: 'Failed to fetch records' });
        }
    });


    // POST endpoint to create a new order
    router.post('/submit-order', async (req, res) => {

        console.log(req.body.data)
        const { id, mealType, quantity, date } = req.body.data;

        if (!mealType || !quantity || !date) {
            res.status(400).json({ error: 'All fields are required!' });
            return;
        }

        const data = {
            mealType,
            quantity,
            date,
            id
        }

        const params = {
            TableName: 'mealwastetracker',
            Item: data,
        };

        try {
            await dynamoDB.put(params).promise();
            console.log('Data inserted in DynamoDB', data);
            res.status(200).json({ message: 'Data inserted successfully', data: params.Item });
        } catch (error) {
            console.error('Error updating DynamoDB:', error);
            throw new Error('DynamoDB update failed');
        }
    });

    return router;
};

