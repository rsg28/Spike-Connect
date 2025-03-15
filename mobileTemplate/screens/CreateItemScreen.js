// screens/CreateEventScreen.js (previously CreateItemScreen.js)
import React, { useState } from 'react';
import BackendService from '../services/BackendService';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  Switch,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CreateEventScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [fee, setFee] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Available categories for volleyball events
  const categories = ['Tournament', 'League', 'Training', 'Casual', 'Competition'];
  const [showCategories, setShowCategories] = useState(false);
  
  // Available levels
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  const [showLevels, setShowLevels] = useState(false);

  // Simple date options
  const [showDateModal, setShowDateModal] = useState(false);
  const dateOptions = [
    'Mar 20, 2025, 10:00 AM',
    'Mar 21, 2025, 2:00 PM',
    'Mar 25, 2025, 7:00 PM',
    'Mar 30, 2025, 9:00 AM',
    'Apr 5, 2025, 1:00 PM',
    'Apr 10, 2025, 6:00 PM',
  ];

  const handleSubmit = async () => {
    // Validate inputs
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the event');
      return;
    }
  
    if (!category) {
      Alert.alert('Error', 'Please select an event category');
      return;
    }
    
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location for the event');
      return;
    }
    
    if (!level) {
      Alert.alert('Error', 'Please select a skill level');
      return;
    }
    
    if (!eventDate) {
      Alert.alert('Error', 'Please set a date and time for the event');
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Create the new event object
      const newEvent = {
        title,
        description,
        category,
        level,
        location,
        eventDate: eventDate,
        dueDate: eventDate.split(',')[0], // Extract just the date part
        fee: fee || 'Free',
        maxParticipants: parseInt(maxParticipants) || 12,
        currentParticipants: 0,
        status: 'Open',
        hostName: 'Your Name', // Would come from user profile in a real app
        isPublic,
        attachments: 0
      };
  
      // Save to backend
      await BackendService.addItem(newEvent);
      
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Volleyball event created successfully',
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Reset form
              setTitle('');
              setDescription('');
              setCategory('');
              setLocation('');
              setLevel('');
              setFee('');
              setMaxParticipants('');
              setEventDate('');
              
              // Navigate back to Home
              navigation.navigate('HomeScreen');
            }
          }
        ]
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to create event. Please try again.');
      console.error(error);
    }
  };

  const selectCategory = (selectedCategory) => {
    setCategory(selectedCategory);
    setShowCategories(false);
  };

  const selectLevel = (selectedLevel) => {
    setLevel(selectedLevel);
    setShowLevels(false);
  };
  
  const selectDate = (date) => {
    setEventDate(date);
    setShowDateModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="rgb(168, 38, 29)" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Volleyball Event</Text>
            <View style={styles.placeholderView} />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Event Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter a descriptive title"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your event, rules, what to bring, etc."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Where will the event take place?"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Event Category</Text>
              <TouchableOpacity 
                style={styles.categorySelector}
                onPress={() => setShowCategories(!showCategories)}
              >
                <Text style={category ? styles.categoryText : styles.placeholderText}>
                  {category || "Select a category"}
                </Text>
                <Ionicons 
                  name={showCategories ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#666"
                />
              </TouchableOpacity>
              
              {showCategories && (
                <View style={styles.categoriesDropdown}>
                  {categories.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.categoryItem}
                      onPress={() => selectCategory(item)}
                    >
                      <Text style={styles.categoryItemText}>{item}</Text>
                      {category === item && (
                        <Ionicons name="checkmark" size={18} color="rgb(168, 38, 29)" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Skill Level</Text>
              <TouchableOpacity 
                style={styles.categorySelector}
                onPress={() => setShowLevels(!showLevels)}
              >
                <Text style={level ? styles.categoryText : styles.placeholderText}>
                  {level || "Select skill level"}
                </Text>
                <Ionicons 
                  name={showLevels ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#666"
                />
              </TouchableOpacity>
              
              {showLevels && (
                <View style={styles.categoriesDropdown}>
                  {levels.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.categoryItem}
                      onPress={() => selectLevel(item)}
                    >
                      <Text style={styles.categoryItemText}>{item}</Text>
                      {level === item && (
                        <Ionicons name="checkmark" size={18} color="rgb(168, 38, 29)" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.rowContainer}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Entry Fee</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Free or amount"
                  value={fee}
                  onChangeText={setFee}
                  keyboardType="default"
                />
              </View>
              
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Max Participants</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 12"
                  value={maxParticipants}
                  onChangeText={setMaxParticipants}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Event Date & Time</Text>
              <TouchableOpacity 
                style={styles.dateSelector}
                onPress={() => setShowDateModal(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="rgb(168, 38, 29)" />
                <Text style={eventDate ? styles.categoryText : styles.placeholderText}>
                  {eventDate || "Select date and time"}
                </Text>
              </TouchableOpacity>
              
              {/* Date Selection Modal */}
              <Modal
                visible={showDateModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowDateModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Select Date & Time</Text>
                      <TouchableOpacity onPress={() => setShowDateModal(false)}>
                        <Ionicons name="close" size={24} color="#333" />
                      </TouchableOpacity>
                    </View>
                    
                    <ScrollView>
                      {dateOptions.map((date, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dateOption}
                          onPress={() => selectDate(date)}
                        >
                          <Ionicons 
                            name="calendar-outline" 
                            size={20} 
                            color="rgb(168, 38, 29)" 
                          />
                          <Text style={styles.dateOptionText}>{date}</Text>
                          {eventDate === date && (
                            <Ionicons name="checkmark" size={18} color="rgb(168, 38, 29)" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    
                    <TouchableOpacity
                      style={styles.modalCancelButton}
                      onPress={() => setShowDateModal(false)}
                    >
                      <Text style={styles.modalCancelText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            
            <View style={styles.switchContainer}>
              <View style={styles.switchLabel}>
                <Ionicons name="globe-outline" size={20} color="rgb(168, 38, 29)" />
                <Text style={styles.switchText}>Public Event</Text>
              </View>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ false: "#ccc", true: "rgba(168, 38, 29, 0.4)" }}
                thumbColor={isPublic ? "rgb(168, 38, 29)" : "#f4f3f4"}
              />
            </View>
            
            <View style={styles.optionsContainer}>
              <Text style={styles.label}>Additional Options</Text>
              
              <TouchableOpacity style={styles.optionItem}>
                <View style={styles.optionTextContainer}>
                  <Ionicons name="images-outline" size={20} color="rgb(168, 38, 29)" />
                  <Text style={styles.optionText}>Add Event Photos</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionItem}>
                <View style={styles.optionTextContainer}>
                  <Ionicons name="people-outline" size={20} color="rgb(168, 38, 29)" />
                  <Text style={styles.optionText}>Invite Players</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionItem}>
                <View style={styles.optionTextContainer}>
                  <Ionicons name="alert-circle-outline" size={20} color="rgb(168, 38, 29)" />
                  <Text style={styles.optionText}>Event Rules</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Creating...' : 'Create Volleyball Event'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholderView: {
    width: 40,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  categorySelector: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateSelector: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    marginLeft: 8,
  },
  categoriesDropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 10,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryItemText: {
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  submitButton: {
    backgroundColor: 'rgb(168, 38, 29)',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dateOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  modalCancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default CreateEventScreen;