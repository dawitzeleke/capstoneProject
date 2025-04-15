// savedQuestionsReducer.ts

import {
  SET_SAVED_QUESTIONS,
  CLEAR_SAVED_QUESTIONS,
  SavedQuestionsActionTypes,
  REMOVE_SAVED_QUESTION,
  Question,
} from "./savedQuestionsActionTypes";

// Reducer State
export interface SavedQuestionsState {
  list: Question[];
}

const initialState: SavedQuestionsState = {
  list: [
    {
      id: "1",
      subject: "Biology",
      question: "What is the powerhouse of the cell?",
      author: "temesgen",
    },
    {
      id: "2",
      subject: "Math",
      question: "What is the derivative of x²?",
      author: "lily",
    },
    {
      id: "3",
      subject: "Chemistry",
      question: "Define Avogadro's number.",
      author: "yosef",
    },
  ],
};

// Reducer
const savedQuestionsReducer = (
  state = initialState,
  action: SavedQuestionsActionTypes
): SavedQuestionsState => {
  switch (action.type) {
    case SET_SAVED_QUESTIONS:
      return { ...state, list: action.payload };

    case CLEAR_SAVED_QUESTIONS:
      return { ...state, list: [] };

    case REMOVE_SAVED_QUESTION:
      return {
        ...state,
        list: state.list.filter((q) => q.id !== action.payload),
      };

    default:
      return state;
  }
};

export default savedQuestionsReducer;
