// services/BackendService.js

// Update this to your computer's local IP address and the port your server is running on
// Do not use 'localhost' as the mobile device won't resolve it correctly
const API_URL = 'http://192.168.1.66:3000/api'; // Replace with your actual local IP

class BackendService {
  static async initialize(forceReset = false) {
    console.log("Initializing backend service with API...");
    try {
      // Check if the API is reachable
      const response = await fetch(`${API_URL}/events`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      console.log("Backend service initialized successfully!");
      return true;
    } catch (error) {
      console.error("Error connecting to API:", error);
      throw error;
    }
  }

  static async getAllItems() {
    try {
      const response = await fetch(`${API_URL}/events`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting all items:", error);
      return [];
    }
  }

  static async getFeaturedItems() {
    try {
      const response = await fetch(`${API_URL}/events/featured/upcoming`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting featured items:", error);
      return [];
    }
  }

  static async getRecentItems() {
    try {
      // Alternatively, you can create a specific endpoint for recent items
      const response = await fetch(`${API_URL}/events`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      // Sort by createdAt field, descending
      return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error("Error getting recent items:", error);
      return [];
    }
  }

  static async getItem(id) {
    try {
      const response = await fetch(`${API_URL}/events/${id}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting item:", error);
      return null;
    }
  }

  static async getRelatedItems(category, level, currentItemId) {
    try {
      const response = await fetch(`${API_URL}/events/related?category=${category}&level=${level}&exclude=${currentItemId}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting related items:", error);
      return [];
    }
  }

  static async searchEvents(query) {
    try {
      const response = await fetch(`${API_URL}/events/search/${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error searching events:", error);
      return [];
    }
  }

  // Added method for adding a new event
  static async addItem(event) {
    try {
      console.log("Sending POST request to:", `${API_URL}/events`);
      console.log("With event data:", JSON.stringify(event));
      
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      
      console.log("Server response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Server response data:", data);
      return data;
    } catch (error) {
      console.error("Error adding item:", error);
      throw error;
    }
  }

  // Keep other methods like joinEvent, etc.
  // You would implement these as needed, making the appropriate API calls
}

export default BackendService;