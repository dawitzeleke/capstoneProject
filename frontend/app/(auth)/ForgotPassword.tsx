import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setSubmitting(true);
    try {
      // TODO: Implement password reset logic
      // For now, just show success and go to OTP screen
      router.push('./OTP');
    } catch (error) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f1f3fc]">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center items-center min-h-[90vh] px-4">
          <View className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 items-center">
            {/* Icon/Illustration */}
            <View className="bg-indigo-50 rounded-full p-4 mb-4">
              <Ionicons name="lock-closed-outline" size={36} color="#4F46E5" />
            </View>
            {/* Title */}
            <Text className="text-3xl font-pbold text-gray-900 mb-2 text-center">Forgot Password?</Text>
            {/* Subtitle */}
            <Text className="text-gray-500 text-base font-pregular mb-8 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </Text>
            {/* Email Input */}
            <FormField
              title="Email"
              value={email}
              handleChangeText={(text) => {
                setEmail(text);
                setError("");
              }}
              otherStyles="mb-2"
              keyboardType="email-address"
              placeholder="Enter your email"
              errorMessage={error}
            />
            {/* Button */}
            <CustomButton
              title="Send OTP"
              handlePress={handleSubmit}
              isLoading={submitting}
              disabled={submitting}
              containerStyles="mt-5 bg-indigo-600 rounded-xl shadow-md"
              textStyles="text-white text-lg font-pregular"
            />
            {/* Back to Login */}
            <TouchableOpacity 
              onPress={() => router.back()}
              className="mt-8"
            >
              <Text className="text-center flex-row items-center justify-center text-indigo-600 font-pregular text-base">
                <Ionicons name="arrow-back" size={18} color="#4F46E5" /> Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword; 