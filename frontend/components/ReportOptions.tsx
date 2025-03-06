import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ReportOption = () => {
  console.log("Rendered")
  return (
    <View className="w-[320px] h-[320px] bg-gray-900 rounded-2xl py-6 z-10 shadow-2xl border border-gray-800">
      <TouchableOpacity className="py-4 border-b border-gray-700 active:bg-gray-800">
        <Text className="text-white text-lg font-medium text-center tracking-wide">
          Non-educational
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="py-4 border-b border-gray-700 active:bg-gray-800">
        <Text className="text-white text-lg font-medium text-center tracking-wide">
          Incorrect Question
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="py-4 border-b border-gray-700 active:bg-gray-800">
        <Text className="text-white text-lg font-medium text-center tracking-wide">
          Subject Irrelevant
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReportOption;
