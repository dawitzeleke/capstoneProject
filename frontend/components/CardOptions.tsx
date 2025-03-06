import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { setReport } from "@/redux/optionReducer/optionActions";
import { MaterialIcons } from "@expo/vector-icons";

const OptionsMenu = () => {
  const dispatch = useDispatch<AppDispatch>();
  const menuState = useSelector((state: RootState) => state.option);

  const handlePress = () => {
    dispatch(setReport());
  };
  console.log("Rendered");

  return (
    <View className="w-[250px] h-[220px] bg-gray-900 rounded-2xl  py-6 z-10 shadow-2xl border border-gray-800">
      <TouchableOpacity className="py-4 border-b border-gray-700 active:bg-gray-800">
        <Text
          onPress={handlePress}
          className="text-white text-lg font-medium text-center tracking-wide">
          Report
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="py-4 border-b border-gray-700 active:bg-gray-800">
        <Text className="text-white text-lg font-medium text-center tracking-wide">
          Explanation
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="py-4 border-b border-gray-700 active:bg-gray-800">
        <Text className="text-white text-lg font-medium text-center tracking-wide">
          Help
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OptionsMenu;
