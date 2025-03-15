import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AchievementsScreen = () => {
  // Sample achievement data - you would normally fetch this from an API
  const achievements = [
    // Unlocked achievements
    {
      id: 1,
      title: "Rookie Spiker",
      description: "Play your first 10 matches",
      icon: "trophy",
      progress: 100,
      unlocked: true,
      unlockedDate: "Jan 15, 2024",
      category: "Beginner"
    },
    {
      id: 2,
      title: "Team Player",
      description: "Join 3 different teams",
      icon: "people",
      progress: 100,
      unlocked: true, 
      unlockedDate: "Mar 3, 2024",
      category: "Social"
    },
    {
      id: 3,
      title: "Consistent Athlete",
      description: "Participate in events for 3 consecutive months",
      icon: "calendar",
      progress: 100,
      unlocked: true,
      unlockedDate: "Apr 22, 2024",
      category: "Dedication"
    },
    {
      id: 4,
      title: "Outside Specialist",
      description: "Play 50 matches as an Outside Hitter",
      icon: "flash",
      progress: 100,
      unlocked: true,
      unlockedDate: "May 12, 2024",
      category: "Position"
    },
    {
      id: 5,
      title: "Event Organizer",
      description: "Successfully host your first volleyball event",
      icon: "megaphone",
      progress: 100,
      unlocked: true,
      unlockedDate: "Jun 30, 2024",
      category: "Leadership"
    },
    {
      id: 6,
      title: "Early Bird",
      description: "Join 5 morning volleyball sessions",
      icon: "sunny",
      progress: 100,
      unlocked: true,
      unlockedDate: "Jul 17, 2024",
      category: "Participation"
    },
    {
      id: 7,
      title: "Mentor",
      description: "Help train 3 beginner players",
      icon: "school",
      progress: 100,
      unlocked: true,
      unlockedDate: "Aug 5, 2024",
      category: "Leadership"
    },
    {
      id: 8,
      title: "Photographer",
      description: "Share 10 team photos on the community feed",
      icon: "camera",
      progress: 100,
      unlocked: true,
      unlockedDate: "Aug 28, 2024",
      category: "Community"
    },
    // Locked achievements
    {
      id: 9,
      title: "Event Explorer",
      description: "Play in 5 different venues",
      icon: "map",
      progress: 60,
      unlocked: false,
      progressText: "3/5 venues",
      category: "Exploration"
    },
    {
      id: 10,
      title: "Tournament Champion",
      description: "Win your first tournament",
      icon: "medal",
      progress: 0,
      unlocked: false,
      progressText: "0/1 tournaments won",
      category: "Competition"
    },
    {
      id: 11,
      title: "Winning Streak",
      description: "Win 10 matches in a row",
      icon: "flame",
      progress: 40,
      unlocked: false,
      progressText: "4/10 consecutive wins",
      category: "Performance"
    },
    {
      id: 12,
      title: "Volleyball Veteran",
      description: "Play 200 matches",
      icon: "ribbon",
      progress: 88,
      unlocked: false,
      progressText: "176/200 matches",
      category: "Dedication"
    },
    {
      id: 13,
      title: "Social Butterfly",
      description: "Connect with 25 other players",
      icon: "people-circle",
      progress: 48,
      unlocked: false,
      progressText: "12/25 connections",
      category: "Social"
    },
    {
      id: 14,
      title: "All-Around Player",
      description: "Play at least 10 matches in each position",
      icon: "swap-horizontal",
      progress: 30,
      unlocked: false,
      progressText: "Complete: OH, MB | Incomplete: S, L, OP",
      category: "Versatility"
    },
    {
      id: 15,
      title: "Community Leader",
      description: "Get 100 likes on your community posts",
      icon: "heart",
      progress: 67,
      unlocked: false,
      progressText: "67/100 likes",
      category: "Community"
    },
    {
      id: 16,
      title: "Perfect Attendance",
      description: "Attend 20 consecutive scheduled events",
      icon: "calendar-number",
      progress: 35,
      unlocked: false,
      progressText: "7/20 consecutive events",
      category: "Dedication"
    },
    {
      id: 17,
      title: "International Player",
      description: "Play volleyball in 3 different countries",
      icon: "globe",
      progress: 33,
      unlocked: false,
      progressText: "1/3 countries",
      category: "Exploration"
    },
    {
      id: 18,
      title: "Beach Master",
      description: "Play 25 beach volleyball matches",
      icon: "sunny",
      progress: 20,
      unlocked: false,
      progressText: "5/25 beach matches",
      category: "Versatility"
    },
    {
      id: 19,
      title: "Night Owl",
      description: "Play in 10 evening events (after 8 PM)",
      icon: "moon",
      progress: 80,
      unlocked: false,
      progressText: "8/10 evening events",
      category: "Participation"
    },
    {
      id: 20,
      title: "Volleyball Scholar",
      description: "Complete all training tutorials in the app",
      icon: "book",
      progress: 50,
      unlocked: false,
      progressText: "5/10 tutorials completed",
      category: "Skill Development"
    },
    {
      id: 21,
      title: "Skill Master",
      description: "Reach rating 9.0 or higher",
      icon: "star",
      progress: 94,
      unlocked: false,
      progressText: "8.5/9.0 rating",
      category: "Skill Development"
    },
    {
      id: 22,
      title: "Legend Status",
      description: "Play 500 matches with 75% win rate",
      icon: "trophy",
      progress: 35,
      unlocked: false,
      progressText: "176/500 matches, 72% win rate",
      category: "Elite"
    },
    // New positional achievements
    {
      id: 23,
      title: "Setting Maestro",
      description: "Play 50 matches as a Setter",
      icon: "hand-right",
      progress: 6,
      unlocked: false,
      progressText: "3/50 matches",
      category: "Position"
    },
    {
      id: 24,
      title: "Middle Blocker Wall",
      description: "Play 50 matches as a Middle Blocker",
      icon: "shield",
      progress: 22,
      unlocked: false,
      progressText: "11/50 matches",
      category: "Position"
    },
    {
      id: 25,
      title: "Libero Legend",
      description: "Play 50 matches as a Libero",
      icon: "body",
      progress: 10,
      unlocked: false,
      progressText: "5/50 matches",
      category: "Position"
    },
    {
      id: 26,
      title: "Opposite Powerhouse",
      description: "Play 50 matches as an Opposite Hitter",
      icon: "fitness",
      progress: 56,
      unlocked: false,
      progressText: "28/50 matches",
      category: "Position"
    },
    {
      id: 27,
      title: "Serving Specialist",
      description: "Score 100 aces across any position",
      icon: "baseball",
      progress: 64,
      unlocked: false,
      progressText: "64/100 aces",
      category: "Position"
    },
    {
      id: 28,
      title: "Position MVP",
      description: "Be voted match MVP 10 times in the same position",
      icon: "star-half",
      progress: 50,
      unlocked: false,
      progressText: "5/10 MVP awards",
      category: "Position"
    }
  ];

  // Group achievements by category
  const groupedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {});

  // Calculate overall achievement progress
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const overallProgress = Math.round((unlockedAchievements / totalAchievements) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Achievements</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${overallProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {unlockedAchievements}/{totalAchievements} Completed ({overallProgress}%)
            </Text>
          </View>
        </View>

        {/* Achievement Categories */}
        {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
          <View key={category} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category}</Text>
            
            {categoryAchievements.map(achievement => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementCard,
                  achievement.unlocked ? styles.unlockedCard : styles.lockedCard
                ]}
              >
                <View style={styles.achievementIcon}>
                  <Ionicons 
                    name={achievement.unlocked ? achievement.icon : `${achievement.icon}-outline`}
                    size={28} 
                    color={achievement.unlocked ? "rgb(168, 38, 29)" : "#999"} 
                  />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={[
                    styles.achievementTitle,
                    achievement.unlocked ? styles.unlockedTitle : styles.lockedTitle
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                  
                  {achievement.unlocked ? (
                    <Text style={styles.unlockedDate}>
                      Unlocked on {achievement.unlockedDate}
                    </Text>
                  ) : (
                    <View style={styles.progressContainer}>
                      <View style={styles.achievementProgressBar}>
                        <View 
                          style={[
                            styles.achievementProgressFill, 
                            { width: `${achievement.progress}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.achievementProgressText}>
                        {achievement.progressText}
                      </Text>
                    </View>
                  )}
                </View>
                {achievement.unlocked && (
                  <View style={styles.badgeIcon}>
                    <Ionicons name="checkmark-circle" size={22} color="rgb(168, 38, 29)" />
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
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
  header: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ececec',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: 8,
    backgroundColor: 'rgb(168, 38, 29)',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginLeft: 4,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  unlockedCard: {
    borderLeftWidth: 4,
    borderLeftColor: 'rgb(168, 38, 29)',
  },
  lockedCard: {
    opacity: 0.8,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  unlockedTitle: {
    color: '#333',
  },
  lockedTitle: {
    color: '#666',
  },
  achievementDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  unlockedDate: {
    fontSize: 12,
    color: 'rgb(168, 38, 29)',
    fontWeight: '500',
  },
  achievementProgressBar: {
    height: 6,
    backgroundColor: '#ececec',
    borderRadius: 3,
    marginBottom: 6,
  },
  achievementProgressFill: {
    height: 6,
    backgroundColor: '#999',
    borderRadius: 3,
  },
  achievementProgressText: {
    fontSize: 11,
    color: '#888',
  },
  badgeIcon: {
    marginLeft: 8,
  },
});

export default AchievementsScreen;