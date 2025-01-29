const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const AWS = require('aws-sdk')

dotenv.config()

// Configure the SDK with your AWS region
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: 'us-east-1'
});

// Create a DynamoDB DocumentClient instance
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const app = express()

app.use(cors({
    origin: process.env.frontend_url || 'https://meal-waste-tracking-client-th1d.vercel.app'
}))

//Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
    res.send('Welcome to the Meal-Waste Tracking Application server!');
});

async function getRecords(tableName) {
    const params = {
        TableName: tableName,
        ScanIndexForward: false,
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        console.log(data)
        return data
    } catch (error) {
        console.error('Error updating DynamoDB:', error);
        throw new Error('DynamoDB update failed');
    }
}

async function submitRecords(params) {
    try {
        dynamoDB.put(params).promise();
        console.log('Data inserted in DynamoDB');
        res.status(200).json({ message: 'Data inserted successfully', data: params.Item });
    } catch (error) {
        console.error('Error updating DynamoDB:', error);
        res.status(500).json({ error: 'Failed to insert data' });
    }
}


app.get("/api/records", async (req, res) => {

    try {
        const data = await getRecords('mealwastetracker')
        res.status(200).json(data.Items);

    } catch (err) {
        console.error('Error fetching records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
});

app.post("/api/submit-order", (req, res) => {
    const { id, mealType, quantity, date } = req.body.data;

    if (!mealType || !quantity || !date) {
        res.status(400).json({ error: 'All fields are required!' });
        return;
    }

    const data = {
        mealType,
        quantity,
        date,
        id,
    };

    const params = {
        TableName: 'mealwastetracker',
        Item: data,
    };

    submitRecords(params)

});

// Export the app as a serverless function
module.exports = app;
