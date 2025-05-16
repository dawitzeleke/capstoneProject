import {
  View,
  Text,
  TextInput,
  TextInputProps,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import React from "react";
import icons from "../constants/icons";

interface FormFieldProps extends TextInputProps {
  title: string;
  otherStyles?: string;
  handleChangeText: (text: string) => void;
  errorMessage?: string;
  placeholder?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  errorMessage,
  otherStyles,
  handleChangeText,
  placeholder,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-600 font-pmedium">{title}</Text>
      <View
        className={`w-full px-4 h-16 rounded-2xl flex-row items-center ${
          errorMessage ? "bg-red-100 border border-red-400" : "bg-gray-300"
        }`}
      >
        <TextInput
          className="text-base font-psemibold flex-1 text-gray-800 bg-transparent"
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? icons.eyeHide : icons.eye}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
      {errorMessage ? (
        <Text className="text-sm text-red-600 font-pmedium">{errorMessage}</Text>
      ) : null}
    </View>
  );
};

export default FormField;
