const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const router = require('./routes/index.js');
const errorHandler = require('./middleware/errorHandler.js')
const logger = require('./utils/logger.js')
const mealAPI = require('./routes/mealAPI.js')
const metricsAPI = require('./routes/metricsAPI.js')
const sqlite3 = require('sqlite3')
const AWS = require('aws-sdk')
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

dotenv.config()

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

const app = express()

app.use(cors({
    origin: process.env.frontend_url || 'http://localhost:3000'
}))

//Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//routes
app.use('/api', mealAPI())
app.use('/api', metricsAPI())

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Meal-Waste Tracking Application server!');
});

async function updateDynamoDB(tableName, data) {
    const params = {
        TableName: tableName,
        Item: data,
    };

    try {
        await dynamoDB.put(params).promise();
    } catch (error) {
        console.error('Error updating DynamoDB:', error);
        throw new Error('DynamoDB update failed');
    }
}

//error handling
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})
