import React, { useRef, useState } from "react";
import { FlatList, useWindowDimensions, View, ViewToken } from "react-native";
import { useSelector } from "react-redux";
import {loadMoreQuestions} from "../redux/questionsReducer/questionAction"; // Adjust the import path as needed
import QuestionCard from "./QuestionCard";
import QuestionSkeleton from "./QuestionSkeleton";
import VideoCard from "./VideoCard";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctOption: string;
  description: string;
  TotalCorrectAnswers: number;
  courseName?: string;
  createdBy?: string;
  difficulty?: string;
  feedbacks?: any[];
  grade?: number;
  point?: number;
  questionType?: string;
  report?: any;
}

interface VideoItem {
  id: string;
  type: "video";
  videoUrl: string;
  postProfile?: any;
  title?: string;
  description?: string;
  likes?: string;
  isLike?: boolean;
}

type MixedItem = Question | VideoItem;

interface QuestionsListProps {
  questions: Question[];
  videos?: VideoItem[];
  loadMoreQuestions: () => void;
  hasMoreQuestions: boolean;
  isLoading: boolean;
}

const QuestionsList: React.FC<QuestionsListProps> = ({
  questions,
  videos = [],
  loadMoreQuestions,
  hasMoreQuestions,
  isLoading,
}) => {
  const { height } = useWindowDimensions();
  const adjustedHeight = height * 0.97;
  const flatListRef = useRef<FlatList<MixedItem>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTheme = useSelector((state: any) => state.theme.mode);

  // Interleave videos and questions (e.g., Q, V, Q, V)
  const mixedData: MixedItem[] = [];
  const maxLength = Math.max(questions.length, videos.length);
  for (let i = 0; i < maxLength; i++) {
    if (i < questions.length) mixedData.push(questions[i]);
    if (i < videos.length) mixedData.push(videos[i]);
  }

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
      data={mixedData}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => {
        const isVisible = index === currentIndex;

        return (
          <View
            style={{
              height: adjustedHeight,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}>
            {"type" in item && item.type === "video" ? (
              <VideoCard
                videoUrl={item.videoUrl}
                isVisible={isVisible}
                _id={item.id}
                uri={item.videoUrl}
                ViewableItem={item.id}
                postProfile={item.postProfile}
                title={item.title}
                description={item.description}
                likes={item.likes}
              />
            ) : (
              <QuestionCard question={item as Question} />
            )}
          </View>
        );
      }}
      className={`${currentTheme === "dark" ? "bg-black" : "bg-white"}`}
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
