// screens/PostDetailScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PostDetailScreen = ({ route, navigation }) => {
  const { post } = route.params || {};
  const [liked, setLiked] = useState(post?.isLiked || false);
  const [likeCount, setLikeCount] = useState(post?.likes || 0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const likeAnimation = useRef(new Animated.Value(1)).current;
  const inputRef = useRef(null);

  useEffect(() => {
    // Load comments
    loadComments();
    
    // Animation for heart icon on mount
    if (post?.isLiked) {
      Animated.sequence([
        Animated.timing(likeAnimation, {
          toValue: 1.3,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(likeAnimation, {
          toValue: 1,
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, []);

  const loadComments = () => {
    setIsLoading(true);
    
    // In a real app, fetch comments from API
    // For now, generate mock comments
    setTimeout(() => {
      setComments(generateMockComments());
      setIsLoading(false);
    }, 800);
  };

  const generateMockComments = () => {
    if (!post) return [];
    
    const mockComments = [];
    const names = [
      "Alex Rodriguez", "Tina Williams", "James Wilson",
      "Olivia Parker", "Malik Davis", "Kathy Chen",
      "Daniel Martinez", "Emma Taylor", "Noah Garcia"
    ];
    
    const commentTexts = [
      "Great post! I'd love to join the game this Saturday.",
      "I've been looking for a team to play with. Is the offer still open?",
      "What time will the game start?",
      "How many people are you playing with already?",
      "I'll be there! Should I bring anything?",
      "Is there parking available at the beach?",
      "Thanks for organizing this!",
      "I'm a beginner, is that okay?",
      "I can bring an extra net if needed.",
      "What's the exact location at Sunset Beach?",
      "Will there be any fees to join?",
      "Count me in! My number is 555-1234, text me the details.",
      "Those drills really helped improve my game!",
      "Is this still happening if it rains?",
      "I'm bringing a friend too if that's alright."
    ];
    
    const numComments = Math.min(post.comments || 10, 10);
    
    for (let i = 0; i < numComments; i++) {
      const randomNameIndex = Math.floor(Math.random() * names.length);
      const randomCommentIndex = Math.floor(Math.random() * commentTexts.length);
      const randomTime = new Date(
        new Date(post.timestamp || Date.now()).getTime() + 
        Math.floor(Math.random() * 1000 * 60 * 60 * 12)
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
        replies: Math.random() > 0.7 ? [{
          id: `reply${i+1}`,
          user: {
            id: post.user?.id || "poster",
            name: post.user?.name || "Original Poster",
            avatar: post.user?.avatar,
          },
          text: "Thanks for your interest! Yes, we're still looking for players.",
          timestamp: new Date(randomTime.getTime() + 1000 * 60 * 30).toISOString(),
          likes: Math.floor(Math.random() * 3),
        }] : [],
      });
    }
    
    // Sort comments by timestamp (newest first)
    return mockComments.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return "Recently";
    
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
      console.error("Error formatting date:", error);
      return "Recently";
    }
  };

  const handleLikePost = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    
    // Animate the heart icon
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: liked ? 0.8 : 1.3,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
    
    // In a real app, update like status with API
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
      replies: [],
    };
    
    if (isReplying && replyingTo) {
      // Add reply to the comment
      setComments(
        comments.map((comment) =>
          comment.id === replyingTo.id
            ? {
                ...comment,
                replies: [...(comment.replies || []), {
                  id: `reply${Date.now()}`,
                  user: newComment.user,
                  text: commentText,
                  timestamp: newComment.timestamp,
                  likes: 0,
                }],
              }
            : comment
        )
      );
    } else {
      // Add new comment
      setComments([newComment, ...comments]);
    }
    
    setCommentText("");
    setIsReplying(false);
    setReplyingTo(null);
    Keyboard.dismiss();
    
    // In a real app, send comment to API
  };

  const handleReplyToComment = (comment) => {
    setIsReplying(true);
    setReplyingTo(comment);
    setCommentText(`@${comment.user?.name || "User"} `);
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
          {item.user?.avatar ? (
            <Image source={{ uri: item.user.avatar }} style={styles.commentAvatarImage} />
          ) : (
            <View style={styles.commentDefaultAvatar}>
              <Text style={styles.commentAvatarInitial}>{item.user?.name?.charAt(0) || "?"}</Text>
            </View>
          )}
        </View>
        <View style={styles.commentContent}>
          <View style={styles.commentBubble}>
            <Text style={styles.commentUserName}>{item.user?.name || "Unknown User"}</Text>
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
      
      {/* Render replies if any */}
      {item.replies && item.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {item.replies.map((reply) => (
            <View key={reply.id || `reply-${Math.random().toString(36)}`} style={styles.replyContainer}>
              <View style={styles.commentUserAvatar}>
                {reply.user?.avatar ? (
                  <Image source={{ uri: reply.user.avatar }} style={styles.commentAvatarImage} />
                ) : (
                  <View style={[styles.commentDefaultAvatar, styles.replyAvatar]}>
                    <Text style={styles.commentAvatarInitial}>{reply.user?.name?.charAt(0) || "?"}</Text>
                  </View>
                )}
              </View>
              <View style={styles.commentContent}>
                <View style={styles.commentBubble}>
                  <Text style={styles.commentUserName}>{reply.user?.name || "Unknown User"}</Text>
                  <Text style={styles.commentText}>{reply.text}</Text>
                </View>
                
                <View style={styles.commentActions}>
                  <Text style={styles.commentTimestamp}>{getRelativeTime(reply.timestamp)}</Text>
                  <TouchableOpacity style={styles.commentAction}>
                    <Text style={styles.commentActionText}>
                      {reply.likes > 0 ? `${reply.likes} likes` : "Like"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  // If post is undefined or null, show error
  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={50} color="#999" />
          <Text style={styles.errorText}>Post not found or has been deleted</Text>
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.returnButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
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
          <Text style={styles.headerTitle}>Post</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id || `comment-${Math.random().toString(36)}`}
          renderItem={renderCommentItem}
          ListHeaderComponent={
            <View style={styles.postContainer}>
              <View style={styles.postHeader}>
                <View style={styles.postUserAvatar}>
                  {post.user?.avatar ? (
                    <Image source={{ uri: post.user.avatar }} style={styles.avatarImage} />
                  ) : (
                    <View style={styles.defaultAvatar}>
                      <Text style={styles.avatarInitial}>{post.user?.name?.charAt(0) || "?"}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.postUserInfo}>
                  <Text style={styles.postUserName}>{post.user?.name || "Unknown User"}</Text>
                  <Text style={styles.postTimestamp}>{getRelativeTime(post.timestamp)}</Text>
                </View>
                <TouchableOpacity style={styles.postOptions}>
                  <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <Text style={styles.postContent}>{post.content || "No content"}</Text>

              <View style={styles.postActions}>
                <TouchableOpacity
                  style={styles.postAction}
                  onPress={handleLikePost}
                  activeOpacity={0.7}
                >
                  <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
                    <Ionicons
                      name={liked ? "heart" : "heart-outline"}
                      size={22}
                      color={liked ? "rgb(168, 38, 29)" : "#666"}
                    />
                  </Animated.View>
                  <Text style={styles.postActionText}>{likeCount}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.postAction}
                  onPress={() => inputRef.current?.focus()}
                >
                  <Ionicons name="chatbubble-outline" size={22} color="#666" />
                  <Text style={styles.postActionText}>{comments.length}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.postAction}>
                  <Ionicons name="share-outline" size={22} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          }
          ListEmptyComponent={isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading comments...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No comments yet</Text>
              <Text style={styles.emptySubtext}>Be the first to comment on this post</Text>
            </View>
          )}
          contentContainerStyle={styles.commentsListContent}
        />

        {isReplying && (
          <View style={styles.replyingContainer}>
            <Text style={styles.replyingText}>
              Replying to <Text style={styles.replyingName}>{replyingTo?.user?.name || "User"}</Text>
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
  shareButton: {
    padding: 8,
  },
  postContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: "#f0f0f0",
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
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
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
  commentsListContent: {
    paddingBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingText: {
    color: "#999",
    fontSize: 14,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
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
  replyAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
  repliesContainer: {
    marginLeft: 40,
    marginTop: 4,
  },
  replyContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
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

export default PostDetailScreen;