// services/BackendService.js
import AsyncStorage from "@react-native-async-storage/async-storage";

class BackendService {
  // Initial sample items
  static initialItems = [
    {
      id: "1",
      title: "Featured Item 1",
      description:
        "This is a detailed description of the featured item. It provides comprehensive information about the product, its features, benefits, and any other relevant details that might be useful for the user.",
      category: "Category A",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      priority: "High",
      dueDate: "Mar 20, 2025",
      attachments: 2,
      status: "In Progress",
    },
    {
      id: "2",
      title: "Featured Item 2",
      description:
        "Description for item 2. This product has unique qualities and is part of our premium collection.",
      category: "Category B",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      priority: "Medium",
      dueDate: "Mar 25, 2025",
      attachments: 1,
      status: "New",
    },
    {
      id: "3",
      title: "Featured Item 3",
      description:
        "Description for item 3. This is our most popular product with a variety of applications.",
      category: "Category A",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      priority: "Low",
      dueDate: "Apr 5, 2025",
      attachments: 0,
      status: "Resolved",
    },
  ];

  // Initialize the storage with sample data if empty
  static async initialize() {
    try {
      const items = await AsyncStorage.getItem("items");
      if (items === null) {
        await AsyncStorage.setItem("items", JSON.stringify(this.initialItems));
      }
    } catch (error) {
      console.error("Error initializing backend:", error);
    }
  }

  // Get all items
  static async getAllItems() {
    try {
      const items = await AsyncStorage.getItem("items");
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Error getting items:", error);
      return [];
    }
  }

  // Get featured items
  static async getFeaturedItems() {
    const allItems = await this.getAllItems();
    return allItems.slice(0, 3); // Just return the first 3 for featured
  }

  // Get recent items
  static async getRecentItems() {
    const allItems = await this.getAllItems();
    return allItems.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  // Get a single item by id
  static async getItem(id) {
    try {
      const items = await this.getAllItems();
      return items.find((item) => item.id === id) || null;
    } catch (error) {
      console.error("Error getting item:", error);
      return null;
    }
  }

  // Add a new item
  static async addItem(item) {
    try {
      const items = await this.getAllItems();
      const newItem = {
        ...item,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: "New",
      };

      const updatedItems = [...items, newItem];
      await AsyncStorage.setItem("items", JSON.stringify(updatedItems));
      return newItem;
    } catch (error) {
      console.error("Error adding item:", error);
      throw error;
    }
  }

  // Update an existing item
  static async updateItem(id, updatedData) {
    try {
      const items = await this.getAllItems();
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item
      );

      await AsyncStorage.setItem("items", JSON.stringify(updatedItems));
      return updatedItems.find((item) => item.id === id);
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  }

  // Get related items (basic implementation)
  static async getRelatedItems(categoryName, currentItemId) {
    try {
      const items = await this.getAllItems();
      return items
        .filter(
          (item) => item.category === categoryName && item.id !== currentItemId
        )
        .slice(0, 2); // Return at most 2 related items
    } catch (error) {
      console.error("Error getting related items:", error);
      return [];
    }
  }
}

export default BackendService;
