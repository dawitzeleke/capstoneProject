import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { Link } from "expo-router";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";

const TeacherProfile = () => {
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
      {/* Profile Header */}
      <View className="items-center justify-center relative">
        <View className="flex-row items-center mb-6 absolute top-3 left-0 ">
          <Link
            href="/student/(tabs)/SearchScreen"
            className="text-lg text-blue-500 font-pregular">
            <Ionicons name="chevron-back" size={20} color="gray" />
          </Link>
        </View>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/3.jpg" }}
          className="w-24 h-24 rounded-full border-2 border-gray-400"
        />
        <Text className="text-white text-lg font-psemibold mt-2">
          Johnnie 21
        </Text>
        <Text className="text-gray-400 font-pregular">Teaches Biology</Text>
      </View>

      {/* Stats */}
      <View className="flex-row justify-around mt-4">
        <View className="items-center w-20">
          <AntDesign name="staro" size={24} color="white" />
          <Text className="text-white text-lg font-pbold">4.2</Text>
          <Text className="text-gray-400 font-pregular">Raiting</Text>
        </View>
        <View className="items-center w-20">
          <MaterialIcons name="group" size={24} color="white" />
          <Text className="text-white text-lg font-pbold ">189</Text>
          <Text className="text-gray-400 font-pregular">Followers</Text>
        </View>
        <View className="items-center w-20">
          <MaterialIcons name="edit-note" size={24} color="white" />
          <Text className="text-white text-lg font-pbold">461</Text>
          <Text className="text-gray-400 font-pregular">Questions</Text>
        </View>
      </View>

      {/* Follow Button */}
      <TouchableOpacity className="p-2 border border-cyan-400 rounded-lg mt-4 items-center">
        <Text className="text-white font-psemibold">Follow</Text>
      </TouchableOpacity>

      {/* Suggested Teachers */}
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
      />
    </View>
  );
};

export default TeacherProfile;
