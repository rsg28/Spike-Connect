// ResetDatabaseButton.js
import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, ActivityIndicator, View } from 'react-native';
import BackendService from '../services/BackendService';

const ResetDatabaseButton = ({ onComplete }) => {
  const [isResetting, setIsResetting] = useState(false);

  const resetDatabase = async () => {
    Alert.alert(
      "Reset Database",
      "This will clear all data and reinitialize the database. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset", 
          style: "destructive",
          onPress: async () => {
            try {
              setIsResetting(true);
              
              // Clear all existing data
              await BackendService.clearAllData();
              
              // Reinitialize with volleyball_sessions.json data
              await BackendService.initialize(true);
              
              setIsResetting(false);
              
              Alert.alert(
                "Success",
                "Database has been reset and reinitialized with fresh data."
              );
              
              // Call onComplete callback if provided
              if (onComplete) {
                onComplete();
              }
            } catch (error) {
              console.error("Error resetting database:", error);
              setIsResetting(false);
              
              Alert.alert(
                "Error",
                "Failed to reset database. Please try again."
              );
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: isResetting ? "#999" : "rgb(168, 38, 29)",
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
      }}
      onPress={resetDatabase}
      disabled={isResetting}
    >
      {isResetting ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={{ color: '#fff', marginLeft: 8, fontWeight: '500' }}>
            Resetting...
          </Text>
        </View>
      ) : (
        <Text style={{ color: '#fff', fontWeight: '600' }}>
          Reset Database
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ResetDatabaseButton;