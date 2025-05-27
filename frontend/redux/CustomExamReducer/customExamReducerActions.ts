import { SET_CUSTOM_EXAM, RESET_CUSTOM_EXAM } from "./customExamActionTypes";

export const setCustomExam = (exam: any) => ({
  type: SET_CUSTOM_EXAM,
  payload: exam,
});

export const resetCustomExam = () => ({
  type: RESET_CUSTOM_EXAM,
});
