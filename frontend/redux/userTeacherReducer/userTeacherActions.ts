import { SET_TEACHER_DATA, RESET_TEACHER_DATA, FETCH_TEACHERS_REQUEST, FETCH_TEACHERS_SUCCESS, FETCH_TEACHERS_FAILURE } from "./userTeacherActionTypes";

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

export interface FetchTeachersRequestAction {
  type: typeof FETCH_TEACHERS_REQUEST;
}

export interface FetchTeachersSuccessAction {
  type: typeof FETCH_TEACHERS_SUCCESS;
  payload: TeacherData[];
}

export interface FetchTeachersFailureAction {
  type: typeof FETCH_TEACHERS_FAILURE;
  payload: string;
}

export type TeacherActionTypes = 
  | SetTeacherDataAction 
  | ResetTeacherDataAction
  | FetchTeachersRequestAction
  | FetchTeachersSuccessAction
  | FetchTeachersFailureAction;

// Action Creators
export const setTeacherData = (teacherData: TeacherData): SetTeacherDataAction => ({
  type: SET_TEACHER_DATA,
  payload: teacherData,
});

export const resetTeacherData = (): ResetTeacherDataAction => ({
  type: RESET_TEACHER_DATA,
});

export const fetchTeachersRequest = (): FetchTeachersRequestAction => ({
  type: FETCH_TEACHERS_REQUEST,
});

export const fetchTeachersSuccess = (teachers: TeacherData[]): FetchTeachersSuccessAction => ({
  type: FETCH_TEACHERS_SUCCESS,
  payload: teachers,
});

export const fetchTeachersFailure = (error: string): FetchTeachersFailureAction => ({
  type: FETCH_TEACHERS_FAILURE,
  payload: error,
});



