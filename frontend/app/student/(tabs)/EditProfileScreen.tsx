import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Field } from "@/components/Field";
import { httpRequest } from "@/util/httpRequest";

export default function EditProfileScreen() {
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const user = useSelector((state: any) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const router = useRouter();
  const isDark = currentTheme === "dark";

  // State for all fields with backend keys
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [progressLevel, setProgressLevel] = useState<string | null>(null);
  const [grade, setGrade] = useState<number | null>(null);
  const [removeProfilePicture, setRemoveProfilePicture] = useState<boolean>(false);
  const [school, setSchool] = useState<string | null>(null);

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert(
        "Permission needed",
        "Allow media access to upload a picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
      setRemoveProfilePicture(false); // If new picture selected, do not remove
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();

    if (profileImage) {
      // Extract filename and mime type from URI
      const uriParts = profileImage.split("/");
      const filename = uriParts[uriParts.length - 1];
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1].toLowerCase()}` : "image/jpeg";

      // On React Native, file object requires { uri, name, type }
      formData.append("ProfilePicture", {
        uri: profileImage,
        name: filename,
        type,
      } as any);
    }

    if (firstName !== null) formData.append("FirstName", firstName);
    if (lastName !== null) formData.append("LastName", lastName);
    if (email !== null) formData.append("Email", email);
    if (userName !== null) formData.append("UserName", userName);
    if (phoneNumber !== null) formData.append("PhoneNumber", phoneNumber);
    if (progressLevel !== null) formData.append("ProgressLevel", progressLevel);
    if (grade !== null) formData.append("Grade", grade.toString());
    formData.append("RemoveProfilePicture", removeProfilePicture ? "true" : "false");
    if (school !== null) formData.append("School", school);

    try {
      const data = await httpRequest(
        "/Students/settings",
        formData,
        "PATCH",
        user?.token,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      console.log("Server response:", data);
      Alert.alert("Success", "Profile updated!");

      router.back();
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert("Error", "Could not update profile.");
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <ScrollView className="flex-1 px-4">
            {/* Profile Header & Image */}
            <View className="flex-row items-center justify-between mt-8 mb-6">
              <TouchableOpacity
                onPress={() => router.back()}
                className={`p-2 rounded-full ${isDark ? "bg-gray-800" : "bg-white"} shadow-sm`}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={isDark ? "white" : "black"}
                />
              </TouchableOpacity>
              <View
                className={`relative rounded-full ${isDark ? "bg-gray-800" : "bg-white"} p-1 shadow-sm`}
              >
                <Image
                  source={{
                    uri: profileImage || "https://i.pravatar.cc/150?img=32",
                  }}
                  className="w-24 h-24 rounded-full"
                />
                <TouchableOpacity
                  onPress={pickImage}
                  className={`absolute bottom-0 right-0 p-2 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
                >
                  <Feather
                    name="camera"
                    size={16}
                    color={isDark ? "white" : "black"}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={handleSubmit}
                className={`p-2 rounded-full ${isDark ? "bg-gray-800" : "bg-white"} shadow-sm`}
              >
                <Ionicons
                  name="checkmark"
                  size={24}
                  color={isDark ? "white" : "black"}
                />
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View
              className={`space-y-4 px-4 py-5 rounded-2xl ${isDark ? "bg-gray-900" : "bg-white"} shadow-sm`}
            >
              <Field
                label="First Name"
                placeholder="Enter your first name"
                theme={currentTheme}
                value={firstName || ""}
                onChangeText={setFirstName}
              />
              <Field
                label="Last Name"
                placeholder="Enter your last name"
                theme={currentTheme}
                value={lastName || ""}
                onChangeText={setLastName}
              />
              <Field
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                theme={currentTheme}
                value={email || ""}
                onChangeText={setEmail}
              />
              <Field
                label="Username"
                placeholder="Enter your username"
                theme={currentTheme}
                value={userName || ""}
                onChangeText={setUserName}
              />
              <Field
                label="Phone Number"
                placeholder="Enter your phone number"
                type="phone"
                theme={currentTheme}
                value={phoneNumber || ""}
                onChangeText={setPhoneNumber}
              />
            </View>

            {/* Academic Section */}
            <View className="mt-6">
              <Text className={`text-lg font-pbold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Academic Information
              </Text>
              <View
                className={`space-y-4 px-4 py-5 rounded-2xl ${isDark ? "bg-gray-900" : "bg-white"} shadow-sm`}
              >
                <Field
                  label="Progress Level"
                  placeholder="Enter your progress level"
                  theme={currentTheme}
                  value={progressLevel || ""}
                  onChangeText={setProgressLevel}
                />
                <Field
                  label="Grade"
                  placeholder="Enter your grade"
                  theme={currentTheme}
                  value={grade !== null ? grade.toString() : ""}
                  onChangeText={(text) => setGrade(Number(text))}
                  keyboardType="numeric"
                />
                <Field
                  label="School"
                  placeholder="Enter your school name"
                  theme={currentTheme}
                  value={school || ""}
                  onChangeText={setSchool}
                />
              </View>
            </View>

            {/* Security Section */}
            <View className="mt-6 mb-6">
              <Text className={`text-lg font-pbold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Security
              </Text>
              <View
                className={`space-y-4 px-4 py-5 rounded-2xl ${isDark ? "bg-gray-900" : "bg-white"} shadow-sm`}
              >
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

            {/* Submit within form */}
            <View className="mb-10 px-4">
              <TouchableOpacity
                onPress={handleSubmit}
                className={`py-4 rounded-full items-center ${isDark ? "bg-indigo-600" : "bg-indigo-500"}`}
              >
                <Text className="text-white font-pbold text-base">Update Profile</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading Modal */}
      <Modal transparent animationType="fade" visible={loading}>
        <View className="flex-1 items-center justify-center bg-black/40">
          <View className="bg-white dark:bg-gray-900 p-6 rounded-xl items-center">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text
              style={{
                marginTop: 16,
                color: isDark ? "#fff" : "#000",
                fontWeight: "600",
              }}
            >
              Updating Profile...
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
