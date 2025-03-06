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
import { MaterialIcons, FontAwesome, AntDesign, Feather } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setDisplayOption } from "@/redux/optionReducer/optionActions";

interface QuestionProps {
  question: {
    id: string;
    text: string;
    options: string[];
    correctAttempts: number;
    questionDetail: string;
    answer: string;
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

const QuestionCard: React.FC<QuestionProps> = ({ question }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [heightAnim] = useState(new Animated.Value(60));
  const [isFollowing, setIsFollowing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const { height } = useWindowDimensions();

  const dispatch = useDispatch();

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
    <View style={{ height: height * 0.9 }} className="bg-card justify-center shadow-lg mb-2 mt-2 p-5 w-full relative">
      {/* User Info & Follow */}
      <View className="absolute top-2 w-full h-[60px] left-0 flex flex-row justify-between items-center px-6">
        <View className="flex flex-row items-center">
          <View className="w-[48px] h-[48px] rounded-full justify-center items-center border-2 border-cyan-400">
            <Image source={{ uri: "https://avatar.iran.liara.run/public" }} className="w-[35px] h-[35px] rounded-full" resizeMode="contain" />
          </View>
          <Text className="color-slate-300 font-pthin ml-3">Birhanu</Text>
          <Pressable onPress={() => setIsFollowing(!isFollowing)} className={`ml-4 p-2 rounded-xl border ${isFollowing ? 'border-gray-400' : 'border-green-400'}`}>
            <Text className="color-slate-300 font-pthin">{isFollowing ? "Following" : "Follow"}</Text>
          </Pressable>
        </View>
        <MaterialIcons onPress={handleOpenOption} name="more-vert" size={24} color="white" />
      </View>
      
      {/* Question Text */}
      <Text className="text-xl color-slate-300 font-pmedium mb-8">{question.text}</Text>
      
      {/* Answer Options */}
      {question.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          disabled={!!selectedOption}
          onPress={() => handleAnswer(option)}
          className={`flex flex-row items-center mb-2 p-3 rounded-xl border ${
            option === question.answer && selectedOption ? 'bg-correct border-green-400' :
            option === selectedOption && option !== question.answer ? 'bg-wrong border-red-400' : ''
          }`}>
          <FontAwesome name={selectedOption === option ? "dot-circle-o" : "circle-o"} size={24} color="gray" style={{ marginRight: 10 }} />
          <Text className="text-lg color-slate-300 font-pmedium">{option}</Text>
        </TouchableOpacity>
      ))}

      {/* Social Buttons */}
      <View className="absolute right-6 top-2/3 transform -translate-y-5">
        <TouchableOpacity className="mb-4" onPress={() => setLiked(!liked)}>
          <AntDesign name="heart" size={22} color={liked ? "red" : "white"} />
          <Text className="text-xs text-center color-slate-300 font-pmedium">+1.2k</Text>
        </TouchableOpacity>

        <TouchableOpacity className="mb-4" onPress={() => setSaved(!saved)}>
          <Feather name="star" size={22} color={saved ? "yellow" : "white"} />
          <Text className="text-xs text-center color-slate-300 font-pmedium">+1.2k</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Feather name="send" size={22} color="white" />
          <Text className="text-xs text-center color-slate-300 font-pmedium">+1.2k</Text>
        </TouchableOpacity>
      </View>

      {/* Question Details */}
      <View className="absolute bg-black p-2 rounded-lg bottom-0 left-0 right-0" style={{ backgroundColor: expanded ? "rgba(0, 0, 0, 0.7)" : "#131314", width: "100%" }}>
        <Text className="color-slate-300 font-pmedium">
          <Text className="font-psemibold color-slate-300">{formatNumber(question.correctAttempts)}</Text>
          {"  "}<Text className="font-psemibold color-slate-300">Correct attempts</Text>
        </Text>
        <Animated.View style={{ maxHeight: heightAnim }}>
          <Text className="text-sm color-slate-300 font-plight">
            {expanded ? question.questionDetail : question.questionDetail.substring(0, 45)}
          </Text>
        </Animated.View>
        {question.questionDetail.length > 100 && (
          <TouchableOpacity onPress={toggleExpanded}>
            <Text className="text-blue-500 text-xs ">{expanded ? "Less" : "More"}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default QuestionCard;
