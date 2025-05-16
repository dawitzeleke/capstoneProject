import React from "react";
import { View, Text, ActivityIndicator, Animated } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; // Adjust path based on your project structure

const LoadingOverlay: React.FC = () => {
  // Access the loading state from Redux (state.animation.loading)
  const loading = useSelector((state: RootState) => state.animation.loading);

  // Animated value for fade effect
  const fadeAnim = new Animated.Value(0); // Initial opacity is 0 (invisible)

  // Trigger fade-in/fade-out effect based on loading state
  React.useEffect(() => {
    if (loading) {
      // Fade-in effect
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300, // Duration of fade-in animation
        useNativeDriver: true,
      }).start();
    } else {
      // Fade-out effect
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300, // Duration of fade-out animation
        useNativeDriver: true,
      }).start();
    }
  }, [loading]); // Re-run effect when `loading` changes

  if (!loading) return null; // Do not render overlay if not loading

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeAnim, // Bind the animated opacity value
      }}>
      <ActivityIndicator size="large" color="#fff" />
      <Text className="mt-4 text-white">Processing...</Text>
    </Animated.View>
  );
};

export default LoadingOverlay;
