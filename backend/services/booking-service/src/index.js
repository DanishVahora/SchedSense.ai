const express = require('express');
const cors = require('cors');
const app = express();
const port = 3002; // 3002 for booking

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: `Booking Service is running` });
});

app.listen(port, () => {
    console.log(`Booking Service running on port ${port}`);
});
