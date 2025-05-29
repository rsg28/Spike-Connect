// screens/ItemDetailScreen.js - Updated to adapt to available data

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
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackendService from '../services/BackendService';

const ItemDetailScreen = ({ route, navigation }) => {
  const { itemId } = route.params;
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [imageSource, setImageSource] = useState(null);

  // Image mapping for location-based images
  const locationImages = {
    bonsor: require("../assets/media/images/bonsor.png"),
    christine: require("../assets/media/images/christine.png"),
    edmonds: require("../assets/media/images/edmonds.png"),
    pittmeadows: require("../assets/media/images/pittmeadows.png"),
    queensborough: require("../assets/media/images/queensborough.png"),
    default: require("../assets/media/images/favicon.png")
  };

  // Safe formatting for event date display
  const formatEventDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  // Helper function to abbreviate day of week
  const abbreviateDayOfWeek = (day) => {
    if (!day) return '';
    return day.substring(0, 3);
  };

  // Fetch event details when component mounts
  useEffect(() => {
    const loadEventDetails = async () => {
      setIsLoading(true);
      try {
        const fetchedEvent = await BackendService.getItem(itemId);
        
        if (fetchedEvent) {
          console.log("Loaded event:", fetchedEvent);
          setEvent(fetchedEvent);
          
          // Only fetch related events if level, venue type, and city are available
          if (fetchedEvent.level && fetchedEvent.venueType && fetchedEvent.city) {
            const related = await BackendService.getRelatedItems(
              fetchedEvent.level, 
              fetchedEvent.venueType, 
              fetchedEvent.city,
              fetchedEvent.id
            );
            
            // Assign random images to related events too
            const relatedWithImages = related.map(item => ({
              ...item,
              imageUrl: locationImages.default
            }));
            
            setRelatedEvents(relatedWithImages);
          }
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

  const handleShare = async () => {
    if (!event) return;
    
    try {
      const dateInfo = event.eventDate ? ` on ${event.eventDate}` : '';
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

        {/* Image section */}
        <View style={styles.imageContainer}>
          {(() => {
            if (imageSource) {
              return (
                <Image 
                  source={imageSource}
                  style={styles.eventImage}
                  resizeMode="cover"
                />
              );
            }
            
            const locationFirstWord = event.location ? event.location.split(' ')[0].toLowerCase() : '';
            const imageKey = Object.keys(locationImages).find(key => 
              locationFirstWord.includes(key)
            ) || 'default';
            
            return (
              <Image 
                source={locationImages[imageKey]}
                style={styles.eventImage}
                resizeMode="cover"
                onError={() => setImageSource(locationImages.default)}
              />
            );
          })()}
        </View>

        {/* Event details card */}
        <View style={styles.detailsCard}>
          <View style={styles.titleRow}>
            <Text style={styles.itemTitle}>{event.title}</Text>
            {event.status && (
              <View style={[
                styles.statusBadge, 
                { 
                  backgroundColor: event.status === 'Full' 
                    ? 'rgba(168, 38, 29, 0.1)' 
                    : event.status === 'In Progress' 
                      ? 'rgba(255, 179, 0, 0.1)'
                      : 'rgba(76, 175, 80, 0.1)'
                }
              ]}>
                <Text style={[
                  styles.statusText, 
                  { 
                    color: event.status === 'Full' 
                      ? 'rgb(168, 38, 29)' 
                      : event.status === 'In Progress' 
                        ? '#FFB300'
                        : '#4CAF50'
                  }
                ]}>{event.status}</Text>
              </View>
            )}
          </View>
          {/* Only show location row if location is available */}
          {event.location && (
            <View style={styles.locationRow}>
              <View style={styles.locationIconContainer}>
                <Ionicons name="location-outline" size={20} />
              </View>
              <Text style={styles.locationText}>{event.location}</Text>
            </View>
          )}
          
          {/* Only show date and time if available */}
          {(event.eventDate || event.eventTime) && (
            <View style={styles.DateTimeContainer}>
              <View style={styles.dateTimeIconContainer}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </View>
              <Text style={styles.DateTimeText}>
                {event.eventDate && `${abbreviateDayOfWeek(event.dayOfWeek)}, ${formatEventDate(event.eventDate)}`}
                {event.eventTime && ` • ${event.eventTime}`}
              </Text>
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
          
          {/* Show Openings info */}
          {event.openings && event.openings !== undefined && (
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="people-outline" size={20} color="rgb(168, 38, 29)" />
              </View>
              <Text style={styles.detailLabel}>Spots:</Text>
              <Text style={styles.detailValue}>
                {event.openings === "Full" ? 'Full' : event.openings === "Unspecified" ? 'Unspecified' : `${event.openings} ${parseInt(event.openings) === 1 ? 'spot available' : 'spots available'}`}
              </Text>
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
                    onPress={() => Linking.openURL(event.eventLink)}>
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
            onPress={() => Linking.openURL(event.eventLink)}
            disabled={event.status === 'Full'}
          >
            <Ionicons 
              name={event.status === 'Full' ? "close-circle-outline" : "checkmark-circle-outline"} 
              size={20} 
              color="#fff" 
            />
            <Text style={styles.actionButtonText}>
              {event.status === 'Full' ? "Event Full" : "Register for Event"}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Only show related events section if there are related events */}
        {relatedEvents.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Related Events</Text>
            
            {relatedEvents.map((relatedItem) => (
              <TouchableOpacity 
                key={relatedItem.id} 
                style={styles.relatedItem}
                onPress={() => navigation.navigate('ItemDetail', { itemId: relatedItem.id })}
              >
                <View style={styles.relatedItemContent}>
                  <Text style={styles.relatedItemTitle}>{relatedItem.title}</Text>
                  <View style={styles.relatedItemDetails}>
                    {relatedItem.location && (
                      <>
                        <View style={styles.locationIconContainer}>
                          <Ionicons name="location-outline" size={20} />
                        </View>
                        <Text style={styles.relatedItemLocation}>{relatedItem.location}</Text>
                      </>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    fontSize: 13,
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
    marginBottom: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
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
  statusText: {
    fontSize: 13,
  },
  dateTimeIconContainer: {
    marginRight: 4,
  },
  DateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  DateTimeText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 13,
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
    marginRight: 4,
    width: 24,
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
    width: 100,
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  locationIconContainer: {
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    color: '#333',
  },
  linkText: {
    color: 'rgb(168, 38, 29)',
    textDecorationLine: 'underline',
  },
  actionsContainer: {
    marginTop: 10,
    marginBottom: 20,
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
    fontSize: 13,
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
    alignItems: 'center',
  },
  relatedItemLevel: {
    fontSize: 13,
    color: '#2196F3',
    marginRight: 8,
  },
  relatedItemLocation: {
    fontSize: 13,
    color: '#666',
  }
});

export default ItemDetailScreen;