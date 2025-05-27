import { SET_CUSTOM_EXAM, RESET_CUSTOM_EXAM } from "./customExamActionTypes";

const initialState = {
  exam: null,
};

const customExamReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_CUSTOM_EXAM:
      return { ...state, exam: action.payload };
    case RESET_CUSTOM_EXAM:
      return { ...state, exam: null };
    default:
      return state;
  }
};

export default customExamReducer;
