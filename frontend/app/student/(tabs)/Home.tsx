import { View, Text } from "react-native";
import React from "react";

const Home = () => {
  return (
    <View className="bg-blue-800 flex-1  items-center justify-center">
      <Text className=" text-white text-2xl font-pblack">
        Hello NativeWind
      </Text>
      <Text className="text-red-500">
        This is a text with a background
      </Text>
    </View>
  );
};

export default Home;
