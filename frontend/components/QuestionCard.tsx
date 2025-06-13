import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Image,
  Pressable,
} from "react-native";
import { FontAwesome, AntDesign, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setReportedContent } from "@/redux/questionsReducer/questionAction";
import { setDisplayOption } from "@/redux/optionReducer/optionActions";
import {
  addQuestionAttempt,
  clearAttempts,
} from "@/redux/StudentReducer/studentAction";
import httpRequest from "@/util/httpRequest";

interface QuestionProps {
  question: {
    id: string;
    questionText: string;
    options: string[];
    correctOption: string;
    TotalCorrectAnswers: number;
    description: string;
    type: string;
  };
}

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
  const user = useSelector((state: any) => state.user.user);
  const correctAttempts = useSelector(
    (state: any) => state.student.correctAttempts
  );
  const sendLimit = useSelector((state: any) => state.student.sendLimit);
  const attemptedQuestions = useSelector(
    (state: any) => state.student.attemptedQuestions
  );

  console.log(sendLimit);

  const correctAnswer = question.correctOption;

  const handleOpenOption = () => {
    dispatch(setDisplayOption());
    dispatch(
      setReportedContent({ contentId: question.id, contentType: question.type })
    );
  };

  const handleAnswer = (option: string) => {
    setSelectedOption(option);
    const isCorrect = option === correctAnswer;

    dispatch(
      addQuestionAttempt({
        id: question.id,
        question: question.questionText,
        answer: option,
        isCorrect,
      })
    );
  };
  useEffect(() => {
    if (sendLimit !== 10 || !user?.token || !selectedOption) return;
    const sendProgressUpdate = async () => {
      try {
        const formData = new FormData();
        formData.append("questionId", question.id);
        formData.append(
          "isCorrect",
          (selectedOption === correctAnswer).toString()
        );

        const data = await httpRequest(
          "/Students/settings",
          formData,
          "PATCH",
          user.token,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        dispatch(clearAttempts());
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    };

    sendProgressUpdate();
  }, [correctAttempts, attemptedQuestions, selectedOption, sendLimit]);

  const toggleExpanded = () => {
    Animated.timing(heightAnim, {
      toValue: expanded ? 60 : 200,
      duration: 400,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const isDark = currentTheme === "dark";
  const descriptionBg = isDark
    ? expanded
      ? "#101624"
      : "#1A233A"
    : expanded
    ? "#F0F4FF"
    : "#E8EDF5";

  return (
    <View
      style={{ height: height * 0.94 }}
      className={`justify-center mb-2 mt-4 p-5 w-full relative rounded-2xl ${
        isDark ? "bg-black" : "bg-white border border-gray-200"
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
              isDark ? "text-gray-300" : "text-black"
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
                isDark ? "text-gray-300" : "text-gray-800"
              }`}>
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Question */}
      <Text
        className={`text-xl font-pmedium mb-8 ${
          isDark ? "text-gray-300" : "text-gray-800"
        }`}>
        {question.questionText}
      </Text>

      {/* Options */}
      {question.options.map((option, index) => {
        const isSelected = selectedOption === option;
        const isCorrect = option === correctAnswer;

        const bgClass =
          isCorrect && selectedOption
            ? "bg-correct border-green-400"
            : isSelected && !isCorrect
            ? "bg-wrong border-red-400"
            : isDark
            ? "border-gray-700"
            : "border-gray-300";

        return (
          <TouchableOpacity
            key={index}
            disabled={!!selectedOption}
            onPress={() => handleAnswer(option)}
            className={`flex flex-row items-center w-[90%] mb-2 p-3 rounded-xl border ${bgClass}`}>
            <FontAwesome
              name={isSelected ? "dot-circle-o" : "circle-o"}
              size={24}
              color={isDark ? "gray" : "black"}
              style={{ marginRight: 10 }}
            />
            <Text
              className={`text-[14px] font-pmedium flex-1 ${
                isDark ? "text-gray-300" : "text-gray-800"
              }`}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* Social Actions */}
      <View className="absolute right-2 bottom-20 bg-black/60 py-2 w-10 flex flex-col justify-center items-center rounded-full z-10">
        <TouchableOpacity className="mb-4" onPress={() => setLiked(!liked)}>
          <AntDesign
            name={liked ? "heart" : "hearto"}
            size={26}
            color={liked ? "red" : "white"}
          />
          <Text className="text-xs text-white font-pmedium">
            {formatCount(liked ? 1201 : 1200)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="mb-4" onPress={() => setSaved(!saved)}>
          <Feather
            name="bookmark"
            size={26}
            color={saved ? "#ffd700" : "white"}
          />
          <Text className="text-xs text-white font-pmedium">
            {formatCount(saved ? 800 : 799)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleOpenOption}>
          <Feather name="more-vertical" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Details Section */}
      <View
        className="absolute p-2 bottom-0 left-0 right-0"
        style={{ backgroundColor: descriptionBg }}>
        <Text
          className={`font-pmedium ${
            isDark ? "text-gray-300" : "text-gray-800"
          }`}>
          <Text className="font-psemibold">
            {formatCount(question.TotalCorrectAnswers)}
          </Text>{" "}
          Correct attempts
        </Text>

        <Animated.View style={{ maxHeight: heightAnim }}>
          <Text
            className={`text-sm font-plight ${
              isDark ? "text-gray-300" : "text-gray-800"
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
                isDark ? "text-blue-400" : "text-indigo-600"
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
