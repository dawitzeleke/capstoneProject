import { View, Text, ScrollView, Image, StatusBar } from "react-native";
import { Link, Redirect, router } from "expo-router";
import { blue } from "react-native-reanimated/lib/typescript/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import favicon from "../constants/images";

export default function App() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full min-h-[85vh] justify-start items-center px-4">
          <Image
            source={favicon}
            className="w-[130px] h-[80px] bg-white my-10"
            resizeMode="contain"
          />
          <Image
            className="w-[380px] h-[300px] bg-white"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover a whole new learning Experience {""}
              <Text className="text-secondary-100">FunIQ</Text>
            </Text>
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-5 text-center">
            Where learning meets a connected environment, Connect to various
            educators from all over the counrty.
          </Text>
          <CustomButton
            title="Continue With Email"
            handlePress={() => router.push("/(auth)/SignIn")}
            containerStyles="w-full mt-7"
            textStyles=""
            isLoading={false}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" barStyle="light-content" />
    </SafeAreaView>
  );
}
