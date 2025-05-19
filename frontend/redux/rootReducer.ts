import { combineReducers } from "redux";
import optionReducer from "./optionReducer/optionReducer";
import questionsReducer from "./questionsReducer/questionsReducer";
import savedQuestionsReducer from "./savedQuestionsReducer/savedQuestionReducer";
import teacherReducer from "./teacherReducer/teacherReducer";
import themeReducer from "./themeReducer/themeReducer";

const rootReducer = combineReducers({
  option: optionReducer,
  theme: themeReducer,
  questions: questionsReducer,
  teacher: teacherReducer,
  savedQuestions:savedQuestionsReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
