// screens/ItemDetailScreen.js - With related events section removed

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
  // Removed relatedEvents state since we're not showing related events
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [randomImage, setRandomImage] = useState(null);

  // Mock images for activities - updated to use require()
  const activityImgs = [
    require("../assets/media/edmonds.png"),
    require("../assets/media/christine.png"),
    require("../assets/media/bonsor.png"),
    require("../assets/media/pittmeadows.png")
  ];

  // Safe date handling helpers
  const safeGetEventDate = (event) => {
    if (!event) return null;
    if (event.eventDate) return event.eventDate;
    if (event.dueDate) return event.dueDate;
    return null;
  };

  // Safe formatting for event date display
  const formatEventDate = (dateString) => {
    if (!dateString) return null;
    return dateString;
  };

  // Fetch event details when component mounts
  useEffect(() => {
    const loadEventDetails = async () => {
      setIsLoading(true);
      try {
        console.log("Looking for event with ID:", itemId);
        
        // Try to find the event
        let fetchedEvent = await BackendService.getItem(itemId);
        
        if (fetchedEvent) {
          console.log("Loaded event:", fetchedEvent);
          setEvent(fetchedEvent);
          
          // Select a random image from the array
          const randomIndex = Math.floor(Math.random() * activityImgs.length);
          setRandomImage(activityImgs[randomIndex]);
          
          // Removed related events fetching
        } else {
          // FALLBACK - Generate a mock event 
          console.log("Event not found - using fallback mock event");
          
          const mockEvent = {
            id: itemId,
            eventID: `mock-${itemId}`,
            title: "Volleyball Event",
            description: "This is a fallback event because the original wasn't found. You can still see the format of how events are displayed.",
            location: "Recreation Center",
            eventDate: "March 25, 2025",
            category: "drop-in",
            level: "All Levels",
            fee: "Free",
            status: "Open",
            openings: "5",
            ages: "All Ages"
          };
          
          setEvent(mockEvent);
          const randomIndex = Math.floor(Math.random() * activityImgs.length);
          setRandomImage(activityImgs[randomIndex]);
        }
      } catch (error) {
        console.error('Error loading event details:', error);
        
        // Create mock data instead of showing error
        const mockEvent = {
          id: itemId,
          eventID: `mock-${itemId}`,
          title: "Example Volleyball Event",
          description: "This is an example event to demonstrate the layout and design of an event details page.",
          location: "Recreation Center",
          eventDate: "March 25, 2025",
          category: "drop-in",
          level: "All Levels",
          fee: "Free",
          status: "Open",
          openings: "10",
          ages: "All Ages"
        };
        
        setEvent(mockEvent);
        const randomIndex = Math.floor(Math.random() * activityImgs.length);
        setRandomImage(activityImgs[randomIndex]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEventDetails();
  }, [itemId, navigation]);

  const handleShare = async () => {
    if (!event) return;
    
    try {
      const dateInfo = safeGetEventDate(event) ? ` on ${safeGetEventDate(event)}` : '';
      await Share.share({
        message: `Check out this volleyball event: ${event.title} - ${event.location || 'Location TBD'} (${event.level || 'All Levels'})${dateInfo}`,
        title: event.title,
      });
    } catch (error) {
      console.error(error);
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

        {/* Image section - Updated to show random image */}
        <View style={styles.imageContainer}>
          {randomImage ? (
            <Image 
              source={randomImage}
              style={styles.eventImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="volleyball-outline" size={60} color="#999" />
              <Text style={styles.placeholderText}>Event image will be added later</Text>
            </View>
          )}
        </View>

        {/* Event details card */}
        <View style={styles.detailsCard}>
          <Text style={styles.itemTitle}>{event.title || "Unnamed Event"}</Text>
          
          {/* Category and Level badges - Only show if available */}
          <View style={styles.categoryContainer}>
            {event.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{event.category}</Text>
              </View>
            )}
            {event.level && (
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{event.level}</Text>
              </View>
            )}
          </View>
          
          {/* Status and Openings - Only show if available */}
          {(event.status || event.openings !== undefined) && (
            <View style={styles.statusContainer}>
              {event.status && (
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
              )}
              
              {event.openings !== undefined && (
                <View style={styles.participantsContainer}>
                  <Ionicons name="people-outline" size={16} color="#666" />
                  <Text style={styles.participantsText}>
                    {event.openings} {parseInt(event.openings) === 1 ? 'spot' : 'spots'} available
                  </Text>
                </View>
              )}
            </View>
          )}
          
          <View style={styles.divider} />
          
          {/* Only show description section if there is a description */}
          {event.description && (
            <>
              <Text style={styles.sectionTitle}>About This Event</Text>
              <Text style={styles.descriptionText}>{event.description}</Text>
              <View style={styles.divider} />
            </>
          )}
          
          <Text style={styles.sectionTitle}>Event Details</Text>
          
          {/* Only show date row if date is available */}
          {safeGetEventDate(event) && (
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="calendar-outline" size={20} color="rgb(168, 38, 29)" />
              </View>
              <Text style={styles.detailLabel}>Date & Time:</Text>
              <Text style={styles.detailValue}>
                {formatEventDate(safeGetEventDate(event))}
              </Text>
            </View>
          )}
          
          {/* Only show location row if location is available */}
          {event.location && (
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="location-outline" size={20} color="rgb(168, 38, 29)" />
              </View>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>{event.location}</Text>
            </View>
          )}
          
          {/* Only show level row if level is available */}
          {event.level && (
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="trophy-outline" size={20} color="rgb(168, 38, 29)" />
              </View>
              <Text style={styles.detailLabel}>Level:</Text>
              <Text style={styles.detailValue}>{event.level}</Text>
            </View>
          )}
          
          {/* Only show fee row if fee is available */}
          {event.fee && (
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="cash-outline" size={20} color="rgb(168, 38, 29)" />
              </View>
              <Text style={styles.detailLabel}>Fee:</Text>
              <Text style={styles.detailValue}>{event.fee}</Text>
            </View>
          )}
          
          {/* Only show ages row if ages is available */}
          {event.ages && (
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="people-outline" size={20} color="rgb(168, 38, 29)" />
              </View>
              <Text style={styles.detailLabel}>Ages:</Text>
              <Text style={styles.detailValue}>{event.ages}</Text>
            </View>
          )}

          {/* Add event link row if available */}
          {event.eventLink && (
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="link-outline" size={20} color="rgb(168, 38, 29)" />
              </View>
              <Text style={styles.detailLabel}>Event Link:</Text>
              <Text style={[styles.detailValue, styles.linkText]} 
                    onPress={() => Alert.alert("Event Link", "This would open the external event link.")}>
                View Details
              </Text>
            </View>
          )}
        </View>
        
        {/* Show Action button for registration */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              event.status === 'Full' ? styles.disabledButton : styles.joinButton
            ]}
            onPress={() => {
              Alert.alert(
                "Registration",
                "Would you like to register for this event?",
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: "Register", 
                    onPress: () => Alert.alert(
                      "Registration Info",
                      "This would navigate to the registration page or process."
                    )
                  }
                ]
              );
            }}
            disabled={event.status === 'Full'}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>
              {event.status === 'Full' ? "Event Full" : "Register for Event"}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Removed related events section */}
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
  eventImage: {
    width: '100%',
    height: 200,
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
  linkText: {
    color: 'rgb(168, 38, 29)',
    textDecorationLine: 'underline',
  },
  actionsContainer: {
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgb(168, 38, 29)',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  actionButtonText: {
    color: '#fff',
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
  relatedItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  }
});

export default ItemDetailScreen;