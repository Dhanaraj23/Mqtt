const express = require('express');
const mqtt = require('mqtt');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

let sensorData = {}; // Object to store data for multiple users

app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MQTT broker
const client = mqtt.connect('mqtt://localhost');

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('sensor/data');
});

client.on('message', (topic, message) => {
    if (topic === 'sensor/data') {
        try {
            const data = JSON.parse(message.toString());
            const { user, temperature } = data;

            // Store data for each user
            sensorData[user] = { temperature }; // Only store temperature now
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }
});

// Route to fetch sensor data for all users
app.get('/data', (req, res) => {
    res.json(sensorData);
});

// Route to get the list of users
app.get('/users', (req, res) => {
    res.json(Object.keys(sensorData)); // Send list of users
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
