import { combineReducers } from "redux";
import optionReducer from "./optionReducer/optionReducer";
import questionsReducer from "./questionsReducer/questionsReducer"


const rootReducer = combineReducers({
  option: optionReducer,
  questions: questionsReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
