import { SET_TEACHER_DATA, RESET_TEACHER_DATA, FETCH_TEACHERS_REQUEST, FETCH_TEACHERS_SUCCESS, FETCH_TEACHERS_FAILURE } from "./userTeacherActionTypes";
import { TeacherData, TeacherActionTypes } from "./userTeacherActions";

// Define the Teacher interface
interface Teacher {
  id: string;
  name: string;
  title: string;
  followers: string;
  questions: string;
  imageUrl: string;
}

// Define the initial state with the list of teachers
interface TeacherState {
  teacherData: TeacherData | null;
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
}

const initialState: TeacherState = {
  teacherData: null,
  teachers: [],
  loading: false,
  error: null,
};

const teacherReducer = (
  state = initialState,
  action: TeacherActionTypes
): TeacherState => {
  switch (action.type) {
    case SET_TEACHER_DATA:
      return {
        ...state,
        teacherData: action.payload,
      };

    case RESET_TEACHER_DATA:
      return {
        ...state,
        teacherData: null,
      };

    case FETCH_TEACHERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_TEACHERS_SUCCESS:
      return {
        ...state,
        loading: false,
        teachers: action.payload,
        error: null,
      };

    case FETCH_TEACHERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default teacherReducer;
