/**
 * This script combines all drop-in sessions JSON files into a single volleyball_sessions.json file.
 * Run this script with Node.js: node scripts/combine-json-files.js
 */

const fs = require('fs');
const path = require('path');

// Define the paths
const dataDir = path.join(__dirname, '..', 'assets', 'data');
const outputFile = path.join(dataDir, 'volleyball_sessions.json');

// Get all JSON files in the data directory
const files = fs.readdirSync(dataDir)
  .filter(file => file.endsWith('drop-in-sessions.json'));
console.log(`Found ${files.length} JSON files to combine: ${files.join(', ')}`);

// Combine all the data
let combinedData = [];

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    
    // Add source information to each item
    const sourceName = path.basename(file, '.json');
    const itemsWithSource = jsonData.map(item => ({
      ...item,
      source: sourceName
    }));
    
    combinedData = [...combinedData, ...itemsWithSource];
    console.log(`Added ${itemsWithSource.length} items from ${file}`);
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

// Sort all sessions by ascending date
console.log('Sorting sessions by ascending date...');
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

// Write the combined data to the output file
try {
  fs.writeFileSync(outputFile, JSON.stringify(combinedData, null, 2));
  console.log(`Successfully created ${outputFile} with ${combinedData.length} total items, sorted by date`);
} catch (error) {
  console.error('Error writing output file:', error.message);
} 