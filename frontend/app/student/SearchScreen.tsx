import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { setTeacherData } from "../../redux/teacherReducer/teacherActions";
import TeacherItem from "@/components/TeacherItem";
import { RootState, AppDispatch } from "../../redux/store";

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"teachers" | "content">("teachers");
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
      className={`flex-1 ${
        currentTheme === "dark" ? "bg-black" : "bg-[#f1f3fc]"
      }`}>
      {/* Header */}
      <View className={`px-4 pt-12 pb-4 ${
        currentTheme === "dark" ? "bg-gray-900" : "bg-white"
      }`}>
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={currentTheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
          <Text className={`text-xl font-pbold ${
            currentTheme === "dark" ? "text-white" : "text-gray-900"
          }`}>
            Search
          </Text>
          <View className="w-6" />
        </View>

        {/* Search Bar */}
        <View
          className={`flex-row items-center p-3 rounded-xl mb-4 ${
            currentTheme === "dark" ? "bg-gray-800" : "bg-gray-100"
          }`}>
          <Ionicons
            name="search"
            size={20}
            color={currentTheme === "dark" ? "#9ca3af" : "#6b7280"}
          />
          <TextInput
            placeholder="Search teachers or content..."
            placeholderTextColor={currentTheme === "dark" ? "#9ca3af" : "#6b7280"}
            value={query}
            onChangeText={setQuery}
            className={`flex-1 ml-3 font-pregular text-base ${
              currentTheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={currentTheme === "dark" ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Toggle Buttons */}
        <View className="flex-row space-x-3 mt-4">
          <TouchableOpacity
            onPress={() => setActiveTab("teachers")}
            className={`flex-1 py-3 rounded-xl border ${
              activeTab === "teachers"
                ? currentTheme === "dark"
                  ? "border-indigo-500 bg-indigo-500/20"
                  : "border-indigo-600 bg-indigo-500/10"
                : currentTheme === "dark"
                ? "border-gray-700 bg-gray-800/50"
                : "border-gray-200 bg-gray-200/50"
            }`}
          >
            <Text
              className={`text-center font-psemibold ${
                activeTab === "teachers"
                  ? currentTheme === "dark"
                    ? "text-indigo-400"
                    : "text-indigo-600"
                  : currentTheme === "dark"
                  ? "text-gray-300"
                  : "text-gray-700"
              }`}
            >
              Teachers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("content")}
            className={`flex-1 py-3 rounded-xl border ${
              activeTab === "content"
                ? currentTheme === "dark"
                  ? "border-indigo-500 bg-indigo-500/20"
                  : "border-indigo-600 bg-indigo-500/10"
                : currentTheme === "dark"
                ? "border-gray-700 bg-gray-800/50"
                : "border-gray-200 bg-gray-200/50"
            }`}
          >
            <Text
              className={`text-center font-psemibold ${
                activeTab === "content"
                  ? currentTheme === "dark"
                    ? "text-indigo-400"
                    : "text-indigo-600"
                  : currentTheme === "dark"
                  ? "text-gray-300"
                  : "text-gray-700"
              }`}
            >
              Content
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-4 pt-4">
        {activeTab === "teachers" ? (
          <>
            {query.length > 0 && (
              <Text
                className={`text-sm font-pmedium mb-4 ${
                  currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                {filteredTeachers.length} results found
              </Text>
            )}
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
                <View className="flex-1 items-center justify-center mt-10">
                  <MaterialIcons
                    name="search-off"
                    size={48}
                    color={currentTheme === "dark" ? "#4b5563" : "#9ca3af"}
                  />
                  <Text
                    className={`text-center mt-4 text-base font-pmedium ${
                      currentTheme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}>
                    {query.length > 0
                      ? "No matching teachers found."
                      : "Search for teachers to get started."}
                  </Text>
                </View>
              }
            />
          </>
        ) : (
          <View className="flex-1 items-center justify-center">
            <MaterialIcons
              name="content-paste"
              size={48}
              color={currentTheme === "dark" ? "#4b5563" : "#9ca3af"}
            />
            <Text
              className={`text-center mt-4 text-base font-pmedium ${
                currentTheme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
              Content search coming soon...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchScreen;
