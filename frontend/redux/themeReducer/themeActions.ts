// src/redux/theme/themeActions.ts
import { TOGGLE_THEME, SET_THEME, ThemeMode } from "./themeActionTypes";

export const toggleTheme = () => ({
  type: TOGGLE_THEME as typeof TOGGLE_THEME,
});

export const setTheme = (mode: ThemeMode) => ({
  type: SET_THEME as typeof SET_THEME,
  payload: mode,
});

export type ThemeAction =
  | ReturnType<typeof toggleTheme>
  | ReturnType<typeof setTheme>;
