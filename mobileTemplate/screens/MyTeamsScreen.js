// screens/MyTeamsScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
  Dimensions,
  Keyboard,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MyTeamsScreen = ({ navigation }) => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamType, setNewTeamType] = useState('Indoor');
  const [newTeamLevel, setNewTeamLevel] = useState('Intermediate');
  const inputRef = useRef(null);

  // Sample teams data
  const sampleTeams = [
    {
      id: '1',
      name: 'Spike Masters',
      type: 'Indoor',
      level: 'Advanced',
      memberCount: 12,
      captainName: 'John Doe',
      isUserCaptain: true,
      wins: 14,
      losses: 6,
      nextMatch: 'Mar 22, 2025, 6:00 PM',
      location: 'Metro Sports Center',
      avatar: null,
    },
    {
      id: '2',
      name: 'Beach Volleys',
      type: 'Beach',
      level: 'Intermediate',
      memberCount: 8,
      captainName: 'Sarah Johnson',
      isUserCaptain: false,
      wins: 8,
      losses: 4,
      nextMatch: 'Mar 28, 2025, 4:30 PM',
      location: 'Sunset Beach',
      avatar: null,
    },
    {
      id: '3',
      name: 'Skyliners VC',
      type: 'Indoor',
      level: 'Beginner',
      memberCount: 10,
      captainName: 'Mike Wilson',
      isUserCaptain: false,
      wins: 5,
      losses: 7,
      nextMatch: 'Apr 5, 2025, 1:00 PM',
      location: 'Community Center',
      avatar: null,
    },
  ];

  useEffect(() => {
    // Simulate loading teams from an API
    const loadTeams = () => {
      setIsLoading(true);
      setTimeout(() => {
        setTeams(sampleTeams);
        setIsLoading(false);
      }, 1000);
    };

    loadData();

    // Refresh when screen comes into focus
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const loadData = () => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      setTeams(sampleTeams);
      setIsLoading(false);
    }, 1000);
  };

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      Alert.alert('Error', 'Please enter a team name');
      return;
    }

    // Create new team object
    const newTeam = {
      id: Date.now().toString(),
      name: newTeamName.trim(),
      type: newTeamType,
      level: newTeamLevel,
      memberCount: 1,
      captainName: 'John Doe', // Current user would be the captain
      isUserCaptain: true,
      wins: 0,
      losses: 0,
      nextMatch: 'Not scheduled',
      location: 'Not set',
      avatar: null,
    };

    // Add to teams list
    setTeams([newTeam, ...teams]);
    
    // Reset and close modal
    hideCreateModal();
    
    // Show confirmation
    Alert.alert('Success', `Team "${newTeamName}" has been created!`);
  };

  const showCreateModalHandler = () => {
    // Reset form
    setNewTeamName('');
    setNewTeamType('Indoor');
    setNewTeamLevel('Intermediate');
    // Show modal
    setShowCreateModal(true);
  };

  const hideCreateModal = () => {
    // Dismiss keyboard
    Keyboard.dismiss();
    // Reset form
    setNewTeamName('');
    // Close modal
    setShowCreateModal(false);
  };

  // Generate initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Render a single team card
  const renderTeamItem = ({ item }) => (
    <TouchableOpacity
      style={styles.teamCard}
      onPress={() => {
        // Navigate to team details (this would be implemented in a full app)
        Alert.alert('Team Details', `View details for team "${item.name}"`);
      }}
    >
      <View style={styles.teamHeader}>
        <View style={styles.teamAvatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.teamAvatar} />
          ) : (
            <View style={[
              styles.teamAvatarPlaceholder,
              {
                backgroundColor: 
                  item.type === 'Beach' ? '#FFB300' : 
                  item.type === 'Indoor' ? 'rgb(168, 38, 29)' : 
                  '#2196F3'
              }
            ]}>
              <Text style={styles.teamAvatarText}>
                {getInitials(item.name)}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{item.name}</Text>
          <View style={styles.teamTypeRow}>
            <View style={[
              styles.teamTypeBadge,
              {
                backgroundColor: 
                  item.type === 'Beach' ? 'rgba(255, 179, 0, 0.1)' : 
                  item.type === 'Indoor' ? 'rgba(168, 38, 29, 0.1)' : 
                  'rgba(33, 150, 243, 0.1)'
              }
            ]}>
              <Text style={[
                styles.teamTypeText,
                {
                  color: 
                    item.type === 'Beach' ? '#FFB300' : 
                    item.type === 'Indoor' ? 'rgb(168, 38, 29)' : 
                    '#2196F3'
                }
              ]}>
                {item.type}
              </Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{item.level}</Text>
            </View>
          </View>
        </View>
        
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </View>
      
      <View style={styles.teamStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.memberCount}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.wins}</Text>
          <Text style={styles.statLabel}>Wins</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.losses}</Text>
          <Text style={styles.statLabel}>Losses</Text>
        </View>
      </View>
      
      <View style={styles.teamDetailsSection}>
        <View style={styles.teamDetailRow}>
          <View style={styles.teamDetailIcon}>
            <Ionicons name="person-outline" size={16} color="rgb(168, 38, 29)" />
          </View>
          <Text style={styles.teamDetailLabel}>Captain:</Text>
          <Text style={styles.teamDetailValue}>
            {item.captainName} {item.isUserCaptain && '(You)'}
          </Text>
        </View>
        
        <View style={styles.teamDetailRow}>
          <View style={styles.teamDetailIcon}>
            <Ionicons name="calendar-outline" size={16} color="rgb(168, 38, 29)" />
          </View>
          <Text style={styles.teamDetailLabel}>Next Match:</Text>
          <Text style={styles.teamDetailValue}>{item.nextMatch}</Text>
        </View>
        
        <View style={styles.teamDetailRow}>
          <View style={styles.teamDetailIcon}>
            <Ionicons name="location-outline" size={16} color="rgb(168, 38, 29)" />
          </View>
          <Text style={styles.teamDetailLabel}>Location:</Text>
          <Text style={styles.teamDetailValue}>{item.location}</Text>
        </View>
      </View>
      
      <View style={styles.teamActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            Alert.alert('Team Chat', `Chat with "${item.name}" members`);
          }}
        >
          <Ionicons name="chatbubble-outline" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Team Chat</Text>
        </TouchableOpacity>
        
        {item.isUserCaptain ? (
          <TouchableOpacity 
            style={[styles.actionButton, styles.manageButton]}
            onPress={() => {
              Alert.alert('Manage Team', `Manage "${item.name}" settings`);
            }}
          >
            <Ionicons name="settings-outline" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Manage Team</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.actionButton, styles.leaveButton]}
            onPress={() => {
              Alert.alert(
                'Leave Team',
                `Are you sure you want to leave "${item.name}"?`,
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Leave',
                    onPress: () => {
                      // Remove team from list
                      setTeams(teams.filter(team => team.id !== item.id));
                    },
                    style: 'destructive',
                  },
                ]
              );
            }}
          >
            <Ionicons name="exit-outline" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Leave Team</Text>
          </TouchableOpacity>
        )}
      </View>
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
        <Text style={styles.headerTitle}>My Teams</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={showCreateModalHandler}
        >
          <Ionicons name="add" size={24} color="rgb(168, 38, 29)" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgb(168, 38, 29)" />
          <Text style={styles.loadingText}>Loading your teams...</Text>
        </View>
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id}
          renderItem={renderTeamItem}
          contentContainerStyle={styles.teamsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No Teams Yet</Text>
              <Text style={styles.emptySubtitle}>
                You haven't joined any volleyball teams yet
              </Text>
              <TouchableOpacity 
                style={styles.createTeamButton}
                onPress={showCreateModalHandler}
              >
                <Text style={styles.createTeamButtonText}>Create Team</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
      
      {/* Create Team Modal */}
      {showCreateModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create New Team</Text>
                <TouchableOpacity 
                  onPress={hideCreateModal}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                style={styles.modalScrollContent}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.modalScrollContainer}
              >
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Team Name</Text>
                  <TextInput
                    ref={inputRef}
                    style={styles.textInput}
                    placeholder="Enter team name"
                    value={newTeamName}
                    onChangeText={setNewTeamName}
                    returnKeyType="done"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Team Type</Text>
                  <View style={styles.optionButtonsContainer}>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        newTeamType === 'Indoor' && styles.selectedOption,
                      ]}
                      onPress={() => setNewTeamType('Indoor')}
                    >
                      <Text 
                        style={[
                          styles.optionButtonText,
                          newTeamType === 'Indoor' && styles.selectedOptionText,
                        ]}
                      >
                        Indoor
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        newTeamType === 'Beach' && styles.selectedOption,
                      ]}
                      onPress={() => setNewTeamType('Beach')}
                    >
                      <Text 
                        style={[
                          styles.optionButtonText,
                          newTeamType === 'Beach' && styles.selectedOptionText,
                        ]}
                      >
                        Beach
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        newTeamType === 'Grass' && styles.selectedOption,
                      ]}
                      onPress={() => setNewTeamType('Grass')}
                    >
                      <Text 
                        style={[
                          styles.optionButtonText,
                          newTeamType === 'Grass' && styles.selectedOptionText,
                        ]}
                      >
                        Grass
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Skill Level</Text>
                  <View style={styles.optionButtonsContainer}>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        newTeamLevel === 'Beginner' && styles.selectedOption,
                      ]}
                      onPress={() => setNewTeamLevel('Beginner')}
                    >
                      <Text 
                        style={[
                          styles.optionButtonText,
                          newTeamLevel === 'Beginner' && styles.selectedOptionText,
                        ]}
                      >
                        Beginner
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        newTeamLevel === 'Intermediate' && styles.selectedOption,
                      ]}
                      onPress={() => setNewTeamLevel('Intermediate')}
                    >
                      <Text 
                        style={[
                          styles.optionButtonText,
                          newTeamLevel === 'Intermediate' && styles.selectedOptionText,
                        ]}
                      >
                        Intermediate
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        newTeamLevel === 'Advanced' && styles.selectedOption,
                      ]}
                      onPress={() => setNewTeamLevel('Advanced')}
                    >
                      <Text 
                        style={[
                          styles.optionButtonText,
                          newTeamLevel === 'Advanced' && styles.selectedOptionText,
                        ]}
                      >
                        Advanced
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
              
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={hideCreateModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleCreateTeam}
                >
                  <Text style={styles.createButtonText}>Create Team</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
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
  addButton: {
    padding: 8,
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
  teamsList: {
    padding: 16,
  },
  teamCard: {
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
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamAvatarContainer: {
    marginRight: 12,
  },
  teamAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  teamAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  teamTypeRow: {
    flexDirection: 'row',
  },
  teamTypeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  teamTypeText: {
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
  teamStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(168, 38, 29)',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  teamDetailsSection: {
    marginBottom: 12,
  },
  teamDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamDetailIcon: {
    marginRight: 8,
  },
  teamDetailLabel: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  teamDetailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  teamActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(168, 38, 29)',
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  manageButton: {
    backgroundColor: '#2196F3',
    marginRight: 0,
    marginLeft: 8,
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
  createTeamButton: {
    backgroundColor: 'rgb(168, 38, 29)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  createTeamButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  // Modal Styles - completely redesigned for better stability
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  closeButton: {
    padding: 4,
  },
  modalScrollContent: {
    maxHeight: 400,
  },
  modalScrollContainer: {
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 4,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 80,
  },
  selectedOption: {
    backgroundColor: 'rgba(168, 38, 29, 0.1)',
    borderColor: 'rgb(168, 38, 29)',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionText: {
    color: 'rgb(168, 38, 29)',
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: 'rgb(168, 38, 29)',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MyTeamsScreen;