import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  LayoutAnimation, 
  Platform, 
  UIManager
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackendService from '../services/BackendService';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DropInSessionsScreen = ({ navigation }) => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: 'All',
    date: 'All',
    status: 'All',
    // fee: 'All',
  });
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState(new Set());

  // Filter options
  const locationOptions = ['All', 'Burnaby', 'New Westminster'];
  const dateOptions = ['All', 'Today', 'This Week', 'This Month'];
  const statusOptions = ['All', 'Open', 'Full'];

  useEffect(() => {
    loadSessions();
  }, [filters]);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const allSessions = await BackendService.searchEvents('drop-in');
      let filteredSessions = allSessions.filter(session => session.category === 'Drop-in');

      // Apply filters
      if (filters.location !== 'All') {
        filteredSessions = filteredSessions.filter(session => 
          session.city.includes(filters.location)
        );
      }

      if (filters.status !== 'All') {
        filteredSessions = filteredSessions.filter(session => 
          session.status.includes(filters.status)
        );
      }

      if (filters.date !== 'All') {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day
        
        filteredSessions = filteredSessions.filter(session => {
          // Parse YYYY-MM-DD format
          const [year, month, day] = session.eventDate.split('-').map(Number);
          const sessionDate = new Date(year, month - 1, day); // month is 0-indexed
          sessionDate.setHours(0, 0, 0, 0); // Set to start of day
          
          switch (filters.date) {
            case 'Today':
              return sessionDate.getTime() === today.getTime();
            case 'This Week':
              const weekEnd = new Date(today);
              weekEnd.setDate(today.getDate() + 7);
              weekEnd.setHours(0, 0, 0, 0);
              return sessionDate >= today && sessionDate <= weekEnd;
            case 'This Month':
              const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
              monthEnd.setHours(0, 0, 0, 0);
              return sessionDate >= today && sessionDate <= monthEnd;
            default:
              return true;
          }
        });
      }

      // if (filters.fee !== 'All') {
      //   filteredSessions = filteredSessions.filter(session => {
      //     if (filters.fee === 'Free') {
      //       return !session.fee || session.fee === '0';
      //     } else {
      //       return session.fee && session.fee !== '0';
      //     }
      //   });
      // }

      setSessions(filteredSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a refresh function
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Just reload the sessions without reinitializing the backend service
      await loadSessions();
    } catch (error) {
      console.error("Error refreshing data:", error);
      setError("Failed to refresh data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFilters = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFilters(f => !f);
  };

  const resetFilters = () => {
    setFilters({
      location: 'All',
      date: 'All',
      status: 'All',
      // fee: 'All',
    });
  };

  const toggleFilter = (filterType) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(filterType)) {
        newSet.delete(filterType);
      } else {
        newSet.add(filterType);
      }
      return newSet;
    });
  };

  const renderFilterButton = (title, options, currentValue, onSelect, filterType) => (
    <View style={styles.filterSection}>
      <TouchableOpacity 
        style={styles.filterHeader}
        onPress={() => toggleFilter(filterType)}
      >
        <Text style={styles.filterTitle}>{title}</Text>
        <Ionicons 
          name={expandedFilters.has(filterType) ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#666" 
        />
      </TouchableOpacity>
      {expandedFilters.has(filterType) && (
        <View style={styles.filterOptions}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.filterChip,
                currentValue === option && styles.selectedFilterChip,
              ]}
              onPress={() => onSelect(option)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  currentValue === option && styles.selectedFilterChipText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderSession = ({ item }) => {
    // Format the date properly
    const formatDate = (dateString) => {
      try {
        // Parse YYYY-MM-DD format
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day); // month is 0-indexed in JS
        
        // Format the date
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
      }
    };

    const isOpen = item.status === 'Open';

    return (
      <TouchableOpacity 
        onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
        style={styles.sessionCard}
      >
        <View style={styles.sessionContent}>
          <View style={styles.sessionHeader}>
            <Text style={styles.sessionTitle}>{item.title}</Text>
            <View style={[
              styles.sessionBadge,
              { backgroundColor: isOpen ? 'rgba(76, 175, 80, 0.1)' : 'rgba(168, 38, 29, 0.1)' }
            ]}>
              <Text style={[
                styles.sessionBadgeText,
                { color: isOpen ? 'rgb(76, 175, 80)' : 'rgb(168, 38, 29)' }
              ]}>{item.status}</Text>
            </View>
          </View>
          
          <View style={styles.sessionDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{item.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{item.dayOfWeek.slice(0, 3)} - {formatDate(item.eventDate)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{item.eventTime}</Text>
            </View>
          </View>
        </View>
        <View style={styles.chevronContainer}>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.headerTitle}>Drop-in Sessions</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={toggleFilters} style={styles.iconBtn}>
            <Ionicons name="filter-outline" size={24} color="rgb(168, 38, 29)" />
          </TouchableOpacity>
        </View>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          {renderFilterButton('Location', locationOptions, filters.location,
            loc => setFilters({ ...filters, location: loc }), 'location')}
          {renderFilterButton('Date', dateOptions, filters.date,
            dt => setFilters({ ...filters, date: dt }), 'date')}
          {renderFilterButton('Status', statusOptions, filters.status,
            status => setFilters({ ...filters, status: status }), 'status')}
          <TouchableOpacity 
            onPress={resetFilters}
          >
            <Text style={styles.clearFiltersText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgb(168, 38, 29)" />
          <Text style={styles.loadingText}>Loading sessions...</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSession}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.sessionsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No sessions found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
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
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterSection: {
    marginBottom: 8,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedFilterChip: {
    backgroundColor: 'rgba(168, 38, 29, 0.1)',
    borderColor: 'rgb(168, 38, 29)',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  selectedFilterChipText: {
    color: 'rgb(168, 38, 29)',
    fontWeight: '500',
  },
  sessionsList: {
    padding: 16,
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionContent: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  sessionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sessionBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sessionDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  refreshButton: {
    padding: 8,
  },
  clearFiltersText: {
    color: 'rgb(168, 38, 29)',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  iconBtn: {
    padding: 8,
  },
  chevronContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
});

export default DropInSessionsScreen; 