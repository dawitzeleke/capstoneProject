import { combineReducers } from "redux";
import optionReducer from "./optionReducer/optionReducer";
import questionsReducer from "./questionsReducer/questionsReducer";
import savedQuestionsReducer from "./savedQuestionsReducer/savedQuestionReducer";
import teacherReducer from "@/redux/teacherReducer/teacherReducer";
import contentReducer from "@/redux/teacherReducer/contentSlice";
import mediaReducer from "@/redux/teacherReducer/mediaSlice";
import notificationsReducer from "@/redux/teacherReducer/notificationsSlice"
import themeReducer from "./themeReducer/themeReducer";

const rootReducer = combineReducers({
  option: optionReducer,
  questions: questionsReducer,
  teacher: teacherReducer,
  savedQuestions: savedQuestionsReducer,
  content: contentReducer,
  media: mediaReducer,
  notifications: notificationsReducer,
   theme:   themeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;


