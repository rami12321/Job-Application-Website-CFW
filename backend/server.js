const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'youthdb.json');

// Enable CORS for cross-origin requests
app.use(cors());

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Ensure the youthdb.json file exists and is initialized
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, '[]', 'utf8'); // Initialize with an empty array
    console.log('Initialized youthdb.json with an empty array.');
}

// GET route for the root path
app.get('/', (req, res) => {
    res.send('Welcome to the Backend Server! Use POST /submit to save data.');
});

// POST endpoint to handle form submissions
app.post('/submit', (req, res) => {
    const newFormData = req.body;

    // Read the existing data from youthdb.json
    fs.readFile(DB_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the database file:', err);
            return res.status(500).send('Error reading database file');
        }

        let db = [];
        try {
            db = JSON.parse(data || '[]'); // Parse existing data or fallback to empty array
        } catch (parseError) {
            console.error('Error parsing JSON data:', parseError);
            return res.status(500).send('Database file is corrupted');
        }

        // Add the new form data to the database
        db.push(newFormData);

        // Write updated data back to youthdb.json
        fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), (err) => {
            if (err) {
                console.error('Error writing to the database file:', err);
                return res.status(500).send('Error saving data');
            }

            console.log('New form data saved successfully.');
            res.status(200).send({ message: 'Form data saved successfully!' });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
