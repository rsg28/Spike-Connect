// screens/ItemDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Share,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackendService from '../services/BackendService';

const ItemDetailScreen = ({ route, navigation }) => {
  const { itemId } = route.params;
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch item details when component mounts
  useEffect(() => {
    const loadItemDetails = async () => {
      setIsLoading(true);
      try {
        const fetchedItem = await BackendService.getItem(itemId);
        
        if (fetchedItem) {
          setItem(fetchedItem);
          
          // Also fetch related items
          const related = await BackendService.getRelatedItems(fetchedItem.category, itemId);
          setRelatedItems(related);
        } else {
          // Handle item not found
          Alert.alert('Error', 'Item not found');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error loading item details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItemDetails();
  }, [itemId, navigation]);

  // Calculate relative time for display
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  };

  const handleShare = async () => {
    if (!item) return;
    
    try {
      await Share.share({
        message: `Check out this item: ${item.title}`,
        title: item.title,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkComplete = async () => {
    if (!item) return;
    
    try {
      const updatedItem = await BackendService.updateItem(item.id, {
        status: 'Resolved'
      });
      
      setItem(updatedItem);
      Alert.alert('Success', 'Item marked as complete');
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item');
    }
  };

  // Display loading indicator while fetching data
  if (isLoading || !item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgb(168, 38, 29)" />
          <Text style={styles.loadingText}>Loading item details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="rgb(168, 38, 29)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Item Details</Text>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={24} color="rgb(168, 38, 29)" />
          </TouchableOpacity>
        </View>

        {/* Image placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={60} color="#999" />
            <Text style={styles.placeholderText}>Image will be added later</Text>
          </View>
        </View>

        {/* Item details card */}
        <View style={styles.detailsCard}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          
          <View style={styles.categoryContainer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <Text style={styles.dateText}>{getRelativeTime(item.createdAt)}</Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge, 
              { 
                backgroundColor: item.status === 'Resolved' 
                  ? 'rgba(76, 175, 80, 0.1)' 
                  : item.status === 'In Progress' 
                    ? 'rgba(255, 179, 0, 0.1)'
                    : 'rgba(33, 150, 243, 0.1)'
              }
            ]}>
              <View style={[
                styles.statusDot, 
                { 
                  backgroundColor: item.status === 'Resolved' 
                    ? '#4CAF50' 
                    : item.status === 'In Progress' 
                      ? '#FFB300'
                      : '#2196F3'
                }
              ]} />
              <Text style={[
                styles.statusText, 
                { 
                  color: item.status === 'Resolved' 
                    ? '#4CAF50' 
                    : item.status === 'In Progress' 
                      ? '#FFB300'
                      : '#2196F3'
                }
              ]}>{item.status}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="calendar-outline" size={20} color="rgb(168, 38, 29)" />
            </View>
            <Text style={styles.detailLabel}>Due Date:</Text>
            <Text style={styles.detailValue}>{item.dueDate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="flag-outline" size={20} color="rgb(168, 38, 29)" />
            </View>
            <Text style={styles.detailLabel}>Priority:</Text>
            <Text style={styles.detailValue}>{item.priority}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="attach-outline" size={20} color="rgb(168, 38, 29)" />
            </View>
            <Text style={styles.detailLabel}>Attachments:</Text>
            <Text style={styles.detailValue}>{item.attachments}</Text>
          </View>
        </View>
        
        {/* Actions section */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleMarkComplete}
            disabled={item.status === 'Resolved'}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="rgb(168, 38, 29)" />
            <Text style={styles.secondaryButtonText}>
              {item.status === 'Resolved' ? 'Completed' : 'Mark Complete'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Related items section */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>Related Items</Text>
          
          {relatedItems.length > 0 ? (
            relatedItems.map((relatedItem) => (
              <TouchableOpacity 
                key={relatedItem.id} 
                style={styles.relatedItem}
                onPress={() => navigation.navigate('ItemDetail', { itemId: relatedItem.id })}
              >
                <View style={styles.relatedItemIcon}>
                  <Ionicons name="document-text-outline" size={24} color="rgb(168, 38, 29)" />
                </View>
                <View style={styles.relatedItemContent}>
                  <Text style={styles.relatedItemTitle}>{relatedItem.title}</Text>
                  <Text style={styles.relatedItemCategory}>{relatedItem.category}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noRelatedText}>No related items found</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  shareButton: {
    padding: 8,
  },
  imageContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imagePlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: 'rgba(168, 38, 29, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    color: 'rgb(168, 38, 29)',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIconContainer: {
    marginRight: 8,
    width: 24,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgb(168, 38, 29)',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgb(168, 38, 29)',
  },
  secondaryButtonText: {
    color: 'rgb(168, 38, 29)',
    fontWeight: '600',
    marginLeft: 8,
  },
  relatedSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  relatedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  relatedItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(168, 38, 29, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  relatedItemContent: {
    flex: 1,
  },
  relatedItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  relatedItemCategory: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  noRelatedText: {
    fontSize: 14,
    color: '#999',
    padding: 12,
    textAlign: 'center',
  }
});

export default ItemDetailScreen;