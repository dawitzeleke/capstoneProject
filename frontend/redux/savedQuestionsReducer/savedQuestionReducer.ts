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
      _id: "1",
      CreatedAt: new Date().toISOString(),
      UpdatedAt: null,
      UpdatedBy: null,
      type: 0,
      CreatedBy: "temesgen",
      QuestionText: "What is the powerhouse of the cell?",
      Description: "Biology cell structure",
      CourseName: "Biology",
      Options: ["Nucleus", "Mitochondria", "Ribosome", "Cytoplasm"],
      CorrectOption: "Mitochondria",
      Grade: 12,
      Chapter: 0,
      QuestionType: 0,
      Difficulty: 0,
      Stream: 0,
      Explanation: "Mitochondria are often referred to as the powerhouses of the cell. They generate most of the supply of adenosine triphosphate (ATP), which is used as a source of chemical energy.",
      Hint: "Think about energy production in cells",
      Tags: ["biology", "cell", "mitochondria"],
      RelatedBlog: null,
      Report: null,
      Point: 1,
      TotalCorrectAnswers: 1234,
      Likes: null
    },
    {
      _id: "2",
      CreatedAt: new Date().toISOString(),
      UpdatedAt: null,
      UpdatedBy: null,
      type: 0,
      CreatedBy: "lily",
      QuestionText: "What is the derivative of x²?",
      Description: "Calculus differentiation",
      CourseName: "Mathematics",
      Options: ["x", "2x", "x²", "2"],
      CorrectOption: "2x",
      Grade: 12,
      Chapter: 0,
      QuestionType: 0,
      Difficulty: 0,
      Stream: 0,
      Explanation: "The derivative of x² with respect to x is 2x, according to the power rule of differentiation.",
      Hint: "Use the power rule",
      Tags: ["math", "calculus", "derivative"],
      RelatedBlog: null,
      Report: null,
      Point: 1,
      TotalCorrectAnswers: 5678,
      Likes: null
    },
    {
      _id: "3",
      CreatedAt: new Date().toISOString(),
      UpdatedAt: null,
      UpdatedBy: null,
      type: 0,
      CreatedBy: "yosef",
      QuestionText: "Define Avogadro's number.",
      Description: "Chemistry constants",
      CourseName: "Chemistry",
      Options: ["6.022 x 10²³", "3.14159", "9.8 m/s²", "2.71828"],
      CorrectOption: "6.022 x 10²³",
      Grade: 12,
      Chapter: 0,
      QuestionType: 0,
      Difficulty: 0,
      Stream: 0,
      Explanation: "Avogadro's number is the number of constituent particles, usually atoms or molecules, that are contained in one mole of a substance. It is approximately 6.022 x 10²³ mol⁻¹.",
      Hint: "Think about moles and particles",
      Tags: ["chemistry", "constant", "avogadro"],
      RelatedBlog: null,
      Report: null,
      Point: 1,
      TotalCorrectAnswers: 9012,
      Likes: null
    }
  ]
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
        list: state.list.filter((q) => q._id !== action.payload),
      };

    default:
      return state;
  }
};

export default savedQuestionsReducer;
