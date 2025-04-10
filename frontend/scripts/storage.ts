import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const saveToken = async (token: string) => {
  try {
    console.log("Attempting to save token:", token);
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem('token', token);
      console.log("Token saved to AsyncStorage (web):", token);
    } else {
      await SecureStore.setItemAsync('token', token);
      console.log("Token saved to SecureStore (mobile):", token);
    }
  } catch (error: any) {
    console.error("Error saving token:", error.message);
    throw error;
  }
};

export const getToken = async () => {
  try {
    if (Platform.OS === 'web') {
      const token = await AsyncStorage.getItem('token');
      console.log("Retrieved token from AsyncStorage (web):", token);
      return token;
    } else {
      const token = await SecureStore.getItemAsync('token');
      console.log("Retrieved token from SecureStore (mobile):", token);
      return token;
    }
  } catch (error: any) {
    console.error("Error retrieving token:", error.message);
    return null;
  }
};