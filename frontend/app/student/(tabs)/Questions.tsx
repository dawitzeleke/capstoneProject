import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import ReportOption from "../../../components/ReportOptions";
import OptionsMenu from "../../../components/CardOptions";
import { View } from "react-native";
import QuestionsList from "../../../components/QuestionList";
import { StatusBar } from "react-native";
import { Pressable, Text, SafeAreaView, Dimensions } from "react-native";
import { closeOption } from "@/redux/optionReducer/optionActions";
import {
  setQuestions,
  setLoading,
} from "@/redux/questionsReducer/questionAction";
import httpRequest from "@/util/httpRequest";
import QuestionSkeleton from "@/components/QuestionSkeleton";

const { height } = Dimensions.get("window"); // Get device height

const Questions = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const token = user?.token; // Get the token from the user state
  const [videos, setVideos] = useState<VideoItem[]>([]); // <-- Add this

  useEffect(() => {
    const loadQuest = async () => {
      dispatch(setLoading());
      try {
        const response = await httpRequest("/Questions/", null, "GET", token);
        console.log("here", response);
        const resonse2 = await httpRequest("/VideoContent", null, "GET");
        // const resonse3 = await httpRequest("/ImageContent", null, "GET");
        console.log(resonse2, "herey");
        // console.log(resonse3);
        dispatch(setQuestions(response.data.items));
        setVideos(resonse2); // <-- Set videos from backend
      } catch (err) {
        console.error(err);
        console.log(err);
      } finally {
        dispatch(setLoading());
      }
    };
    loadQuest();
  }, [dispatch]);

  const questions = useSelector((state: RootState) => state.questions.data);
  type VideoItem = {
    id: string;
    type: "video"; // Literal type
    videoUrl: string;
    title: string;
    description: string;
    likes: string;
    isLike: boolean;
  };

  const isLoading = useSelector(
    (state: RootState) => state.questions.isLoading
  );
  const hasMoreQuestions = useSelector(
    (state: RootState) => state.questions.hasMore
  );

  // Function to load more questions (dispatch an action)
  const loadMoreQuestions = () => {
    dispatch(setLoading());
  };

  const displayOption = useSelector(
    (state: RootState) => state.option.isOptionsOpen
  );
  const displayReport = useSelector(
    (state: RootState) => state.option.isReportOpen
  );

  console.log(videos, "video")
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor="rgba(255, 255, 255, 0.9)"
        barStyle="dark-content" // or "dark-content" depending on your background
      />
      {displayOption && (
        <Pressable
          onPress={() => dispatch(closeOption())}
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10"
          style={{ height: height, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <OptionsMenu />
        </Pressable>
      )}

      {displayReport && (
        <Pressable
          onPress={() => dispatch(closeOption())}
          className="absolute top-0 left-0 w-full flex items-center justify-center z-10 "
          style={{ height: height, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <ReportOption />
        </Pressable>
      )}

      {/* Render the list of questions only if not loading */}
      {questions.length > 0 ? (
        <QuestionsList
          questions={questions}
          loadMoreQuestions={loadMoreQuestions}
          hasMoreQuestions={hasMoreQuestions}
          isLoading={isLoading}
          videos={videos} // <-- Use backend videos here
        />
      ) : (
        <View className="flex justify-center items-center">
          <QuestionSkeleton />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Questions;
