// server.js (Node.js backend)
const express = require('express');
const cors = require('cors');
// const fetch = require('node-fetch'); // Ensure you have neode-fetch installed
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const AFRICASTALKING_API_KEY = 'atsk_dffb66e3315ac6fce9e2f154d95a4556eb3eb3b9c2e39f47b2c8b6f4be41f1991e67a603'; // your API key
const AFRICASTALKING_USERNAME = 'sandbox';

app.post('/send-sms', async (req, res) => {
  const { phoneNumbers, message } = req.body;
  console.log('Received:', phoneNumbers, message);

  if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
    return res.status(400).json({ error: 'phoneNumbers must be a non-empty array' });
  }

  try {
    const response = await fetch('https://api.sandbox.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'apiKey': AFRICASTALKING_API_KEY, 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        username: AFRICASTALKING_USERNAME,
        to: phoneNumbers.join(','), // Join the array into a string
        message,
        senderId: '91941'
      }),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    res.status(response.ok ? 200 : 500).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send SMS', details: error.message });
  }
});


app.listen(3001, () => {
  console.log('Server is running on port 3001');
});



