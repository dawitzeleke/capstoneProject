import { View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { MaterialIcons } from "@expo/vector-icons";

const ReportOption = () => {
  const currentTheme = useSelector((state: RootState) => state.theme.mode);

  return (
    <View className={`w-[280px] rounded-2xl py-4 z-10 shadow-2xl border ${
      currentTheme === "dark" 
        ? "bg-gray-900 border-gray-800" 
        : "bg-white border-gray-200"
    }`}>
      <View className="items-center mb-4">
        <MaterialIcons 
          name="report" 
          size={32} 
          color={currentTheme === "dark" ? "#fff" : "#000"} 
        />
        <Text className={`text-xl font-psemibold mt-2 ${
          currentTheme === "dark" ? "text-white" : "text-gray-900"
        }`}>
          Report Question
        </Text>
        <Text className={`text-sm text-center mt-1 ${
          currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}>
          Help us understand what's wrong
        </Text>
      </View>

      <TouchableOpacity 
        className="flex-row items-center px-6 py-4 active:opacity-70"
      >
        <MaterialIcons 
          name="school" 
          size={24} 
          color={currentTheme === "dark" ? "#fff" : "#000"} 
        />
        <View className="ml-4 flex-1">
          <Text className={`text-lg font-psemibold ${
            currentTheme === "dark" ? "text-white" : "text-gray-900"
          }`}>
            Non-educational
          </Text>
          <Text className={`text-sm font-pregular ${
            currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            Content not suitable for learning
          </Text>
        </View>
      </TouchableOpacity>

      <View className={`h-[1px] mx-4 my-2 ${
        currentTheme === "dark" ? "bg-gray-800" : "bg-gray-200"
      }`} />

      <TouchableOpacity 
        className="flex-row items-center px-6 py-4 active:opacity-70"
      >
        <MaterialIcons 
          name="error" 
          size={24} 
          color={currentTheme === "dark" ? "#fff" : "#000"} 
        />
        <View className="ml-4 flex-1">
          <Text className={`text-lg font-psemibold ${
            currentTheme === "dark" ? "text-white" : "text-gray-900"
          }`}>
            Incorrect Question
          </Text>
          <Text className={`text-sm font-pregular ${
            currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            The answer provided is wrong
          </Text>
        </View>
      </TouchableOpacity>

      <View className={`h-[1px] mx-4 my-2 ${
        currentTheme === "dark" ? "bg-gray-800" : "bg-gray-200"
      }`} />

      <TouchableOpacity 
        className="flex-row items-center px-6 py-4 active:opacity-70"
      >
        <MaterialIcons 
          name="subject" 
          size={24} 
          color={currentTheme === "dark" ? "#fff" : "#000"} 
        />
        <View className="ml-4 flex-1">
          <Text className={`text-lg font-psemibold ${
            currentTheme === "dark" ? "text-white" : "text-gray-900"
          }`}>
            Subject Irrelevant
          </Text>
          <Text className={`text-sm font-pregular ${
            currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            Question doesn't match the subject
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ReportOption;
