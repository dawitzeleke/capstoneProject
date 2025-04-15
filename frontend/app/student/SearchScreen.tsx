import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { setTeacherData } from "../../redux/teacherReducer/teacherActions";
import TeacherItem from "@/components/TeacherItem";
import { RootState, AppDispatch } from "../../redux/store"; // Import RootState and AppDispatch

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch<AppDispatch>(); // Correctly type dispatch with AppDispatch

  const router = useRouter();

  // Access the teachers from Redux store
  const teachers = useSelector((state: RootState) => state.teacher.teachers);

  // Filter teachers based on the search query
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(query.toLowerCase())
  );

  // Handle teacher selection and dispatch to the store
  const handlePress = (teacher: (typeof teachers)[0]) => {
    dispatch(setTeacherData(teacher)); // Dispatch the selected teacher
    console.log(teacher);
    router.push("/student/(tabs)/TeacherDetail");
  };

  return (
    <View className="flex-1 bg-primary px-4 pt-4">
      {/* Search Bar */}
      <View className="flex-row items-center bg-gray-700 p-3 rounded-full mb-5">
        <Ionicons name="search" size={20} color="white" />
        <TextInput
          placeholder="Search teacher"
          placeholderTextColor="#ccc"
          value={query}
          onChangeText={setQuery}
          className="flex-1 ml-3 text-white font-pregular"
        />
      </View>

      {/* Toggle Buttons */}
      <View className="flex-row justify-between mb-5">
        <TouchableOpacity className="bg-cyan-700 px-5 py-3 rounded-xl">
          <Text className="text-white font-psemibold text-base">Teacher</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-700 px-5 py-3 rounded-xl">
          <Text className="text-white font-psemibold text-base">Content</Text>
        </TouchableOpacity>
      </View>

      {/* Top Rated Teachers */}
      <Text className="text-lg font-pbold text-white mb-3">Top Rated</Text>
      <FlatList
        data={filteredTeachers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TeacherItem
            name={item.name}
            title={item.title}
            followers={item.followers}
            questions={item.questions}
            imageUrl={item.imageUrl}
            onPress={() => handlePress(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-center text-gray-400 mt-10">
            No matching teachers found.
          </Text>
        }
      />
    </View>
  );
};

export default SearchScreen;
