import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { setReport } from "@/redux/optionReducer/optionActions";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";

const OptionsMenu = () => {
  const dispatch = useDispatch<AppDispatch>();
  const menuState = useSelector((state: RootState) => state.option);
  const currentTheme = useSelector((state: RootState) => state.theme.mode);

  const handlePress = () => {
    dispatch(setReport());
  };

  return (
    <View className={` p-6 rounded-lg ${currentTheme === "dark" ? "bg-gray-900" : "bg-white"} rounded-t-3xl`}>
      <View className="w-12 h-1 bg-gray-400 rounded-full self-center my-3" />
      
      <TouchableOpacity 
        className="flex-row items-center px-6 py-4 border-b border-gray-200"
        onPress={handlePress}
      >
        <Ionicons 
          name="flag-outline" 
          size={24} 
          color="#ef4444" 
          className="mr-3"
        />
        <Text className="text-red-500 font-psemibold text-lg">Report</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="flex-row items-center px-6 py-4 border-b border-gray-200"
      >
        <Feather 
          name="book-open" 
          size={24} 
          color={currentTheme === "dark" ? "#e5e5e5" : "#64748b"} 
          className="mr-3"
        />
        <Text className={`font-pmedium text-base ${currentTheme === "dark" ? "text-gray-300" : "text-gray-800"}`}>
          Explanation
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="flex-row items-center px-6 py-4 border-b border-gray-200"
      >
        <Ionicons 
          name="help-circle-outline" 
          size={24} 
          color={currentTheme === "dark" ? "#e5e5e5" : "#64748b"} 
          className="mr-3"
        />
        <Text className={`font-pmedium text-base ${currentTheme === "dark" ? "text-gray-300" : "text-gray-800"}`}>
          Help
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="p-4"
      >
        <Text className={`text-center font-pmedium ${currentTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OptionsMenu;
