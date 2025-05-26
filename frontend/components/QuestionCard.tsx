import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Image,
  Pressable,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome,
  AntDesign,
  Feather,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setDisplayOption } from "@/redux/optionReducer/optionActions";

interface QuestionProps {
  question: {
    id: string;
    questionText: string;
    options: string[];
    correctOption: string;
    TotalCorrectAnswers: number;
    description: string;
  };
}

const formatNumber = (number: number) => {
  if (number >= 1000 && number < 1000000) {
    return `+${(number / 1000).toFixed(1)}k`;
  } else if (number >= 1000000) {
    return `+${(number / 1000000).toFixed(1)}M`;
  } else {
    return `+${number}`;
  }
};

const formatCount = (num: number) => {
  if (num >= 1_000_000) return `+${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `+${(num / 1_000).toFixed(1)}k`;
  return `+${num}`;
};

const QuestionCard: React.FC<QuestionProps> = ({ question }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [heightAnim] = useState(new Animated.Value(60));
  const [isFollowing, setIsFollowing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const { height } = useWindowDimensions();
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: any) => state.theme.mode);

  const correctAnswer = question.correctOption;

  const handleOpenOption = () => {
    dispatch(setDisplayOption());
  };

  const handleAnswer = (option: string) => {
    setSelectedOption(option);
  };

  const toggleExpanded = () => {
    Animated.timing(heightAnim, {
      toValue: expanded ? 60 : 200,
      duration: 400,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  return (
    <View
      style={{ height: height * 0.94 }}
      className={`justify-center mb-2 mt-4 p-5 w-full relative rounded-2xl ${
        currentTheme === "dark" ? "bg-black" : "bg-white border border-gray-200"
      }`}>
      {/* User Info */}
      <View className="absolute top-2 w-full h-[60px] left-0 flex flex-row justify-between items-center px-6">
        <View className="flex flex-row items-center">
          <View className="w-[48px] h-[48px] rounded-full justify-center items-center border-2 border-cyan-400">
            <Image
              source={{ uri: "https://avatar.iran.liara.run/public" }}
              className="w-[35px] h-[35px] rounded-full"
              resizeMode="contain"
            />
          </View>
          <Text
            className={`font-pregular ml-3 ${
              currentTheme === "dark" ? "text-gray-300" : "text-black"
            }`}>
            Birhanu
          </Text>
          <Pressable
            onPress={() => setIsFollowing(!isFollowing)}
            className={`ml-4 p-2 rounded-xl border ${
              isFollowing ? "border-gray-400" : "border-green-400"
            }`}>
            <Text
              className={`font-pregular ${
                currentTheme === "dark" ? "text-gray-300" : "text-gray-800"
              }`}>
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Question Text */}
      <Text
        className={`text-xl font-pmedium mb-8 ${
          currentTheme === "dark" ? "text-gray-300" : "text-gray-800"
        }`}>
        {question.questionText}
      </Text>

      {/* Options */}
      {question.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          disabled={!!selectedOption}
          onPress={() => handleAnswer(option)}
          className={`flex flex-row items-center w-[90%] mb-2 p-3 rounded-xl border ${
            option === correctAnswer && selectedOption
              ? "bg-correct border-green-400"
              : option === selectedOption && option !== correctAnswer
              ? "bg-wrong border-red-400"
              : currentTheme === "dark"
              ? "border-gray-700"
              : "border-gray-300"
          }`}>
          <FontAwesome
            name={selectedOption === option ? "dot-circle-o" : "circle-o"}
            size={24}
            color={currentTheme === "dark" ? "gray" : "black"}
            style={{ marginRight: 10 }}
          />
          <Text
            className={`text-[14px] font-pmedium flex-1 ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-800"
            }`}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Social Actions */}
      <View className="absolute right-2 bottom-20 bg-black/60 py-2 w-10 flex flex-col justify-center items-center rounded-full z-10">
        {/* Like */}
        <TouchableOpacity 
          className="mb-4" 
          onPress={() => setLiked(!liked)}>
          <AntDesign
            name={liked ? "heart" : "hearto"}
            size={26}
            color={liked ? "red" : "white"}
          />
          <Text
            className={`text-xs text-center text-white font-pmedium ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
            {formatCount(liked ? 1201 : 1200)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="mb-4" onPress={() => setSaved(!saved)}>
          <Feather
            name="bookmark"
            size={26}
            color={saved ? "#ffd700" : "white"}
          />
          <Text
            className={`text-xs text-center text-white font-pmedium ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
            {formatCount(saved ? 800 : 799)}
          </Text>
        </TouchableOpacity>

        {/* More Options */}
        <TouchableOpacity onPress={handleOpenOption}>
          <Feather name="more-vertical" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Question Details */}
      <View
        className="absolute p-2 bottom-0 left-0 right-0"
        style={{
          backgroundColor:
            currentTheme === "dark"
              ? expanded
                ? "#101624"
                : "#1A233A"
              : expanded
              ? "#F0F4FF"
              : "#E8EDF5",
        }}>
        <Text
          className={`font-pmedium ${
            currentTheme === "dark" ? "text-gray-300" : "text-gray-800"
          }`}>
          <Text className="font-psemibold">
            {formatNumber(question.TotalCorrectAnswers)}
          </Text>
          {"  "}Correct attempts
        </Text>
        <Animated.View style={{ maxHeight: heightAnim }}>
          <Text
            className={`text-sm font-plight ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-800"
            }`}>
            {expanded
              ? question.description
              : question.description.substring(0, 45)}
          </Text>
        </Animated.View>
        {question.description.length > 100 && (
          <TouchableOpacity onPress={toggleExpanded}>
            <Text
              className={`text-xs ${
                currentTheme === "dark" ? "text-blue-400" : "text-indigo-600"
              }`}>
              {expanded ? "Less" : "More"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default QuestionCard;
