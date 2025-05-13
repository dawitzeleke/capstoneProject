import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  useWindowDimensions,
  ViewToken,
} from "react-native";
import { useSelector } from "react-redux";
import QuestionCard from "./QuestionCard";
import QuestionSkeleton from "./QuestionSkeleton";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctOption: string;
  totalCorrectAnswers: number;
  description: string;
}

interface QuestionsListProps {
  questions: Question[];
  loadMoreQuestions: () => void;
  hasMoreQuestions: boolean;
  isLoading: boolean;
}

const QuestionsList: React.FC<QuestionsListProps> = ({
  questions,
  loadMoreQuestions,
  hasMoreQuestions,
  isLoading,
}) => {
  const { height } = useWindowDimensions();
  const adjustedHeight = height * 0.97;
  const flatListRef = useRef<FlatList<Question>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTheme = useSelector((state: any) => state.theme.mode);

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  return (
    <FlatList
      ref={flatListRef}
      data={questions}
      className={`${
        currentTheme === "dark" ? "bg-black" : "bg-white"
      }`}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ height: adjustedHeight, width: "100%" }}>
          <QuestionCard question={item} />
        </View>
      )}
      pagingEnabled
      snapToAlignment="start"
      decelerationRate="fast"
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      onEndReached={hasMoreQuestions ? loadMoreQuestions : undefined}
      onEndReachedThreshold={0.1}
      ListFooterComponent={
        isLoading ? (
          <View
            className="flex justify-center items-center"
            style={{ height: adjustedHeight, width: "100%" }}>
            <QuestionSkeleton />
          </View>
        ) : null
      }
    />
  );
};

export default QuestionsList;
