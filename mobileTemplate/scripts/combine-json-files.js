/**
 * This script combines all drop-in sessions JSON files into a single volleyball_sessions.json file.
 * Run this script with Node.js: node scripts/combine-json-files.js
 */

const fs = require('fs');
const path = require('path');

// Read the JSON files
const burnabySessions = JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/data/burnaby-drop-in-sessions.json'), 'utf8'));
const newwestSessions = JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/data/newwest-drop-in-sessions.json'), 'utf8'));

// Combine the sessions
const combinedData = [...burnabySessions, ...newwestSessions];

// Sort by eventDate
combinedData.sort((a, b) => {
  try {
    // Parse dates for comparison
    const dateA = a.eventDate.includes(",")
      ? new Date(a.eventDate.split(",")[0])
      : new Date(a.eventDate);
    const dateB = b.eventDate.includes(",")
      ? new Date(b.eventDate.split(",")[0])
      : new Date(b.eventDate);

    // First sort by date
    const dateComparison = dateA - dateB;
    if (dateComparison !== 0) return dateComparison;

    // If dates are equal, sort by time
    const timeA = a.eventTime ? a.eventTime.split(" - ")[0] : "";
    const timeB = b.eventTime ? b.eventTime.split(" - ")[0] : "";
    return timeA.localeCompare(timeB);
  } catch (error) {
    console.error("Error sorting dates:", error);
    return 0;
  }
});

// Write the combined and sorted data to volleyball_sessions.json
fs.writeFileSync(
  path.join(__dirname, '../assets/data/volleyball_sessions.json'),
  JSON.stringify(combinedData, null, 2)
);

console.log(`Combined ${burnabySessions.length} Burnaby sessions and ${newwestSessions.length} New Westminster sessions.`);
console.log(`Total sessions: ${combinedData.length}`); 