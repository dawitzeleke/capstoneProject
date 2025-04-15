import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
  ViewToken,
} from "react-native";
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
      className="bg-card"
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
          <View className="flex justify-center items-center">
            <QuestionSkeleton />
          </View>
        ) : null
      }
    />
  );
};

export default QuestionsList;
