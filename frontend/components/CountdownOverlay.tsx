import React from "react";
import { View, Text } from "react-native";

type CountdownOverlayProps = {
  countdown: number | null;
};

export default function CountdownOverlay({ countdown }: CountdownOverlayProps) {
  if (countdown === null) return null;
  return (
    <View className="absolute inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center">
      <Text className="text-white text-7xl font-bold">{countdown}</Text>
    </View>
  );
}
