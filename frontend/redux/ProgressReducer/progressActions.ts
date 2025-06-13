// progressActions.ts
import { SET_PROGRESS_DATA, HeatmapMonth, ProgressActionTypes } from "./progressActionTypes";

export const setProgressData = (data: HeatmapMonth[]): ProgressActionTypes => ({
  type: SET_PROGRESS_DATA,
  payload: data,
});
