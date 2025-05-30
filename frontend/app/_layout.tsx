import React, { useEffect, useState } from "react";
import { Stack, useRouter, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator } from "react-native";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor, RootState } from "@/redux/store";
import "../global.css";

SplashScreen.preventAutoHideAsync();

const RedirectHandler: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const [rehydrated, setRehydrated] = useState(false);

  useEffect(() => {
    // Listen for redux-persist rehydration
    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        setRehydrated(true);
        unsubscribe();
      }
    });
  }, []);

  useEffect(() => {
    if (!rehydrated) return;

    if (user) {
      if (user.role === "Student") {
        router.replace("/student/(tabs)/Home");
      } else if (user.role === "Teacher") {
        router.replace("/teacher/(tabs)/Home");
      }
    } else {
      router.replace("/SignIn");
    }
  }, [rehydrated, user]);

  if (!rehydrated) {
    // wait for persistence to finish
  }

  return <>{children}</>;
};

const RootLayout = () => {
  const [appReady, setAppReady] = useState(false);

  const [fontsLoaded, error] = useFonts({
    // your font loading here...
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
        setAppReady(true);
      }, 200);
    }
  }, [fontsLoaded, error]);

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
        <PersistGate
          loading={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          }
          persistor={persistor}>
          <RedirectHandler>
            <Stack
              screenOptions={{
                animation: "slide_from_right",
                animationDuration: 300,
                headerShown: false,
                presentation: "transparentModal",
                freezeOnBlur: true,
              }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="TeacherVerification"
                options={{ headerShown: false }}
              />
            </Stack>
          </RedirectHandler>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
