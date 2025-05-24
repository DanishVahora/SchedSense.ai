const express = require('express');
const cors = require('cors');
const IntentRecognizer = require('./intentRecognizer');
const app = express();
const port = 3001;

app.use(cors()); // Allow frontend requests
app.use(express.json());

const intentRecognizer = new IntentRecognizer();

app.post('/extract-intent', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const intent = await intentRecognizer.recognizeIntent(text);
        res.json(intent);
    } catch (error) {
        res.status(500).json({ error: 'Intent recognition failed', details: error.message });
    }
});

app.get('/', (req, res) => {
    res.json({ message: 'AI Agent Service is running' });
});

app.listen(port, () => {
    console.log(`AI Agent Service running on port ${port}`);
});
