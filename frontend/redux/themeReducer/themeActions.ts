// src/redux/theme/themeActions.ts
import { TOGGLE_THEME, SET_THEME, ThemeMode } from './themeActionTypes';

export interface ThemeAction {
  type: typeof TOGGLE_THEME | typeof SET_THEME;
  payload?: ThemeMode;
}

export const toggleTheme = (): ThemeAction => ({
  type: TOGGLE_THEME,
});

export const setTheme = (mode: ThemeMode): ThemeAction => ({
  type: SET_THEME,
  payload: mode,
});
