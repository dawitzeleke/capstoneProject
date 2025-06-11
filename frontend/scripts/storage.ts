import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Define the shape of user data
interface UserData {
  id: string; // or any other unique identifier
  token: string;
  name: string;
  email: string;
  role: string; // e.g., "student", "teacher", etc.
  image: string; // or avatar, photoUrl, etc.
}

export const saveUserData = async (data: UserData) => {
  try {
    const jsonValue = JSON.stringify(data);
    console.log("Attempting to save user data:", jsonValue);

    if (Platform.OS === 'web') {
      await AsyncStorage.setItem('userData', jsonValue);
      console.log("User data saved to AsyncStorage (web)");
    } else {
      await SecureStore.setItemAsync('userData', jsonValue);
      console.log("User data saved to SecureStore (mobile)");
    }
  } catch (error: any) {
    console.error("Error saving user data:", error.message);
    throw error;
  }
};

export const getUserData = async (): Promise<UserData | null> => {
  try {
    let jsonValue: string | null;

    if (Platform.OS === 'web') {
      jsonValue = await AsyncStorage.getItem('userData');
      console.log("Retrieved user data from AsyncStorage (web):", jsonValue);
    } else {
      jsonValue = await SecureStore.getItemAsync('userData');
    }

    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error: any) {
    console.error("Error retrieving user data:", error.message);
    return null;
  }
};
