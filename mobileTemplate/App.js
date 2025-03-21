// App.js
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchScreen from "./screens/SearchScreen";
import CreateItemScreen from "./screens/CreateItemScreen";
import ItemDetailScreen from "./screens/ItemDetailScreen";
import MyEventsScreen from "./screens/MyEventsScreen";
import MyTeamsScreen from "./screens/MyTeamsScreen";
import AchievementsScreen from "./screens/AchievementsScreen";
import CommunityFeedScreen from "./screens/CommunityFeedScreen";
import PostDetailScreen from "./screens/PostDetailScreen";
import PostCommentScreen from "./screens/PostCommentScreen";
import CreatePostScreen from "./screens/CreatePostScreen";
import BackendService from "./services/BackendService";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Theme colors
const THEME = {
  PRIMARY: "rgb(168, 38, 29)",
  SECONDARY: "#ffffff",
  BACKGROUND: "#f8f8f8",
  TEXT: "#333333",
};

function HomeStack() {
  const HomeStack = createStackNavigator();
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="CreateItem" component={CreateItemScreen} />
      <HomeStack.Screen name="ItemDetail" component={ItemDetailScreen} />
      
      {/* Add community-related screens */}
      <HomeStack.Screen name="CommunityFeed" component={CommunityFeedScreen} />
      <HomeStack.Screen name="PostDetail" component={PostDetailScreen} />
      <HomeStack.Screen name="PostComments" component={PostCommentScreen} />
      <HomeStack.Screen name="CreatePost" component={CreatePostScreen} />
    </HomeStack.Navigator>
  );
}

function ProfileStack() {
  const ProfileStack = createStackNavigator();
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen name="MyEvents" component={MyEventsScreen} />
      <ProfileStack.Screen name="MyTeams" component={MyTeamsScreen} />
      <ProfileStack.Screen name="Achievements" component={AchievementsScreen} />
    </ProfileStack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: THEME.PRIMARY,
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: THEME.SECONDARY,
          borderTopColor: "#e0e0e0",
        },
        headerStyle: {
          backgroundColor: THEME.PRIMARY,
        },
        headerTintColor: THEME.SECONDARY,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState(null);
  

  
  // Initialize database when app loads
  useEffect(() => {
    initializeDatabase();
  }, []);
  
  const initializeDatabase = async () => {
    setIsDbInitialized(false);
    setInitializationError(null);
    
    try {
      console.log("Initializing backend service...");
      await BackendService.initialize();
      console.log("Backend service initialized successfully!");
      setIsDbInitialized(true);
    } catch (error) {
      console.error("Error initializing database:", error);
      setInitializationError(error.message);
      // Still set as initialized so user can see error and retry
      setIsDbInitialized(true);
    }
  };

  // Show loading screen while database initializes
  if (!isDbInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.PRIMARY} />
        <Text style={styles.loadingText}>Loading volleyball data...</Text>
      </View>
    );
  }
  
  // Show error screen if initialization failed
  if (initializationError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={50} color={THEME.PRIMARY} />
        <Text style={styles.errorTitle}>Database Error</Text>
        <Text style={styles.errorMessage}>{initializationError}</Text>
        <Text style={styles.errorHint}>
          Try resetting the database using the button below.
        </Text>
        
        
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoggedIn ? (
          <Stack.Screen
            name="Login"
            options={{
              headerShown: false,
            }}
          >
            {(props) => (
              <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
      
      
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.BACKGROUND,
  },
  loadingText: {
    marginTop: 20,
    color: THEME.TEXT,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: THEME.BACKGROUND,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME.PRIMARY,
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: THEME.TEXT,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  devToolsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});