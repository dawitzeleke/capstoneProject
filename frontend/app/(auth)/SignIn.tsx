import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Link, useRouter } from "expo-router";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import httpRequest from "@/util/httpRequest";
import { saveToken } from "@/scripts/storage";

const SignIn = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    Email: "",
    Password: "",
  });
  const [submiting, setsubmiting] = useState(false);
  const submitForm = async () => {
    setsubmiting(true);
    console.log("Form submitted:", form);
    try {
      const formData = new FormData();
      formData.append("email", form.Email);
      formData.append("password", form.Password);

      console.log(formData);
      const endpoint = "/api/auth/signin";
      const response = await httpRequest(endpoint, formData, "POST", {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response:", response);
      // const response = await api.post(endpoint, formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      await saveToken(response.token);
      console.log("Login response:", response);

      if (response.role === "Student") {
        router.replace("/student/(tabs)/Home");
      } else {
        router.replace("/teacher/TeacherVerification");
      }

      // router.replace(
      //   response.data.token.role === "Student"
      //     ? "/student/(tabs)/Home"
      //     : "/teacher/TeacherVerification"
      // );
    } catch (error: any) {
      console.error("Login error:", error?.response || error.messae);
      alert("Login failed. Please check your input or try again.");
    }
    setsubmiting(false);
  };
  return (
    <SafeAreaView className="bg-[#f1f3fc] h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          {/* <Image
            source={favicon}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          /> */}
          <Text className="text-2xl text-gray-800 text-semibold mt-10 font-psemibold">
            LogIn To Your Account
          </Text>
          <FormField
            title="Email"
            value={form.Email}
            handleChangeText={(text: string) =>
              setForm({ ...form, Email: text })
            }
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="Enter your email"
          />
          <FormField
            title="Password"
            value={form.Password}
            handleChangeText={(text: string) =>
              setForm({ ...form, Password: text })
            }
            otherStyles="mt-7"
            placeholder="Enter your password"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submitForm}
            isLoading={submiting}
            disabled={submiting}
            containerStyles="mt-7 bg-blue-500"
            textStyles="text-white text-lg"
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-400 font-pregular">
              Don't Have an account?
            </Text>
            <Link
              href="/SignUp"
              className="text-lg font-pregular text-blue-500">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
