// savedQuestionsReducer.ts

import {
  SET_SAVED_QUESTIONS,
  CLEAR_SAVED_QUESTIONS,
  UPDATE_SAVED_QUESTION,
  SavedQuestionsActionTypes,
  REMOVE_SAVED_QUESTION,
  Question,
} from "./savedQuestionsActionTypes";

// Reducer State
export interface SavedQuestionsState {
  list: Question[];
  ids: string[];
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
  ids: [],
};

// Reducer
const savedQuestionsReducer = (
  state = initialState,
  action: SavedQuestionsActionTypes
): SavedQuestionsState => {
  switch (action.type) {
    case SET_SAVED_QUESTIONS:
      return { ...state, list: action.payload,ids: action.payload.map(q => q.id) };

    case CLEAR_SAVED_QUESTIONS:
      return { ...state, list: [] };

    case REMOVE_SAVED_QUESTION:
      return {
        ...state,
        // to update the ids we check if it present before then remove and if not present we add the id
        list: state.list.filter((q) => q.id !== action.payload), ids: state.ids.includes(action.payload) ? state.ids.filter(id => id !== action.payload) : [...state.ids, action.payload] 
      };
    case UPDATE_SAVED_QUESTION:
      return {
        ...state,
        list: [action.payload, ...state.list],
      };

    default:
      return state; 
  }
};

export default savedQuestionsReducer;
