import { questionsActionTypes } from "./questionActionTypes"; // Import the enum

// Action to load initial questions
export const loadQuestions = () => ({
  type: questionsActionTypes.LOAD_QUESTIONS,
});

// Action to set the questions data in the Redux store
export const setQuestions = (questions: any[]) => ({
  type: questionsActionTypes.SET_QUESTIONS,
  payload: questions,
});

// Action to trigger loading more questions (for pagination)
export const loadMoreQuestions = () => ({
  type: questionsActionTypes.LOAD_MORE_QUESTIONS,
});

// Action to set loading state for questions
export const setLoading = (isLoading: boolean) => ({
  type: questionsActionTypes.SET_LOADING,
  payload: isLoading,
});

// Action to set if there are more questions available (pagination)
export const setHasMore = (hasMore: boolean) => ({
  type: questionsActionTypes.SET_HAS_MORE,
  payload: hasMore,
});
