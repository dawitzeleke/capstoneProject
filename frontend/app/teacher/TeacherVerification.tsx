import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";

import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import httpRequest from "@/util/httpRequest";
import type { DocumentPickerAsset } from "expo-document-picker";

type VerificationForm = {
  id: string;
  school: string;
  teachingLicense: DocumentPickerAsset | null;
  graduationPaper: DocumentPickerAsset | null;
};

const TeacherVerification = () => {
  const router = useRouter();

  const [form, setForm] = useState<VerificationForm>({
    id: "",
    school: "",
    teachingLicense: null,
    graduationPaper: null,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (key: keyof VerificationForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const pickDocument = async (field: "teachingLicense" | "graduationPaper") => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setForm((prevForm) => ({
          ...prevForm,
          [field]: file,
        }));
      }
    } catch (err) {
      console.error("Document Picker Error:", err);
      alert("Failed to pick document. Please try again.");
    }
  };

  const submitForm = async () => {
    if (
      !form.id.trim() ||
      !form.school.trim() ||
      !form.teachingLicense ||
      !form.graduationPaper
    ) {
      alert("Please complete all fields and upload both documents.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("SchoolName", form.school.trim());
      formData.append("NationalId", form.id.trim());

      formData.append("LicenseDocument", {
        uri: form.teachingLicense.uri,
        name: form.teachingLicense.name,
        type: "application/pdf",
      } as any);

      formData.append("GraduationDocument", {
        uri: form.graduationPaper.uri,
        name: form.graduationPaper.name,
        type: "application/pdf",
      } as any);

      await httpRequest("/Teachers/verification-request", formData, "POST", {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          // Content-Type is automatically set for FormData
        },
      });

      alert("Verification request submitted successfully!");
      router.replace("../teacher/(tabs)/Home");
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Text className="text-2xl text-white font-semibold mt-5">
            Teacher Verification
          </Text>

          <FormField
            title="National ID, Passport or ID Number"
            value={form.id}
            handleChangeText={(text) => handleInputChange("id", text)}
            otherStyles="mt-7"
            placeholder="Enter your ID, Passport or National ID"
          />

          <FormField
            title="School Name"
            value={form.school}
            handleChangeText={(text) => handleInputChange("school", text)}
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
                  ? `Uploaded: ${form.teachingLicense.name}`
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
                  ? `Uploaded: ${form.graduationPaper.name}`
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

          <View className="flex-row justify-evenly pt-5 gap-2">
            <TouchableOpacity onPress={() => router.push("../help")}>
              <Text className="text-[16px] font-pregular text-gray-200">
                Contact Support
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("../teacher/(tabs)/Home")}>
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
