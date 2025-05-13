import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Field } from "@/components/Field";
import { useSelector } from "react-redux";

export default function EditProfileScreen() {
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isDark = currentTheme === "dark";

  return (
    <View
      className={`flex-1 px-4 pt-14 ${
        isDark ? "bg-black" : "bg-[#f1f3fc]"
      }`}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity className="p-1">
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDark ? "white" : "black"}
          />
        </TouchableOpacity>
        <Text
          className={`text-lg font-pbold ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          Edit Profile
        </Text>
        <TouchableOpacity className="p-1">
          <Ionicons
            name="checkmark"
            size={24}
            color={isDark ? "white" : "black"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View className="items-center mb-8">
          <View
            className={`relative rounded-full ${
              isDark ? "" : "border border-gray-200"
            }`}
          >
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=32" }}
              className="w-24 h-24 rounded-full"
            />
            <TouchableOpacity
              className={`absolute bottom-0 right-0 p-1 rounded-full border ${
                isDark
                  ? "bg-neutral-900 border-neutral-700"
                  : "bg-white border-gray-300 shadow"
              }`}
            >
              <Feather
                name="camera"
                size={16}
                color={isDark ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields Container */}
        <View
          className={`space-y-4 px-4 py-5 rounded-2xl ${
            isDark
              ? ""
              : "bg-white border border-gray-200 shadow-sm"
          }`}
        >
          <Field
            label="Name"
            placeholder="Charlotte King"
            theme={currentTheme}
          />
          <Field
            label="E mail address"
            placeholder="@johnkinggraphics.gmail.com"
            type="email"
            theme={currentTheme}
          />
          <Field
            label="User name"
            placeholder="@johnkinggraphics"
            theme={currentTheme}
          />
          <Field
            label="Password"
            type="password"
            value="password"
            theme={currentTheme}
          />
          <Field
            label="Phone number"
            placeholder="+91 6895312"
            type="phone"
            theme={currentTheme}
          />
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
