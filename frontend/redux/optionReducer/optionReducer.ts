import { optionsActionTypes } from "./optionTypes";
import { ReportActions } from "./optionActions"; // Import the new type

interface ReportState {
  isReportOpen: boolean;
  isOptionsOpen: boolean;
}

const initialState: ReportState = { isReportOpen: false, isOptionsOpen: false };

const optionReducer = (
  state = initialState,
  action: ReportActions
): ReportState => {
  switch (action.type) {
    case optionsActionTypes.OPEN_REPORT:
      return {
        ...state,
        isReportOpen: !state.isReportOpen,
        isOptionsOpen: false,
      };

    case optionsActionTypes.OPEN_OPTION:
      console.log(state.isReportOpen);
      console.log("hehere");
      return {
        ...state,
        isOptionsOpen: !state.isOptionsOpen,
      };

    case optionsActionTypes.CLOSE_OPTION:
      return { ...state, isReportOpen: false, isOptionsOpen: false };

    default:
      return state;
  }
};

export default optionReducer;
