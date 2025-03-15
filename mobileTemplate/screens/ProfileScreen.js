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
          
          <View style={styles.playerInfo}>
            <View style={styles.playerBadge}>
              <Ionicons name="shield-checkmark-outline" size={14} color="rgb(168, 38, 29)" />
              <Text style={styles.playerBadgeText}>Advanced Player</Text>
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>28</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Teams</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Connections</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        {/* Player Stats */}
        <View style={styles.playerStatsContainer}>
          <Text style={styles.sectionTitle}>Volleyball Stats</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxValue}>176</Text>
              <Text style={styles.statBoxLabel}>Matches</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxValue}>72%</Text>
              <Text style={styles.statBoxLabel}>Win Rate</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxValue}>8.5</Text>
              <Text style={styles.statBoxLabel}>Rating</Text>
            </View>
          </View>
          
          <View style={styles.playerInfoBox}>
            <View style={styles.playerInfoRow}>
              <Text style={styles.playerInfoLabel}>Main Position</Text>
              <Text style={styles.playerInfoValue}>Outside Hitter</Text>
            </View>
            <View style={styles.playerInfoRow}>
              <Text style={styles.playerInfoLabel}>Height</Text>
              <Text style={styles.playerInfoValue}>6'2" (188 cm)</Text>
            </View>
            <View style={styles.playerInfoRow}>
              <Text style={styles.playerInfoLabel}>Playing Since</Text>
              <Text style={styles.playerInfoValue}>2015</Text>
            </View>
            <View style={styles.playerInfoRow}>
              <Text style={styles.playerInfoLabel}>Preferred Location</Text>
              <Text style={styles.playerInfoValue}>Indoor</Text>
            </View>
          </View>
        </View>
        
        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="calendar-outline" size={22} color="rgb(168, 38, 29)" />
            <Text style={styles.optionText}>My Events</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="people-outline" size={22} color="rgb(168, 38, 29)" />
            <Text style={styles.optionText}>My Teams</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="ribbon-outline" size={22} color="rgb(168, 38, 29)" />
            <Text style={styles.optionText}>Achievements</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="settings-outline" size={22} color="rgb(168, 38, 29)" />
            <Text style={styles.optionText}>Settings</Text>
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
    marginBottom: 12,
  },
  playerInfo: {
    marginBottom: 16,
  },
  playerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(168, 38, 29, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  playerBadgeText: {
    fontSize: 12,
    color: 'rgb(168, 38, 29)',
    fontWeight: '500',
    marginLeft: 4,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  playerStatsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(168, 38, 29, 0.05)',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  statBoxValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(168, 38, 29)',
    marginBottom: 4,
  },
  statBoxLabel: {
    fontSize: 12,
    color: '#666',
  },
  playerInfoBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  playerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  playerInfoLabel: {
    fontSize: 14,
    color: '#666',
  },
  playerInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
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