import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  GestureResponderEvent,
} from "react-native";
import React from "react";

interface CustomButtonProps {
  title: string;
  handlePress: (event: GestureResponderEvent) => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles = "",
  textStyles = "",
  isLoading = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-[#4F46E5] font-pmedium rounded-xl min-h-[62px] justify-center items-center px-4 ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={disabled || isLoading}>
      {isLoading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text className={` font-psemibold text-lg ${textStyles}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
