const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// Function to extract numbers from strings
const extractNumbers = (data) => {
    return data.map(obj => ({
        ...obj,
        extractedNumbers: obj.value.match(/\d+/g)?.map(Number) || []
    }));
};

// 🟢 GET Route - Check if API is working
app.get("/", (req, res) => {
    res.send("API is working! Upload a JSON file.");
});

// 🔵 POST Route - Upload JSON File & Process Data
app.post("/upload", upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = req.file.path;
        const rawData = fs.readFileSync(filePath, "utf8");
        const jsonData = JSON.parse(rawData);

        if (!Array.isArray(jsonData)) {
            return res.status(400).json({ error: "Invalid JSON format, expected an array of objects" });
        }

        const processedData = extractNumbers(jsonData);

        // Delete the uploaded file after processing
        fs.unlinkSync(filePath);

        res.json({ extractedData: processedData });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
