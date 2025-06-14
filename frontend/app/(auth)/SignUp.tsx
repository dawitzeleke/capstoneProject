import { View, Text, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Link, useRouter } from "expo-router";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { FontAwesome } from "@expo/vector-icons";
import httpRequest from "@/util/httpRequest";
import { saveUserData } from "@/scripts/storage";

type Stream = "NaturalScience" | "SocialSience";

type UserForm = {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  PhoneNumber: string;
  Grade: string;
  Stream: Stream;
  Subject: string;
};

type FormErrors = Partial<Record<keyof UserForm, string>>;

const subjectsByStream: Record<Stream, string[]> = {
  NaturalScience: ["Biology", "Physics", "Chemistry", "Mathematics"],
  SocialSience: ["History", "Geography", "Economics", "Civics"],
};

const grades = ["9", "10", "11", "12"];

const SignUp = () => {
  const router = useRouter();
  const [form, setForm] = useState<UserForm>({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    PhoneNumber: "",
    Grade: "",
    Stream: "NaturalScience",
    Subject: "",
  });
  const [userType, setUserType] = useState<"Student" | "Teacher">("Student");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [gradeDropdownOpen, setGradeDropdownOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!form.FirstName.trim()) newErrors.FirstName = "First name is required.";
    if (!form.LastName.trim()) newErrors.LastName = "Last name is required.";
    if (!form.Email.trim()) newErrors.Email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.Email))
      newErrors.Email = "Invalid email format.";
    if (!form.Password.trim()) newErrors.Password = "Password is required.";
    else if (form.Password.length < 6)
      newErrors.Password = "Password must be at least 6 characters.";
    if (!form.PhoneNumber.trim())
      newErrors.PhoneNumber = "Phone number is required.";

    if (userType === "Student") {
      if (!form.Grade) newErrors.Grade = "Grade is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async () => {
    if (!validate()) return;
    console.log("here");
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("FirstName", form.FirstName);
      formData.append("LastName", form.LastName);
      formData.append("Email", form.Email);
      formData.append("Password", form.Password);
      formData.append("PhoneNumber", form.PhoneNumber);

      if (userType === "Student") {
        formData.append("Grade", form.Grade);
        formData.append("Subject", form.Subject);
        formData.append("Stream", form.Stream);
      }

      const endpoint =
        userType === "Student"
          ? "auth/student/signup"
          : "auth/teacher/signup";

      const response = await httpRequest(endpoint, formData, "POST", undefined, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await saveUserData({
        id: response.id,
        token: response.token,
        name: `${form.FirstName} ${form.LastName}`,
        email: form.Email,
        role: userType.toLowerCase(),
        profilePictureUrl: response.profilePictureUrl || ""
      });
      router.replace(
        userType === "Student"
          ? "/student/(tabs)/Home"
          : "/teacher/TeacherVerification"
      );
    } catch (error: any) {
      console.error("Signup error:", error?.response || error.message);
      Alert.alert("Signup failed", "Please check your input or try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-[#f1f3fc] h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <View className="flex-row justify-between mt-10 rounded-lg p-2 gap-2">
            {["Student", "Teacher"].map((type) => (
              <CustomButton
              id="UserTypeButton"
                key={type}
                title={type}
                handlePress={() => setUserType(type as "Student" | "Teacher")}
                containerStyles={`flex-1 p-3 rounded-lg ${
                  userType === type ? "bg-[#4F46E5]" : "bg-transparent"
                }`}
                textStyles={`text-center font-medium ${
                  userType === type ? "text-white" : "text-gray-400"
                }`}
              />
            ))}
          </View>

          <Text className="text-2xl text-gray-800 font-semibold mt-5">
            {userType} Sign Up
          </Text>

          <FormField
            title="First Name"
            value={form.FirstName}
            handleChangeText={(text) => setForm({ ...form, FirstName: text })}
            otherStyles="mt-7"
            placeholder="Enter your first name"
            errorMessage={errors.FirstName}
          />
          <FormField
            title="Last Name"
            value={form.LastName}
            handleChangeText={(text) => setForm({ ...form, LastName: text })}
            otherStyles="mt-5"
            placeholder="Enter your last name"
            errorMessage={errors.LastName}
          />
          <FormField
            title="Email"
            value={form.Email}
            handleChangeText={(text) => setForm({ ...form, Email: text })}
            otherStyles="mt-5"
            keyboardType="email-address"
            placeholder="Enter your email"
            errorMessage={errors.Email}
            id="Email"
          />
          <FormField
            title="Password"
            value={form.Password}
            handleChangeText={(text) => setForm({ ...form, Password: text })}
            otherStyles="mt-5"
            secureTextEntry
            placeholder="Enter your password"
            errorMessage={errors.Password}
            id="Password"
          />
          <FormField
            title="Phone Number"
            value={form.PhoneNumber}
            handleChangeText={(text) => setForm({ ...form, PhoneNumber: text })}
            otherStyles="mt-5"
            keyboardType="phone-pad"
            placeholder="Enter your phone number"
            errorMessage={errors.PhoneNumber}
          />

          {userType === "Student" && (
            <View>
              <Text className="text-gray-700 mt-6 mb-2 font-pregular">
                Grade
              </Text>
              <Pressable
                onPress={() => setGradeDropdownOpen(!gradeDropdownOpen)}
                className="bg-gray-100 px-4 py-3 rounded-xl mb-2 flex-row justify-between items-center">
                <Text className="text-gray-800 font-pregular">
                  {form.Grade || "Select Grade"}
                </Text>
                <FontAwesome
                  name={gradeDropdownOpen ? "angle-up" : "angle-down"}
                  size={20}
                  color="#6b7280"
                />
              </Pressable>
              {gradeDropdownOpen && (
                <View className="bg-white rounded-xl shadow border border-gray-200 mb-2">
                  {grades.map((g) => (
                    <Pressable
                      key={g}
                      onPress={() => {
                        setForm({ ...form, Grade: g });
                        setGradeDropdownOpen(false);
                      }}
                      className="px-4 py-3 border-b border-gray-100">
                      <Text className="text-gray-800 font-pregular">{g}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
              {errors.Grade && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.Grade}
                </Text>
              )}

              <Text className="text-gray-700 mt-5 mb-2 font-pregular">
                Stream
              </Text>
              <View className="flex-row gap-5 mb-2">
                {["NaturalScience", "SocialSience"].map((stream) => (
                  <Pressable
                    key={stream}
                    onPress={() =>
                      setForm({
                        ...form,
                        Stream: stream as Stream,
                        Subject: "",
                      })
                    }
                    className="flex-row items-center gap-2">
                    <View
                      className={`w-4 h-4 rounded-full border ${
                        form.Stream === stream ? "bg-blue-600" : ""
                      }`}
                    />
                    <Text className="text-gray-800 font-pregular">
                      {stream}
                    </Text>
                  </Pressable>
                ))}
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
            id ="SignUpButton"
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-400 font-pregular">
              Already have an account?
            </Text>
            <Link
              href="/SignIn"
              className="text-lg font-pregular text-blue-500">
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
