import React, { useEffect } from "react";
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

  // Dispatch loadQuestions when component mounts
  useEffect(() => {
    const loadQuest = async () => {
      dispatch(setLoading());
      try {
        const response = await httpRequest("/Questions/", null, "GET");
        console.log("here", response);
        // const resonse2 = await httpRequest("/Video", null, "GET");
        // const resonse3 = await httpRequest("/imagecontent", null, "GET");
        // console.log(resonse2.data, "herey");
        // console.log(resonse3.data);
        dispatch(setQuestions(response.data.items));
      } catch (err) {
        console.error("Failed to load user", err);
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

  const videos: VideoItem[] = [
    {
      id: "v1",
      type: "video",
      videoUrl:
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      title: "Explore Nature",
      description:
        "Beautiful scenes from the forest and riverside with peaceful sounds of nature.",
      likes: "134k",
      isLike: false,
    },
    {
      id: "v2",
      type: "video",
      videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
      title: "Tech Innovations",
      description:
        "Latest inventions and breakthroughs in modern technology, AI, and robotics.",
      likes: "256k",
      isLike: false,
    },
    {
      id: "v3",
      type: "video",
      videoUrl: "https://media.w3.org/2010/05/bunny/trailer.mp4",
      title: "Ocean Life",
      description:
        "Dive into the mysteries of the sea and discover stunning marine creatures.",
      likes: "87k",
      isLike: true,
    },
    {
      id: "v4",
      type: "video",
      videoUrl: "https://media.w3.org/2010/05/video/movie_300.mp4",
      title: "Wildlife Moments",
      description:
        "Close encounters with majestic animals in their natural habitats.",
      likes: "412k",
      isLike: false,
    },
  ];

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
  const user = useSelector(
    (state: RootState) => state.user.user
  );

  console.log(user, "user");
  console.log(questions);
  console.log(isLoading)
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
      {isLoading && questions.length > 0 ? (
        <QuestionsList
          questions={questions}
          loadMoreQuestions={loadMoreQuestions}
          hasMoreQuestions={hasMoreQuestions}
          isLoading={isLoading}
          videos={videos}
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
