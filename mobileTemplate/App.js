// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchScreen from "./screens/SearchScreen";
import CreateItemScreen from "./screens/CreateItemScreen";
import ItemDetailScreen from "./screens/ItemDetailScreen";

// Import community-related screens
import CommunityFeedScreen from "./screens/CommunityFeedScreen";
import PostDetailScreen from "./screens/PostDetailScreen";
import PostCommentScreen from "./screens/PostCommentScreen";
import CreatePostScreen from "./screens/CreatePostScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Theme colors
const THEME = {
  PRIMARY: "rgb(168, 38, 29)",
  SECONDARY: "#ffffff",
  BACKGROUND: "#f8f8f8",
  TEXT: "#333333",
};

// Then update your HomeStack function to include the ItemDetailScreen and community-related screens
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
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

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