const express = require("express");

const app = express();
app.use(express.json()); // Middleware to parse JSON

// Function to extract numbers from strings
const extractNumbers = (data) => {
    return data.map(obj => {
        return {
            ...obj,
            extractedNumbers: obj.value.match(/\d+/g)?.map(Number) || []
        };
    });
};

// API Endpoint
app.post("/extract-numbers", (req, res) => {
    try {
        const { data } = req.body; // Expecting { "data": [ { "value": "abc123xyz45" }, ... ] }
        if (!Array.isArray(data)) {
            return res.status(400).json({ error: "Invalid input format" });
        }

        const result = extractNumbers(data);
        res.json({ extractedData: result });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
