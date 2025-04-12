// services/BackendService.js
import * as SQLite from "expo-sqlite"; // For Expo
// If you're not using Expo, use this instead:
// import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from "@react-native-async-storage/async-storage";
import volleyballSessions from "../assets/data/volleyball_sessions.json";

class BackendService {
  // Initial sample volleyball events - keep as fallback
  static initialItems = [
    {
      id: "1",
      title: "Saturday Beach Volleyball Tournament",
      description:
        "Join us for a fun beach volleyball tournament at Sunset Beach. All levels welcome! Teams will be formed on-site. Bring water and sunscreen. Tournament starts at 10 AM and will run until approximately 4 PM.",
      category: "Tournament",
      level: "Intermediate",
      location: "Sunset Beach, Main Court",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      dueDate: "Mar 20, 2025",
      eventDate: "Mar 20, 2025, 10:00 AM",
      attachments: 2,
      status: "Open",
      maxParticipants: 36,
      currentParticipants: 24,
      hostName: "Volleyball Club NYC",
      fee: "$15 per person",
      eventLink: "https://www.volleyballclubnyc.com/tournaments",
    },
    // ... other items from your original service
  ];

  static async initialize(forceReset = false) {
    try {
      console.log("Initializing backend service...");

      // IMPORTANT: Force clear AsyncStorage data to use JSON file data instead
      try {
        await AsyncStorage.removeItem("volleyballEvents");
        console.log("Cleared existing AsyncStorage data to use JSON file data");
      } catch (asyncError) {
        console.warn("Error clearing AsyncStorage:", asyncError);
      }

      // Try to use SQLite
      try {
        this.db = SQLite.openDatabase("volleyball.db");
        console.log("SQLite opened successfully");
        await this.initializeWithSQLite(forceReset);
        return;
      } catch (sqliteError) {
        console.warn(
          "SQLite initialization failed, falling back to AsyncStorage:",
          sqliteError
        );
        // SQLite failed, use AsyncStorage as fallback
        await this.initializeWithAsyncStorage(true); // Force reset to true
      }
    } catch (error) {
      console.error("Error initializing backend:", error);
      throw error;
    }
  }

  // Initialize with SQLite database
  static async initializeWithSQLite(forceReset) {
    console.log("Initializing with SQLite...");
    try {
      // Create tables
      await this.createTables();

      // Check if data exists
      const count = await this.getSessionCount();
      console.log(`Found ${count} existing sessions in database`);

      if (count === 0 || forceReset) {
        console.log("Importing volleyball sessions data...");
        if (forceReset) {
          await this.clearTables();
        }
        await this.importVolleyballSessions();
      }

      console.log("SQLite initialization complete!");
      this.useAsyncStorage = false;
    } catch (error) {
      console.error("Error initializing SQLite:", error);
      throw error;
    }
  }

  // Initialize with AsyncStorage as fallback
  // Also modify this method to always import from JSON file, not from AsyncStorage
  static async initializeWithAsyncStorage(forceReset) {
    console.log("Initializing with AsyncStorage...");
    try {
      // Always reset the data from the JSON file
      await AsyncStorage.setItem(
        "volleyballEvents",
        JSON.stringify(volleyballSessions)
      );
      console.log("Imported volleyball data to AsyncStorage from JSON file");

      this.useAsyncStorage = true;
    } catch (error) {
      console.error("Error initializing AsyncStorage:", error);
      throw error;
    }
  }

  // CREATE TABLES AND IMPORT DATA METHODS (SQLite) ----------

  // Create database tables
  static createTables() {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          // Venues table
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS venues (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            venue_type TEXT
          );`
          );

          // Categories table
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
          );`
          );

          // Levels table
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS levels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
          );`
          );

          // Sessions table
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id TEXT UNIQUE,
            title TEXT NOT NULL,
            venue_id INTEGER,
            event_link TEXT,
            category_id INTEGER,
            level_id INTEGER,
            ages TEXT,
            openings INTEGER,
            status TEXT,
            event_date TEXT,
            event_time TEXT,
            fee TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (venue_id) REFERENCES venues(id),
            FOREIGN KEY (category_id) REFERENCES categories(id),
            FOREIGN KEY (level_id) REFERENCES levels(id)
          );`
          );

          // Participants table (for users who have joined sessions)
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS participants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER,
            user_id INTEGER,
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions(id),
            UNIQUE(session_id, user_id)
          );`
          );
        },
        (error) => {
          console.error("Error creating tables:", error);
          reject(error);
        },
        () => {
          console.log("Tables created successfully");
          resolve();
        }
      );
    });
  }

  // Clear all tables
  static clearTables() {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          tx.executeSql("DELETE FROM participants;");
          tx.executeSql("DELETE FROM sessions;");
          tx.executeSql("DELETE FROM levels;");
          tx.executeSql("DELETE FROM categories;");
          tx.executeSql("DELETE FROM venues;");
        },
        (error) => {
          console.error("Error clearing tables:", error);
          reject(error);
        },
        () => {
          console.log("Tables cleared successfully");
          resolve();
        }
      );
    });
  }

  // Get count of sessions
  static getSessionCount() {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          "SELECT COUNT(*) as count FROM sessions;",
          [],
          (_, { rows }) => {
            resolve(rows.item(0).count);
          },
          (_, error) => {
            console.error("Error getting session count:", error);
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // Import volleyball sessions from JSON data
  static async importVolleyballSessions() {
    // Extract unique venues, categories, and levels
    const venues = [
      ...new Set(volleyballSessions.map((session) => session.location)),
    ];
    const categories = [
      ...new Set(volleyballSessions.map((session) => session.category)),
    ];
    const levels = [
      ...new Set(volleyballSessions.map((session) => session.level)),
    ];

    // Insert venues
    const venueMap = {};
    for (const venue of venues) {
      const venueId = await this.insertVenue(venue, this.getVenueType(venue));
      venueMap[venue] = venueId;
    }

    // Insert categories
    const categoryMap = {};
    for (const category of categories) {
      const categoryId = await this.insertCategory(category);
      categoryMap[category] = categoryId;
    }

    // Insert levels
    const levelMap = {};
    for (const level of levels) {
      const levelId = await this.insertLevel(level);
      levelMap[level] = levelId;
    }

    // Insert sessions
    for (const session of volleyballSessions) {
      await this.insertSession({
        eventId: session.eventID,
        title: session.title,
        venueId: venueMap[session.location],
        eventLink: session.eventLink,
        categoryId: categoryMap[session.category],
        levelId: levelMap[session.level],
        ages: session.ages,
        openings: parseInt(session.openings),
        status: session.status,
        eventDate: session.eventDate,
        eventTime: session.eventTime,
        fee: session.fee,
      });
    }

    console.log(`Imported ${volleyballSessions.length} volleyball sessions.`);
  }

  // Helper methods for inserting data
  static insertVenue(name, venueType) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO venues (name, venue_type) VALUES (?, ?);",
          [name, venueType],
          (_, { insertId }) => {
            resolve(insertId);
          },
          (_, error) => {
            console.error("Error inserting venue:", error);
            reject(error);
            return false;
          }
        );
      });
    });
  }

  static insertCategory(name) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO categories (name) VALUES (?);",
          [name],
          (_, { insertId }) => {
            resolve(insertId);
          },
          (_, error) => {
            console.error("Error inserting category:", error);
            reject(error);
            return false;
          }
        );
      });
    });
  }

  static insertLevel(name) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO levels (name) VALUES (?);",
          [name],
          (_, { insertId }) => {
            resolve(insertId);
          },
          (_, error) => {
            console.error("Error inserting level:", error);
            reject(error);
            return false;
          }
        );
      });
    });
  }

  static insertSession(session) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO sessions (
            event_id, title, venue_id, event_link, category_id, level_id, 
            ages, openings, status, event_date, event_time, fee
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            session.eventId,
            session.title,
            session.venueId,
            session.eventLink,
            session.categoryId,
            session.levelId,
            session.ages,
            session.openings,
            session.status,
            session.eventDate,
            session.eventTime,
            session.fee,
          ],
          (_, { insertId }) => {
            resolve(insertId);
          },
          (_, error) => {
            console.error("Error inserting session:", error);
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // Determine venue type based on location name
  static getVenueType(location) {
    const lowerLocation = location.toLowerCase();
    if (lowerLocation.includes("beach") || lowerLocation.includes("sand")) {
      return "Beach";
    } else if (
      lowerLocation.includes("park") ||
      lowerLocation.includes("field")
    ) {
      return "Outdoor";
    } else {
      return "Indoor";
    }
  }

  // API METHODS - COMPATIBLE WITH BOTH SQLITE AND ASYNCSTORAGE ----------

  // Get all events
  static async getAllItems() {
    // Use appropriate method based on storage type
    if (this.useAsyncStorage) {
      return this.getAllItemsFromAsyncStorage();
    } else {
      return this.getAllItemsFromSQLite();
    }
  }

  // Get all items from AsyncStorage
  static async getAllItemsFromAsyncStorage() {
    try {
      const items = await AsyncStorage.getItem("volleyballEvents");
      const parsedItems = items ? JSON.parse(items) : [];
      
      // Convert to standard format with safe date handling
      return parsedItems.map(item => ({
        ...item,
        id: item.eventID || item.id,
        maxParticipants: parseInt(item.openings || 0) || 0,
        currentParticipants: 0, // Not tracked in AsyncStorage
        status: item.status || "Open",
        // For safety, ensure date fields are never undefined
        dueDate: item.eventDate || item.dueDate || "Date not specified", 
        eventDate: item.eventDate || item.dueDate || "Date not specified",
        eventTime: item.eventTime || "Time not specified"
      }));
    } catch (error) {
      console.error("Error getting all items from AsyncStorage:", error);
      return [];
    }
  }

  // Get all items from SQLite
  static async getAllItemsFromSQLite() {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `SELECT 
            s.id, s.event_id as eventID, s.title, v.name as location, 
            v.venue_type as venueType, s.event_link as eventLink,
            c.name as category, l.name as level, s.ages,
            s.openings, s.status, s.event_date as eventDate,
            s.event_time as eventTime, s.fee,
            s.created_at as createdAt,
            (SELECT COUNT(*) FROM participants WHERE session_id = s.id) as currentParticipants
          FROM sessions s
          JOIN venues v ON s.venue_id = v.id
          JOIN categories c ON s.category_id = c.id
          JOIN levels l ON s.level_id = l.id
          ORDER BY s.event_date;`,
          [],
          (_, { rows }) => {
            // Convert rows to array of objects
            const items = [];
            for (let i = 0; i < rows.length; i++) {
              // Add dueDate field as alias of eventDate for backward compatibility
              const item = rows.item(i);
              items.push({
                ...item,
                id: item.id.toString(), // Ensure ID is a string for compatibility
                maxParticipants: parseInt(item.openings || 0) + parseInt(item.currentParticipants || 0),
                dueDate: item.eventDate, // Add this line for backwards compatibility
                // For safety, ensure date fields are never undefined
                eventDate: item.eventDate || "Date not specified",
                eventTime: item.eventTime || "Time not specified"
              });
            }
            resolve(items);
          },
          (_, error) => {
            console.error('Error getting all items from SQLite:', error);
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // Get featured events (upcoming events)
  static async getFeaturedItems() {
    try {
      const today = new Date();
      const allItems = await this.getAllItems();

      // Filter for upcoming events
      return allItems
        .filter((item) => {
          if (!item.eventDate) return false;

          let eventDate;
          try {
            // Try to extract date part if it contains a comma (like "March 18, 2025")
            eventDate = item.eventDate.includes(",")
              ? new Date(item.eventDate.split(",")[0])
              : new Date(item.eventDate);

            return !isNaN(eventDate) && eventDate >= today;
          } catch (error) {
            console.error("Error parsing date:", item.eventDate, error);
            return false;
          }
        })
        .sort((a, b) => {
          try {
            const dateA = a.eventDate.includes(",")
              ? new Date(a.eventDate.split(",")[0])
              : new Date(a.eventDate);

            const dateB = b.eventDate.includes(",")
              ? new Date(b.eventDate.split(",")[0])
              : new Date(b.eventDate);

            return dateA - dateB;
          } catch (error) {
            return 0; // Default to no change in order if there's an error
          }
        })
        .slice(0, 5); // Return the 5 closest upcoming events
    } catch (error) {
      console.error("Error getting featured items:", error);
      return [];
    }
  }

  // Get recent events
  static async getRecentItems() {
    try {
      const allItems = await this.getAllItems();

      // Sort by createdAt if available, otherwise by eventDate
      return allItems.sort((a, b) => {
        try {
          let dateA, dateB;

          if (a.createdAt) {
            dateA = new Date(a.createdAt);
          } else if (a.eventDate) {
            dateA = a.eventDate.includes(",")
              ? new Date(a.eventDate.split(",")[0])
              : new Date(a.eventDate);
          } else {
            dateA = new Date(0); // Default to epoch if no date available
          }

          if (b.createdAt) {
            dateB = new Date(b.createdAt);
          } else if (b.eventDate) {
            dateB = b.eventDate.includes(",")
              ? new Date(b.eventDate.split(",")[0])
              : new Date(b.eventDate);
          } else {
            dateB = new Date(0); // Default to epoch if no date available
          }

          return dateB - dateA; // Sort descending (newest first)
        } catch (error) {
          return 0; // Default to no change in order if there's an error
        }
      });
    } catch (error) {
      console.error("Error getting recent items:", error);
      return [];
    }
  }

  // Get a single event by id
  static async getItem(id) {
    try {
      const allItems = await this.getAllItems();
      return (
        allItems.find((item) => item.id.toString() === id.toString()) || null
      );
    } catch (error) {
      console.error("Error getting item:", error);
      return null;
    }
  }

  // Get related events (same category, level)
  static async getRelatedItems(category, level, currentItemId) {
    try {
      const allItems = await this.getAllItems();

      // Filter for related items
      return allItems
        .filter(
          (item) =>
            (item.category === category || item.level === level) &&
            item.id.toString() !== currentItemId.toString()
        )
        .slice(0, 3); // Return at most 3 related events
    } catch (error) {
      console.error("Error getting related items:", error);
      return [];
    }
  }

  // Join an event (increment participant count)
  static async joinEvent(eventId) {
    try {
      const event = await this.getItem(eventId);

      if (!event) {
        throw new Error("Event not found");
      }

      if (event.status === "Full" || parseInt(event.openings) <= 0) {
        throw new Error("Event is already full");
      }

      // If using AsyncStorage, update in memory
      if (this.useAsyncStorage) {
        const allItems = await this.getAllItems();
        const updatedItems = allItems.map((item) => {
          if (item.id.toString() === eventId.toString()) {
            const openings = parseInt(item.openings || 0) - 1;
            const currentParticipants =
              parseInt(item.currentParticipants || 0) + 1;
            return {
              ...item,
              openings,
              currentParticipants,
              status: openings <= 0 ? "Full" : "Open",
            };
          }
          return item;
        });

        await AsyncStorage.setItem(
          "volleyballEvents",
          JSON.stringify(updatedItems)
        );
        return this.getItem(eventId);
      }
      // Otherwise use SQLite
      else {
        // Simulate joining the event - in a real app, you'd use the user ID
        const userId = 1; // Temporary mock user ID

        // Insert participant
        await this.executeQuery(
          "INSERT INTO participants (session_id, user_id) VALUES (?, ?);",
          [eventId, userId]
        );

        // Update openings and status if needed
        const newOpenings = Math.max(0, parseInt(event.openings) - 1);
        const newStatus = newOpenings === 0 ? "Full" : "Open";

        await this.executeQuery(
          "UPDATE sessions SET openings = ?, status = ? WHERE id = ?;",
          [newOpenings, newStatus, eventId]
        );

        return this.getItem(eventId);
      }
    } catch (error) {
      console.error("Error joining event:", error);
      throw error;
    }
  }

  // Leave an event (decrement participant count)
  static async leaveEvent(eventId) {
    try {
      const event = await this.getItem(eventId);

      if (!event) {
        throw new Error("Event not found");
      }

      // If using AsyncStorage, update in memory
      if (this.useAsyncStorage) {
        const allItems = await this.getAllItems();
        const updatedItems = allItems.map((item) => {
          if (item.id.toString() === eventId.toString()) {
            const openings = parseInt(item.openings || 0) + 1;
            const currentParticipants = Math.max(
              0,
              parseInt(item.currentParticipants || 0) - 1
            );
            return {
              ...item,
              openings,
              currentParticipants,
              status: "Open",
            };
          }
          return item;
        });

        await AsyncStorage.setItem(
          "volleyballEvents",
          JSON.stringify(updatedItems)
        );
        return this.getItem(eventId);
      }
      // Otherwise use SQLite
      else {
        // Simulate leaving the event - in a real app, you'd use the user ID
        const userId = 1; // Temporary mock user ID

        // Remove participant
        await this.executeQuery(
          "DELETE FROM participants WHERE session_id = ? AND user_id = ?;",
          [eventId, userId]
        );

        // Update openings and status
        const newOpenings = parseInt(event.openings) + 1;

        await this.executeQuery(
          "UPDATE sessions SET openings = ?, status = ? WHERE id = ?;",
          [newOpenings, "Open", eventId]
        );

        return this.getItem(eventId);
      }
    } catch (error) {
      console.error("Error leaving event:", error);
      throw error;
    }
  }

  // Search events
  static async searchEvents(query) {
    try {
      const allItems = await this.getAllItems();
      const searchTerm = query.toLowerCase();

      return allItems.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(searchTerm)) ||
          (item.location && item.location.toLowerCase().includes(searchTerm)) ||
          (item.category && item.category.toLowerCase().includes(searchTerm)) ||
          (item.level && item.level.toLowerCase().includes(searchTerm)) ||
          (item.eventDate &&
            item.eventDate.toLowerCase().includes(searchTerm)) ||
          (item.ages && item.ages.toLowerCase().includes(searchTerm))
      );
    } catch (error) {
      console.error("Error searching events:", error);
      return [];
    }
  }

  // Helper method for executing SQLite queries
  static executeQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          sql,
          params,
          (_, { rows, insertId, rowsAffected }) => {
            // Convert rows to array if results exist
            if (rows) {
              const results = [];
              for (let i = 0; i < rows.length; i++) {
                results.push(rows.item(i));
              }
              resolve(results);
            } else if (insertId !== undefined) {
              // Return insert ID for insert operations
              resolve(insertId);
            } else {
              // Return rows affected for update/delete operations
              resolve(rowsAffected);
            }
          },
          (_, error) => {
            console.error("Error executing query:", sql, params, error);
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // Clear all stored data (both SQLite and AsyncStorage)
  static async clearAllData() {
    console.log("Clearing all stored volleyball data...");

    // Clear AsyncStorage
    try {
      await AsyncStorage.removeItem("volleyballEvents");
      console.log("Cleared AsyncStorage data");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }

    // Clear SQLite if available
    if (!this.useAsyncStorage && this.db) {
      try {
        await this.clearTables();
        console.log("Cleared SQLite tables");
      } catch (error) {
        console.error("Error clearing SQLite tables:", error);
      }
    }

    // Reset initialization flag
    this.initialized = false;

    console.log("All data cleared. You can now reinitialize the database.");

    // Return true to indicate success
    return true;
  }
}

export default BackendService;