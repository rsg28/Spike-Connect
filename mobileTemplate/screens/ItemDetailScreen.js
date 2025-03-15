// screens/ItemDetailScreen.js (Event Detail Screen)
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
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);

  // Fetch event details when component mounts
  useEffect(() => {
    const loadEventDetails = async () => {
      setIsLoading(true);
      try {
        const fetchedEvent = await BackendService.getItem(itemId);
        
        if (fetchedEvent) {
          setEvent(fetchedEvent);
          
          // Also fetch related events
          const related = await BackendService.getRelatedItems(fetchedEvent.category, fetchedEvent.level, itemId);
          setRelatedEvents(related);
        } else {
          // Handle event not found
          Alert.alert('Error', 'Event not found');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error loading event details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEventDetails();
  }, [itemId, navigation]);

  // Format date for display
  const formatEventDate = (dateString) => {
    return dateString;
  };

  const handleShare = async () => {
    if (!event) return;
    
    try {
      await Share.share({
        message: `Check out this volleyball event: ${event.title} - ${event.location} (${event.level} level) on ${event.eventDate}`,
        title: event.title,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoinEvent = async () => {
    if (!event) return;
    
    try {
      if (isJoined) {
        // Leave event
        await BackendService.leaveEvent(event.id);
        setIsJoined(false);
        setEvent({
          ...event,
          currentParticipants: event.currentParticipants - 1
        });
        Alert.alert('Success', 'You have left this event');
      } else {
        // Check if event is full
        if (event.currentParticipants >= event.maxParticipants) {
          Alert.alert('Error', 'This event is already full');
          return;
        }
        
        // Join event
        await BackendService.joinEvent(event.id);
        setIsJoined(true);
        setEvent({
          ...event, 
          currentParticipants: event.currentParticipants + 1
        });
        Alert.alert('Success', 'You have joined this event');
      }
    } catch (error) {
      console.error('Error updating event participation:', error);
      Alert.alert('Error', 'Failed to update participation');
    }
  };

  // Display loading indicator while fetching data
  if (isLoading || !event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgb(168, 38, 29)" />
          <Text style={styles.loadingText}>Loading event details...</Text>
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
          <Text style={styles.headerTitle}>Event Details</Text>
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
            <Ionicons name="volleyball-outline" size={60} color="#999" />
            <Text style={styles.placeholderText}>Event image will be added later</Text>
          </View>
        </View>

        {/* Event details card */}
        <View style={styles.detailsCard}>
          <Text style={styles.itemTitle}>{event.title}</Text>
          
          <View style={styles.categoryContainer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{event.level}</Text>
            </View>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge, 
              { 
                backgroundColor: event.status === 'Full' 
                  ? 'rgba(244, 67, 54, 0.1)' 
                  : event.status === 'In Progress' 
                    ? 'rgba(255, 179, 0, 0.1)'
                    : 'rgba(76, 175, 80, 0.1)'
              }
            ]}>
              <View style={[
                styles.statusDot, 
                { 
                  backgroundColor: event.status === 'Full' 
                    ? '#F44336' 
                    : event.status === 'In Progress' 
                      ? '#FFB300'
                      : '#4CAF50'
                }
              ]} />
              <Text style={[
                styles.statusText, 
                { 
                  color: event.status === 'Full' 
                    ? '#F44336' 
                    : event.status === 'In Progress' 
                      ? '#FFB300'
                      : '#4CAF50'
                }
              ]}>{event.status}</Text>
            </View>
            
            <View style={styles.participantsContainer}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={styles.participantsText}>
                {event.currentParticipants} / {event.maxParticipants} participants
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>About This Event</Text>
          <Text style={styles.descriptionText}>{event.description}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Event Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="calendar-outline" size={20} color="rgb(168, 38, 29)" />
            </View>
            <Text style={styles.detailLabel}>Date & Time:</Text>
            <Text style={styles.detailValue}>{formatEventDate(event.eventDate)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="location-outline" size={20} color="rgb(168, 38, 29)" />
            </View>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{event.location}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="trophy-outline" size={20} color="rgb(168, 38, 29)" />
            </View>
            <Text style={styles.detailLabel}>Level:</Text>
            <Text style={styles.detailValue}>{event.level}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="cash-outline" size={20} color="rgb(168, 38, 29)" />
            </View>
            <Text style={styles.detailLabel}>Fee:</Text>
            <Text style={styles.detailValue}>{event.fee}</Text>
          </View>
        </View>
        
        {/* Event Creator Section - NEW */}
        <View style={styles.creatorCard}>
          <Text style={styles.sectionTitle}>Event Creator</Text>
          
          <TouchableOpacity 
            style={styles.creatorProfile}
            onPress={() => {
              // Navigate to creator's profile (this would be implemented in a full app)
              Alert.alert("View Profile", `View ${event.hostName}'s full profile`);
            }}
          >
            <View style={styles.creatorAvatar}>
              <Text style={styles.creatorAvatarText}>
                {event.hostName.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            
            <View style={styles.creatorInfo}>
              <Text style={styles.creatorName}>{event.hostName}</Text>
              <Text style={styles.creatorBio}>Event Organizer</Text>
              
              <View style={styles.creatorStats}>
                <View style={styles.creatorStat}>
                  <Text style={styles.creatorStatValue}>12</Text>
                  <Text style={styles.creatorStatLabel}>Events</Text>
                </View>
                <View style={styles.creatorStat}>
                  <Text style={styles.creatorStatValue}>4.8</Text>
                  <Text style={styles.creatorStatLabel}>Rating</Text>
                </View>
              </View>
            </View>
            
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
        
        {/* Actions section */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              /* Navigate to contact host/organizer */
              Alert.alert("Contact Host", `Would you like to contact ${event.hostName}?`);
            }}
          >
            <Ionicons name="mail-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Contact Host</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              isJoined ? styles.leaveButton : 
                (event.currentParticipants >= event.maxParticipants && !isJoined) ? 
                styles.disabledButton : styles.joinButton
            ]}
            onPress={handleJoinEvent}
            disabled={event.currentParticipants >= event.maxParticipants && !isJoined}
          >
            <Ionicons 
              name={isJoined ? "close-circle-outline" : "checkmark-circle-outline"} 
              size={20} 
              color={isJoined ? "#fff" : 
                (event.currentParticipants >= event.maxParticipants && !isJoined) ? 
                "#999" : "#fff"} 
            />
            <Text style={[
              styles.actionButtonText,
              (event.currentParticipants >= event.maxParticipants && !isJoined) ? 
              styles.disabledButtonText : {}
            ]}>
              {isJoined ? "Leave Event" : 
                (event.currentParticipants >= event.maxParticipants && !isJoined) ? 
                "Event Full" : "Join Event"}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Related events section */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>Related Events</Text>
          
          {relatedEvents.length > 0 ? (
            relatedEvents.map((relatedItem) => (
              <TouchableOpacity 
                key={relatedItem.id} 
                style={styles.relatedItem}
                onPress={() => navigation.navigate('ItemDetail', { itemId: relatedItem.id })}
              >
                <View style={styles.relatedItemIcon}>
                  <Ionicons name="volleyball-outline" size={24} color="rgb(168, 38, 29)" />
                </View>
                <View style={styles.relatedItemContent}>
                  <Text style={styles.relatedItemTitle}>{relatedItem.title}</Text>
                  <View style={styles.relatedItemDetails}>
                    <Text style={styles.relatedItemLevel}>{relatedItem.level}</Text>
                    <Text style={styles.relatedItemLocation}>{relatedItem.location}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noRelatedText}>No related events found</Text>
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
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: 'rgba(168, 38, 29, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    color: 'rgb(168, 38, 29)',
    fontWeight: '500',
  },
  levelBadge: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  levelText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
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
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
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
  // Creator Card Styles - NEW
  creatorCard: {
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
  creatorProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgb(168, 38, 29)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  creatorAvatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  creatorBio: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  creatorStats: {
    flexDirection: 'row',
  },
  creatorStat: {
    marginRight: 16,
  },
  creatorStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(168, 38, 29)',
  },
  creatorStatLabel: {
    fontSize: 12,
    color: '#666',
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
  joinButton: {
    backgroundColor: '#4CAF50',
  },
  leaveButton: {
    backgroundColor: '#F44336',
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButtonText: {
    color: '#999',
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
    marginBottom: 4,
  },
  relatedItemDetails: {
    flexDirection: 'row',
  },
  relatedItemLevel: {
    fontSize: 12,
    color: '#2196F3',
    marginRight: 8,
  },
  relatedItemLocation: {
    fontSize: 12,
    color: '#666',
  },
  noRelatedText: {
    fontSize: 14,
    color: '#999',
    padding: 12,
    textAlign: 'center',
  }
});

export default ItemDetailScreen;