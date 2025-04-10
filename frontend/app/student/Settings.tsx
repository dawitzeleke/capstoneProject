import { View, Text, Image, Switch, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useState } from "react";

const SettingsScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPermissionsEnabled, setIsPermissionsEnabled] = useState(true);
  const [isPlayInBackground, setIsPlayInBackground] = useState(false);
  const [isWifiOnly, setIsWifiOnly] = useState(true);

  return (
    <View className="flex-1 bg-primary p-6">
      {/* Profile Section */}
      <View className="flex-row items-center mb-6">
        <Link
          href="/student/(tabs)/Profile"
          className="text-lg text-blue-500 font-pregular">
          <Ionicons name="chevron-back" size={20} color="gray" />
        </Link>
      </View>

      {/* Settings Section */}
      <Text className="text-gray-300 font-pregular font-bold text-lg mb-3" font-pregular>Settings</Text>

      {/* Language */}
      <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-300">
        <View className="flex-row items-center">
          <Ionicons name="globe-outline" size={20} color="cyan" />
          <Text className="ml-4 text-gray-300 font-pregular">Language</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-gray-300 font-pregular">English</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </View>
      </TouchableOpacity>

      {/* Permissions Toggle */}
      <View className="flex-row items-center justify-between py-4 border-b border-gray-300">
        <View className="flex-row items-center">
          <Ionicons name="lock-closed-outline" size={20} color="cyan" />
          <Text className="ml-4 text-gray-300 font-pregular">Permissions</Text>
        </View>
        <Switch
          value={isPermissionsEnabled}
          onValueChange={setIsPermissionsEnabled}
        />
      </View>

      {/* Dark Mode Toggle */}
      <View className="flex-row items-center justify-between py-4 border-b border-gray-300">
        <View className="flex-row items-center">
          <Ionicons name="moon-outline" size={20} color="cyan" />
          <Text className="ml-4 text-gray-300 font-pregular">Dark Mode</Text>
        </View>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
      </View>

      {/* Play in Background Toggle */}
      <View className="flex-row items-center justify-between py-4 border-b border-gray-300">
        <View className="flex-row items-center">
          <MaterialIcons name="music-note" size={20} color="cyan" />
          <Text className="ml-4 text-gray-300 font-pregular">Play in Background</Text>
        </View>
        <Switch
          value={isPlayInBackground}
          onValueChange={setIsPlayInBackground}
        />
      </View>

      {/* Only Wi-Fi Toggle */}
      <View className="flex-row items-center justify-between py-4 border-b border-gray-300">
        <View className="flex-row items-center">
          <Ionicons name="wifi-outline" size={20} color="cyan" />
          <Text className="ml-4 text-gray-300 font-pregular">Only Wi-Fi</Text>
        </View>
        <Switch value={isWifiOnly} onValueChange={setIsWifiOnly} />
      </View>

      {/* Notifications */}
      <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-300">
        <View className="flex-row items-center">
          <Feather name="bell" size={20} color="cyan" />
          <Text className="ml-4 text-gray-300 font-pregular">Notifications</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="gray" />
      </TouchableOpacity>

      {/* About App */}
      <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-300">
        <View className="flex-row items-center">
          <Ionicons name="information-circle-outline" size={20} color="cyan" />
          <Text className="ml-4 text-gray-300 font-pregular">About Application</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="gray" />
      </TouchableOpacity>

      {/* Help */}
      <TouchableOpacity className="flex-row items-center justify-between py-4">
        <View className="flex-row items-center">
          <Ionicons name="help-circle-outline" size={20} color="green" />
          <Text className="ml-4 text-gray-300 font-pregular">Help</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
