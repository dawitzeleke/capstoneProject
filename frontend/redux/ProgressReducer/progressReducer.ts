import { HeatmapMonth, ProgressActionTypes, SET_PROGRESS_DATA } from "./progressActionTypes";

interface ProgressState {
  progressData: HeatmapMonth[];
}

const initialState: ProgressState = {
  progressData: [],
};

const progressReducer = (state = initialState, action: ProgressActionTypes): ProgressState => {
  switch (action.type) {
    case SET_PROGRESS_DATA:
      return {
        ...state,
        progressData: action.payload,
      };
    default:
      return state;
  }
};

export default progressReducer;
