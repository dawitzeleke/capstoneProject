import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Keyboard,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { 
  setTeacherData, 
  fetchTeachersRequest, 
  fetchTeachersSuccess, 
  fetchTeachersFailure 
} from "../../redux/userTeacherReducer/userTeacherActions";
import TeacherItem from "@/components/TeacherItem";
import { RootState, AppDispatch } from "../../redux/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { httpRequest } from "../../util/httpRequest";

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"teachers" | "content">("teachers");
  const [hasSearched, setHasSearched] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  const { teachers, loading, error } = useSelector((state: RootState) => state.userTeacher);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Animate the placeholder on mount - only when keyboard is not visible
  useEffect(() => {
    if (isKeyboardVisible) {
      // Stop animation when keyboard is visible
      fadeAnim.stopAnimation();
      scaleAnim.stopAnimation();
      return;
    }

    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0.7,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [isKeyboardVisible]);

  // Fetch teachers when query changes (with debounce) - only if user has searched
  useEffect(() => {
    if (!hasSearched) return;
    
    const timeoutId = setTimeout(() => {
      if (activeTab === "teachers" && query.trim()) {
        fetchTeachers();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [query, activeTab, hasSearched]);

  const fetchTeachers = async () => {
    try {
      dispatch(fetchTeachersRequest());
      
      // Build the endpoint with query parameters
      let endpoint = '/teachers/search';
      if (query) {
        endpoint += `?searchTerm=${encodeURIComponent(query)}&pageNumber=1&pageSize=10`;
      } else {
        endpoint += '?pageNumber=1&pageSize=10';
      }
      
      const data = await httpRequest(endpoint, null, 'GET');
      
      // Transform the API data to match the expected format
      const transformedTeachers = data.map((teacher: any) => ({
        id: teacher.id,
        name: `${teacher.firstName} ${teacher.lastName}`,
        title: teacher.subjects?.length > 0 ? `Teaches ${teacher.subjects.join(", ")}` : "Teacher",
        followers: "0", // This would need to come from a different endpoint
        questions: "0", // This would need to come from a different endpoint
        imageUrl: teacher.profilePictureUrl || "https://i.pravatar.cc/150?img=1",
      }));
      
      dispatch(fetchTeachersSuccess(transformedTeachers));
    } catch (err: any) {
      console.error("Error fetching teachers:", err);
      dispatch(fetchTeachersFailure(err.message || "Failed to fetch teachers"));
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      setHasSearched(true);
      fetchTeachers();
    }
  };

  const handlePress = (teacher: (typeof teachers)[0]) => {
    dispatch(setTeacherData(teacher));
    router.push("/student/(tabs)/TeacherDetail");
  };

  // Placeholder component with animation
  const SearchPlaceholder = () => (
    <Animated.View 
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
      className="flex-1 items-center justify-center px-8"
    >
      <View className="items-center">
        {/* Animated search icon */}
        <View className={`w-24 h-24 rounded-full items-center justify-center mb-6 ${
          currentTheme === "dark" ? "bg-indigo-500/20" : "bg-indigo-100"
        }`}>
          <Ionicons
            name="search"
            size={48}
            color={currentTheme === "dark" ? "#6366f1" : "#4f46e5"}
          />
        </View>
        
        {/* Title */}
        <Text className={`text-2xl font-pbold text-center mb-3 ${
          currentTheme === "dark" ? "text-white" : "text-gray-900"
        }`}>
          Search for Teachers
        </Text>
        
        {/* Subtitle */}
        <Text className={`text-base font-pmedium text-center mb-6 ${
          currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}>
          Find amazing teachers and discover new learning opportunities
        </Text>
        
        {/* Search tips */}
        <View className="space-y-2">
          <View className="flex-row items-center">
            <Ionicons
              name="bulb-outline"
              size={16}
              color={currentTheme === "dark" ? "#6366f1" : "#4f46e5"}
            />
            <Text className={`text-sm font-pmedium ml-2 ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              Search by name, subject, or expertise
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons
              name="star-outline"
              size={16}
              color={currentTheme === "dark" ? "#6366f1" : "#4f46e5"}
            />
            <Text className={`text-sm font-pmedium ml-2 ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              Browse verified teachers with great reviews
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === "dark" ? "bg-black" : "bg-[#f1f3fc]"}`}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <View style={{ flex: 1 }}>
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
                onSubmitEditing={handleSearch}
                returnKeyType="search"
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
              <TouchableOpacity 
                onPress={handleSearch}
                disabled={!query.trim()}
                className={`ml-2 px-3 py-1 rounded-lg ${
                  query.trim() 
                    ? currentTheme === "dark" ? "bg-indigo-600" : "bg-indigo-500"
                    : currentTheme === "dark" ? "bg-gray-700" : "bg-gray-300"
                }`}
              >
                <Text className={`text-sm font-pmedium ${
                  query.trim() ? "text-white" : currentTheme === "dark" ? "text-gray-500" : "text-gray-500"
                }`}>
                  Search
                </Text>
              </TouchableOpacity>
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
                {!hasSearched && !isKeyboardVisible ? (
                  <SearchPlaceholder />
                ) : (
                  <>
                    {query.length > 0 && (
                      <Text
                        className={`text-sm font-pmedium mb-4 ${
                          currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>
                        {teachers.length} results found
                      </Text>
                    )}
                    
                    {loading ? (
                      <View className="flex-1 items-center justify-center mt-10">
                        <ActivityIndicator 
                          size="large" 
                          color={currentTheme === "dark" ? "#6366f1" : "#4f46e5"} 
                        />
                        <Text
                          className={`text-center mt-4 text-base font-pmedium ${
                            currentTheme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}>
                          Searching teachers...
                        </Text>
                      </View>
                    ) : error ? (
                      <View className="flex-1 items-center justify-center mt-10">
                        <MaterialIcons
                          name="error-outline"
                          size={48}
                          color={currentTheme === "dark" ? "#ef4444" : "#dc2626"}
                        />
                        <Text
                          className={`text-center mt-4 text-base font-pmedium ${
                            currentTheme === "dark" ? "text-red-400" : "text-red-600"
                          }`}>
                          {error}
                        </Text>
                      </View>
                    ) : (
                      <FlatList
                        data={teachers}
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
                    )}
                  </>
                )}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SearchScreen;
