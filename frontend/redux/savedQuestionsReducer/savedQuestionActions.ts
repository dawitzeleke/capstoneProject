// savedQuestionsActions.ts

import {
  SET_SAVED_QUESTIONS,
  CLEAR_SAVED_QUESTIONS,
  Question,
  REMOVE_SAVED_QUESTION,
  UPDATE_SAVED_QUESTION,
  SavedQuestionsActionTypes,
  RemoveSavedQuestionAction,
} from "./savedQuestionsActionTypes";

// Action Creators
export const setSavedQuestions = (
  questions: Question[]
): SavedQuestionsActionTypes => ({
  type: SET_SAVED_QUESTIONS,
  payload: questions,
});

export const clearSavedQuestions = (): SavedQuestionsActionTypes => ({
  type: CLEAR_SAVED_QUESTIONS,
});

export const removeSavedQuestion = (id: string): RemoveSavedQuestionAction => ({
  type: REMOVE_SAVED_QUESTION,
  payload: id,
});

export const updateSavedQuestion = (
  question: Question
): SavedQuestionsActionTypes => ({
  type: UPDATE_SAVED_QUESTION,
  payload: question,
});
