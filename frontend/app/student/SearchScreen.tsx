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
import { RootState, AppDispatch } from "../../redux/store";

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  const teachers = useSelector((state: RootState) => state.teacher.teachers);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(query.toLowerCase())
  );

  const handlePress = (teacher: (typeof teachers)[0]) => {
    dispatch(setTeacherData(teacher));
    router.push("/student/(tabs)/TeacherDetail");
  };

  return (
    <View
      className={`flex-1 px-4 pt-4 ${
        currentTheme === "dark" ? "bg-black" : "bg-[#f1f3fc]"
      }`}>
      {/* Search Bar */}
      <View
        className={`flex-row items-center p-3 rounded-full mb-5 ${
          currentTheme === "dark" ? "bg-neutral-800" : "bg-white"
        }`}>
        <Ionicons
          name="search"
          size={20}
          color={currentTheme === "dark" ? "white" : "black"}
        />
        <TextInput
          placeholder="Search teacher"
          placeholderTextColor={currentTheme === "dark" ? "#ccc" : "#888"}
          value={query}
          onChangeText={setQuery}
          className={`flex-1 ml-3 font-pregular ${
            currentTheme === "dark" ? "text-white" : "text-black"
          }`}
        />
      </View>

      {/* Toggle Buttons */}
      <View className="flex-row justify-between mb-5">
        <TouchableOpacity
          className={`px-5 py-3 rounded-xl ${
            currentTheme === "dark" ? "bg-indigo-700" : "bg-indigo-600"
          }`}>
          <Text className="text-white font-psemibold text-base">Teacher</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-5 py-3 rounded-xl ${
            currentTheme === "dark" ? "bg-neutral-700" : "bg-gray-300"
          }`}>
          <Text
            className={`font-psemibold text-base ${
              currentTheme === "dark" ? "text-white" : "text-black"
            }`}>
            Content
          </Text>
        </TouchableOpacity>
      </View>

      {/* Top Rated Teachers */}
      <Text
        className={`text-lg font-pbold mb-3 ${
          currentTheme === "dark" ? "text-white" : "text-black"
        }`}>
        Top Rated
      </Text>
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
            theme={currentTheme}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text
            className={`text-center mt-10 ${
              currentTheme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}>
            No matching teachers found.
          </Text>
        }
      />
    </View>
  );
};

export default SearchScreen;
