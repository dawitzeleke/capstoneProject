// Define User type with the required properties
interface User {
  id: string;
  image: string;
  name: string;
  token: string;
  role: string; // role can be student, teacher, or other string
}

// Define UserState using the User type
interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Action types constants (should match your userActionTypes)
const GET_USER = "GET_USER";
const SET_USER = "SET_USER";
const CLEAR_USER = "CLEAR_USER";
const SET_LOADING = "SET_LOADING";
const SET_ERROR = "SET_ERROR";
const REHYDRATE_USER = "REHYDRATE_USER";

// You probably already have UserAction imported; 
// but if not, define UserAction union here with appropriate payloads.

// Initial state
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Reducer function
export const userReducer = (
  state = initialState,
  action: any // You can replace 'any' with your UserAction union type
): UserState => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case SET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };

    case CLEAR_USER:
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
      };

    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case REHYDRATE_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };

    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};
