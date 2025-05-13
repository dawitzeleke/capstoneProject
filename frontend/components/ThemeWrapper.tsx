import { View, ViewProps } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type ThemeWrapperProps = ViewProps & {
  children: React.ReactNode;
};

export default function ThemeWrapper({ children, ...props }: ThemeWrapperProps) {
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <View className={`${theme === "dark" ? "dark" : ""} flex-1`} {...props}>
      {children}
    </View>
  );
}
