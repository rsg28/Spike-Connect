// services/BackendService.js
import AsyncStorage from "@react-native-async-storage/async-storage";

class BackendService {
  // Initial sample volleyball events
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
      priority: "High",
      dueDate: "Mar 20, 2025",
      eventDate: "Mar 20, 2025, 10:00 AM",
      attachments: 2,
      status: "Open",
      maxParticipants: 36,
      currentParticipants: 24,
      hostName: "Volleyball Club NYC",
      fee: "$15 per person",
      link: "https://ca.apm.activecommunities.com/burnaby/Activity_Search/reserve-in-advance-volleyball-all-ages/49665?locale=en-US",
      ages: "6yrs+",
      time_range: "Thu 3:45 PM - 5:45 PM"
    },
    {
      id: "2",
      title: "Wednesday Night Indoor League",
      description:
        "Weekly indoor volleyball league for advanced players. Games run from 7 PM to 10 PM. League runs for 8 weeks with playoffs in the final week. Teams of 6 required, individual registrations also accepted.",
      category: "League",
      level: "Advanced",
      location: "Metro Sports Center, Court 3",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      priority: "Medium",
      dueDate: "Mar 25, 2025",
      eventDate: "Every Wednesday, 7:00 PM",
      attachments: 1,
      status: "Open",
      maxParticipants: 48,
      currentParticipants: 36,
      hostName: "City Volleyball Association",
      fee: "$120 per team",
      link: "https://ca.apm.activecommunities.com/burnaby/Activity_Search/reserve-in-advance-volleyball-adult-intermediate/62108?locale=en-US",
      ages: "19yrs+",
      time_range: "Tue 7:45 PM - 9:45 PM"
    },
    {
      id: "3",
      title: "Beginners Volleyball Clinic",
      description:
        "Learn the basics of volleyball in this beginner-friendly clinic. Our experienced coaches will teach proper techniques for serving, passing, setting, and basic game rules. All equipment provided.",
      category: "Training",
      level: "Beginner",
      location: "Community Center Gym",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      priority: "Low",
      dueDate: "Apr 5, 2025",
      eventDate: "Apr 5, 2025, 1:00 PM",
      attachments: 0,
      status: "Open",
      maxParticipants: 20,
      currentParticipants: 8,
      hostName: "Volleyball Fundamentals",
      fee: "$25 per person",
      link: "https://ca.apm.activecommunities.com/burnaby/Activity_Search/reserve-in-advance-volleyball-adult/58679?locale=en-US",
      ages: "19yrs+",
      time_range: "Sat 1:30 PM - 3:30 PM"
    },
    {
      id: "4",
      title: "Co-Ed 4v4 Sand Tournament",
      description:
        "Join our monthly co-ed 4v4 sand volleyball tournament. Teams must have at least one player of each gender on the court at all times. Double elimination format with prizes for top teams!",
      category: "Tournament",
      level: "All Levels",
      location: "Sandy Shores Volleyball Complex",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      priority: "Medium",
      dueDate: "Mar 30, 2025",
      eventDate: "Mar 30, 2025, 9:00 AM",
      attachments: 1,
      status: "Open",
      maxParticipants: 64,
      currentParticipants: 40,
      hostName: "Sandy Shores VC",
      fee: "$80 per team",
      link: "https://ca.apm.activecommunities.com/burnaby/Activity_Search/reserve-in-advance-volleyball-adult/50974?locale=en-US",
      ages: "19yrs+",
      time_range: "Sun 5:30 PM - 7:30 PM"
    },
    {
      id: "5",
      title: "Casual Volleyball at Bonsor Recreation Complex",
      description: "Join us for a fun, no-pressure volleyball session at Bonsor Recreation Complex. All skill levels welcome! This is a great opportunity to practice your skills, meet new people, and enjoy the game without the pressure of competition.",
      category: "Casual",
      level: "All Levels",
      location: "Bonsor Recreation Complex",
      createdAt: "2025-03-12T22:55:53.412Z",
      priority: "Medium",
      dueDate: "Mar 21, 2025",
      eventDate: "Mar 21, 2025, 5:20 PM",
      attachments: 0,
      status: "Open",
      maxParticipants: 42,
      currentParticipants: 15,
      hostName: "Community Volleyball Club",
      fee: "Free"
    },
    {
      id: "6",
      title: "Casual Volleyball at Christine Sinclair Community Centre",
      description: "Join us for a fun, no-pressure volleyball session at Christine Sinclair Community Centre. All skill levels welcome! This is a great opportunity to practice your skills, meet new people, and enjoy the game without the pressure of competition.",
      category: "Casual",
      level: "Beginner",
      location: "Christine Sinclair Community Centre",
      createdAt: "2025-03-10T22:55:53.412Z",
      priority: "Low",
      dueDate: "Mar 17, 2025",
      eventDate: "Mar 17, 2025, 1:45 PM",
      attachments: 1,
      status: "Open",
      maxParticipants: 20,
      currentParticipants: 8,
      hostName: "Recreational Sports Group",
      fee: "$5 per person"
    },
    {
      id: "7",
      title: "Casual Volleyball at Edmonds Community Centre",
      description: "Join us for a fun, no-pressure volleyball session at Edmonds Community Centre. All skill levels welcome! This is a great opportunity to practice your skills, meet new people, and enjoy the game without the pressure of competition.",
      category: "Casual",
      level: "All Levels",
      location: "Edmonds Community Centre",
      createdAt: "2025-03-14T22:55:53.412Z",
      priority: "Medium",
      dueDate: "Mar 25, 2025",
      eventDate: "Mar 25, 2025, 7:30 PM",
      attachments: 0,
      status: "Open",
      maxParticipants: 30,
      currentParticipants: 12,
      hostName: "Volleyball Enthusiasts",
      fee: "Free"
    }
  ];

  // Initialize the storage with sample data if empty
  static async initialize(forceReset = false) {
    try {
      // If forceReset is true, reset the data regardless of what's in storage
      if (forceReset) {
        await AsyncStorage.setItem("volleyballEvents", JSON.stringify(this.initialItems));
        return;
      }
      
      const items = await AsyncStorage.getItem("volleyballEvents");
      if (items === null) {
        await AsyncStorage.setItem("volleyballEvents", JSON.stringify(this.initialItems));
      }
    } catch (error) {
      console.error("Error initializing backend:", error);
    }
  }

  // Get all events
  static async getAllItems() {
    try {
      const items = await AsyncStorage.getItem("volleyballEvents");
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Error getting events:", error);
      return [];
    }
  }

  // Get featured events (upcoming events)
  static async getFeaturedItems() {
    const allItems = await this.getAllItems();
    // Sort by date (closest events first) and return
    return allItems
      .filter(item => new Date(item.dueDate) >= new Date()) // Only future events
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5); // Return the 5 closest upcoming events
  }

  // Get recent events
  static async getRecentItems() {
    const allItems = await this.getAllItems();
    return allItems.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  // Get a single event by id
  static async getItem(id) {
    try {
      const items = await this.getAllItems();
      return items.find((item) => item.id === id) || null;
    } catch (error) {
      console.error("Error getting event:", error);
      return null;
    }
  }

  // Add a new event
  static async addItem(item) {
    try {
      const items = await this.getAllItems();
      const newItem = {
        ...item,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: "Open",
        currentParticipants: 0,
      };

      const updatedItems = [...items, newItem];
      await AsyncStorage.setItem("volleyballEvents", JSON.stringify(updatedItems));
      return newItem;
    } catch (error) {
      console.error("Error adding event:", error);
      throw error;
    }
  }

  // Update an existing event
  static async updateItem(id, updatedData) {
    try {
      const items = await this.getAllItems();
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item
      );

      await AsyncStorage.setItem("volleyballEvents", JSON.stringify(updatedItems));
      return updatedItems.find((item) => item.id === id);
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  // Get related events (same category, level or location)
  static async getRelatedItems(category, level, currentItemId) {
    try {
      const items = await this.getAllItems();
      return items
        .filter(
          (item) => 
            (item.category === category || item.level === level) && 
            item.id !== currentItemId
        )
        .slice(0, 3); // Return at most 3 related events
    } catch (error) {
      console.error("Error getting related events:", error);
      return [];
    }
  }

  // Join an event (increment participant count)
  static async joinEvent(eventId, userData) {
    try {
      const event = await this.getItem(eventId);
      
      if (!event) {
        throw new Error("Event not found");
      }
      
      if (event.currentParticipants >= event.maxParticipants) {
        throw new Error("Event is already full");
      }
      
      const updatedEvent = {
        ...event,
        currentParticipants: event.currentParticipants + 1
      };
      
      return await this.updateItem(eventId, updatedEvent);
    } catch (error) {
      console.error("Error joining event:", error);
      throw error;
    }
  }

  // Leave an event (decrement participant count)
  static async leaveEvent(eventId, userId) {
    try {
      const event = await this.getItem(eventId);
      
      if (!event) {
        throw new Error("Event not found");
      }
      
      if (event.currentParticipants <= 0) {
        throw new Error("No participants to remove");
      }
      
      const updatedEvent = {
        ...event,
        currentParticipants: event.currentParticipants - 1
      };
      
      return await this.updateItem(eventId, updatedEvent);
    } catch (error) {
      console.error("Error leaving event:", error);
      throw error;
    }
  }

  // Search events by title, description, level, location, or age range
  static async searchEvents(query) {
    try {
      const items = await this.getAllItems();
      const lowercaseQuery = query.toLowerCase();
      
      return items.filter(
        item => 
          item.title.toLowerCase().includes(lowercaseQuery) ||
          item.description.toLowerCase().includes(lowercaseQuery) ||
          item.level.toLowerCase().includes(lowercaseQuery) ||
          item.location.toLowerCase().includes(lowercaseQuery) ||
          item.category.toLowerCase().includes(lowercaseQuery) ||
          (item.ages && item.ages.toLowerCase().includes(lowercaseQuery)) ||
          (item.time_range && item.time_range.toLowerCase().includes(lowercaseQuery))
      );
    } catch (error) {
      console.error("Error searching events:", error);
      return [];
    }
  }

  // Get events by level
  static async getEventsByLevel(level) {
    try {
      const items = await this.getAllItems();
      return items.filter(item => item.level === level);
    } catch (error) {
      console.error("Error getting events by level:", error);
      return [];
    }
  }

  // Get events by category (Tournament, League, Training, etc.)
  static async getEventsByCategory(category) {
    try {
      const items = await this.getAllItems();
      return items.filter(item => item.category === category);
    } catch (error) {
      console.error("Error getting events by category:", error);
      return [];
    }
  }
  
  // NEW: Get events by age group
  static async getEventsByAgeGroup(ageGroup) {
    try {
      const items = await this.getAllItems();
      return items.filter(item => 
        item.ages && item.ages.toLowerCase().includes(ageGroup.toLowerCase())
      );
    } catch (error) {
      console.error("Error getting events by age group:", error);
      return [];
    }
  }
  
  // NEW: Get events by time range
  static async getEventsByTimeOfDay(timeOfDay) {
    try {
      const items = await this.getAllItems();
      // timeOfDay can be 'morning', 'afternoon', 'evening'
      return items.filter(item => {
        if (!item.time_range) return false;
        
        const timeString = item.time_range.toLowerCase();
        if (timeOfDay === 'morning' && timeString.includes('am')) return true;
        if (timeOfDay === 'afternoon' && timeString.includes('pm') && 
            !timeString.includes('7') && !timeString.includes('8') && !timeString.includes('9')) return true;
        if (timeOfDay === 'evening' && 
            (timeString.includes('7 pm') || timeString.includes('8 pm') || timeString.includes('9 pm'))) return true;
        
        return false;
      });
    } catch (error) {
      console.error("Error getting events by time of day:", error);
      return [];
    }
  }
}

export default BackendService;