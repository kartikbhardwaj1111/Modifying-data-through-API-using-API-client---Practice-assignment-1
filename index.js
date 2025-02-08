const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const MenuItem = require('./schema'); // Importing the schema

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("Error connecting to MongoDB Atlas:", err));

// Routes

// POST /menu: Create a new menu item
app.post('/menu', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        if (!name || !price) {
            return res.status(400).json({ message: "Name and price are required" });
        }

        const newItem = new MenuItem({ name, description, price });
        await newItem.save();
        res.status(201).json({ message: "Menu item created successfully", item: newItem });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// GET /menu: Fetch all menu items
app.get('/menu', async (req, res) => {
    try {
        const items = await MenuItem.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on  http://localhost:${PORT}`);
});
