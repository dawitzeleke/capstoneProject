import { combineReducers } from "redux";
import optionReducer from "./optionReducer/optionReducer";
import questionsReducer from "./questionsReducer/questionsReducer";
import savedQuestionsReducer from "./savedQuestionsReducer/savedQuestionReducer";
import teacherReducer from "@/redux/teacherReducer/teacherSlice";
import mediaReducer from "@/redux/teacherReducer/mediaSlice";
import notificationsReducer from "@/redux/teacherReducer/notificationsSlice";
import teacherQuestionReducer from "@/redux/teacherReducer/teacherQuestionSlice";
import themeReducer from "./themeReducer/themeReducer";
import userTeacherReducer from "@/redux/userTeacherReducer/userTeacherReducer";
import teacherInsightsReducer from "@/redux/teacherReducer/teacherInsightsSlice";
import animationReducer from "./AnimationReducer/animationReducer";
import { userReducer } from "./userReducer/userReducer";
import customExamReducer from "./CustomExamReducer/customExamReducer";

const rootReducer = combineReducers({
  option: optionReducer,
  theme: themeReducer,
  animation: animationReducer,
  questions: questionsReducer,
  teacher: teacherReducer,
  userTeacher: userTeacherReducer,
  savedQuestions: savedQuestionsReducer,
  media: mediaReducer,
  notifications: notificationsReducer,
  teacherQuestions: teacherQuestionReducer,
  teacherInsights: teacherInsightsReducer,
  user: userReducer,
  customExam: customExamReducer,
});

// Export RootState type from rootReducer
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
