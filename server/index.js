const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: 'us-east-1'
});

exports.handler = async (event) => {
    try {
        console.log('Event:', JSON.stringify(event)); // Keep this for debugging

        // For Lambda Proxy integration, we use event.resource to check the path
        // and event.httpMethod for the method
        const path = event.resource;
        const httpMethod = event.httpMethod;

        console.log('Path:', path);
        console.log('Method:', httpMethod);

        if (httpMethod === 'GET' && path === '/records') {
            const params = {
                TableName: 'mealwastetracker', // Replace with your DynamoDB table name
            };

            const data = await dynamoDB.scan(params).promise(); // Fetch all records

            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Add your Vercel frontend URL in production
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data.Items)
            };
        }

        if (httpMethod === 'POST' && path === '/submit-order') {

            const path = event.resource;
            const httpMethod = event.httpMethod;
            const body = JSON.parse(event.body);

            console.log('POST Event:', JSON.stringify(event));
            console.log('POST Path:', path);
            console.log('POST Method:', httpMethod);
            console.log('POST Body:', body);

            const { id, mealType, quantity, date } = body.data;

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

            await dynamoDB.put(params).promise();
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ message: 'Record created successfully' })
            };
        }

        return {
            statusCode: 404,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Not found',
                path: path,
                method: httpMethod
            })
        };
    } catch (error) {
        console.log('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Internal server error',
                error: error.message,
                path: path,
                method: httpMethod
            })
        };
    }
};