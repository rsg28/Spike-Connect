// screens/MyEventsScreen.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackendService from '../services/BackendService';

const MyEventsScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();

    // Refresh when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadEvents();
    });

    return unsubscribe;
  }, [navigation]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch only the user's events
      // For demo purposes, we'll use all events and simulate participation
      const allEvents = await BackendService.getAllItems();
      
      // Simulate participation in some events (every other event)
      const myEvents = allEvents.filter((_, index) => index % 2 === 0);
      
      setEvents(myEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatEventDate = (dateString) => {
    return dateString;
  };

  // Check if event is in the past
  const isEventPast = (dateString) => {
    const eventDate = new Date(dateString.split(',')[0]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  };

  // Filter events based on active tab
  const filteredEvents = events.filter(event => 
    activeTab === 'upcoming' 
      ? !isEventPast(event.eventDate)
      : isEventPast(event.eventDate)
  );

  // Render a single event
  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
    >
      <View style={styles.eventHeader}>
        <View style={styles.eventTypeContainer}>
          <View 
            style={[
              styles.eventTypeBadge, 
              { 
                backgroundColor: 
                  item.category === 'Tournament' ? 'rgba(168, 38, 29, 0.1)' :
                  item.category === 'League' ? 'rgba(33, 150, 243, 0.1)' :
                  item.category === 'Training' ? 'rgba(76, 175, 80, 0.1)' :
                  'rgba(255, 179, 0, 0.1)'
              }
            ]}
          >
            <Text 
              style={[
                styles.eventTypeText,
                {
                  color: 
                    item.category === 'Tournament' ? 'rgb(168, 38, 29)' :
                    item.category === 'League' ? '#2196F3' :
                    item.category === 'Training' ? '#4CAF50' :
                    '#FFB300'
                }
              ]}
            >
              {item.category}
            </Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{item.level}</Text>
          </View>
        </View>
        <View 
          style={[
            styles.statusBadge,
            {
              backgroundColor: 
                item.status === 'Full' ? 'rgba(244, 67, 54, 0.1)' :
                item.status === 'In Progress' ? 'rgba(255, 179, 0, 0.1)' :
                'rgba(76, 175, 80, 0.1)'
            }
          ]}
        >
          <Text 
            style={[
              styles.statusText,
              {
                color: 
                  item.status === 'Full' ? '#F44336' :
                  item.status === 'In Progress' ? '#FFB300' :
                  '#4CAF50'
              }
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.eventTitle}>{item.title}</Text>

      <View style={styles.eventDetailsRow}>
        <View style={styles.eventDetailItem}>
          <Ionicons name="calendar-outline" size={16} color="rgb(168, 38, 29)" />
          <Text style={styles.eventDetailText}>{formatEventDate(item.eventDate)}</Text>
        </View>
        <View style={styles.eventDetailItem}>
          <Ionicons name="location-outline" size={16} color="rgb(168, 38, 29)" />
          <Text style={styles.eventDetailText}>{item.location}</Text>
        </View>
      </View>

      <View style={styles.eventParticipantsRow}>
        <View style={styles.eventParticipantsIndicator}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.eventParticipantsText}>
            {item.currentParticipants}/{item.maxParticipants}
          </Text>
        </View>
        <View style={styles.eventFeeContainer}>
          <Text style={styles.eventFeeText}>{item.fee}</Text>
        </View>
      </View>

      {/* Additional options for upcoming events */}
      {!isEventPast(item.eventDate) && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
          >
            <Ionicons name="eye-outline" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.leaveButton]}
            onPress={() => {
              // Handle leaving the event
              alert('You have left this event');
              loadEvents(); // Reload events
            }}
          >
            <Ionicons name="close-circle-outline" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Leave Event</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="rgb(168, 38, 29)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Events</Text>
        <View style={styles.placeholderView} />
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgb(168, 38, 29)" />
          <Text style={styles.loadingText}>Loading your events...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderEventItem}
          contentContainerStyle={styles.eventsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No {activeTab} events</Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'upcoming' 
                  ? "You haven't joined any upcoming events yet" 
                  : "You don't have any past events"}
              </Text>
              {activeTab === 'upcoming' && (
                <TouchableOpacity 
                  style={styles.findEventsButton}
                  onPress={() => navigation.navigate('Home')}
                >
                  <Text style={styles.findEventsButtonText}>Find Events</Text>
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
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholderView: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'rgb(168, 38, 29)',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: 'rgb(168, 38, 29)',
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
  eventsList: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  eventTypeContainer: {
    flexDirection: 'row',
  },
  eventTypeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  eventTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  levelBadge: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  eventDetailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  eventParticipantsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  eventParticipantsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventParticipantsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  eventFeeContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  eventFeeText: {
    fontSize: 12,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(168, 38, 29)',
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  leaveButton: {
    backgroundColor: '#F44336',
    marginRight: 0,
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  findEventsButton: {
    backgroundColor: 'rgb(168, 38, 29)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  findEventsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MyEventsScreen;