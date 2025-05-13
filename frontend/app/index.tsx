import { View, Text, ScrollView, Image, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { favicon, CognifyLogo, Cognify, home } from "../constants/images";
import { router } from "expo-router";
import LottieView from "lottie-react-native"; // ✅ Lottie
import { useRef } from "react";

export default function App() {
  const animationRef = useRef(null);

  return (
    <SafeAreaView className="bg-[#f1f3fc] h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full min-h-[85vh] justify-start items-center px-4">
          {/* ✅ Lottie Animation */}

          <Image
            source={Cognify}
            className=""
            resizeMode="contain"
            style={{ height: 190, tintColor: "#4F46E5" }}
          />
          <View className="w-full items-center justify-center">
  <View style={{ width: 450, height: 350 }}>
    <LottieView
      ref={animationRef}
      source={require("../assets/animations/group.json")}
      autoPlay
      loop
      style={{
        width: 700,
        height: 700,
        transform: [{ scale: 3 }], // force magnify
      }}
    />
  </View>
</View>

          <View className="relative">
            <Text className="text-3xl text-gray-800 font-pregular text-center">
              Discover a whole new learning Experience{" "}
              <Text className="text-[#4F46E5] font-pbold">Cognify</Text>
            </Text>
          </View>
          <Text className="text-sm font-pregular text-gray-600 mt-5 text-center">
            Where learning meets a connected environment, Connect to various
            educators from all over the country.
          </Text>
          <CustomButton
            title="Continue With Email"
            handlePress={() => router.push("/(auth)/SignIn")}
            containerStyles="w-full mt-7"
            textStyles="text-white"
            isLoading={false}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" barStyle="light-content" />
    </SafeAreaView>
  );
}
