import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Link, useRouter } from "expo-router";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import httpRequest from "@/util/httpRequest";
import { saveToken } from "@/scripts/storage";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userReducer/userActions";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import type { AppDispatch } from "@/redux/store";

const SignIn = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  console.log("User in SignIn:", user);
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState({
    Email: "",
    Password: "",
  });

  const [errors, setErrors] = useState({
    Email: "",
    Password: "",
  });

  const [submiting, setsubmiting] = useState(false);
  const submitForm = async () => {
    setsubmiting(true);

    const newErrors: any = {};

    // Email validation
    if (!form.Email.trim()) {
      newErrors.Email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.Email.trim())
    ) {
      newErrors.Email = "Enter a valid email address.";
    }

    // Password validation
    if (!form.Password.trim()) {
      newErrors.Password = "Password is required.";
    } else if (form.Password.trim().length < 6) {
      newErrors.Password = "Password must be at least 6 characters.";
    }

    // Show errors if any
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setsubmiting(false);
      return;
    }

    setErrors({ Email: "", Password: "" });

    try {
      const formData = new FormData();
      formData.append("email", form.Email);
      formData.append("password", form.Password);

      const endpoint = "auth/signin";
      const response = await httpRequest(endpoint, formData, "POST", {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await saveToken(response.token);

      if (response.role === "Student") {
        router.replace("/student/(tabs)/Home");
      } else {
        router.replace("/teacher/TeacherVerification");
      }
      dispatch(setUser(response.user));
    } catch (error: any) {
      const serverError =
        error?.response?.data?.message || "Login failed. Please try again.";
      setErrors({ ...newErrors, Email: serverError, Password: "" });
    }

    setsubmiting(false);
  };

  return (
    <SafeAreaView className="bg-[#f1f3fc] h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Text className="text-2xl text-gray-800 text-semibold mt-10 font-psemibold">
            LogIn To Your Account
          </Text>

          <FormField
            title="Email"
            value={form.Email}
            handleChangeText={(text: string) => {
              setForm({ ...form, Email: text });
              setErrors({ ...errors, Email: "" }); // clear email error
            }}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="Enter your email"
            errorMessage={errors.Email}
          />

          <FormField
            title="Password"
            value={form.Password}
            handleChangeText={(text: string) => {
              setForm({ ...form, Password: text });
              setErrors({ ...errors, Password: "" }); // clear password error
            }}
            otherStyles="mt-7"
            placeholder="Enter your password"
            errorMessage={errors.Password}
          />

          <CustomButton
            title="Sign In"
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
