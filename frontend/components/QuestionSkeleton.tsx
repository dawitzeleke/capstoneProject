import React, { useEffect, useRef } from "react";
import { View, Animated, useWindowDimensions } from "react-native";
import { Easing } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const QuestionSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const { width, height } = useWindowDimensions();

  const currentTheme = useSelector((state: RootState) => state.theme.mode);

  const shimmerLoop = Animated.loop(
    Animated.timing(shimmerAnim, {
      toValue: 1,
      duration: 2300,
      easing: Easing.linear,
      useNativeDriver: false,
    }),
    { iterations: -1 }
  );

  useEffect(() => {
    shimmerLoop.start();
    return () => shimmerLoop.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const Shimmer = ({ className = "" }: { className?: string }) => (
    <View
      className={`relative overflow-hidden ${
        currentTheme === "dark" ? "bg-neutral-700/30" : "bg-gray-300/30"
      } ${className}`}>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "80%",
          backgroundColor:
            currentTheme === "dark"
              ? "rgba(255,255,255,0.06)"
              : "rgba(200,200,200,0.1)",
          transform: [{ translateX }],
        }}
      />
    </View>
  );

  return (
    <View
      style={{ height: height * 0.94 }}
      className={`justify-center mb-2 px-4 p-5 w-full relative ${
        currentTheme === "dark" ? "bg-neutral-800" : "bg-[#f1f3fc]"
      }`}>
      {/* User Info */}
      <View className="absolute top-2 w-full h-[60px] left-0 flex flex-row justify-between items-center px-6">
        <View className="flex flex-row items-center">
          <Shimmer className="w-[48px] h-[48px] rounded-full" />
        </View>
      </View>

      {/* Question Text */}
      <View className="mb-8 mt-[80px] space-y-3">
        <Shimmer className="w-4/4 h-5 rounded-md" />
        <Shimmer className="w-4/4 h-5 rounded-md" />
        <Shimmer className="w-2/3 h-4 rounded-md" />
      </View>

      {/* Answer Options */}
      <View className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <Shimmer key={i} className={`w-full h-[48px] rounded-xl`} />
        ))}
      </View>

      {/* Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 p-2"
        style={{
          backgroundColor:
            currentTheme === "dark" ? "bg-neutral-800" : "bg-[#f1f3fc]", // dark: gray-900, light: gray-100
          width: "100%",
        }}>
        <Shimmer className="w-40 h-4 rounded-md mb-2" />
        <Shimmer className="w-5/6 h-3 rounded-md mb-1" />
        <Shimmer className="w-12 h-3 rounded-md" />
      </View>
    </View>
  );
};

export default QuestionSkeleton;
