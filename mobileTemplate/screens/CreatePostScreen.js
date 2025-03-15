// screens/CreatePostScreen.js
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BackendService from "../services/BackendService";

const CreatePostScreen = ({ navigation }) => {
  const [postContent, setPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [attachedMedia, setAttachedMedia] = useState([]);
  const MAX_LENGTH = 500;
  
  const inputRef = useRef(null);
  
  // Focus the text input when the screen mounts
  React.useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }, []);
  
  const handleContentChange = (text) => {
    setPostContent(text);
    setCharCount(text.length);
  };
  
  const handleSubmitPost = async () => {
    if (postContent.trim() === "") {
      Alert.alert("Empty Post", "Please enter some content for your post.");
      return;
    }
    
    setIsPosting(true);
    try {
      // In a real app, you would send the post to your backend
      // await BackendService.createPost(postContent, attachedMedia);
      
      // For now, simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      navigation.goBack();
      
      // You might want to show a success message or refresh the feed
      // This is where you would dispatch an action to update your global state
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert(
        "Error",
        "There was a problem posting your content. Please try again."
      );
    } finally {
      setIsPosting(false);
    }
  };
  
  const handleAddPhoto = () => {
    // In a real app, you would use a library like react-native-image-picker
    // or expo-image-picker to allow the user to select images
    
    // Mock adding an image for now
    if (attachedMedia.length < 4) {
      setAttachedMedia([
        ...attachedMedia,
        {
          id: Date.now().toString(),
          type: 'image',
          uri: null, // In a real app, this would be the image URI
        }
      ]);
    } else {
      Alert.alert("Limit Reached", "You can only attach up to 4 images.");
    }
  };
  
  const handleRemoveMedia = (id) => {
    setAttachedMedia(attachedMedia.filter(media => media.id !== id));
  };
  
  const renderMediaPreview = () => {
    if (attachedMedia.length === 0) return null;
    
    return (
      <View style={styles.mediaPreviewContainer}>
        {attachedMedia.map(media => (
          <View key={media.id} style={styles.mediaPreview}>
            <View style={styles.mediaPlaceholder}>
              <Ionicons name="image-outline" size={24} color="#999" />
            </View>
            <TouchableOpacity
              style={styles.removeMediaButton}
              onPress={() => handleRemoveMedia(media.id)}
            >
              <Ionicons name="close-circle" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              if (postContent.trim().length > 0) {
                Alert.alert(
                  "Discard Post",
                  "Are you sure you want to discard this post?",
                  [
                    { text: "Keep Editing", style: "cancel" },
                    { 
                      text: "Discard",
                      style: "destructive",
                      onPress: () => navigation.goBack()
                    },
                  ]
                );
              } else {
                navigation.goBack();
              }
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Create Post</Text>
          
          <TouchableOpacity
            style={[
              styles.postButton,
              (postContent.trim() === "" || isPosting) && styles.postButtonDisabled
            ]}
            onPress={handleSubmitPost}
            disabled={postContent.trim() === "" || isPosting}
          >
            {isPosting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.postButtonText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content}>
          <View style={styles.userSection}>
            <View style={styles.userAvatar}>
              <Text style={styles.avatarInitial}>Y</Text>
            </View>
            <Text style={styles.userName}>You</Text>
          </View>
          
          <TextInput
            ref={inputRef}
            style={styles.inputField}
            placeholder="What's on your mind?"
            placeholderTextColor="#999"
            multiline
            value={postContent}
            onChangeText={handleContentChange}
            maxLength={MAX_LENGTH}
          />
          
          {renderMediaPreview()}
        </ScrollView>
        
        <View style={styles.footer}>
          <View style={styles.charCount}>
            <Text style={[
              styles.charCountText,
              charCount > MAX_LENGTH * 0.8 && styles.charCountWarning
            ]}>
              {charCount}/{MAX_LENGTH}
            </Text>
          </View>
          
          <View style={styles.attachmentOptions}>
            <TouchableOpacity
              style={styles.attachmentButton}
              onPress={handleAddPhoto}
            >
              <Ionicons name="image-outline" size={24} color="rgb(168, 38, 29)" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.attachmentButton}>
              <Ionicons name="location-outline" size={24} color="rgb(168, 38, 29)" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.attachmentButton}>
              <Ionicons name="videocam-outline" size={24} color="rgb(168, 38, 29)" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.attachmentButton}>
              <Ionicons name="pricetag-outline" size={24} color="rgb(168, 38, 29)" />
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
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
  },
  postButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgb(168, 38, 29)",
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: "rgba(168, 38, 29, 0.5)",
  },
  postButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgb(168, 38, 29)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  inputField: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    minHeight: 120,
    textAlignVertical: "top",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  attachmentOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  attachmentButton: {
    padding: 8,
  },
  charCount: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  charCountText: {
    fontSize: 12,
    color: "#999",
  },
  charCountWarning: {
    color: "rgb(168, 38, 29)",
  },
  mediaPreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
  },
  mediaPreview: {
    width: 80,
    height: 80,
    marginRight: 10,
    marginBottom: 10,
    position: "relative",
  },
  mediaPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  removeMediaButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "rgb(168, 38, 29)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreatePostScreen;