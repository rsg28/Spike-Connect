// screens/HomeScreen.js
import {React, useEffect, useState} from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import BackendService from "../services/BackendService";

const HomeScreen = ({ navigation }) => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize backend and load data when component mounts
    const loadData = async () => {
      setIsLoading(true);
      try {
        await BackendService.initialize();
        const featured = await BackendService.getFeaturedItems();
        const recent = await BackendService.getRecentItems();

        setFeaturedItems(featured);
        setRecentItems(recent);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Refresh data when screen comes into focus
    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  // Calculate the relative time for display
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} week${
      Math.floor(diffDays / 7) > 1 ? "s" : ""
    } ago`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Featured Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <FlatList
            horizontal
            data={featuredItems}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.featuredCard}
                onPress={() =>
                  navigation.navigate("ItemDetail", { itemId: item.id })
                }
              >
                <View style={styles.featuredImageContainer}>
                  <View
                    style={[
                      styles.featuredImage,
                      { backgroundColor: "rgba(168, 38, 29, 0.2)" },
                    ]}
                  >
                    <Ionicons name="star" size={30} color="rgb(168, 38, 29)" />
                  </View>
                </View>
                <Text style={styles.featuredTitle}>{item.title}</Text>
                <Text style={styles.featuredDescription}>
                  {item.description.substring(0, 50)}...
                </Text>
                <TouchableOpacity
                  style={styles.featuredButton}
                  onPress={() =>
                    navigation.navigate("ItemDetail", { itemId: item.id })
                  }
                >
                  <Text style={styles.featuredButtonText}>View Details</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* Recent Activity Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentItems.slice(0, 4).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.recentItem}
              onPress={() =>
                navigation.navigate("ItemDetail", { itemId: item.id })
              }
            >
              <View style={styles.recentItemIcon}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color="rgb(168, 38, 29)"
                />
              </View>
              <View style={styles.recentItemContent}>
                <Text style={styles.recentItemTitle}>{item.title}</Text>
                <Text style={styles.recentItemDate}>
                  {getRelativeTime(item.createdAt)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate("CreateItem")}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons
                  name="add-circle"
                  size={24}
                  color="rgb(168, 38, 29)"
                />
              </View>
              <Text style={styles.quickActionText}>Add New</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate("Search")}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="search" size={24} color="rgb(168, 38, 29)" />
              </View>
              <Text style={styles.quickActionText}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={styles.quickActionIcon}>
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color="rgb(168, 38, 29)"
                />
              </View>
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContent: {
    padding: 16,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  notificationButton: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  featuredList: {
    paddingRight: 8,
  },
  featuredCard: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredImageContainer: {
    marginBottom: 12,
  },
  featuredImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  featuredDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  featuredButton: {
    backgroundColor: "rgb(168, 38, 29)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  featuredButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  recentItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(168, 38, 29, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  recentItemDate: {
    fontSize: 12,
    color: "#999",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(168, 38, 29, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
});

export default HomeScreen;
