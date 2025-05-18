import { View, Text, Switch, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useRouter } from "expo-router";
import { AppDispatch } from "@/redux/store";
import { toggleTheme } from "@/redux/themeReducer/themeActions"; // import your action

const SettingsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentTheme = useSelector((state: any) => state.theme.mode); // get current theme from Redux
  const [isPermissionsEnabled, setIsPermissionsEnabled] = useState(true);
  const [isPlayInBackground, setIsPlayInBackground] = useState(false);
  const [isSeen, setIsSeen] = useState(false);
  const [isWifiOnly, setIsWifiOnly] = useState(true);
  const router = useRouter();

  // Handle the theme toggle
  const handleThemeToggle = () => {
    dispatch(toggleTheme()); // Dispatch the action to toggle the theme
  };

  return (
    <View
      className={`flex-1 ${
        currentTheme === "dark" ? "bg-black" : "bg-light-background"
      } p-6`}>
      {/* Profile Section */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => router.push("/student/(tabs)/Profile")}>
          <Ionicons
            name="chevron-back"
            size={20}
            color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"} // Pritext-[#a5a1f7] color for icons
          />
        </TouchableOpacity>
      </View>

      {/* Settings Section */}
      <Text
        className={`font-pregular font-bold text-lg mb-3 ${
          currentTheme === "dark" ? "text-white" : "text-primary"
        }`}>
        Settings
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/student/(tabs)/EditProfileScreen")}
        className="flex-row items-center justify-between py-4 border-b border-gray-300">
        <View className="flex-row items-center">
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
          />
          <Text
            className={`ml-4 font-pregular ${
              currentTheme === "dark" ? "text-[#a5a1f7]" : "text-primary"
            }`}>
            Edit Profile
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
        />
      </TouchableOpacity>

      {/* Dark Mode Toggle */}
      <View className="flex-row items-center justify-between py-4 border-b border-gray-300">
        <View className="flex-row items-center">
          <Ionicons
            name="moon-outline"
            size={20}
            color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
          />
          <Text
            className={`ml-4 font-pregular ${
              currentTheme === "dark" ? "text-[#a5a1f7]" : "text-primary"
            }`}>
            Dark Mode
          </Text>
        </View>
        <Switch
          value={currentTheme === "dark"}
          onValueChange={handleThemeToggle}
        />
      </View>

      {/* Permissions Toggle */}
      <View className="flex-row items-center justify-between py-4 border-b border-gray-300">
        <View className="flex-row items-center">
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
          />
          <Text
            className={`ml-4 font-pregular ${
              currentTheme === "dark" ? "text-[#a5a1f7]" : "text-primary"
            }`}>
            Permissions
          </Text>
        </View>
        <Switch
          value={isPermissionsEnabled}
          onValueChange={setIsPermissionsEnabled}
        />
      </View>

      {/* Play in Background Toggle */}
      <View className="flex-row items-center justify-between py-4 border-b border-gray-300">
        <View className="flex-row items-center">
          <MaterialIcons
            name="music-note"
            size={20}
            color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
          />
          <Text
            className={`ml-4 font-pregular ${
              currentTheme === "dark" ? "text-[#a5a1f7]" : "text-primary"
            }`}>
            Play in Background
          </Text>
        </View>
        <Switch
          value={isPlayInBackground}
          onValueChange={setIsPlayInBackground}
        />
      </View>

      {/* Display Rank */}
      <View className="flex-row items-center justify-between py-4 border-b border-gray-300">
        <View className="flex-row items-center">
          <MaterialIcons
            name="people-outline"
            size={20}
            color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
          />
          <Text
            className={`ml-4 font-pregular ${
              currentTheme === "dark" ? "text-[#a5a1f7]" : "text-primary"
            }`}>
            Display Rank
          </Text>
        </View>
        <Switch value={isSeen} onValueChange={setIsSeen} />
      </View>

      {/* Only Wi-Fi Toggle */}
      <View className="flex-row items-center justify-between py-4 border-b border-gray-300">
        <View className="flex-row items-center">
          <Ionicons
            name="wifi-outline"
            size={20}
            color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
          />
          <Text
            className={`ml-4 font-pregular ${
              currentTheme === "dark" ? "text-[#a5a1f7]" : "text-primary"
            }`}>
            Only Wi-Fi
          </Text>
        </View>
        <Switch value={isWifiOnly} onValueChange={setIsWifiOnly} />
      </View>

      {/* Notifications */}
      <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-300">
        <View className="flex-row items-center">
          <Feather
            name="bell"
            size={20}
            color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
          />
          <Text
            className={`ml-4 font-pregular ${
              currentTheme === "dark" ? "text-[#a5a1f7]" : "text-primary"
            }`}>
            Notifications
          </Text>
        </View>
        <Switch value={isWifiOnly} onValueChange={setIsWifiOnly} />
      </TouchableOpacity>

      {/* About App */}
      <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-300">
        <View className="flex-row items-center">
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
          />
          <Text
            className={`ml-4 font-pregular ${
              currentTheme === "dark" ? "text-[#a5a1f7]" : "text-primary"
            }`}>
            About Application
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
        />
      </TouchableOpacity>

      {/* Help */}
      <TouchableOpacity className="flex-row items-center justify-between py-4">
        <View className="flex-row items-center">
          <Ionicons
            name="help-circle-outline"
            size={20}
            color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
          />
          <Text
            className={`ml-4 font-pregular ${
              currentTheme === "dark" ? "text-[#a5a1f7]" : "text-primary"
            }`}>
            Help
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;