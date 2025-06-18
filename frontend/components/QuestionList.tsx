import React, { useMemo, useRef, useState } from "react"; // <-- Import useMemo
import { FlatList, useWindowDimensions, View, ViewToken } from "react-native";
import { useSelector } from "react-redux";
// import {loadMoreQuestions} from "../redux/questionsReducer/questionAction"; // Adjust the import path as needed
import QuestionCard from "./QuestionCard";
import QuestionSkeleton from "./QuestionSkeleton";
import VideoCard from "./VideoCard";

// Define the Question interface
interface Question {
  id: string;
  type: "question";
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

// Define the VideoItem interface
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

// A union type for items in the list
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

  // ===================== MODIFICATION START =====================
  // Use useMemo to create the mixed data array with the new logic.
  // This will only re-run when the questions or videos array changes.
  const mixedData = useMemo(() => {
    const data: MixedItem[] = [];
    let videoIndex = 0; // To track which video we should insert next

    // Loop through all the questions
    for (let i = 0; i < questions.length; i++) {
      // 1. Always add the current question
      data.push({ ...questions[i], type: 'question' });

      // 2. Check if this is the 5th question in a sequence (e.g., after question index 4, 9, 14...)
      // The condition (i + 1) % 5 === 0 will be true after every 5 questions.
      if ((i + 1) % 5 === 0) {
        
        // 3. If it's time for a video, check if there are any videos left to show
        if (videoIndex < videos.length) {
          // Add the next available video and increment the video index
          data.push({ ...videos[videoIndex], type: 'video' });
          videoIndex++;
        }
      }
    }
    return data;
  }, [questions, videos]); // Dependency array for useMemo
  // ====================== MODIFICATION END ======================

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
      data={mixedData} // The data is now correctly ordered
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
            {item.type === "video" ? (
              // Render VideoCard if item type is 'video'
              <VideoCard
                videoUrl={(item as VideoItem).videoUrl}
                isVisible={isVisible}
                _id={item.id}
                uri={(item as VideoItem).videoUrl}
                ViewableItem={item.id}
                postProfile={(item as VideoItem).postProfile}
                title={(item as VideoItem).title}
                description={(item as VideoItem).description}
                likes={(item as VideoItem).likes}
              />
            ) : (
              // Otherwise, render QuestionCard
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