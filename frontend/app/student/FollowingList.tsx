import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import TeacherItem from "@/components/TeacherItem";
import { RootState, AppDispatch } from "../../redux/store";
import { setTeacherData } from "../../redux/teacherReducer/teacherActions";
import { SafeAreaView } from "react-native-safe-area-context";

const FollowingList = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState("");

  const followingTeachers = useSelector(
    (state: RootState) => state.teacher.teachers
  );
  const currentTheme = useSelector((state: RootState) => state.theme.mode); // Get the current theme

  const filteredTeachers = followingTeachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(query.toLowerCase())
  );

  const handlePress = (teacher: (typeof followingTeachers)[0]) => {
    dispatch(setTeacherData(teacher));
    router.push("/student/(tabs)/TeacherDetail");
  };

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === "dark" ? "bg-black" : "bg-[#f1f3fc]"}`}> 
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <View style={{ flex: 1 }}>
          <View
            className={`flex-row justify-between items-center mb-4 ${
              currentTheme === "dark" ? "text-white" : "text-gray-800"
            }`}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={currentTheme === "dark" ? "white" : "gray"}
              />
            </TouchableOpacity>
            <Text
              className={`text-2xl font-pbold ${
                currentTheme === "dark" ? "text-white" : "text-gray-800"
              }`}>
              Following
            </Text>
            <Ionicons
              name="people-circle"
              size={28}
              color={currentTheme === "dark" ? "white" : "gray"}
            />
          </View>

          <View
            className={`flex-row items-center ${
              currentTheme === "dark" ? "bg-gray-700" : "bg-gray-200"
            } p-3 rounded-full mb-4`}>
            <TextInput
              placeholder="Search followed teachers"
              placeholderTextColor={currentTheme === "dark" ? "#ccc" : "#888"}
              value={query}
              onChangeText={setQuery}
              className={`flex-1 ml-2 ${
                currentTheme === "dark" ? "text-white" : "text-black"
              } pl-4 font-pregular`}
            />
            <TouchableOpacity className="p-2">
              <Ionicons
                name="search"
                size={20}
                color={currentTheme === "dark" ? "white" : "gray"}
              />
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredTeachers}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TeacherItem
                name={item.name}
                title={item.title}
                followers={item.followers}
                questions={item.questions}
                imageUrl={item.imageUrl}
                onPress={() => handlePress(item)}
                theme={currentTheme} // Pass the theme to TeacherItem
              />
            )}
            ListEmptyComponent={
              <Text
                className={`text-center ${
                  currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
                } mt-10`}>
                You are not following any teacher.
              </Text>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FollowingList;
