// savedQuestionsActionTypes.ts

export const SET_SAVED_QUESTIONS = "SET_SAVED_QUESTIONS";
export const CLEAR_SAVED_QUESTIONS = "CLEAR_SAVED_QUESTIONS";
export const REMOVE_SAVED_QUESTION = "REMOVE_SAVED_QUESTION";

export interface RemoveSavedQuestionAction {
  type: typeof REMOVE_SAVED_QUESTION;
  payload: string; // question ID
}

// Question interface (can be reused across files)
export interface Question {
  id: string;
  subject: string;
  question: string;
  author: string;
}

// Action Interfaces
export interface SetSavedQuestionsAction {
  type: typeof SET_SAVED_QUESTIONS;
  payload: Question[];
}

export interface ClearSavedQuestionsAction {
  type: typeof CLEAR_SAVED_QUESTIONS;
}

export type SavedQuestionsActionTypes =
  | SetSavedQuestionsAction
  | ClearSavedQuestionsAction
  | RemoveSavedQuestionAction;
