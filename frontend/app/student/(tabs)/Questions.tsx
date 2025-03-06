import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import ReportOption from "../../../components/ReportOptions";
import OptionsMenu from "../../../components/CardOptions";
import QuestionsList from "../../../components/QuestionList";
import { Pressable, Text, SafeAreaView, Dimensions } from "react-native";
import { closeOption } from "@/redux/optionReducer/optionActions";
import { loadQuestions } from "@/redux/questionsReducer/questionAction";

const { height } = Dimensions.get("window"); // Get device height

const Questions = () => {
  const dispatch = useDispatch();

  // Retrieve questions from Redux store
  const questions = useSelector((state: RootState) => state.questions.data);
  const isLoading = useSelector((state: RootState) => state.questions.isLoading);
  const hasMoreQuestions = useSelector((state: RootState) => state.questions.hasMore);

  // Function to load more questions (dispatch an action)
  const loadMoreQuestions = () => {
    dispatch({ type: "LOAD_MORE_QUESTIONS" });
  };

  const displayOption = useSelector((state: RootState) => state.option.isOptionsOpen);
  const displayReport = useSelector((state: RootState) => state.option.isReportOpen);

  // Dispatch loadQuestions when component mounts
  useEffect(() => {
    dispatch(loadQuestions());
  }, [dispatch]);

 console.log(displayOption)
 console.log(displayReport)
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
          className="absolute top-0 left-0 w-full flex items-center justify-center z-10"
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
        <Pressable
          className="w-full flex justify-center items-center"
          style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
          <Text>{isLoading ? "Loading..." : "No questions available"}</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
};

export default Questions;
