// progressActionTypes.ts

export const SET_PROGRESS_DATA = "SET_PROGRESS_DATA";

export interface HeatmapMonth {
  year: number;
  days_in_month: number;
  heatmap: number[][];
}


export interface SetProgressDataAction {
  type: typeof SET_PROGRESS_DATA;
  payload: HeatmapMonth[];
}

export type ProgressActionTypes = SetProgressDataAction;
