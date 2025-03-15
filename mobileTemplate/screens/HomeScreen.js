// screens/HomeScreen.js
import {React, useEffect, useState, useRef} from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import BackendService from "../services/BackendService";

const HomeScreen = ({ navigation }) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [communityPosts, setCommunityPosts] = useState([]); // Add state for community posts
  const likeAnimations = useRef({}).current;

  useEffect(() => {
    // Initialize backend and load data when component mounts
    const loadData = async () => {
      setIsLoading(true);
      try {
        await BackendService.initialize();
        const featured = await BackendService.getFeaturedItems();
        const recent = await BackendService.getRecentItems();

        setUpcomingEvents(featured);
        setRecentEvents(recent);
        
        // Initialize community posts with mock data
        setCommunityPosts(mockPosts);
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

  // Mock data for posts until backend is implemented
  const mockPosts = [
    {
      id: "post1",
      user: {
        id: "user1",
        name: "Sarah Johnson",
        avatar: null,
      },
      content: "Looking for 2 more players for our beach volleyball game this Saturday at Sunset Beach. Intermediate level. Comment if interested!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      likes: 12,
      comments: 5,
      isLiked: false,
    },
    {
      id: "post2",
      user: {
        id: "user2",
        name: "Mike Thompson",
        avatar: null,
      },
      content: "Just finished an amazing tournament at Central Park! Our team made it to the semi-finals. Proud of everyone's hard work and improvement! 🏐 #VolleyballLife",
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
      likes: 24,
      comments: 8,
      isLiked: true,
    },
    {
      id: "post3",
      user: {
        id: "user3",
        name: "Coach Emily",
        avatar: null,
      },
      content: "New drills for improving your serve accuracy! Check out today's practice video on my profile. Tag someone who needs to see this!",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      likes: 45,
      comments: 13,
      isLiked: false,
    },
  ];

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

  // Handle post interactions with enhanced animation
  const handleLikePost = (postId) => {
    // Create animation value if it doesn't exist for this post
    if (!likeAnimations[postId]) {
      likeAnimations[postId] = new Animated.Value(1);
    }
    
    // Update the post state
    setCommunityPosts(
      communityPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );

    // Find the post and check if it's now liked
    const post = communityPosts.find(p => p.id === postId);
    const isNowLiked = post ? !post.isLiked : false;
    
    // Run heart beat animation
    Animated.sequence([
      Animated.timing(likeAnimations[postId], {
        toValue: 1.5,
        duration: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimations[postId], {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // In a real app, you would also call the API to update the like status
  };

  const handleCommentPost = (postId) => {
    navigation.navigate("PostComments", { postId });
  };

  const handleSharePost = (postId) => {
    // Implement share functionality 
    console.log("Share post", postId);
  };

  // Render a single post item with animated like button
  const renderPostItem = ({ item }) => {
    // Initialize animation value for this post if it doesn't exist
    if (!likeAnimations[item.id]) {
      likeAnimations[item.id] = new Animated.Value(1);
    }

    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <View style={styles.postUserAvatar}>
            {item.user.avatar ? (
              <Image source={{ uri: item.user.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.defaultAvatar}>
                <Text style={styles.avatarInitial}>
                  {item.user.name.charAt(0)}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.postUserInfo}>
            <Text style={styles.postUserName}>{item.user.name}</Text>
            <Text style={styles.postTimestamp}>{getRelativeTime(item.timestamp)}</Text>
          </View>
          <TouchableOpacity style={styles.postOptions}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={() => navigation.navigate("PostDetail", { post: item })}
        >
          <Text style={styles.postContent}>{item.content}</Text>
        </TouchableOpacity>

        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.postAction}
            onPress={() => handleLikePost(item.id)}
            activeOpacity={0.7}
          >
            <Animated.View style={{ 
              transform: [{ scale: likeAnimations[item.id] }],
              // Add extra effects for liked state
              shadowColor: item.isLiked ? "rgb(168, 38, 29)" : "transparent",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: item.isLiked ? 0.5 : 0,
              shadowRadius: item.isLiked ? 10 : 0,
            }}>
              <Ionicons
                name={item.isLiked ? "heart" : "heart-outline"}
                size={22}
                color={item.isLiked ? "rgb(168, 38, 29)" : "#666"}
              />
            </Animated.View>
            <Text style={[
              styles.postActionText,
              item.isLiked && styles.likedText
            ]}>{item.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.postAction}
            onPress={() => handleCommentPost(item.id)}
          >
            <Ionicons name="chatbubble-outline" size={22} color="#666" />
            <Text style={styles.postActionText}>{item.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.postAction}
            onPress={() => handleSharePost(item.id)}
          >
            <Ionicons name="share-outline" size={22} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  // Community posts component to be rendered inside the main FlatList
  const CommunityPostsSection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Community Feed</Text>
        <TouchableOpacity 
          style={styles.newPostButton}
          onPress={() => navigation.navigate("CreatePost")}
        >
          <Text style={styles.newPostButtonText}>New Post</Text>
          <Ionicons name="add-circle-outline" size={18} color="rgb(168, 38, 29)" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={communityPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPostItem}
        contentContainerStyle={styles.communityPostsList}
      />
      
      <TouchableOpacity 
        style={styles.viewAllButton}
        onPress={() => navigation.navigate("CommunityFeed")}
      >
        <Text style={styles.viewAllButtonText}>View All Posts</Text>
        <Ionicons name="chevron-forward" size={16} color="rgb(168, 38, 29)" />
      </TouchableOpacity>
    </View>
  );
  
  // Featured section component for the main FlatList
  const FeaturedSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Featured</Text>
      <FlatList
        horizontal
        data={upcomingEvents}
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
  );
  
  // Recent activity section for the main FlatList
  const RecentActivitySection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {recentEvents.slice(0, 4).map((item) => (
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
  );
  
  // Quick actions section for the main FlatList
  const QuickActionsSection = () => (
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
  );
  
  // Define the sections for our main content
  const sections = [
    { id: 'header', component: () => (
      <View style={styles.headerSection}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    )},
    { id: 'community', component: CommunityPostsSection },
    { id: 'featured', component: FeaturedSection },
    { id: 'recent', component: RecentActivitySection },
    { id: 'actions', component: QuickActionsSection },
  ];
  
  // Render each section
  const renderSection = ({ item }) => item.component();

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.scrollContent}
      />
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

  // Post styles
  postContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 300, // Fixed width for horizontal scrolling
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  communityPostsList: {
    paddingRight: 8,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  postUserAvatar: {
    marginRight: 10,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgb(168, 38, 29)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  postTimestamp: {
    fontSize: 12,
    color: "#999",
  },
  postOptions: {
    padding: 5,
  },
  postContent: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  postAction: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  postActionText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  likedText: {
    color: "rgb(168, 38, 29)",
    fontWeight: "500",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgb(168, 38, 29)",
    marginRight: 6,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  newPostButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  newPostButtonText: {
    color: "rgb(168, 38, 29)",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
});

export default HomeScreen;