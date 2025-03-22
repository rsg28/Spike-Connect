// screens/CommunityFeedScreen.js
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BackendService from "../services/BackendService";

const CommunityFeedScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    loadPosts();
    
    // Refresh when screen comes into focus
    const unsubscribe = navigation.addListener("focus", () => {
      loadPosts();
    });
    
    return unsubscribe;
  }, [navigation]);

  // Filter posts whenever searchQuery changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = posts.filter(
        post =>
          post.content.toLowerCase().includes(query) ||
          post.user.name.toLowerCase().includes(query)
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      // In a real app, fetch from backend
      // const fetchedPosts = await BackendService.getCommunityPosts();
      
      // For now, using mock data
      const fetchedPosts = generateMockPosts(15);
      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const handleLikePost = (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          }
        : post
    );
    setPosts(updatedPosts);
    // In a real app, call API to update like status
  };

  const handleCommentPost = (postId) => {
    navigation.navigate("PostComments", { postId });
  };

  const handleSharePost = (postId) => {
    console.log("Share post", postId);
    // Implement share functionality
  };

  const handlePostPress = (post) => {
    navigation.navigate("PostDetail", { post });
  };

  // Calculate the relative time for display
  const getRelativeTime = (dateString) => {
    if (!dateString) return "Date unknown";
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffMinutes < 1) return "Just now";
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return `${Math.floor(diffDays / 7)}w ago`;
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Date error";
    }
  };

  // Render a post item
  const renderPostItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.postContainer}
      onPress={() => handlePostPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.postHeader}>
        <View style={styles.postUserAvatar}>
          {item.user?.avatar ? (
            <Image source={{ uri: item.user.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.avatarInitial}>{item.user?.name?.charAt(0) || "?"}</Text>
            </View>
          )}
        </View>
        <View style={styles.postUserInfo}>
          <Text style={styles.postUserName}>{item.user?.name || "Unknown User"}</Text>
          <Text style={styles.postTimestamp}>{getRelativeTime(item.timestamp)}</Text>
        </View>
        <TouchableOpacity style={styles.postOptions}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <Text
        style={styles.postContent}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {item.content || "No content"}
      </Text>

      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.postAction}
          onPress={() => handleLikePost(item.id)}
        >
          <Ionicons
            name={item.isLiked ? "heart" : "heart-outline"}
            size={22}
            color={item.isLiked ? "rgb(168, 38, 29)" : "#666"}
          />
          <Text style={styles.postActionText}>{item.likes}</Text>
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
    </TouchableOpacity>
  );

  // Generate mock data
  const generateMockPosts = (count) => {
    const posts = [];
    const userNames = [
      "Sarah Johnson", "Mike Thompson", "Coach Emily", 
      "Alex Rodriguez", "Tina Williams", "James Wilson",
      "Olivia Parker", "Malik Davis", "Kathy Chen"
    ];
    
    const contents = [
      "Looking for 2 more players for our beach volleyball game this Saturday at Sunset Beach. Intermediate level. Comment if interested!",
      "Just finished an amazing tournament at Central Park! Our team made it to the semi-finals. Proud of everyone's hard work and improvement! 🏐 #VolleyballLife",
      "New drills for improving your serve accuracy! Check out today's practice video on my profile. Tag someone who needs to see this!",
      "Anyone interested in joining our weekly volleyball practice sessions? We meet every Thursday at 7pm at Riverfront Park. All skill levels welcome!",
      "Just upgraded to the new Wilson AVP ball - the touch and feel are amazing! Highly recommend for serious players 🏐",
      "Looking for recommendations for volleyball knee pads that actually stay in place during diving. The ones I have keep sliding down!",
      "Our team is looking for a sponsor for the upcoming summer league. Great opportunity for local businesses to get visibility! DM if interested.",
      "Who's watching the pro beach volleyball tournament this weekend? I'm so excited to see the Williams sisters play!",
      "Just registered for the charity volleyball marathon next month. 12 hours of non-stop volleyball for a good cause! Who else is in?",
      "Need advice on dealing with a sprained ankle. How long before I can get back to playing? Any rehab exercises you recommend?",
      "Our indoor league is looking for a few more players to complete teams. Games on Monday evenings. Let me know if you're interested!",
      "Check out this amazing save from yesterday's game! Sometimes you just have to dive for it! #NoballDrops #VolleyballHustle",
      "What's your pre-game ritual? I always have to eat a banana and listen to my pump-up playlist. Curious what works for others!",
      "Coaching youth volleyball for the first time this summer. Any tips from experienced coaches on keeping kids engaged and motivated?",
      "Does anyone know if Central Beach courts are open after the recent renovation? Website doesn't have updated information."
    ];
    
    for (let i = 0; i < count; i++) {
      const randomTime = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
      const randomUserIndex = Math.floor(Math.random() * userNames.length);
      const randomContentIndex = Math.floor(Math.random() * contents.length);
      
      posts.push({
        id: `post${i+1}`,
        user: {
          id: `user${randomUserIndex+1}`,
          name: userNames[randomUserIndex],
          avatar: null,
        },
        content: contents[randomContentIndex],
        timestamp: randomTime.toISOString(),
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 15),
        isLiked: Math.random() > 0.7,
      });
    }
    
    return posts;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community Feed</Text>
        <TouchableOpacity 
          style={styles.newPostButton}
          onPress={() => navigation.navigate("CreatePost")}
        >
          <Ionicons name="add-circle-outline" size={24} color="rgb(168, 38, 29)" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search posts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgb(168, 38, 29)" />
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id || `post-${Math.random().toString(36)}`}
          renderItem={renderPostItem}
          contentContainerStyle={styles.postsList}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No posts found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? "Try a different search term" : "Be the first to post something!"}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  style={styles.createPostButton}
                  onPress={() => navigation.navigate("CreatePost")}
                >
                  <Text style={styles.createPostButtonText}>Create Post</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  backButton: {
    padding: 8,
  },
  newPostButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postsList: {
    padding: 16,
  },
  postContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
  createPostButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "rgb(168, 38, 29)",
    borderRadius: 25,
  },
  createPostButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CommunityFeedScreen;
