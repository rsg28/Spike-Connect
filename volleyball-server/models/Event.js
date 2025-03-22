// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventID: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventTime: { type: String },
  fee: { type: String, default: 'Free' },
  openings: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Open', 'Full', 'Cancelled'],
    default: 'Open'
  },
  venueType: { type: String },
  ages: { type: String },
  eventLink: { type: String },
  description: { type: String },
  currentParticipants: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);