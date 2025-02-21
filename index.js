const express = require("express");

const app = express();
app.use(express.json()); 

const extractNumbers = (data) => {
    return data.map(obj => {
        return {
            ...obj,
            extractedNumbers: obj.value.match(/\d+/g)?.map(Number) || []
        };
    });
};
app.get("/", (req, res) => {
    res.send("API is working!");
});

// API Endpoint
app.post("/extract-numbers", (req, res) => {
    try {
        const { data } = req.body;
        if (!Array.isArray(data)) {
            return res.status(400).json({ error: "Invalid input format" });
        }

        const result = extractNumbers(data);
        res.json({ extractedData: result });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
