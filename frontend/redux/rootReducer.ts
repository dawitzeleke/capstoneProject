import { combineReducers } from "redux";
import optionReducer from "./optionReducer/optionReducer";
import questionsReducer from "./questionsReducer/questionsReducer";
import savedQuestionsReducer from "./savedQuestionsReducer/savedQuestionReducer";
import teacherReducer from "./teacherReducer/teacherReducer";
import contentReducer from "./teacherReducer/contentSlice";

const rootReducer = combineReducers({
  option: optionReducer,
  questions: questionsReducer,
  teacher: teacherReducer,
  savedQuestions:savedQuestionsReducer,
  content: contentReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
