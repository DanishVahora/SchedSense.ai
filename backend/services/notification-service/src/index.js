const express = require('express');
const cors = require('cors');
const app = express();
const port = 3003; // 3003 for notification
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: `notification Service is running` });
});

app.listen(port, () => {
    console.log(`notification Service running on port ${port}`);
});
