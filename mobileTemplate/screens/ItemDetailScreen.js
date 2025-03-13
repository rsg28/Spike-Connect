// screens/ItemDetailScreen.js
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ItemDetailScreen = ({ route, navigation }) => {
  // You would normally get the item from route.params
  // const { itemId } = route.params;
  
  // For demonstration, we'll use a sample item
  const [item, setItem] = useState({
    id: '1',
    title: 'Featured Item 1',
    description: 'This is a detailed description of the featured item. It provides comprehensive information about the product, its features, benefits, and any other relevant details that might be useful for the user.',
    category: 'Category A',
    date: '2 days ago',
    priority: 'High',
    dueDate: 'Mar 20, 2025',
    attachments: 2,
    status: 'In Progress'
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this item: ${item.title}`,
        title: item.title,
      });
    } catch (error) {
      console.error(error);
    }
  };

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
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: 'rgba(255, 179, 0, 0.1)' }]}>
              <View style={[styles.statusDot, { backgroundColor: '#FFB300' }]} />
              <Text style={[styles.statusText, { color: '#FFB300' }]}>{item.status}</Text>
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
          
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
            <Ionicons name="checkmark-circle-outline" size={20} color="rgb(168, 38, 29)" />
            <Text style={styles.secondaryButtonText}>Mark Complete</Text>
          </TouchableOpacity>
        </View>
        
        {/* Related items section */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>Related Items</Text>
          
          <TouchableOpacity style={styles.relatedItem}>
            <View style={styles.relatedItemIcon}>
              <Ionicons name="document-text-outline" size={24} color="rgb(168, 38, 29)" />
            </View>
            <View style={styles.relatedItemContent}>
              <Text style={styles.relatedItemTitle}>Related Item 1</Text>
              <Text style={styles.relatedItemCategory}>Category A</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.relatedItem}>
            <View style={styles.relatedItemIcon}>
              <Ionicons name="document-text-outline" size={24} color="rgb(168, 38, 29)" />
            </View>
            <View style={styles.relatedItemContent}>
              <Text style={styles.relatedItemTitle}>Related Item 2</Text>
              <Text style={styles.relatedItemCategory}>Category B</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
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
});

export default ItemDetailScreen;