import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import favicon from "@/constants/images";
import * as DocumentPicker from "expo-document-picker";

const TeacherVerification = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    id: "",
    school: "",
    teachingLicense: null,
    graduationPaper: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const pickDocument = async (field: "teachingLicense" | "graduationPaper") => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        console.log("URI:", file.uri);
        console.log("File Name:", file.name);

        setForm((prevForm) => ({
          ...prevForm,
          [field]: file,
        }));
      } else {
        console.log("Document picker canceled");
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const submitForm = () => {
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      router.replace("../teacher/(tabs)/Home");
    }, 2000);
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

          <Text className="text-2xl text-white font-semibold mt-5">
            Teacher Verification
          </Text>

          <FormField
            title="National ID, Passport or ID Number"
            value={form.id}
            handleChangeText={(text) => setForm({ ...form, id: text })}
            otherStyles="mt-7"
            placeholder="Enter your ID, Passport or National ID"
          />
          <FormField
            title="School Name"
            value={form.school}
            handleChangeText={(text) => setForm({ ...form, school: text })}
            otherStyles="mt-7"
            placeholder="Enter the school you teach at"
          />

          <View className="mt-7">
            <Text className="text-white text-lg mb-2">Teaching License</Text>
            <TouchableOpacity
              onPress={() => pickDocument("teachingLicense")}
              className="border border-gray-500 rounded-lg p-3">
              <Text className="text-white">
                {form.teachingLicense
                  ? "Teaching License Uploaded"
                  : "Upload Teaching License (PDF)"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-7">
            <Text className="text-white text-lg mb-2">Graduation Paper</Text>
            <TouchableOpacity
              onPress={() => pickDocument("graduationPaper")}
              className="border border-gray-500 rounded-lg p-3">
              <Text className="text-white">
                {form.graduationPaper
                  ? "Graduation Paper Uploaded"
                  : "Upload Graduation Paper (PDF)"}
              </Text>
            </TouchableOpacity>
          </View>

          <CustomButton
            title="Verify"
            handlePress={submitForm}
            isLoading={submitting}
            disabled={submitting}
            containerStyles="mt-7 bg-blue-500"
            textStyles="text-white text-lg"
          />

          <View className="justify-evenly align-middle pt-5 flex-row gap-2">
            <TouchableOpacity onPress={() => router.push("../help")}>
              <Text className="text-[16px] font-pregular text-gray-200">
                Contact Support
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("../help")}>
              <Text className="text-[16px] font-pregular text-blue-500">
                Skip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TeacherVerification;
