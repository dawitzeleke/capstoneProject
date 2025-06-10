import { User } from './userReducer';
import { GET_USER, SET_USER, CLEAR_USER, SET_LOADING, SET_ERROR } from './userActionTypes';

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

export type UserAction = 
    | GetUserAction 
    | SetUserAction 
    | ClearUserAction 
    | SetLoadingAction 
    | SetErrorAction;

// Action Creators
export const getUser = (): GetUserAction => ({
    type: GET_USER
});

export const setUser = (user: User): SetUserAction => ({
    type: SET_USER,
    payload: user
});

export const clearUser = (): ClearUserAction => ({
    type: CLEAR_USER
});

export const setLoading = (loading: boolean): SetLoadingAction => ({
    type: SET_LOADING,
    payload: loading
});

export const setError = (error: string | null): SetErrorAction => ({
    type: SET_ERROR,
    payload: error
}); 