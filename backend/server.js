const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const youthRoutes = require('./youth/youthRoutes'); 


const app = express();
const PORT = 3000;
const DB_PATH = path.resolve(__dirname, '../public/assets/data/youthdb.json');
const dirPath = path.dirname(DB_PATH);

app.use(cors());
app.use(bodyParser.json());
app.use('/youth', youthRoutes);

if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, '[]', 'utf8');
    console.log('Initialized youthdb.json with an empty array.');
}

app.get('/', (req, res) => {
    res.send('Welcome to the Backend Server! Use POST /submit to save data.');
});

app.post('/submit', (req, res) => {
    const newFormData = req.body;

    fs.readFile(DB_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the database file:', err);
            return res.status(500).send('Error reading database file');
        }

        let db = [];
        try {
            db = JSON.parse(data || '[]');
        } catch (parseError) {
            console.error('Error parsing JSON data:', parseError);
            return res.status(500).send('Database file is corrupted');
        }

        db.push(newFormData);

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
