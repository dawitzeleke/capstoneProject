// src/redux/theme/themeReducer.ts
import { TOGGLE_THEME, SET_THEME, ThemeMode } from "./themeActionTypes";
import { ThemeAction } from "./themeActions";

export interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = {
  mode: "light", // default theme
};

const themeReducer = (
  state = initialState,
  action: ThemeAction
): ThemeState => {
  switch (action.type) {
    case TOGGLE_THEME:
      return {
        ...state,
        mode: state.mode === "light" ? "dark" : "light",
      };
    case SET_THEME:
      return {
        ...state,
        mode: action.payload,
      };
    default:
      return state;
  }
};

export default themeReducer;
