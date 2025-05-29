// screens/SearchScreen.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackendService from '../services/BackendService';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Popular searches for volleyball events
  const popularSearches = ['tournament', 'beginner', 'beach', 'indoor', 'advanced'];
  
  // Filter categories
  const categories = ['All', 'Tournament', 'League', 'Training', 'Casual', 'Drop-in'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleSearch = async (text) => {
    setSearchQuery(text);
    
    if (text.length > 0) {
      setSearching(true);
      setIsLoading(true);
      
      try {
        // Use the BackendService to search for events
        const searchResults = await BackendService.searchEvents(text);
        
        // Filter by category if not 'All'
        const filteredResults = selectedCategory === 'All' 
          ? searchResults 
          : searchResults.filter(item => item.category === selectedCategory);
          
        setResults(filteredResults);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearching(false);
      setResults([]);
    }
  };
  
  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    
    // If there's an active search, filter by the new category
    if (searchQuery.length > 0) {
      handleSearch(searchQuery);
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header Section */}
      <View style={styles.headerSection}>
        {/* Search Box */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Find volleyball events..."
              value={searchQuery}
              onChangeText={handleSearch}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Category Filter */}
        
      </View>

      {/* Scrollable Content Section */}
      {!searching ? (
        <ScrollView style={styles.contentContainer}>
          <View style={styles.popularSearchesContainer}>
            <Text style={styles.sectionTitle}>Popular Searches</Text>
            {popularSearches.map((search, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.popularSearchItem}
                onPress={() => handleSearch(search)}
              >
                <Ionicons name="trending-up-outline" size={20} color="rgb(168, 38, 29)" />
                <Text style={styles.popularSearchText}>{search}</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </TouchableOpacity>
            ))}

            <View style={styles.quickFiltersSection}>
              <Text style={styles.sectionTitle}>Quick Filters</Text>
              <View style={styles.quickFiltersRow}>
                <TouchableOpacity 
                  style={styles.quickFilterButton}
                  onPress={() => handleCategorySelect('Tournament')}
                >
                  <View style={styles.quickFilterIcon}>
                    <Ionicons name="trophy-outline" size={24} color="rgb(168, 38, 29)" />
                  </View>
                  <Text style={styles.quickFilterText}>Tournaments</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quickFilterButton}
                  onPress={() => navigation.navigate('DropInSessions')}
                >
                  <View style={styles.quickFilterIcon}>
                    <Ionicons name="school-outline" size={24} color="rgb(168, 38, 29)" />
                  </View>
                  <Text style={styles.quickFilterText}>Drop-in</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.quickFiltersRow}>
                <TouchableOpacity 
                  style={styles.quickFilterButton}
                  onPress={() => {
                    setSelectedCategory('All');
                    handleSearch('today');
                  }}
                >
                  <View style={styles.quickFilterIcon}>
                    <Ionicons name="today-outline" size={24} color="rgb(168, 38, 29)" />
                  </View>
                  <Text style={styles.quickFilterText}>Today</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quickFilterButton}
                  onPress={() => {
                    setSelectedCategory('All');
                    handleSearch('beach');
                  }}
                >
                  <View style={styles.quickFilterIcon}>
                    <Ionicons name="sunny-outline" size={24} color="rgb(168, 38, 29)" />
                  </View>
                  <Text style={styles.quickFilterText}>Beach Events</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        // Results Section
        <>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="rgb(168, 38, 29)" />
              <Text style={styles.loadingText}>Searching for events...</Text>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const isOpen = item.status === 'Open';
                return (
                  <TouchableOpacity 
                    style={styles.resultItem}
                    onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
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
              }}
              ListEmptyComponent={
                <View style={styles.noResultsContainer}>
                  <Ionicons name="search-outline" size={50} color="#ccc" />
                  <Text style={styles.noResultsText}>No events found</Text>
                  <Text style={styles.noResultsSubtext}>Try different keywords or filters</Text>
                </View>
              }
              contentContainerStyle={styles.resultsList}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  chevronContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  headerSection: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  categoryFilterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedCategoryChip: {
    backgroundColor: 'rgba(168, 38, 29, 0.1)',
    borderColor: 'rgb(168, 38, 29)',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryChipText: {
    color: 'rgb(168, 38, 29)',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
  },
  popularSearchesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  popularSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  popularSearchText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
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
  sessionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sessionBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  quickFiltersSection: {
    marginTop: 24,
  },
  quickFiltersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quickFilterButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  quickFilterIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(168, 38, 29, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickFilterText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
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
  resultsList: {
    padding: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  resultIconContainer: {
    marginRight: 12,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(168, 38, 29, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  resultDetailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  categoryBadge: {
    backgroundColor: 'rgba(168, 38, 29, 0.1)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: 'rgb(168, 38, 29)',
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
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});

export default SearchScreen;
