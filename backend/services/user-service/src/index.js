const express = require('express');
const cors = require('cors');
const app = express();
const port = 3004; // 3004 for user

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: `user Service is running` });
});

app.listen(port, () => {
    console.log(`user Service running on port ${port}`);
});
