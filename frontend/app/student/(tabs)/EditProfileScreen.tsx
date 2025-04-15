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

export default function EditProfileScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View className="flex-1 bg-primary px-4 pt-14">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="gray" />
        </TouchableOpacity>
        <Text className="text-lg font-pbold text-gray-200">Edit Profile</Text>
        <TouchableOpacity>
          <Ionicons name="checkmark" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View className="items-center mb-8">
          <View className="relative">
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=32" }} // Replace with real user image
              className="w-24 h-24 rounded-full"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-300">
              <Feather name="camera" size={16} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View className="space-y-4">
          <Field label="Name" placeholder="Charlotte King" />
          <Field
            label="E mail address"
            placeholder="@johnkinggraphics.gmail.com"
            type="email"
          />
          <Field label="User name" placeholder="@johnkinggraphics" />
          <Field
            label="Password"
            type="password"
            value="password"
          />
          <Field label="Phone number" placeholder="+91 6895312" type="phone" />
        </View>
      </ScrollView>
    </View>
  );
}
