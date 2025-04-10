import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Link, useRouter } from "expo-router";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import favicon from "@/constants/images";
import { api } from "@/scripts/api";
import { saveToken } from "@/scripts/storage";

const SignIn = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [submiting, setsubmiting] = useState(false);
  const submitForm = async () => {
    setsubmiting(true);
    console.log("Form submitted:", form);
    try {
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("password", form.password);
      const endpoint = "/api/auth/signin";
      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await saveToken(response.data.token);
      console.log("Login response:", response.data);

      if (response.data.role === "Student") {
        router.replace("/student/(tabs)/Home");
      }
      else {
        router.replace("/teacher/TeacherVerification");
      }
      
      // router.replace(
      //   response.data.token.role === "Student"
      //     ? "/student/(tabs)/Home"
      //     : "/teacher/TeacherVerification"
      // );
    } catch (error : any) {
      console.error("Login error:", error?.response?.data || error.message);
      alert("Login failed. Please check your input or try again.");
    }
    setsubmiting(false);
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
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            LogIn To Your Account
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(text: string) =>
              setForm({ ...form, email: text })
            }
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="Enter your email"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(text: string) =>
              setForm({ ...form, password: text })
            }
            otherStyles="mt-7"
            placeholder="Enter your password"
          />

          <CustomButton
            title="Login"
            handlePress={submitForm}
            containerStyles="mt-7"
            isLoading={submiting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't Have an account?
            </Text>
            <Link href="/SignUp" className="text-lg font-pregular text-blue-500">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
