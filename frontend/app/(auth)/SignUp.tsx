import { View, Text, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Link, useRouter } from "expo-router";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import favicon from "@/constants/images";
import { api } from "@/scripts/api";
import { saveToken } from "@/scripts/storage";

const SignUp = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    grade: "",
  });
  const [userType, setUserType] = useState("Student");
  const [submitting, setSubmitting] = useState(false);

  const submitForm = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("phoneNumber", form.phoneNumber);
      
      if (userType === "Student") {
        formData.append("grade", form.grade);
      }

      const endpoint = userType === "Student" 
        ? "/api/auth/student/signup" 
        : "/api/auth/teacher/signup";

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Signup response:", response.data);
      await saveToken(response.data.token);
      console.log("Signup response:", response.data);
      router.replace(
        userType === "Student"
          ? "/student/(tabs)/Home"
          : "/teacher/TeacherVerification"
      );
      console.log("Signup response:", response.data);
    } catch (error : any) {
      console.error("Signup error:", error?.response?.data || error.message);
      alert("Signup failed. Please check your input or try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={favicon}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />

          <View className="flex-row justify-between mt-10 rounded-lg p-2">
            <CustomButton
              title="Student"
              handlePress={() => setUserType("Student")}
              containerStyles={`flex-1 p-3 rounded-lg ${
                userType === "Student" ? "bg-white" : "bg-transparent"
              }`}
              textStyles={
                userType === "Student" ? "text-gray-800" : "text-white"
              }
            />

            <CustomButton
              title="Teacher"
              handlePress={() => setUserType("Teacher")}
              containerStyles={`flex-1 p-3 rounded-lg ${
                userType === "Teacher" ? "bg-white" : "bg-transparent"
              }`}
              textStyles={
                userType === "Teacher" ? "text-gray-800" : "text-white"
              }
            />
          </View>

          <Text className="text-2xl text-white font-semibold mt-5">
            {userType} Sign Up
          </Text>

          <FormField
            title="First Name"
            value={form.firstName}
            handleChangeText={(text) => setForm({ ...form, firstName: text })}
            otherStyles="mt-7"
            placeholder="Enter your first name"
          />
          <FormField
            title="Last Name"
            value={form.lastName}
            handleChangeText={(text) => setForm({ ...form, lastName: text })}
            otherStyles="mt-7"
            placeholder="Enter your last name"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(text) => setForm({ ...form, email: text })}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="Enter your email"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(text) => setForm({ ...form, password: text })}
            otherStyles="mt-7"
            placeholder="Enter your password"
          />
          <FormField
            title="Phone Number"
            value={form.phoneNumber}
            handleChangeText={(text) => setForm({ ...form, phoneNumber: text })}
            otherStyles="mt-7"
            keyboardType="phone-pad"
            placeholder="Enter your phone number"
          />

          {userType === "Student" && (
            <View className="mt-7">
              <Text className="text-white text-lg mb-2">Select Grade</Text>
              <View className="border border-gray-500 rounded-lg p-3">
                <TextInput
                  className="text-white font-pmedium"
                  value={form.grade}
                  placeholder="Choose Grade"
                  placeholderTextColor="gray"
                  onChangeText={(text) => setForm({ ...form, grade: text })}
                  keyboardType="numeric"
                />
              </View>
            </View>
          )}

          <CustomButton
            title="Sign Up"
            handlePress={submitForm}
            isLoading={submitting}
            disabled={submitting}
            containerStyles="mt-7 bg-blue-500"
            textStyles="text-white text-lg"
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Already Have an account?
            </Text>
            <Link
              href="/SignIn"
              className="text-lg font-pregular text-blue-500"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;