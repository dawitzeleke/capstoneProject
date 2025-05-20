import { View, Text, TouchableOpacity } from "react-native";
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
      // For now, just show success and go back
      router.back();
    } catch (error) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-[#f1f3fc] h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="p-2 rounded-full bg-white"
            >
              <Ionicons name="chevron-back" size={24} color="#4F46E5" />
            </TouchableOpacity>
            <Text className="text-2xl text-gray-800 font-pbold ml-4">
              Forgot Password
            </Text>
          </View>

          <Text className="text-gray-600 text-base mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </Text>

          <FormField
            title="Email"
            value={email}
            handleChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="Enter your email"
            errorMessage={error}
          />

          <CustomButton
            title="Send Reset Link"
            handlePress={handleSubmit}
            isLoading={submitting}
            disabled={submitting}
            containerStyles="mt-7 bg-[#4F46E5]"
            textStyles="text-white text-lg"
          />

          <TouchableOpacity 
            onPress={() => router.back()}
            className="mt-6"
          >
            <Text className="text-center text-[#4F46E5] font-pmedium">
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword; 