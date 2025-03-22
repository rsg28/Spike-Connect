// routes/events.js
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findOne({ eventID: req.params.id });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get featured events (upcoming)
router.get("/featured/upcoming", async (req, res) => {
  try {
    const today = new Date();
    const events = await Event.find({
      status: "Open",
      eventDate: { $gte: today.toISOString().split("T")[0] },
    })
      .sort("eventDate")
      .limit(5);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search events
router.get("/search/:query", async (req, res) => {
  try {
    const searchTerm = req.params.query;
    const events = await Event.find({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { location: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } },
        { level: { $regex: searchTerm, $options: "i" } },
      ],
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const event = new Event(req.body);
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add related events endpoint
router.get("/related", async (req, res) => {
  try {
    const { category, level, exclude } = req.query;
    const events = await Event.find({
      $and: [
        { eventID: { $ne: exclude } },
        { $or: [{ category: category }, { level: level }] },
      ],
    }).limit(3);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add more routes as needed...

module.exports = router;
