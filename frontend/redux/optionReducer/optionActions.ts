import { optionsActionTypes } from "./optionTypes";

export interface setReport {
  type: optionsActionTypes.OPEN_REPORT;
}

export interface closeOption {
  type: optionsActionTypes.CLOSE_OPTION;
}

export interface setDisplayOption {
  type: optionsActionTypes.OPEN_OPTION;
  payload: { key: string };
}

export interface UpdateReportAction {
  type: optionsActionTypes.UPDATE_REPORT;
  payload: { key: string; value: any };
}

export interface ResetReportAction {
  type: optionsActionTypes.RESET_REPORT;
}

export const setReport = () => ({
  type: "OPEN_REPORT",
});

export const closeOption = () => ({
  type: "CLOSE_OPTION",
});

export const setDisplayOption = () => ({
  type: "OPEN_OPTION",
});
// Define all action types in a single union type
export type ReportActions =
  | setReport
  | setDisplayOption
  | UpdateReportAction
  | ResetReportAction
  | closeOption;
