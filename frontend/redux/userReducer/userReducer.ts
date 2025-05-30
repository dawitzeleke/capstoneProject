// userReducer.ts

import { GET_USER, SET_USER, CLEAR_USER, SET_LOADING, SET_ERROR } from './userActionTypes';
import { UserAction } from './userActions';

// ✅ User interface based on your correct structure
export interface User {
  token: string;
  email: string;
  role: string;
}

// ✅ State interface for the user slice
export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// ✅ Initial state
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// ✅ Reducer function
export const userReducer = (
  state = initialState,
  action: UserAction
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
