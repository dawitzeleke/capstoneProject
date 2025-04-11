import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import TeacherItem from "@/components/TeacherItem";
import { RootState, AppDispatch } from "../../redux/store";
import { setTeacherData } from "../../redux/teacherReducer/teacherActions";

const FollowingList = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState("");

  const followingTeachers = useSelector(
    (state: RootState) => state.teacher.teachers
  );

  const filteredTeachers = followingTeachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(query.toLowerCase())
  );

  const handlePress = (teacher: (typeof followingTeachers)[0]) => {
    dispatch(setTeacherData(teacher));
    router.push("/student/(tabs)/TeacherDetail");
  };

  return (
    <View className="flex-1 bg-primary px-4 pt-6">
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="gray" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-pbold">Following</Text>
        <Ionicons name="people-circle" size={28} color="white" />
      </View>

      <View className="flex-row items-center bg-gray-700 p-3 rounded-full mb-4">
        <TextInput
          placeholder="Search followed teachers"
          placeholderTextColor="#ccc"
          value={query}
          onChangeText={setQuery}
          className="flex-1 ml-2 text-white pl-4 font-pregular"
        />
        <TouchableOpacity className="p-2">
          <Ionicons name="search" size={20} color="white" />
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
          />
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-400 mt-10">
            You are not following any teacher.
          </Text>
        }
      />
    </View>
  );
};

export default FollowingList;
