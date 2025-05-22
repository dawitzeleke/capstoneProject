import { combineReducers } from "redux";
import optionReducer from "./optionReducer/optionReducer";
import questionsReducer from "./questionsReducer/questionsReducer";
import savedQuestionsReducer from "./savedQuestionsReducer/savedQuestionReducer";
import teacherReducer from "@/redux/teacherReducer/teacherSlice";
import mediaReducer from "@/redux/teacherReducer/mediaSlice";
import notificationsReducer from "@/redux/teacherReducer/notificationsSlice"
import teacherQuestionReducer from "@/redux/teacherReducer/teacherQuestionSlice"
import themeReducer from "./themeReducer/themeReducer";

const rootReducer = combineReducers({
  option: optionReducer,
  questions: questionsReducer,
  teacher: teacherReducer,
  savedQuestions: savedQuestionsReducer,
  media: mediaReducer,
  notifications: notificationsReducer,
  theme: themeReducer,
  teacherQuestions: teacherQuestionReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;


