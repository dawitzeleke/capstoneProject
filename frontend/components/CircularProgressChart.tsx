import React from "react";
import { View, Text } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";

const CircularProgressChart = () => {
  return (
    <View className="items-center justify-center">
      <CircularProgress
        value={72}
        radius={60}
        duration={1500}
        progressValueColor={"gray"}
        maxValue={100}
        inActiveStrokeOpacity={0.2}
        activeStrokeWidth={10}
        inActiveStrokeWidth={10}
        activeStrokeColor={"aqua"}
        inActiveStrokeColor={"#ddd"}
        title={"Steps"}
        titleColor={"#555"}
        titleStyle={{ fontSize: 14 }}
      />
    </View>
  );
};

export default CircularProgressChart;
