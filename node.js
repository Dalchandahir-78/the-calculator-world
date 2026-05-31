const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const FILE_NAME = 'db.json';

// File check logic
if (!fs.existsSync(FILE_NAME)) {
    fs.writeFileSync(FILE_NAME, JSON.stringify({ calculations: [] }, null, 2));
}

app.post('/save', (req, res) => {
    try {
        const newEntry = req.body;
        const fileData = JSON.parse(fs.readFileSync(FILE_NAME));
        
        fileData.calculations.push({
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            expression: newEntry.expression,
            result: newEntry.result
        });

        fs.writeFileSync(FILE_NAME, JSON.stringify(fileData, null, 2));
        console.log("Data Saved to JSON!"); 
        res.status(200).json({ status: "success", message: "History Saved!" }); // Yeh response hai!
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).json({ status: "error", message: "Failed to save" });
    }
});

app.listen(3000, () => {
    console.log("Server chalu: http://localhost:3000");
});