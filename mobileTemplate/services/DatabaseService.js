// services/DatabaseService.js
import * as SQLite from "expo-sqlite";
import volleyballSessions from "../assets/data/volleyball_sessions.json";

class DatabaseService {
  constructor() {
    this.db = SQLite.openDatabase("volleyball.db");
    this.initialized = false;
  }

  // Initialize the database with tables and seed data
  async initialize() {
    if (this.initialized) return;

    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          // Create tables
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS venues (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            venue_type TEXT CHECK (venue_type IN ('Indoor', 'Outdoor', 'Beach'))
          );`
          );

          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS levels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
          );`
          );

          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
          );`
          );

          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id TEXT UNIQUE,
            title TEXT NOT NULL,
            location_id INTEGER,
            event_link TEXT,
            category_id INTEGER,
            level_id INTEGER,
            ages TEXT,
            openings INTEGER,
            status TEXT CHECK (status IN ('Open', 'Full', 'Cancelled')),
            event_date TEXT,
            event_time TEXT,
            fee TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (location_id) REFERENCES venues(id),
            FOREIGN KEY (category_id) REFERENCES categories(id),
            FOREIGN KEY (level_id) REFERENCES levels(id)
          );`
          );

          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS user_registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            session_id INTEGER NOT NULL,
            registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions(id),
            UNIQUE(user_id, session_id)
          );`
          );
        },
        (error) => {
          console.error("Error creating database schema:", error);
          reject(error);
        },
        async () => {
          // Import data after creating tables
          await this.importData();
          this.initialized = true;
          resolve();
        }
      );
    });
  }

  // Import volleyball sessions data
  async importData() {
    if (!volleyballSessions || !volleyballSessions.length) {
      console.error("No volleyball sessions data found");
      return;
    }

    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          // First, check if we already have data
          tx.executeSql(
            "SELECT COUNT(*) as count FROM sessions;",
            [],
            (_, { rows }) => {
              const { count } = rows.item(0);

              // Only import if no data exists
              if (count === 0) {
                // Process venues
                const venues = [
                  ...new Set(
                    volleyballSessions.map((session) => session.location)
                  ),
                ];
                venues.forEach((venue) => {
                  tx.executeSql(
                    "INSERT INTO venues (name, venue_type) VALUES (?, ?);",
                    [venue, "Indoor"] // Assuming Indoor as default, update as needed
                  );
                });

                // Process levels
                const levels = [
                  ...new Set(
                    volleyballSessions.map((session) => session.level)
                  ),
                ];
                levels.forEach((level) => {
                  tx.executeSql("INSERT INTO levels (name) VALUES (?);", [
                    level,
                  ]);
                });

                // Process categories
                const categories = [
                  ...new Set(
                    volleyballSessions.map((session) => session.category)
                  ),
                ];
                categories.forEach((category) => {
                  tx.executeSql("INSERT INTO categories (name) VALUES (?);", [
                    category,
                  ]);
                });

                // Process sessions (need to get IDs from related tables)
                volleyballSessions.forEach((session) => {
                  // Get venue ID
                  tx.executeSql(
                    "SELECT id FROM venues WHERE name = ?;",
                    [session.location],
                    (_, { rows: venueRows }) => {
                      if (venueRows.length > 0) {
                        const venueId = venueRows.item(0).id;

                        // Get level ID
                        tx.executeSql(
                          "SELECT id FROM levels WHERE name = ?;",
                          [session.level],
                          (_, { rows: levelRows }) => {
                            if (levelRows.length > 0) {
                              const levelId = levelRows.item(0).id;

                              // Get category ID
                              tx.executeSql(
                                "SELECT id FROM categories WHERE name = ?;",
                                [session.category],
                                (_, { rows: categoryRows }) => {
                                  if (categoryRows.length > 0) {
                                    const categoryId = categoryRows.item(0).id;

                                    // Insert session
                                    tx.executeSql(
                                      `INSERT INTO sessions (
                                      event_id, title, location_id, event_link, 
                                      category_id, level_id, ages, openings, 
                                      status, event_date, event_time, fee
                                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                                      [
                                        session.eventID,
                                        session.title,
                                        venueId,
                                        session.eventLink,
                                        categoryId,
                                        levelId,
                                        session.ages,
                                        parseInt(session.openings) || 0,
                                        session.status,
                                        session.eventDate,
                                        session.eventTime,
                                        session.fee,
                                      ]
                                    );
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                });
              }
            },
            (error) => {
              console.error("Error checking sessions count:", error);
              reject(error);
            }
          );
        },
        (error) => {
          console.error("Error importing data:", error);
          reject(error);
        },
        () => {
          console.log("Data import completed successfully");
          resolve();
        }
      );
    });
  }

  // Get all sessions with related data
  async getAllSessions() {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `SELECT 
            s.id, s.event_id as eventID, s.title, v.name as location, 
            s.event_link as eventLink, v.venue_type as venueType, 
            c.name as category, l.name as level, s.ages, 
            s.openings, s.status, s.event_date as eventDate, 
            s.event_time as eventTime, s.fee
          FROM sessions s
          JOIN venues v ON s.location_id = v.id
          JOIN categories c ON s.category_id = c.id
          JOIN levels l ON s.level_id = l.id
          ORDER BY s.event_date;`,
          [],
          (_, { rows }) => {
            const sessions = [];
            for (let i = 0; i < rows.length; i++) {
              sessions.push(rows.item(i));
            }
            resolve(sessions);
          },
          (error) => {
            console.error("Error getting all sessions:", error);
            reject(error);
          }
        );
      });
    });
  }

  // Get featured sessions (equivalent to getFeaturedItems in BackendService)
  async getFeaturedSessions() {
    // Get sessions with upcoming dates, ordered by date
    return new Promise((resolve, reject) => {
      const today = new Date().toISOString().split("T")[0];

      this.db.transaction((tx) => {
        tx.executeSql(
          `SELECT 
            s.id, s.event_id as eventID, s.title, v.name as location, 
            s.event_link as eventLink, v.venue_type as venueType, 
            c.name as category, l.name as level, s.ages, 
            s.openings, s.status, s.event_date as eventDate, 
            s.event_time as eventTime, s.fee
          FROM sessions s
          JOIN venues v ON s.location_id = v.id
          JOIN categories c ON s.category_id = c.id
          JOIN levels l ON s.level_id = l.id
          WHERE s.status = 'Open'
          ORDER BY s.event_date
          LIMIT 5;`,
          [],
          (_, { rows }) => {
            const sessions = [];
            for (let i = 0; i < rows.length; i++) {
              sessions.push(rows.item(i));
            }
            resolve(sessions);
          },
          (error) => {
            console.error("Error getting featured sessions:", error);
            reject(error);
          }
        );
      });
    });
  }

  // Get session by ID
  async getSessionById(id) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `SELECT 
            s.id, s.event_id as eventID, s.title, v.name as location, 
            s.event_link as eventLink, v.venue_type as venueType, 
            c.name as category, l.name as level, s.ages, 
            s.openings, s.status, s.event_date as eventDate, 
            s.event_time as eventTime, s.fee
          FROM sessions s
          JOIN venues v ON s.location_id = v.id
          JOIN categories c ON s.category_id = c.id
          JOIN levels l ON s.level_id = l.id
          WHERE s.id = ?;`,
          [id],
          (_, { rows }) => {
            if (rows.length > 0) {
              resolve(rows.item(0));
            } else {
              resolve(null);
            }
          },
          (error) => {
            console.error("Error getting session by ID:", error);
            reject(error);
          }
        );
      });
    });
  }

  // Search sessions
  async searchSessions(query) {
    return new Promise((resolve, reject) => {
      const searchTerm = `%${query}%`;

      this.db.transaction((tx) => {
        tx.executeSql(
          `SELECT 
            s.id, s.event_id as eventID, s.title, v.name as location, 
            s.event_link as eventLink, v.venue_type as venueType, 
            c.name as category, l.name as level, s.ages, 
            s.openings, s.status, s.event_date as eventDate, 
            s.event_time as eventTime, s.fee
          FROM sessions s
          JOIN venues v ON s.location_id = v.id
          JOIN categories c ON s.category_id = c.id
          JOIN levels l ON s.level_id = l.id
          WHERE 
            s.title LIKE ? OR
            v.name LIKE ? OR
            c.name LIKE ? OR
            l.name LIKE ? OR
            s.ages LIKE ?;`,
          [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm],
          (_, { rows }) => {
            const sessions = [];
            for (let i = 0; i < rows.length; i++) {
              sessions.push(rows.item(i));
            }
            resolve(sessions);
          },
          (error) => {
            console.error("Error searching sessions:", error);
            reject(error);
          }
        );
      });
    });
  }

  // Filter sessions by category
  async getSessionsByCategory(category) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `SELECT 
            s.id, s.event_id as eventID, s.title, v.name as location, 
            s.event_link as eventLink, v.venue_type as venueType, 
            c.name as category, l.name as level, s.ages, 
            s.openings, s.status, s.event_date as eventDate, 
            s.event_time as eventTime, s.fee
          FROM sessions s
          JOIN venues v ON s.location_id = v.id
          JOIN categories c ON s.category_id = c.id
          JOIN levels l ON s.level_id = l.id
          WHERE c.name = ?;`,
          [category],
          (_, { rows }) => {
            const sessions = [];
            for (let i = 0; i < rows.length; i++) {
              sessions.push(rows.item(i));
            }
            resolve(sessions);
          },
          (error) => {
            console.error("Error getting sessions by category:", error);
            reject(error);
          }
        );
      });
    });
  }

  // Filter sessions by level
  async getSessionsByLevel(level) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `SELECT 
            s.id, s.event_id as eventID, s.title, v.name as location, 
            s.event_link as eventLink, v.venue_type as venueType, 
            c.name as category, l.name as level, s.ages, 
            s.openings, s.status, s.event_date as eventDate, 
            s.event_time as eventTime, s.fee
          FROM sessions s
          JOIN venues v ON s.location_id = v.id
          JOIN categories c ON s.category_id = c.id
          JOIN levels l ON s.level_id = l.id
          WHERE l.name = ?;`,
          [level],
          (_, { rows }) => {
            const sessions = [];
            for (let i = 0; i < rows.length; i++) {
              sessions.push(rows.item(i));
            }
            resolve(sessions);
          },
          (error) => {
            console.error("Error getting sessions by level:", error);
            reject(error);
          }
        );
      });
    });
  }

  // Join a session (register user)
  async joinSession(sessionId, userId) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        // First check if openings > 0
        tx.executeSql(
          "SELECT openings, status FROM sessions WHERE id = ?;",
          [sessionId],
          (_, { rows }) => {
            if (rows.length > 0) {
              const session = rows.item(0);
              if (session.status === "Full" || session.openings <= 0) {
                reject(new Error("Session is already full"));
                return;
              }

              // Add user registration
              tx.executeSql(
                "INSERT INTO user_registrations (user_id, session_id) VALUES (?, ?);",
                [userId, sessionId],
                (_, insertResult) => {
                  if (insertResult.rowsAffected > 0) {
                    // Update openings
                    const newOpenings = Math.max(0, session.openings - 1);
                    const newStatus = newOpenings === 0 ? "Full" : "Open";

                    tx.executeSql(
                      "UPDATE sessions SET openings = ?, status = ? WHERE id = ?;",
                      [newOpenings, newStatus, sessionId],
                      (_, updateResult) => {
                        if (updateResult.rowsAffected > 0) {
                          resolve(true);
                        } else {
                          reject(new Error("Failed to update session"));
                        }
                      }
                    );
                  } else {
                    reject(new Error("Failed to register user"));
                  }
                },
                (error) => {
                  // Handle case where user is already registered
                  if (error.message.includes("UNIQUE constraint failed")) {
                    reject(
                      new Error("User already registered for this session")
                    );
                  } else {
                    reject(error);
                  }
                }
              );
            } else {
              reject(new Error("Session not found"));
            }
          },
          (error) => {
            console.error("Error checking session status:", error);
            reject(error);
          }
        );
      });
    });
  }

  // Leave a session (unregister user)
  async leaveSession(sessionId, userId) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        // First check if user is registered
        tx.executeSql(
          "SELECT * FROM user_registrations WHERE user_id = ? AND session_id = ?;",
          [userId, sessionId],
          (_, { rows }) => {
            if (rows.length > 0) {
              // Remove user registration
              tx.executeSql(
                "DELETE FROM user_registrations WHERE user_id = ? AND session_id = ?;",
                [userId, sessionId],
                (_, deleteResult) => {
                  if (deleteResult.rowsAffected > 0) {
                    // Update openings
                    tx.executeSql(
                      "SELECT openings FROM sessions WHERE id = ?;",
                      [sessionId],
                      (_, { rows: sessionRows }) => {
                        if (sessionRows.length > 0) {
                          const session = sessionRows.item(0);
                          const newOpenings = session.openings + 1;

                          tx.executeSql(
                            "UPDATE sessions SET openings = ?, status = ? WHERE id = ?;",
                            [newOpenings, "Open", sessionId],
                            (_, updateResult) => {
                              if (updateResult.rowsAffected > 0) {
                                resolve(true);
                              } else {
                                reject(new Error("Failed to update session"));
                              }
                            }
                          );
                        }
                      }
                    );
                  } else {
                    reject(new Error("Failed to unregister user"));
                  }
                }
              );
            } else {
              reject(new Error("User not registered for this session"));
            }
          }
        );
      });
    });
  }

  // Get registered sessions for a user
  async getUserSessions(userId) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `SELECT 
            s.id, s.event_id as eventID, s.title, v.name as location, 
            s.event_link as eventLink, v.venue_type as venueType, 
            c.name as category, l.name as level, s.ages, 
            s.openings, s.status, s.event_date as eventDate, 
            s.event_time as eventTime, s.fee,
            ur.registration_date
          FROM sessions s
          JOIN venues v ON s.location_id = v.id
          JOIN categories c ON s.category_id = c.id
          JOIN levels l ON s.level_id = l.id
          JOIN user_registrations ur ON s.id = ur.session_id
          WHERE ur.user_id = ?
          ORDER BY s.event_date;`,
          [userId],
          (_, { rows }) => {
            const sessions = [];
            for (let i = 0; i < rows.length; i++) {
              sessions.push(rows.item(i));
            }
            resolve(sessions);
          },
          (error) => {
            console.error("Error getting user sessions:", error);
            reject(error);
          }
        );
      });
    });
  }

  // Add a new session (for admins)
  async addSession(sessionData) {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          // First, ensure venue exists or create it
          tx.executeSql(
            "SELECT id FROM venues WHERE name = ?;",
            [sessionData.location],
            (_, { rows: venueRows }) => {
              let venueId;

              if (venueRows.length > 0) {
                venueId = venueRows.item(0).id;
                processLevel();
              } else {
                // Create new venue
                tx.executeSql(
                  "INSERT INTO venues (name, venue_type) VALUES (?, ?);",
                  [sessionData.location, sessionData.venueType || "Indoor"],
                  (_, { insertId }) => {
                    venueId = insertId;
                    processLevel();
                  }
                );
              }

              // Process level
              function processLevel() {
                tx.executeSql(
                  "SELECT id FROM levels WHERE name = ?;",
                  [sessionData.level],
                  (_, { rows: levelRows }) => {
                    let levelId;

                    if (levelRows.length > 0) {
                      levelId = levelRows.item(0).id;
                      processCategory();
                    } else {
                      // Create new level
                      tx.executeSql(
                        "INSERT INTO levels (name) VALUES (?);",
                        [sessionData.level],
                        (_, { insertId }) => {
                          levelId = insertId;
                          processCategory();
                        }
                      );
                    }

                    // Process category
                    function processCategory() {
                      tx.executeSql(
                        "SELECT id FROM categories WHERE name = ?;",
                        [sessionData.category],
                        (_, { rows: categoryRows }) => {
                          let categoryId;

                          if (categoryRows.length > 0) {
                            categoryId = categoryRows.item(0).id;
                            insertSession();
                          } else {
                            // Create new category
                            tx.executeSql(
                              "INSERT INTO categories (name) VALUES (?);",
                              [sessionData.category],
                              (_, { insertId }) => {
                                categoryId = insertId;
                                insertSession();
                              }
                            );
                          }

                          // Finally insert the session
                          function insertSession() {
                            tx.executeSql(
                              `INSERT INTO sessions (
                              event_id, title, location_id, event_link, 
                              category_id, level_id, ages, openings, 
                              status, event_date, event_time, fee
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                              [
                                sessionData.eventID || `#${Date.now()}`,
                                sessionData.title,
                                venueId,
                                sessionData.eventLink || "",
                                categoryId,
                                levelId,
                                sessionData.ages || "",
                                parseInt(sessionData.openings) || 0,
                                sessionData.status || "Open",
                                sessionData.eventDate,
                                sessionData.eventTime,
                                sessionData.fee || "Free",
                              ],
                              (_, { insertId }) => {
                                // Get the full session data to return
                                tx.executeSql(
                                  `SELECT 
                                  s.id, s.event_id as eventID, s.title, v.name as location, 
                                  s.event_link as eventLink, v.venue_type as venueType, 
                                  c.name as category, l.name as level, s.ages, 
                                  s.openings, s.status, s.event_date as eventDate, 
                                  s.event_time as eventTime, s.fee
                                FROM sessions s
                                JOIN venues v ON s.location_id = v.id
                                JOIN categories c ON s.category_id = c.id
                                JOIN levels l ON s.level_id = l.id
                                WHERE s.id = ?;`,
                                  [insertId],
                                  (_, { rows }) => {
                                    if (rows.length > 0) {
                                      resolve(rows.item(0));
                                    } else {
                                      resolve({ id: insertId });
                                    }
                                  }
                                );
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        },
        (error) => {
          console.error("Error adding session:", error);
          reject(error);
        }
      );
    });
  }

  // Create a new event
  static async createEvent(event) {
    try {
      const db = await this.getDBConnection();
      const { eventDate, eventTime, location, description, dayOfWeek } = event;
      
      const result = await db.execute(
        `INSERT INTO events (eventDate, eventTime, location, description, dayOfWeek) 
         VALUES (?, ?, ?, ?, ?)`,
        [eventDate, eventTime, location, description, dayOfWeek]
      );
      
      return result.insertId;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  // Update an existing event
  static async updateEvent(id, event) {
    try {
      const db = await this.getDBConnection();
      const { eventDate, eventTime, location, description, dayOfWeek } = event;
      
      await db.execute(
        `UPDATE events 
         SET eventDate = ?, eventTime = ?, location = ?, description = ?, dayOfWeek = ?
         WHERE id = ?`,
        [eventDate, eventTime, location, description, dayOfWeek, id]
      );
      
      return true;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  // Get all events
  static async getAllEvents() {
    try {
      const db = await this.getDBConnection();
      const [rows] = await db.execute(
        `SELECT id, eventDate, eventTime, location, description, dayOfWeek 
         FROM events 
         ORDER BY eventDate ASC, eventTime ASC`
      );
      
      return rows;
    } catch (error) {
      console.error("Error getting all events:", error);
      throw error;
    }
  }

  // Get event by ID
  static async getEventById(id) {
    try {
      const db = await this.getDBConnection();
      const [rows] = await db.execute(
        `SELECT id, eventDate, eventTime, location, description, dayOfWeek 
         FROM events 
         WHERE id = ?`,
        [id]
      );
      
      return rows[0];
    } catch (error) {
      console.error("Error getting event by ID:", error);
      throw error;
    }
  }

  // Delete event by ID
  static async deleteEvent(id) {
    try {
      const db = await this.getDBConnection();
      await db.execute(
        `DELETE FROM events 
         WHERE id = ?`,
        [id]
      );
      
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }

  // Initialize database
  static async initDB() {
    try {
      const db = await this.getDBConnection();
      
      // Create events table if it doesn't exist
      await db.execute(`
        CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          eventDate TEXT NOT NULL,
          eventTime TEXT NOT NULL,
          location TEXT NOT NULL,
          description TEXT,
          dayOfWeek TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }
}

export default new DatabaseService();
