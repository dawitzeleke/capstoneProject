import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { FC, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

type FieldType = "text" | "email" | "password" | "phone";

interface FieldProps extends Omit<TextInputProps, "secureTextEntry"> {
  label: string;
  type?: FieldType;
  theme?: "dark" | "light";
}

export const Field: FC<FieldProps> = ({
  label,
  type = "text",
  theme = "light",
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  const isPassword = type === "password";
  const keyboardType =
    type === "email"
      ? "email-address"
      : type === "phone"
      ? "phone-pad"
      : "default";

  const isDark = theme === "dark";

  return (
    <View>
      <Text
        className={`text-sm font-psemibold mb-1 ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}
      >
        {label}
      </Text>
      <View
        className={`flex-row items-center rounded-xl px-4 ${
          isPassword ? "pr-2" : ""
        } ${isDark ? "bg-neutral-800" : "bg-gray-50"} border ${
          isDark ? "border-transparent" : "border-gray-200"
        }`}
      >
        <TextInput
          className={`flex-1 py-3 text-sm font-pregular ${
            isDark
              ? "text-gray-100 placeholder:text-gray-400"
              : "text-gray-900 placeholder:text-gray-500"
          }`}
          placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
          keyboardType={keyboardType}
          secureTextEntry={isPassword && !visible}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setVisible(!visible)}>
            <MaterialIcons
              name={visible ? "visibility" : "visibility-off"}
              size={20}
              color={isDark ? "#e5e7eb" : "#6b7280"} // light gray in dark, medium gray in light
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
