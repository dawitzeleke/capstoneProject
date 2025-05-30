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
import httpRequest from "@/util/httpRequest";

export default function EditProfileScreen() {
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const isDark = currentTheme === "dark";
  const [form, setForm] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    UserName: "",
    Phone: "",
    GradeLevel: "",
    Stream: "",
    School: "",
    CurrentPassword: "",
    NewPassword: "",
    ConfirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handler for field changes
  const handleFieldChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handler for submit
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Only send fields that are filled
      const formData = new FormData();
      let hasField = false;
      Object.entries(form).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          formData.append(key, value);
          hasField = true;
        }
      });
      if (!hasField) {
        setError("Please fill at least one field to update.");
        setLoading(false);
        return;
      }
      console.log("Updating profile with payload (FormData):", formData);
      const res = await httpRequest("/api/students/settings", formData, "PATCH", {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("response", res);
      setSuccess(true);
    } catch (err: any) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                label="First Name"
                placeholder="Enter your first name"
                value={form.FirstName}
                onChangeText={(val) => handleFieldChange("FirstName", val)}
                theme={currentTheme}
              />
              <Field
                label="Last Name"
                placeholder="Enter your second name"
                value={form.LastName}
                onChangeText={(val) => handleFieldChange("LastName", val)}
                theme={currentTheme}
              />
              <Field
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                value={form.Email}
                onChangeText={(val) => handleFieldChange("Email", val)}
                theme={currentTheme}
              />
              <Field
                label="Username"
                placeholder="Enter your username"
                value={form.UserName}
                onChangeText={(val) => handleFieldChange("UserName", val)}
                theme={currentTheme}
              />
              <Field
                label="Phone Number"
                placeholder="Enter your phone number"
                type="phone"
                value={form.Phone}
                onChangeText={(val) => handleFieldChange("Phone", val)}
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
                  value={form.GradeLevel}
                  onChangeText={(val) => handleFieldChange("GradeLevel", val)}
                  theme={currentTheme}
                />
                <Field
                  label="School"
                  placeholder="Enter your school name"
                  value={form.School}
                  onChangeText={(val) => handleFieldChange("School", val)}
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
                  value={form.CurrentPassword}
                  onChangeText={(val) => handleFieldChange("CurrentPassword", val)}
                  theme={currentTheme}
                />
                <Field
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  value={form.NewPassword}
                  onChangeText={(val) => handleFieldChange("NewPassword", val)}
                  theme={currentTheme}
                />
                <Field
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm new password"
                  value={form.ConfirmPassword}
                  onChangeText={(val) => handleFieldChange("ConfirmPassword", val)}
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

            {/* Save Button and Feedback */}
            <View className="mt-6 mb-8 px-4">
              <TouchableOpacity
                onPress={handleSave}
                className={`py-4 rounded-xl ${isDark ? "bg-indigo-500" : "bg-indigo-600"} items-center`}
                disabled={loading}
              >
                <Text className="text-white font-psemibold text-base">
                  {loading ? "Saving..." : "Save Changes"}
                </Text>
              </TouchableOpacity>
              {error && (
                <Text className="mt-3 text-center text-red-500 font-pmedium">{error}</Text>
              )}
              {success && (
                <Text className="mt-3 text-center text-green-600 font-pmedium">Profile updated successfully!</Text>
              )}
            </View>
          </ScrollView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
