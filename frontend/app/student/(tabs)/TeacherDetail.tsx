import React from "react";
import { useSelector } from "react-redux";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { Link } from "expo-router";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { RootState } from "../../../redux/store";

const TeacherProfile = () => {
  const teacherData = useSelector(
    (state: RootState) => state.teacher.teacherData
  );
  console.log(teacherData);

  if (!teacherData) return null;

  const { name, title, followers, questions, imageUrl } = teacherData;

  const suggestedTeachers = [
    {
      id: "1",
      name: "Rahel Solomons",
      subject: "Math",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: "2",
      name: "Yanet Mekuria",
      subject: "Physics",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
    },
  ];

  return (
    <View className="flex-1 bg-primary p-4">
      {/* Back button */}
      <View className="absolute top-3 left-3 z-10">
        <Link
          href="/student/(tabs)/Home"
          className="text-lg text-blue-500 font-pregular">
          <Ionicons name="chevron-back" size={20} color="gray" />
        </Link>
      </View>

      {/* Profile Info */}
      <View className="items-center justify-center mt-10">
        <Image
          source={{ uri: imageUrl }}
          className="w-24 h-24 rounded-full border-2 border-gray-400"
        />
        <Text className="text-white text-lg font-psemibold mt-2">{name}</Text>
        <Text className="text-gray-400 font-pregular">{title}</Text>
      </View>

      {/* Stats */}
      <View className="flex-row justify-around mt-4">
        <View className="items-center align-middle w-20">
          <AntDesign name="staro" size={24} color="white" />
          <Text className="text-white text-lg font-pbold text-center">
            4.2 Rating
          </Text>
        </View>
        <View className="items-center flex-col align-middle w-20">
          <MaterialIcons name="group" size={24} color="white" />
          <Text className="text-white text-lg text-center font-pbold">
            {followers}
          </Text>
        </View>
        <View className="items-center w-20">
          <MaterialIcons name="edit-note" size={24} color="white" />
          <Text className="text-white text-lg text-center font-pbold">
            {questions}
          </Text>
        </View>
      </View>

      {/* Follow button */}
      <TouchableOpacity className="p-2 border border-cyan-400 rounded-lg mt-4 items-center">
        <Text className="text-white font-psemibold">Follow</Text>
      </TouchableOpacity>

      {/* Suggested */}
      <Text className="text-white font-pbold mt-6 mb-2">Suggested for you</Text>
      <FlatList
        horizontal
        data={suggestedTeachers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="m-2 items-center">
            <Image
              source={{ uri: item.image }}
              className="w-16 h-16 rounded-full"
            />
            <Text className="text-white mt-1 text-sm font-psemibold">
              {item.name}
            </Text>
            <Text className="text-gray-400 text-xs font-pregular">
              {item.subject}
            </Text>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default TeacherProfile;
