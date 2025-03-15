// screens/PostCommentsScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BackendService from "../services/BackendService";

const PostCommentsScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  
  const inputRef = useRef(null);

  useEffect(() => {
    // Load post and comments
    loadPostAndComments();
  }, [postId]);

  const loadPostAndComments = async () => {
    setIsLoading(true);
    try {
      // In a real app, fetch from backend
      // const fetchedPost = await BackendService.getPostById(postId);
      // const fetchedComments = await BackendService.getPostComments(postId);
      
      // Mock data for now
      setTimeout(() => {
        const mockPost = getMockPost();
        const mockComments = generateMockComments(mockPost);
        
        setPost(mockPost);
        setComments(mockComments);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error loading post and comments:", error);
      setIsLoading(false);
    }
  };

  const getMockPost = () => {
    // Generate a mock post based on postId
    return {
      id: postId,
      user: {
        id: "user1",
        name: "Sarah Johnson",
        avatar: null,
      },
      content: "Looking for 2 more players for our beach volleyball game this Saturday at Sunset Beach. Intermediate level. Comment if interested!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 12,
      comments: 5,
      isLiked: false,
    };
  };

  const generateMockComments = (post) => {
    const mockComments = [];
    const names = [
      "Alex Rodriguez", "Tina Williams", "James Wilson",
      "Olivia Parker", "Malik Davis", "Kathy Chen"
    ];
    
    const commentTexts = [
      "I'd love to join! What time are you playing?",
      "Count me in! I'll bring an extra ball.",
      "Are beginners welcome too?",
      "I can make it this Saturday. How do I find you?",
      "Is there parking nearby?",
      "How many players do you need in total?"
    ];
    
    for (let i = 0; i < post.comments; i++) {
      const randomNameIndex = Math.floor(Math.random() * names.length);
      const randomCommentIndex = Math.floor(Math.random() * commentTexts.length);
      const randomTime = new Date(
        new Date(post.timestamp).getTime() + 
        Math.floor(Math.random() * 1000 * 60 * 60 * 5)
      );
      
      mockComments.push({
        id: `comment${i+1}`,
        user: {
          id: `user${randomNameIndex+10}`,
          name: names[randomNameIndex],
          avatar: null,
        },
        text: commentTexts[randomCommentIndex],
        timestamp: randomTime.toISOString(),
        likes: Math.floor(Math.random() * 5),
        isLiked: Math.random() > 0.7,
      });
    }
    
    // Sort comments by timestamp (newest first)
    return mockComments.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  };

  const getRelativeTime = (dateString) => {
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
  };

  const handleLikeComment = (commentId) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    );
    // In a real app, update like status with API
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    
    const newComment = {
      id: `comment${Date.now()}`,
      user: {
        id: "currentUser", // In a real app, use logged-in user's ID
        name: "You", // In a real app, use logged-in user's name
        avatar: null,
      },
      text: commentText,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };
    
    // Add new comment to the top of the list
    setComments([newComment, ...comments]);
    setCommentText("");
    setIsReplying(false);
    setReplyingTo(null);
    
    // In a real app, send comment to API
  };

  const handleReplyToComment = (comment) => {
    setIsReplying(true);
    setReplyingTo(comment);
    setCommentText(`@${comment.user.name} `);
    inputRef.current?.focus();
  };

  const cancelReply = () => {
    setIsReplying(false);
    setReplyingTo(null);
    setCommentText("");
  };

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <View style={styles.commentUserAvatar}>
          {item.user.avatar ? (
            <Image source={{ uri: item.user.avatar }} style={styles.commentAvatarImage} />
          ) : (
            <View style={styles.commentDefaultAvatar}>
              <Text style={styles.commentAvatarInitial}>{item.user.name.charAt(0)}</Text>
            </View>
          )}
        </View>
        <View style={styles.commentContent}>
          <View style={styles.commentBubble}>
            <Text style={styles.commentUserName}>{item.user.name}</Text>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
          
          <View style={styles.commentActions}>
            <Text style={styles.commentTimestamp}>{getRelativeTime(item.timestamp)}</Text>
            
            <TouchableOpacity
              style={styles.commentAction}
              onPress={() => handleLikeComment(item.id)}
            >
              <Text style={[
                styles.commentActionText,
                item.isLiked && styles.commentActionTextActive
              ]}>
                {item.likes > 0 ? `${item.likes} likes` : "Like"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.commentAction}
              onPress={() => handleReplyToComment(item)}
            >
              <Text style={styles.commentActionText}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="rgb(168, 38, 29)" />
        <Text style={styles.loadingText}>Loading comments...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comments</Text>
          <View style={styles.headerRight} />
        </View>

        {post && (
          <View style={styles.postPreview}>
            <View style={styles.postPreviewHeader}>
              <View style={styles.postUserAvatar}>
                {post.user.avatar ? (
                  <Image source={{ uri: post.user.avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.defaultAvatar}>
                    <Text style={styles.avatarInitial}>{post.user.name.charAt(0)}</Text>
                  </View>
                )}
              </View>
              <View style={styles.postInfo}>
                <Text style={styles.postUserName}>{post.user.name}</Text>
                <Text style={styles.postTimestamp}>{getRelativeTime(post.timestamp)}</Text>
              </View>
            </View>
            <Text 
              style={styles.postContent}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {post.content}
            </Text>
            <TouchableOpacity 
              style={styles.viewPostButton}
              onPress={() => navigation.navigate("PostDetail", { post })}
            >
              <Text style={styles.viewPostButtonText}>View Post</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={renderCommentItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No comments yet</Text>
              <Text style={styles.emptySubtext}>Be the first to comment on this post</Text>
            </View>
          }
          contentContainerStyle={styles.commentsListContent}
        />

        {isReplying && (
          <View style={styles.replyingContainer}>
            <Text style={styles.replyingText}>
              Replying to <Text style={styles.replyingName}>{replyingTo?.user.name}</Text>
            </Text>
            <TouchableOpacity onPress={cancelReply}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputContainer}>
          <View style={styles.commentInputWrapper}>
            <TextInput
              ref={inputRef}
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                !commentText.trim() && styles.sendButtonDisabled
              ]}
              onPress={handleSubmitComment}
              disabled={!commentText.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={commentText.trim() ? "rgb(168, 38, 29)" : "#ccc"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
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
  headerRight: {
    width: 40,
  },
  postPreview: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  postPreviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  postUserAvatar: {
    marginRight: 10,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  defaultAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgb(168, 38, 29)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  postInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  postTimestamp: {
    fontSize: 12,
    color: "#999",
  },
  postContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 10,
  },
  viewPostButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 14,
  },
  viewPostButtonText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  commentsListContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
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
  commentContainer: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  commentUserAvatar: {
    marginRight: 8,
    marginTop: 4,
  },
  commentAvatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentDefaultAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgb(168, 38, 29)",
    alignItems: "center",
    justifyContent: "center",
  },
  commentAvatarInitial: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: "#eee",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  commentUserName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginLeft: 8,
  },
  commentTimestamp: {
    fontSize: 12,
    color: "#999",
    marginRight: 12,
  },
  commentAction: {
    marginRight: 12,
  },
  commentActionText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  commentActionTextActive: {
    color: "rgb(168, 38, 29)",
  },
  inputContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  commentInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  commentInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    fontSize: 15,
    color: "#333",
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  replyingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  replyingText: {
    fontSize: 13,
    color: "#666",
  },
  replyingName: {
    fontWeight: "600",
    color: "rgb(168, 38, 29)",
  },
});

export default PostCommentsScreen;