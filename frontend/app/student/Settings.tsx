import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
// 1. Import useNavigation from expo-router and CommonActions from react-navigation
import { useRouter, useNavigation } from "expo-router";
import { CommonActions } from "@react-navigation/native";
import { AppDispatch } from "@/redux/store";
import { toggleTheme } from "@/redux/themeReducer/themeActions";
import { SafeAreaView } from "react-native-safe-area-context";
import { ReactNode } from "react";
import { clearUser } from "@/redux/userReducer/userActions";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { clearUserData } from "@/scripts/storage"; // Import the new function to clear user data

interface SettingItemProps {
  icon: ReactNode;
  title: string;
  onPress?: () => void;
  showSwitch?: boolean;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  showArrow?: boolean;
}

const SettingsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const [isPermissionsEnabled, setIsPermissionsEnabled] = useState(true);
  const [isPlayInBackground, setIsPlayInBackground] = useState(false);
  const [isSeen, setIsSeen] = useState(false);
  const [isWifiOnly, setIsWifiOnly] = useState(true);
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const router = useRouter();
  // 2. Get the navigation object to dispatch advanced actions
  const navigation = useNavigation();

  const handleThemeToggle = () => {
    setIsThemeChanging(true);
    setTimeout(() => {
      dispatch(toggleTheme());
      setTimeout(() => {
        setIsThemeChanging(false);
      }, 500);
    }, 1000);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Clear all user data from storage and Redux
            await clearUserData(); // <-- Use the new function here
            dispatch(clearUser());

            // 3. Reset the entire navigation stack to the auth flow
            // This prevents the user from navigating back to the authenticated part of the app.
            // We target the '(auth)' route group, and Expo Router will automatically
            // load its initial screen (e.g., SignIn).
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "(auth)" }],
              })
            );
          } catch (error) {
            console.error("Logout failed:", error);
            Alert.alert("Error", "Something went wrong during logout.");
          }
        },
      },
    ]);
  };

  const SettingItem = ({
    icon,
    title,
    onPress,
    showSwitch = false,
    value,
    onValueChange,
    showArrow = false,
  }: SettingItemProps) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-between py-5 px-4 ${
        showArrow ? "" : "border-b border-gray-700/20"
      }`}
      style={!showArrow && { borderBottomWidth: 0.5 }}>
      <View className="flex-row items-center space-x-4">
        <View
          className={`w-12 h-12 mr-2 rounded-xl items-center justify-center ${
            currentTheme === "dark" ? "bg-gray-800" : "bg-gray-100"
          }`}>
          {icon}
        </View>
        <Text
          className={`text-base font-pmedium ${
            currentTheme === "dark" ? "text-white" : "text-gray-900"
          }`}>
          {title}
        </Text>
      </View>
      {showSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: "#767577",
            true: currentTheme === "dark" ? "#4F46E5" : "#6366F1",
          }}
          thumbColor={value ? "#fff" : "#f4f3f4"}
        />
      ) : showArrow ? (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
        />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className={`flex-1 ${
        currentTheme === "dark" ? "bg-black" : "bg-[#f1f3fc]"
      }`}>
      {/* Header */}
      <View
        className={`px-6 pt-4 pb-6 ${
          currentTheme === "dark" ? "bg-gray-900" : "bg-white"
        }`}>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full items-center justify-center">
            <Ionicons
              name="chevron-back"
              size={24}
              color={currentTheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
          <Text
            className={`text-xl font-pbold ${
              currentTheme === "dark" ? "text-white" : "text-gray-900"
            }`}>
            Settings
          </Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Profile Section */}
        <View className="mt-6 mb-8">
          <Text
            className={`text-sm font-pmedium mb-4 ${
              currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
            PROFILE
          </Text>
          <View
            className={`rounded-2xl overflow-hidden ${
              currentTheme === "dark" ? "bg-gray-900" : "bg-white"
            }`}>
            <SettingItem
              icon={
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
                />
              }
              title="Edit Profile"
              onPress={() => router.push("/student/(tabs)/EditProfileScreen")}
              showArrow={true}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View className="mb-8">
          <Text
            className={`text-sm font-pmedium mb-4 ${
              currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
            PREFERENCES
          </Text>
          <View
            className={`rounded-2xl overflow-hidden ${
              currentTheme === "dark" ? "bg-gray-900" : "bg-white"
            }`}>
            <SettingItem
              icon={
                <Ionicons
                  name="moon-outline"
                  size={24}
                  color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
                />
              }
              title="Dark Mode"
              showSwitch={true}
              value={currentTheme === "dark"}
              onValueChange={handleThemeToggle}
            />
            <SettingItem
              icon={
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
                />
              }
              title="Notifications"
              showSwitch={true}
              value={isWifiOnly}
              onValueChange={setIsWifiOnly}
            />
            <SettingItem
              icon={
                <Ionicons
                  name="wifi-outline"
                  size={24}
                  color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
                />
              }
              title="Only Wi-Fi"
              showSwitch={true}
              value={isWifiOnly}
              onValueChange={setIsWifiOnly}
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View className="mb-8">
          <Text
            className={`text-sm font-pmedium mb-4 ${
              currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
            PRIVACY
          </Text>
          <View
            className={`rounded-2xl overflow-hidden ${
              currentTheme === "dark" ? "bg-gray-900" : "bg-white"
            }`}>
            <SettingItem
              icon={
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
                />
              }
              title="Permissions"
              showSwitch={true}
              value={isPermissionsEnabled}
              onValueChange={setIsPermissionsEnabled}
            />
            <SettingItem
              icon={
                <MaterialIcons
                  name="people-outline"
                  size={24}
                  color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
                />
              }
              title="Display Rank"
              showSwitch={true}
              value={isSeen}
              onValueChange={setIsSeen}
            />
          </View>
        </View>

        {/* Support Section */}
        <View className="mb-8">
          <Text
            className={`text-sm font-pmedium mb-4 ${
              currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
            SUPPORT
          </Text>
          <View
            className={`rounded-2xl overflow-hidden ${
              currentTheme === "dark" ? "bg-gray-900" : "bg-white"
            }`}>
            <SettingItem
              icon={
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
                />
              }
              title="About Application"
              showArrow={true}
              onPress={() => {}}
            />
            <SettingItem
              icon={
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
                />
              }
              title="Help"
              showArrow={true}
              onPress={() => {}}
            />
            <SettingItem
              icon={<Ionicons name="log-out-outline" size={24} color="red" />}
              title="Logout"
              showArrow={false}
              onPress={handleLogout}
            />
          </View>
        </View>
      </ScrollView>

      {/* Theme Change Loading Modal */}
      <Modal transparent visible={isThemeChanging} animationType="fade">
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          className="flex-1 items-center justify-center bg-black/50">
          <View
            className={`p-6 rounded-2xl ${
              currentTheme === "dark" ? "bg-gray-900" : "bg-white"
            }`}>
            <ActivityIndicator
              size="large"
              color={currentTheme === "dark" ? "#4F46E5" : "#6366F1"}
            />
            <Text
              className={`mt-4 text-center font-pmedium ${
                currentTheme === "dark" ? "text-white" : "text-gray-900"
              }`}>
              Applying theme changes...
            </Text>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsScreen;
