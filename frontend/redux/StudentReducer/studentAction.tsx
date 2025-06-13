// src/redux/student/studentActions.ts

import { StudentActionTypes } from "./studentActionType";

export interface QuestionAttempt {
  id: string;
  question: string;
  answer: string;
  isCorrect: boolean;
}

export const addQuestionAttempt = (attempt: QuestionAttempt) => ({
  type: StudentActionTypes.ADD_QUESTION_ATTEMPT,
  payload: attempt,
});

export const clearAttempts = () => ({
  type: StudentActionTypes.CLEAR_ATTEMPTS,
});
