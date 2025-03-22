// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/volleyball-app')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Import routes
const eventsRoutes = require('./routes/events');

// Use routes
app.use('/api/events', eventsRoutes);

// Import initial data if database is empty
const Event = require('./models/Event');
const importInitialData = async () => {
  try {
    const count = await Event.countDocuments();
    if (count === 0) {
      console.log('Database empty, importing initial data...');
      const volleyballData = JSON.parse(
        fs.readFileSync(path.join(__dirname, 'volleyball_sessions.json'), 'utf8')
      );
      await Event.insertMany(volleyballData);
      console.log(`Imported ${volleyballData.length} events successfully`);
    } else {
      console.log(`Database already contains ${count} events`);
    }
  } catch (err) {
    console.error('Error importing initial data:', err);
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  importInitialData();
});