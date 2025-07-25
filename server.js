// server.js (Node.js backend)
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');



app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const AFRICASTALKING_API_KEY = 'atsk_666eb0bb76af5210868e0c3e18f772b1b056c9b31fb05bc51f6febee4248a8991f9fc538'; // your API key
const AFRICASTALKING_USERNAME = 'sandbox';

app.post('/send-sms', async (req, res) => {
  const { phoneNumber, message } = req.body;

  try {
    const response = await fetch('https://api.sandbox.africastalking.com/version1/messaging/bulk', {
      method: 'POST',
      headers: {
        'apiKey': AFRICASTALKING_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        username: AFRICASTALKING_USERNAME,
        phoneNumber, // Join the array of phone numbers into a comma-separated string
        message,
        senderId: '91941'
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send SMS', details: error.message });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
