import { StudentActionTypes } from "./studentActionType";
import { QuestionAttempt } from "./studentAction";

interface StudentState {
  correctAttempts: QuestionAttempt[];
  attemptedQuestions: QuestionAttempt[];
  sendLimit: number;
}

const initialState: StudentState = {
  correctAttempts: [],
  attemptedQuestions: [],
  sendLimit: 0,
};

type Action = {
  type: StudentActionTypes;
  payload?: QuestionAttempt;
};

const studentReducer = (state = initialState, action: Action): StudentState => {
  switch (action.type) {
    case StudentActionTypes.ADD_QUESTION_ATTEMPT: {
      const attempt = action.payload!;
      const isCorrect = attempt.isCorrect;
      const updatedSendLimit = state.sendLimit + 1;

      return {
        ...state,
        correctAttempts: isCorrect
          ? [...state.correctAttempts, attempt]
          : state.correctAttempts,
        attemptedQuestions: !isCorrect
          ? [...state.attemptedQuestions, attempt]
          : state.attemptedQuestions,
        sendLimit: updatedSendLimit >= 10 ? 10 : updatedSendLimit, // Cap at 10
      };
    }

    case StudentActionTypes.CLEAR_ATTEMPTS:
      return {
        ...state,
        correctAttempts: [],
        attemptedQuestions: [],
        sendLimit: 0,
      };

    default:
      return state;
  }
};

export default studentReducer;
