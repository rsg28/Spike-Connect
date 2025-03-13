// screens/SearchScreen.js
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Sample search results data
const sampleItems = [
  { id: '1', title: 'Item 1', category: 'Category A' },
  { id: '2', title: 'Item 2', category: 'Category B' },
  { id: '3', title: 'Different Item', category: 'Category A' },
  { id: '4', title: 'Another Item', category: 'Category C' },
  { id: '5', title: 'Special Item', category: 'Category B' },
  { id: '6', title: 'Last Item', category: 'Category D' },
];

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Recent searches
  const recentSearches = ['item', 'category a', 'special'];

  const handleSearch = (text) => {
    setSearchQuery(text);
    
    if (text.length > 0) {
      setSearching(true);
      // Filter items that match the search query
      const filteredResults = sampleItems.filter(
        item => 
          item.title.toLowerCase().includes(text.toLowerCase()) ||
          item.category.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setSearching(false);
      setResults([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items or categories..."
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

      {!searching && (
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
          {recentSearches.map((search, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.recentSearchItem}
              onPress={() => handleSearch(search)}
            >
              <Ionicons name="time-outline" size={20} color="#999" />
              <Text style={styles.recentSearchText}>{search}</Text>
              <TouchableOpacity>
                <Ionicons name="close" size={16} color="#999" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {searching && (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultItem}>
              <View style={styles.resultContent}>
                <Text style={styles.resultTitle}>{item.title}</Text>
                <Text style={styles.resultCategory}>{item.category}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={50} color="#ccc" />
              <Text style={styles.noResultsText}>No results found</Text>
              <Text style={styles.noResultsSubtext}>Try different keywords</Text>
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
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  recentSearchesContainer: {
    padding: 16,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentSearchText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  resultCategory: {
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