import React, { useState } from "react";
import { useSelector } from "react-redux";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { RootState } from "../../../redux/store";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const TeacherProfile = () => {
  const teacherData = useSelector((state: RootState) => state.userTeacher.teacherData);
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!teacherData) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No teacher data found.</Text>
      </View>
    );
  }

  const { name, title, followers, questions, imageUrl } = teacherData;
  // Extract subject from title (e.g., "Teaches Math at HNS" -> "Math")
  const subjectMatch = title.match(/Teaches ([^ ]+)/i);
  const subject = subjectMatch ? subjectMatch[1] : "Subject";

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

  const isDark = currentTheme === "dark";

  const stats = [
    {
      icon: <AntDesign name="staro" size={20} color="#6366f1" />, label: "Rating", value: "4.2"
    },
    {
      icon: <MaterialIcons name="group" size={20} color="#6366f1" />, label: "Followers", value: followers
    },
    {
      icon: <MaterialIcons name="edit-note" size={20} color="#6366f1" />, label: "Questions", value: questions
    },
  ];

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-black" : "bg-[#f1f3fc]"}`}> 
      <View className="flex-1 justify-start items-stretch">
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <LinearGradient
            colors={["#f1f3fc", "#e0e7ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1 rounded-3xl shadow-2xl items-center pb-8 justify-start pt-12"
            style={{ elevation: 6, marginTop: 0, marginHorizontal: 0, borderRadius: 0 }}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {/* Banner/Gradient */}
              <LinearGradient
                colors={["#6366f1", "#a5b4fc"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-full h-40 rounded-t-3xl"
                style={{ position: 'absolute', top: 0, left: 0, right: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, zIndex: 1 }}
              />
              {/* Profile Image Overlapping Banner */}
              <View className="items-center w-full" style={{ marginTop: 32, zIndex: 2 }}>
                <View className="shadow-lg rounded-full" style={{ shadowColor: '#4F46E5', shadowOpacity: 0.3, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, zIndex: 2, position: 'relative' }}>
                  <Image
                    source={{ uri: imageUrl }}
                    className="w-32 h-32 rounded-full border-4 border-white"
                    style={{ backgroundColor: '#f1f3fc', marginTop: 10 }}
                  />
                  {/* Twitter-style Verified Check Mark */}
                  <View style={{ position: 'absolute', bottom: 6, right: 6, backgroundColor: '#1DA1F2', borderRadius: 9999, borderWidth: 3, borderColor: 'white', padding: 2, shadowColor: '#1DA1F2', shadowOpacity: 0.4, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}>
                    <Ionicons name="checkmark" size={18} color="white" />
                  </View>
                </View>
                {/* Name and Subject Badge */}
                <Text className="text-2xl font-pbold text-gray-900 mt-4">{name}</Text>
                <View className="flex items-center mt-2">
                  <View className="px-3 py-1 rounded-full bg-sky-100 border border-sky-400 mr-2 flex-row items-center">
                    <Ionicons name="book" size={14} color="#1DA1F2" style={{ marginRight: 4 }} />
                    <Text className="text-sky-600 font-psemibold text-xs">{subject}</Text>
                  </View>
                  <Text className="text-gray-400 mt-2 font-pregular text-xs">{title}</Text>
                </View>
              </View>
              {/* About/Bio Section */}
              <View className="w-full px-4 mt-8">
                <Text className="text-base font-psemibold text-gray-800 mb-1">About</Text>
                <Text className="text-gray-500 font-pregular text-sm mb-2">
                  Passionate educator with a love for helping students succeed. Always ready to answer questions and provide support. (You can update this bio in the future!)
                </Text>
              </View>
              {/* Divider */}
              <View className="w-4/5 h-0.5 bg-gray-200 my-5 self-center rounded-full" />
              {/* Stats Two-Column Layout */}
              <View className="flex-row flex-wrap justify-between w-full px-4 mt-2">
                {stats.map((stat, idx) => (
                  <View key={stat.label} className="w-[48%] mb-4">
                    <View className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-4 flex-col items-center justify-center shadow-sm">
                      <View className="items-center justify-center mb-1">{stat.icon}</View>
                      <Text className="text-indigo-700 font-pbold text-lg leading-tight text-center mt-1">{stat.value}</Text>
                      <Text className="text-gray-500 font-pregular text-xs leading-tight text-center">{stat.label}</Text>
                    </View>
                  </View>
                ))}
              </View>
              {/* Follow Button */}
              <TouchableOpacity
                className={`w-4/5 py-3 mt-8 rounded-xl items-center self-center ${isFollowing ? 'bg-gray-300' : 'bg-indigo-600'} shadow-md`}
                style={{ elevation: 2 }}
                activeOpacity={0.8}
                onPress={() => setIsFollowing(f => !f)}
              >
                <Text className={`font-pbold text-lg ${isFollowing ? 'text-gray-700' : 'text-white'}`}>{isFollowing ? 'Following' : 'Follow'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default TeacherProfile;
