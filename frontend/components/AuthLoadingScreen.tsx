// app/index.tsx
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { Text } from "react-native";
import { RootState, persistor } from "@/redux/store";

/**
 * Root entry screen.
 * – Waits for redux-persist rehydration
 * – Looks at `user` in Redux
 * – Redirects based on role
 */
const AuthLoadingScreen = () => { const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const [rehydrated, setRehydrated] = useState(false);
  const [routerReady, setRouterReady] = useState(false);

  // Wait for Redux Persist to rehydrate
  useEffect(() => {
    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        console.log("✅ Redux rehydrated");
        setRehydrated(true);
        unsubscribe();
      }
    });
  }, []);

  // Small delay to ensure router layout is mounted
  useEffect(() => {
    const timeout = setTimeout(() => {
      setRouterReady(true);
    }, 100); // Delay to let Expo Router mount

    return () => clearTimeout(timeout);
  }, []);

  // Redirect logic
  useEffect(() => {
    if (!rehydrated || !routerReady) return;

    console.log("👤 User in index:", user);

    if (!user) {
      router.replace("/SignIn");
    } else if (user.role === "Student") {
      router.replace("/student/(tabs)/Home");
    } else if (user.role === "Teacher") {
      router.replace("/teacher/(tabs)/Home");
    } else {
      router.replace("/SignIn");
    }
  }, [rehydrated, routerReady, user]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#4F46E5" />
      <Text style={{ marginTop: 10, color: "#555" }}>
        Loading Cognify...
      </Text>
    </View>
  );
};

export default AuthLoadingScreen;
