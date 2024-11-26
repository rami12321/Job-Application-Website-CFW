const fs = require('fs');
const path = require('path');
const youth = require('../models/youthModel');

const DB_PATH = path.join(__dirname, '../data/youths.json');

const readDatabase = () => {
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, '[]', 'utf8');
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '[]');
};

const writeDatabase = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};

module.exports = {
    getAllyouths: (req, res) => {
        try {
            const youths = readDatabase();
            res.status(200).json(youths);
        } catch (err) {
            res.status(500).send('Error reading youths.');
        }
    },

    getyouthById: (req, res) => {
        const { id } = req.params;
        try {
            const youths = readDatabase();
            const youth = youths.find((u) => u.id === id);
            if (!youth) return res.status(404).send('youth not found.');
            res.status(200).json(youth);
        } catch (err) {
            res.status(500).send('Error fetching youth.');
        }
    },

    createyouth: (req, res) => {
        const newyouth = new youth(req.body);
        try {
            const youths = readDatabase();
            youths.push(newyouth);
            writeDatabase(youths);
            res.status(201).send('youth added successfully.');
        } catch (err) {
            res.status(500).send('Error adding youth.');
        }
    },

    updateyouth: (req, res) => {
        const { id } = req.params;
        try {
            const youths = readDatabase();
            const index = youths.findIndex((u) => u.id === id);
            if (index === -1) return res.status(404).send('youth not found.');
            youths[index] = { ...youths[index], ...req.body };
            writeDatabase(youths);
            res.status(200).send('youth updated successfully.');
        } catch (err) {
            res.status(500).send('Error updating youth.');
        }
    },

    deleteyouth: (req, res) => {
        const { id } = req.params;
        try {
            const youths = readDatabase();
            const updatedyouths = youths.filter((u) => u.id !== id);
            writeDatabase(updatedyouths);
            res.status(200).send('youth deleted successfully.');
        } catch (err) {
            res.status(500).send('Error deleting youth.');
        }
    },
};
