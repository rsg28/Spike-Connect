// screens/ProfileScreen.js
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
          </View>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@example.com</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>152</Text>
              <Text style={styles.statLabel}>Items</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>86</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>27</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="person-outline" size={22} color="rgb(168, 38, 29)" />
            <Text style={styles.optionText}>Personal Information</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="settings-outline" size={22} color="rgb(168, 38, 29)" />
            <Text style={styles.optionText}>Settings</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="notifications-outline" size={22} color="rgb(168, 38, 29)" />
            <Text style={styles.optionText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="shield-outline" size={22} color="rgb(168, 38, 29)" />
            <Text style={styles.optionText}>Privacy & Security</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="help-circle-outline" size={22} color="rgb(168, 38, 29)" />
            <Text style={styles.optionText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={22} color="#fff" />
            <Text style={styles.logoutText}>Log Out</Text>
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
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgb(168, 38, 29)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
  editProfileButton: {
    backgroundColor: 'rgba(168, 38, 29, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editProfileText: {
    color: 'rgb(168, 38, 29)',
    fontWeight: '500',
  },
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
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
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(168, 38, 29)',
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default ProfileScreen;