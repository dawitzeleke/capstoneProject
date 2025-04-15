import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import ReportOption from "../../../components/ReportOptions";
import OptionsMenu from "../../../components/CardOptions";
import {View} from "react-native";
import QuestionsList from "../../../components/QuestionList";
import { Pressable, Text, SafeAreaView, Dimensions } from "react-native";
import { closeOption } from "@/redux/optionReducer/optionActions";
import { setQuestions, setLoading } from "@/redux/questionsReducer/questionAction";
import httpRequest from "@/util/httpRequest";
import QuestionSkeleton from "@/components/QuestionSkeleton";

const { height } = Dimensions.get("window"); // Get device height

const Questions = () => {
  const dispatch = useDispatch();

    // Dispatch loadQuestions when component mounts
    useEffect(() => {
      const loadQuest = async () => {
        dispatch(
          setLoading(),
        );
        try {
          const response = await httpRequest("/api/Questions", null, "GET");
          console.log(response)
          dispatch(
            setQuestions(response), 
          );
        } catch (err) {
          console.error("Failed to load user", err);
        } finally {
          dispatch(
            setLoading(),
          );
        }}
        loadQuest()
    }, [dispatch]);
   
  const questions = useSelector((state: RootState) => state.questions.data);
  const isLoading = useSelector((state: RootState) => state.questions.isLoading);
  const hasMoreQuestions = useSelector((state: RootState) => state.questions.hasMore);

  // Function to load more questions (dispatch an action)
  const loadMoreQuestions = () => {
    dispatch({ type: "LOAD_MORE_QUESTIONS" });
  };

  const displayOption = useSelector((state: RootState) => state.option.isOptionsOpen);
  const displayReport = useSelector((state: RootState) => state.option.isReportOpen);


    
 console.log(questions)
  return (
    <SafeAreaView style={{ flex: 1 }}>
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
