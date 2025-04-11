import { combineReducers } from "redux";
import optionReducer from "./optionReducer/optionReducer";
import questionsReducer from "./questionsReducer/questionsReducer";
import teacherReducer from "./teacherReducer/teacherReducer";

const rootReducer = combineReducers({
  option: optionReducer,
  questions: questionsReducer,
  teacher: teacherReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
