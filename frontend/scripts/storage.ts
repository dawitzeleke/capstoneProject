import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Define the shape of user data
interface UserData {
  id: string; // or any other unique identifier
  token: string;
  name: string;
  email: string;
  role: string; // e.g., "student", "teacher", etc.
  profilePictureUrl: string; // or avatar, photoUrl, etc.
}

export const saveUserData = async (data: UserData) => {
  try {
    const jsonValue = JSON.stringify(data);
    console.log("Attempting to save user data:", jsonValue);

    if (Platform.OS === "web") {
      await AsyncStorage.setItem("userData", jsonValue);
      console.log("User data saved to AsyncStorage (web)");
    } else {
      await SecureStore.setItemAsync("userData", jsonValue);
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

    if (Platform.OS === "web") {
      jsonValue = await AsyncStorage.getItem("userData");
      console.log("Retrieved user data from AsyncStorage (web):", jsonValue);
    } else {
      jsonValue = await SecureStore.getItemAsync("userData");
    }

    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error: any) {
    console.error("Error retrieving user data:", error.message);
    return null;
  }
};

export const clearUserData = async (): Promise<void> => {
  try {
    // The key used to store the data
    const key = "userData";

    console.log("Attempting to clear user data...");

    // Use the appropriate storage mechanism based on the platform
    if (Platform.OS === "web") {
      await AsyncStorage.removeItem(key);
      console.log("User data cleared from AsyncStorage (web)");
    } else {
      await SecureStore.deleteItemAsync(key);
      console.log("User data cleared from SecureStore (mobile)");
    }
  } catch (error: any) {
    console.error("Error clearing user data:", error.message);
    // Re-throw the error so the calling function can handle it if needed
    throw error;
  }
};
