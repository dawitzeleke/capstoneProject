import { SET_TEACHER_DATA, RESET_TEACHER_DATA, UPDATE_TEACHER_IMAGE } from "./teacherActionTypes";

export interface TeacherData {
  id: string;
  name: string;
  title: string;
  followers: string;
  questions: string;
  imageUrl: string;
}


export interface SetTeacherDataAction {
  type: typeof SET_TEACHER_DATA;
  payload: TeacherData;
}

export interface ResetTeacherDataAction {
  type: typeof RESET_TEACHER_DATA;
}

export interface UpdateTeacherImageAction {
  type: typeof UPDATE_TEACHER_IMAGE;
  payload: string;
}


export type TeacherActionTypes =
  | SetTeacherDataAction
  | ResetTeacherDataAction
  | UpdateTeacherImageAction;

// Action Creators
export const setTeacherData = (teacherData: TeacherData): SetTeacherDataAction => ({
  type: SET_TEACHER_DATA,
  payload: teacherData,
});

export const resetTeacherData = (): ResetTeacherDataAction => ({
  type: RESET_TEACHER_DATA,
});


export const updateTeacherImage = (newImageUrl: string): UpdateTeacherImageAction => ({
  type: UPDATE_TEACHER_IMAGE,
  payload: newImageUrl,
});
