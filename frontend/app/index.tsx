import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { Cognify } from "../constants/images";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import { getUserData } from "@/scripts/storage";
import { useRouter } from "expo-router";

export default function App() {
  const animationRef = useRef(null);
  const router = useRouter();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 👇 Load user data once
  useEffect(() => {
    const loadUser = async () => {
      const user = await getUserData();
      if (user?.role === "Teacher") setUserRole("Teacher");
      else if (user?.role === "Student") setUserRole("Student");
      else setUserRole(null);
      setLoading(false);
    };

    loadUser();
  }, []);

  // 👇 Redirect to role-based tab layouts
  useEffect(() => {
    if (!loading) {
      if (userRole === "Teacher") {
        router.replace("/teacher/(tabs)/Home");
      } else if (userRole === "Student") {
        router.replace("/student/(tabs)/Home");
      }
    }
  }, [loading, userRole]);

  // 👇 While redirecting
  if (loading || userRole === "Teacher" || userRole === "Student") {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  // 👇 Default: Landing / Welcome screen
  return (
    <SafeAreaView className="bg-[#f1f3fc] h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full min-h-[85vh] justify-start items-center px-4">
          <Image
            source={Cognify}
            resizeMode="contain"
            style={{ height: 190, tintColor: "#4F46E5" }}
          />

          <View className="w-full items-center justify-center">
            <View className="w-full h-64 items-center justify-center">
              <LottieView
                ref={animationRef}
                source={require("../assets/animations/group.json")}
                autoPlay
                loop
                style={{
                  width: 150,
                  height: 200,
                  transform: [{ scale: 3 }],
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
            Where learning meets a connected environment, connect to various
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
