import React, { useEffect, useState } from "react";
import { Stack, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator } from "react-native";
import { Provider } from "react-redux";
import store from "@/redux/store";
import "../global.css";

// Prevent splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [appReady, setAppReady] = useState(false);

  // Load fonts
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
        setAppReady(true);
      }, 200); // Small delay for smoother transition
    }
  }, [fontsLoaded, error]);

  // Show loading screen while fonts are loading
  if (!appReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <Stack
          screenOptions={{
            animation: "slide_from_right",
            animationDuration: 300, // Smoother transition
            headerShown: false,
            presentation: "transparentModal", // Keep previous screen visible
            freezeOnBlur: true, // Prevent blank screen when navigating back
          }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="TeacherVerification"
            options={{ headerShown: false }} // Hides the header
          />
          {/* <Stack.Screen name="/search/[query]" options={{ headerShown: false }} /> */}
        </Stack>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
