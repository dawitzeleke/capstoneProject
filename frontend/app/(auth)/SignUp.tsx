import { View, Text, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Link, useRouter } from "expo-router";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { FontAwesome } from "@expo/vector-icons";
import httpRequest from "@/util/httpRequest";
import { saveToken } from "@/scripts/storage";

type Stream = "Natural" | "Social";

type UserForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  grade: string;
  stream: Stream;
  subject: string;
};

type FormErrors = Partial<Record<keyof UserForm, string>>;

const subjectsByStream: Record<Stream, string[]> = {
  Natural: ["Biology", "Physics", "Chemistry", "Mathematics"],
  Social: ["History", "Geography", "Economics", "Civics"],
};

const grades = ["9", "10", "11", "12"];

const SignUp = () => {
  const router = useRouter();
  const [form, setForm] = useState<UserForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    grade: "",
    stream: "Natural",
    subject: "",
  });
  const [userType, setUserType] = useState<"Student" | "Teacher">("Student");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [gradeDropdownOpen, setGradeDropdownOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format.";
    if (!form.password.trim()) newErrors.password = "Password is required.";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (!form.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required.";

    if (userType === "Student") {
      if (!form.grade) newErrors.grade = "Grade is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async () => {
    if (!validate()) return;
console.log("here")
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
        formData.append("subject", form.subject);
        formData.append("stream", form.stream);
      }

      const endpoint =
        userType === "Student"
          ? "/api/auth/student/signup"
          : "/api/auth/teacher/signup";

      const response = await httpRequest(endpoint, formData, "POST", {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await saveToken(response.token);
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
            value={form.firstName}
            handleChangeText={(text) => setForm({ ...form, firstName: text })}
            otherStyles="mt-7"
            placeholder="Enter your first name"
            errorMessage={errors.firstName}
          />
          <FormField
            title="Last Name"
            value={form.lastName}
            handleChangeText={(text) => setForm({ ...form, lastName: text })}
            otherStyles="mt-5"
            placeholder="Enter your last name"
            errorMessage={errors.lastName}
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(text) => setForm({ ...form, email: text })}
            otherStyles="mt-5"
            keyboardType="email-address"
            placeholder="Enter your email"
            errorMessage={errors.email}
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(text) => setForm({ ...form, password: text })}
            otherStyles="mt-5"
            secureTextEntry
            placeholder="Enter your password"
            errorMessage={errors.password}
          />
          <FormField
            title="Phone Number"
            value={form.phoneNumber}
            handleChangeText={(text) => setForm({ ...form, phoneNumber: text })}
            otherStyles="mt-5"
            keyboardType="phone-pad"
            placeholder="Enter your phone number"
            errorMessage={errors.phoneNumber}
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
                  {form.grade || "Select Grade"}
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
                        setForm({ ...form, grade: g });
                        setGradeDropdownOpen(false);
                      }}
                      className="px-4 py-3 border-b border-gray-100">
                      <Text className="text-gray-800 font-pregular">{g}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
              {errors.grade && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.grade}
                </Text>
              )}

              <Text className="text-gray-700 mt-5 mb-2 font-pregular">
                Stream
              </Text>
              <View className="flex-row gap-5 mb-2">
                {["Natural", "Social"].map((stream) => (
                  <Pressable
                    key={stream}
                    onPress={() =>
                      setForm({
                        ...form,
                        stream: stream as Stream,
                        subject: "",
                      })
                    }
                    className="flex-row items-center gap-2">
                    <View
                      className={`w-4 h-4 rounded-full border ${
                        form.stream === stream ? "bg-blue-600" : ""
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
