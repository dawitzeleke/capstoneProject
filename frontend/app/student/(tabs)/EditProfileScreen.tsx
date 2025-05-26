import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Field } from "@/components/Field";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function EditProfileScreen() {
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const isDark = currentTheme === "dark";

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-black" : "bg-[#f1f3fc]"}`}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Header */}
          <LinearGradient
            colors={isDark ? ['#000000', '#111827'] : ['#f1f3fc', '#ffffff']}
            className="px-6 pt-4 pb-6"
          >
            <View className="flex-row justify-between items-center">
              <TouchableOpacity 
                onPress={() => router.back()} 
                className={`p-2 rounded-full ${isDark ? "bg-gray-800" : "bg-white"} shadow-sm`}
              >
                <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "black"} />
              </TouchableOpacity>
              <Text className={`text-lg font-pbold ${isDark ? "text-white" : "text-gray-900"}`}>
                Edit Profile
              </Text>
              <TouchableOpacity 
                className={`p-2 rounded-full ${isDark ? "bg-gray-800" : "bg-white"} shadow-sm`}
              >
                <Ionicons name="checkmark" size={24} color={isDark ? "white" : "black"} />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView className="flex-1 px-4">
            {/* Profile Image and Back Button */}
            <View className="flex-row items-center justify-between mt-4 mb-6">
              <TouchableOpacity 
                onPress={() => router.back()} 
                className={`p-2 rounded-full ${isDark ? "bg-gray-800" : "bg-white"} shadow-sm`}
              >
                <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "black"} />
              </TouchableOpacity>
              <View className={`relative rounded-full ${isDark ? "bg-gray-800" : "bg-white"} p-1 shadow-sm`}>
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?img=32" }}
                  className="w-24 h-24 rounded-full"
                />
                <TouchableOpacity
                  className={`absolute bottom-0 right-0 p-2 rounded-full ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <Feather name="camera" size={16} color={isDark ? "white" : "black"} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                className={`p-2 rounded-full ${isDark ? "bg-gray-800" : "bg-white"} shadow-sm`}
              >
                <Ionicons name="checkmark" size={24} color={isDark ? "white" : "black"} />
              </TouchableOpacity>
            </View>

            {/* Form Fields Container */}
            <View className={`space-y-4 px-4 py-5 rounded-2xl ${
              isDark ? "bg-gray-900" : "bg-white"
            } shadow-sm`}>
              <Field
                label="Full Name"
                placeholder="Enter your full name"
                theme={currentTheme}
              />
              <Field
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                theme={currentTheme}
              />
              <Field
                label="Username"
                placeholder="Enter your username"
                theme={currentTheme}
              />
              <Field
                label="Phone Number"
                placeholder="Enter your phone number"
                type="phone"
                theme={currentTheme}
              />
            </View>

            {/* Academic Information */}
            <View className="mt-6">
              <Text className={`text-lg font-pbold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Academic Information
              </Text>
              <View className={`space-y-4 px-4 py-5 rounded-2xl ${
                isDark ? "bg-gray-900" : "bg-white"
              } shadow-sm`}>
                <Field
                  label="Grade Level"
                  placeholder="Select your grade"
                  theme={currentTheme}
                />
                <Field
                  label="Stream"
                  placeholder="Select your stream"
                  theme={currentTheme}
                />
                <Field
                  label="School"
                  placeholder="Enter your school name"
                  theme={currentTheme}
                />
              </View>
            </View>

            {/* Password Section */}
            <View className="mt-6 mb-8">
              <Text className={`text-lg font-pbold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Security
              </Text>
              <View className={`space-y-4 px-4 py-5 rounded-2xl ${
                isDark ? "bg-gray-900" : "bg-white"
              } shadow-sm`}>
                <Field
                  label="Current Password"
                  type="password"
                  placeholder="Enter current password"
                  theme={currentTheme}
                />
                <Field
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  theme={currentTheme}
                />
                <Field
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm new password"
                  theme={currentTheme}
                />
                <TouchableOpacity 
                  onPress={() => router.push("/(auth)/ForgotPassword")}
                  className="items-end mt-2"
                >
                  <Text className={`text-sm font-pmedium ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
