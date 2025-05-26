import React, { useState, useCallback } from 'react';
import { Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RefreshButtonProps {
  onPressAsync: () => Promise<any>;  // expect a promise-returning refresh function
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onPressAsync }) => {
  const [loading, setLoading] = useState(false);

  const handlePress = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onPressAsync();
    } catch (err) {
      console.error('Refresh failed', err);
    } finally {
      setLoading(false);
    }
  }, [loading, onPressAsync]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={loading}
      style={({ pressed }) => [
        styles.button,
        pressed && !loading ? styles.pressed : null,
      ]}
    >
      {loading
        ? <ActivityIndicator size="small" color="#ffffff" />
        : <Ionicons name="refresh" size={24} color="#ffffff" />
      }
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 999,
    backgroundColor: '#4f46e5',   // match your header color
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});

export default RefreshButton; 