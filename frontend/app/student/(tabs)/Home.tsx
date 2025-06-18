import React, { useState, useCallback, useMemo } from "react";
import { View, Text, ScrollView, Image, Pressable, Animated, Modal, StyleSheet, RefreshControl } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import httpRequest from "@/util/httpRequest";
import { LinearGradient } from "expo-linear-gradient";

type RoutePath = `/(student)${string}`;

type Division =
  | 'Beginner'
  | 'Learner'
  | 'Explorer'
  | 'Achiever'
  | 'Rising_Star'
  | 'Thinker'
  | 'Champion'
  | 'Mastermind'
  | 'Grandmaster'
  | 'Legend';

interface Subject {
  id: string;
  name: string;
  checked: boolean;
}

interface DivisionTheme {
  gradient: [string, string];
  icon: string;
  iconColor: string;
  textColor: string;
  bgColor: string;
  progressColor: string;
}

const divisionThemes: Record<Division, DivisionTheme> = {
  Beginner: {
    gradient: ["#B0BEC5", "#90A4AE"], // Soft blue-gray
    icon: "user-graduate",
    iconColor: "#78909C",
    textColor: "#333333",
    bgColor: "#F3F4F6",
    progressColor: "#90A4AE",
  },
  Learner: {
    gradient: ["#34D399", "#10B981"], // Vibrant green
    icon: "book",
    iconColor: "#10B981",
    textColor: "#047857",
    bgColor: "#E0F2FE",
    progressColor: "#10B981",
  },
  Explorer: {
    gradient: ["#FBBF24", "#F59E42"], // Warm gold/orange
    icon: "compass",
    iconColor: "#F59E42",
    textColor: "#B45309",
    bgColor: "#FEF3C7",
    progressColor: "#F59E42",
  },
  Achiever: {
    gradient: ["#F472B6", "#EC4899"], // Pink/magenta
    icon: "trophy",
    iconColor: "#EC4899",
    textColor: "#BE185D",
    bgColor: "#FCE7F3",
    progressColor: "#EC4899",
  },
  Rising_Star: {
    gradient: ["#FDE68A", "#F59E42"], // Yellow/orange
    icon: "star",
    iconColor: "#F59E42",
    textColor: "#B45309",
    bgColor: "#FEF9C3",
    progressColor: "#F59E42",
  },
  Thinker: {
    gradient: ["#818CF8", "#6366F1"], // Indigo/violet
    icon: "brain",
    iconColor: "#6366F1",
    textColor: "#3730A3",
    bgColor: "#EEF2FF",
    progressColor: "#6366F1",
  },
  Champion: {
    gradient: ["#F59E42", "#FBBF24"], // Deep orange/gold
    icon: "medal",
    iconColor: "#F59E42",
    textColor: "#B45309",
    bgColor: "#FEF3C7",
    progressColor: "#F59E42",
  },
  Mastermind: {
    gradient: ["#00C6FB", "#005BEA"], // Diamond blue/cyan
    icon: "gem",
    iconColor: "#00C6FB",
    textColor: "#005BEA",
    bgColor: "#E0F7FA",
    progressColor: "#00C6FB",
  },
  Grandmaster: {
    gradient: ["#06B6D4", "#3B82F6"], // Teal to blue
    icon: "chess-king",
    iconColor: "#06B6D4",
    textColor: "#0E7490",
    bgColor: "#E0F2FE",
    progressColor: "#06B6D4",
  },
  Legend: {
    gradient: ["#FFD700", "#FF9800"], // Gold to orange
    icon: "crown",
    iconColor: "#FFD700",
    textColor: "#B45309",
    bgColor: "#FFFDE7",
    progressColor: "#FFD700",
  },
};

export default function Home() {
  const [division, setDivision] = useState<Division>("Beginner");
  const [totalPoints, setTotalPoints] = useState(0);
  const [nextDivisionPoints, setNextDivisionPoints] = useState(0);
  const [currentDivisionPoints, setCurrentDivisionPoints] = useState(0);
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();
  const [scaleAnim] = useState(new Animated.Value(1));
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [customizeType, setCustomizeType] = useState<'default' | 'custom'>('default');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 'biology', name: 'Biology', checked: false },
    { id: 'chemistry', name: 'Chemistry', checked: false },
    { id: 'physics', name: 'Physics', checked: false },
    { id: 'math', name: 'Mathematics', checked: false },
  ]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Function to calculate division based on points
  const calculateDivision = (points: number): { division: Division; nextPoints: number; currentPoints: number } => {
    if (points <= 99) {
      return { division: 'Beginner', nextPoints: 100, currentPoints: 0 };
    } else if (points <= 299) {
      return { division: 'Learner', nextPoints: 300, currentPoints: 100 };
    } else if (points <= 599) {
      return { division: 'Explorer', nextPoints: 600, currentPoints: 300 };
    } else if (points <= 999) {
      return { division: 'Achiever', nextPoints: 1000, currentPoints: 600 };
    } else if (points <= 1499) {
      return { division: 'Rising_Star', nextPoints: 1500, currentPoints: 1000 };
    } else if (points <= 2499) {
      return { division: 'Thinker', nextPoints: 2500, currentPoints: 1500 };
    } else if (points <= 3999) {
      return { division: 'Champion', nextPoints: 4000, currentPoints: 2500 };
    } else if (points <= 5999) {
      return { division: 'Mastermind', nextPoints: 6000, currentPoints: 4000 };
    } else if (points <= 7999) {
      return { division: 'Grandmaster', nextPoints: 8000, currentPoints: 6000 };
    } else {
      return { division: 'Legend', nextPoints: 8000, currentPoints: 8000 };
    }
  };

  const fetchStudentDetail = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const data = await httpRequest("/students/detail", undefined, "GET", user?.token);
      console.log(data);
      setStudentData(data);
      
      // Extract points and calculate division
      const points = data?.totalPoints || 0;
      setTotalPoints(points);
      
      const divisionInfo = calculateDivision(points);
      setDivision(divisionInfo.division);
      setNextDivisionPoints(divisionInfo.nextPoints);
      setCurrentDivisionPoints(divisionInfo.currentPoints);
      
    } catch (err: any) {
      setError(err.message || "Failed to fetch student detail");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudentDetail();
  }, []);

  const onRefresh = useCallback(() => {
    fetchStudentDetail(true);
  }, []);

  console.log(user)

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Function to cycle through divisions (for testing)
  const cycleDivision = () => {
    const divisions: Division[] = ['Beginner', 'Learner', 'Explorer', 'Achiever', 'Rising_Star', 'Thinker', 'Champion', 'Mastermind', 'Grandmaster', 'Legend'];
    const currentIndex = divisions.indexOf(division);
    const nextIndex = (currentIndex + 1) % divisions.length;
    setDivision(divisions[nextIndex]);
  };

  const handleTypeSelect = useCallback((type: 'default' | 'custom') => {
    setCustomizeType(type);
  }, []);

  const handleDifficultySelect = useCallback((level: 'easy' | 'medium' | 'hard') => {
    setDifficulty(level);
  }, []);

  const handleSubjectToggle = useCallback((id: string) => {
    setSubjects(prevSubjects => 
      prevSubjects.map(subject => 
        subject.id === id ? { ...subject, checked: !subject.checked } : subject
      )
    );
  }, []);

  const handleSave = useCallback(() => {
    // Handle save logic here
    setShowCustomizeModal(false);
  }, []);

  const handleClose = useCallback(() => {
    setShowCustomizeModal(false);
  }, []);

  const CustomizeModal = useMemo(() => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCustomizeModal}
        onRequestClose={handleClose}
      >
        <Pressable 
          onPress={handleClose}
          className="flex-1 justify-center items-center bg-black/50"
        >
          <Pressable 
            onPress={(e) => e.stopPropagation()}
            className={`w-[90%] rounded-3xl p-8 ${currentTheme === "dark" ? 'bg-gray-900' : 'bg-white'} shadow-xl`}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`text-2xl font-pbold ${currentTheme === "dark" ? 'text-white' : 'text-gray-900'}`}>
                Customize Your Questions
              </Text>
              <TouchableOpacity 
                onPress={handleClose}
                className="p-2"
              >
                <Ionicons name="close" size={24} color={currentTheme === "dark" ? 'white' : 'black'} />
              </TouchableOpacity>
            </View>

            {/* Type Selection */}
            <View className="mb-8">
              <Text className={`text-lg font-pmedium mb-4 ${currentTheme === "dark" ? 'text-gray-200' : 'text-gray-700'}`}>
                Choose Type
              </Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={() => handleTypeSelect('default')}
                  className={`flex-1 py-3 px-4 mx-2 rounded-xl border-2 ${
                    customizeType === 'default'
                      ? 'border-indigo-500 bg-indigo-50'
                      : currentTheme === "dark"
                      ? 'border-gray-700'
                      : 'border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-center font-pmedium ${
                      customizeType === 'default'
                        ? 'text-indigo-600'
                        : currentTheme === "dark"
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}
                  >
                    Default
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleTypeSelect('custom')}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                    customizeType === 'custom'
                      ? 'border-indigo-500 bg-indigo-50'
                      : currentTheme === "dark"
                      ? 'border-gray-700'
                      : 'border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-center font-pmedium ${
                      customizeType === 'custom'
                        ? 'text-indigo-600'
                        : currentTheme === "dark"
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}
                  >
                    Custom
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {customizeType === 'custom' && (
              <>
                {/* Difficulty Selection */}
                <View className="mb-8">
                  <Text className={`text-lg font-pmedium mb-4 ${currentTheme === "dark" ? 'text-gray-200' : 'text-gray-700'}`}>
                    Select Difficulty
                  </Text>
                  <View className="flex-row space-x-3">
                    {['easy', 'medium', 'hard'].map((level) => (
                      <TouchableOpacity
                        key={level}
                        onPress={() => handleDifficultySelect(level as 'easy' | 'medium' | 'hard')}
                        className={`flex-1 py-3  mx-2 rounded-xl border-2 ${
                          difficulty === level
                            ? 'border-indigo-500 bg-indigo-50'
                            : currentTheme === "dark"
                            ? 'border-gray-700'
                            : 'border-gray-200'
                        }`}
                      >
                        <Text
                          className={`text-center font-pmedium capitalize ${
                            difficulty === level
                              ? 'text-indigo-600'
                              : currentTheme === "dark"
                              ? 'text-gray-400'
                              : 'text-gray-600'
                          }`}
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Subject Selection */}
                <View className="mb-8">
                  <Text className={`text-lg font-pmedium mb-4 ${currentTheme === "dark" ? 'text-gray-200' : 'text-gray-700'}`}>
                    Select Subjects
                  </Text>
                  <View className="space-y-3">
                    {subjects.map((subject) => (
                      <TouchableOpacity
                        key={subject.id}
                        onPress={() => handleSubjectToggle(subject.id)}
                        className={`flex-row items-center my-1 py-3 px-4 rounded-xl border-2 ${
                          subject.checked
                            ? 'border-indigo-500 bg-indigo-50'
                            : currentTheme === "dark"
                            ? 'border-gray-700'
                            : 'border-gray-200'
                        }`}
                      >
                        <View
                          className={`w-5 h-5 rounded-md border-2 mr-3 items-center justify-center ${
                            subject.checked
                              ? 'border-indigo-500 bg-indigo-500'
                              : currentTheme === "dark"
                              ? 'border-gray-600'
                              : 'border-gray-400'
                          }`}
                        >
                          {subject.checked && (
                            <Ionicons name="checkmark" size={14} color="white" />
                          )}
                        </View>
                        <Text
                          className={`font-pmedium ${
                            subject.checked
                              ? 'text-indigo-600'
                              : currentTheme === "dark"
                              ? 'text-gray-400'
                              : 'text-gray-600'
                          }`}
                        >
                          {subject.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              className="bg-indigo-600 py-3 px-4 rounded-xl mt-4"
            >
              <Text className="text-white text-center font-pbold text-lg">
                Save Preferences
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }, [showCustomizeModal, customizeType, difficulty, subjects, currentTheme, handleTypeSelect, handleDifficultySelect, handleSubjectToggle, handleSave, handleClose]);

  const NewModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNewModal}
        onRequestClose={() => setShowNewModal(false)}
      >
        <Pressable 
          onPress={() => setShowNewModal(false)}
          className="flex-1 justify-center items-center bg-black/50"
        >
          <Pressable 
            onPress={(e) => e.stopPropagation()}
            className={`w-[90%] rounded-3xl p-8 ${currentTheme === "dark" ? 'bg-gray-900' : 'bg-white'} shadow-xl`}
          >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className={`text-2xl font-pbold ${currentTheme === "dark" ? 'text-white' : 'text-gray-900'}`}>
                New Modal
              </Text>
              <TouchableOpacity 
                onPress={() => setShowNewModal(false)}
                className="p-2"
              >
                <Ionicons name="close" size={24} color={currentTheme === "dark" ? 'white' : 'black'} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="mb-6">
              <Text className={`text-base ${currentTheme === "dark" ? 'text-gray-300' : 'text-gray-600'}`}>
                This is a new modal. You can customize its content and functionality as needed.
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row space-x-4">
              <TouchableOpacity
                onPress={() => setShowNewModal(false)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                  currentTheme === "dark" ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <Text className={`text-center font-pmedium ${
                  currentTheme === "dark" ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // Add your action here
                  setShowNewModal(false);
                }}
                className="flex-1 bg-indigo-600 py-3 px-4 rounded-xl"
              >
                <Text className="text-white text-center font-pbold">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === "dark" ? "bg-gray-900" : "bg-[#f1f3fc]"}`}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        className="mb-16"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* Top Bar */}
        <View className="flex-row items-center justify-between px-6 mt-4">
          <View className="flex-row items-center space-x-2">
            <View className="w-3 h-3 rounded-full bg-indigo-500" />
            <Text className={`text-lg font-pbold ${currentTheme === "dark" ? "text-white" : "text-indigo-600"}`}>
              Cognify
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/student/(tabs)/Notification")}
            className={`p-2 rounded-full ${currentTheme === "dark" ? "bg-gray-800" : "bg-white"}`}
          >
            <Ionicons 
              name="notifications-outline" 
              size={24} 
              color={currentTheme === "dark" ? "#fff" : "#6b7280"} 
            />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <LinearGradient
          colors={divisionThemes[division].gradient}
          className="mx-6 mt-6 rounded-3xl p-6 shadow-xl overflow-hidden"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0,0,0,0.18)",
              zIndex: 1,
              borderRadius: 24, // match the card's border radius
            }}
            pointerEvents="none"
          />
          <View style={{ zIndex: 2 }}>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <View className="flex-row items-center space-x-2 mb-2">
                  <View className="w-2 h-2 rounded-full bg-white/30" />
                  <Text
                    className="text-sm font-pregular text-white/80"
                    style={{
                      textShadowColor: "rgba(0,0,0,0.25)",
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 4,
                    }}
                  >
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </Text>
                </View>
                <Text
                  className="text-3xl font-pbold text-white"
                  style={{
                    textShadowColor: "rgba(0,0,0,0.25)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}
                >
                  Welcome {user?.name || 'User'} ! 👋
                </Text>
                <Text
                  className="text-base text-white/80 font-pregular mt-2"
                  style={{
                    textShadowColor: "rgba(0,0,0,0.25)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}
                >
                  Ready to learn something new today?
                </Text>
              </View>
              <View className="relative">
                <View className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                <Image
                  source={{
                    uri: "https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/000000/external-credit-card-payment-flatart-icons-outline-flatarticons.png",
                  }}
                  className="w-24 h-24 opacity-90"
                />
              </View>
            </View>
            <View className="absolute -bottom-16 -right-16 w-40 h-40 bg-white/10 rounded-full blur-xl" />
          </View>
        </LinearGradient>

        {/* Division Card */}
        <Animated.View 
          style={{ transform: [{ scale: scaleAnim }] }}
          className={`mx-6 mt-6 p-5 rounded-2xl ${currentTheme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className={`text-base font-psemibold ${currentTheme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                My Division
              </Text>
              <View className="flex-row items-center mt-1 space-x-2">
                <Text 
                  className="text-2xl font-pbold capitalize"
                  style={{ color: divisionThemes[division].textColor }}
                >
                  {division.replace('_', ' ')}
                </Text>
                <View 
                  className="px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: `${divisionThemes[division].iconColor}15` }}
                >
                  <Text 
                    className="text-sm font-pbold"
                    style={{ color: divisionThemes[division].textColor }}
                  >
                    {totalPoints}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              onPress={cycleDivision}
              className={`p-3 rounded-xl`}
              style={{ backgroundColor: `${divisionThemes[division].iconColor}15` }}
            >
              <FontAwesome5
                name={divisionThemes[division].icon}
                size={24}
                color={divisionThemes[division].iconColor}
              />
            </TouchableOpacity>
          </View>
          <View className="mt-4 flex-row items-center justify-between">
            <View className="flex-row items-center space-x-2">
              <View 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: divisionThemes[division].iconColor }}
              />
              <Text className={`text-sm font-pregular ${currentTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {division === 'Legend' 
                  ? 'You are a Legend! 🏆' 
                  : `${nextDivisionPoints - totalPoints} points to next division`
                }
              </Text>
            </View>
            <View className="flex-row items-center space-x-1">
              <Text 
                className="text-sm font-pbold"
                style={{ color: divisionThemes[division].textColor }}
              >
                {totalPoints}
              </Text>
              <Text className={`text-sm font-pregular ${currentTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {division === 'Legend' ? ' points' : ` / ${nextDivisionPoints}`}
              </Text>
            </View>
          </View>
          <View className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: division === 'Legend' ? "100%" : `${((totalPoints - currentDivisionPoints) / (nextDivisionPoints - currentDivisionPoints)) * 100}%`,
                backgroundColor: divisionThemes[division].progressColor,
              }}
            />
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <View className="mt-8 px-6">
          <Text className={`text-lg font-pbold mb-4 ${currentTheme === "dark" ? "text-white" : "text-gray-800"}`}>
            Quick Actions
          </Text>
          <View className="flex-row justify-between">
            {[
              {
                label: "Exam",
                icon: "tasks",
                bg: currentTheme === "dark" ? "#7c3aed" : "#7c3aed",
                color: "#ffffff",
              },
              {
                label: "News",
                icon: "newspaper",
                bg: currentTheme === "dark" ? "#3b82f6" : "#3b82f6",
                color: "#ffffff",
              },
              {
                label: "Search",
                icon: "search",
                bg: currentTheme === "dark" ? "#f59e0b" : "#facc15",
                color: "#ffffff",
              },
              {
                label: "Customize",
                icon: "chalkboard-teacher",
                bg: currentTheme === "dark" ? "#10b981" : "#10b981",
                color: "#ffffff",
              },
            ].map((item, index) => (
              <View key={index} className="items-center">
                <Pressable
                  onPress={() => {
                    switch (item.label) {
                      case "Customize":
                        setShowCustomizeModal(true);
                        break;
                      case "Exam":
                        router.push("/student/CreateExam");
                        break;
                      case "News":
                        router.push("/student/(tabs)/Blog");
                        break;
                      case "Search":
                        router.push("/student/SearchScreen");
                        break;
                      default:
                        break;
                    }
                  }}
                  className="active:scale-95">
                  <View
                    className="p-4 w-16 h-16 justify-center items-center rounded-2xl mb-2 shadow-lg"
                    style={{
                      backgroundColor: item.bg,
                    }}>
                    <FontAwesome5
                      name={item.icon as any}
                      size={20}
                      color={item.color}
                    />
                  </View>
                </Pressable>
                <Text className={`text-xs font-pmedium ${currentTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Daily Tasks Section */}
        <View className="mt-8 px-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-lg font-pbold ${currentTheme === "dark" ? "text-white" : "text-gray-800"}`}>
              Daily Tasks
            </Text>
            <TouchableOpacity>
              <Text className={`text-sm font-pmedium ${currentTheme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {[
            {
              subject: "Chemistry",
              task: "Complete 15 questions",
              progress: 60,
              dueDate: "Nov 14",
              color: currentTheme === "dark" ? "#A78BFA" : "#7C3AED"
            },
            {
              subject: "Biology",
              task: "Complete 15 questions",
              progress: 40,
              dueDate: "Nov 12",
              color: currentTheme === "dark" ? "#34D399" : "#10B981"
            },
            {
              subject: "Mathematics",
              task: "Complete 15 questions",
              progress: 80,
              dueDate: "Nov 13",
              color: currentTheme === "dark" ? "#60A5FA" : "#3B82F6"
            },
          ].map((task, index) => (
            <View
              key={index}
              className={`p-4 rounded-2xl mb-3 ${currentTheme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm`}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className={`text-base font-psemibold ${currentTheme === "dark" ? "text-white" : "text-gray-800"}`}>
                  {task.subject}
                </Text>
                <Text className={`text-sm font-pregular ${currentTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  Due {task.dueDate}
                </Text>
              </View>
              <Text className={`text-sm font-pregular mb-3 ${currentTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                {task.task}
              </Text>
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${task.progress}%`,
                    backgroundColor: task.color,
                  }}
                />
              </View>
            </View>
          ))}
        </View>

        {CustomizeModal}
        <NewModal />
      </ScrollView>
    </SafeAreaView>
  );
}