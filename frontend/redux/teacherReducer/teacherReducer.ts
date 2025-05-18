import { SET_TEACHER_DATA, RESET_TEACHER_DATA, UPDATE_TEACHER_IMAGE } from "./teacherActionTypes";
import { TeacherData, TeacherActionTypes } from "./teacherActions";

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
  loading: any;
  errors: any;
  profile: any;
  loadingProfile: any;
  errorProfile: any;
  stats: any;
  loadingStats: any;
  errorStats: any;
  uploadingImage: any;
  errorUpload: any;
  teacherData: TeacherData | null;
  teachers: Teacher[];
}

const initialState: TeacherState = {
  teacherData: null,
  teachers: [
    {
      id: "1",
      name: "Birhanu Temesgen",
      title: "Teaches Biology at SOT",
      followers: "2k Followers",
      questions: "400 Questions",
      imageUrl: "https://i.pravatar.cc/150?img=11",
    },
    {
      id: "2",
      name: "Helen Gebre",
      title: "Teaches Math at HNS",
      followers: "1.2k Followers",
      questions: "220 Questions",
      imageUrl: "https://i.pravatar.cc/150?img=25",
    },
    {
      id: "3",
      name: "Yared Lemma",
      title: "Teaches Physics at MHS",
      followers: "3.4k Followers",
      questions: "180 Questions",
      imageUrl: "https://i.pravatar.cc/150?img=33",
    },
  ],
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

    case UPDATE_TEACHER_IMAGE:
      if (!state.teacherData) {
        return state;
      }
      return {
        ...state,
        teacherData: {
          ...state.teacherData,
          imageUrl: action.payload,
        },
      };

    default:
      return state;
  }
};

export default teacherReducer;
