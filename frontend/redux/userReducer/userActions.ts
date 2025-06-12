import { User } from '@/types/userTypes';
import {
  GET_USER,
  SET_USER,
  CLEAR_USER,
  SET_LOADING,
  SET_ERROR,
  REHYDRATE_USER,
} from './userActionTypes';

// Action Types
export interface GetUserAction {
  type: typeof GET_USER;
}

export interface SetUserAction {
  type: typeof SET_USER;
  payload: User;
}

export interface ClearUserAction {
  type: typeof CLEAR_USER;
}

export interface SetLoadingAction {
  type: typeof SET_LOADING;
  payload: boolean;
}

export interface SetErrorAction {
  type: typeof SET_ERROR;
  payload: string | null;
}

// ✅ Add this missing interface
export interface RehydrateUserAction {
  type: typeof REHYDRATE_USER;
  payload: User | null;
}

// ✅ Add RehydrateUserAction to the union
export type UserAction =
  | GetUserAction
  | SetUserAction
  | ClearUserAction
  | SetLoadingAction
  | SetErrorAction
  | RehydrateUserAction; // <-- added here

// Action Creators
export const getUser = (): GetUserAction => ({
  type: GET_USER,
});

export const setUser = (user: User): SetUserAction => ({
  type: SET_USER,
  payload: user,
});

export const rehydrateUser = (user: User | null): RehydrateUserAction => ({
  type: REHYDRATE_USER,
  payload: user,
});

export const clearUser = (): ClearUserAction => ({
  type: CLEAR_USER,
});

export const setLoading = (loading: boolean): SetLoadingAction => ({
  type: SET_LOADING,
  payload: loading,
});

export const setError = (error: string | null): SetErrorAction => ({
  type: SET_ERROR,
  payload: error,
});
