import { questionsActionTypes } from "./questionActionTypes"; // Assuming the file is named `questionActionTypes`

// Define the structure of the state
interface QuestionState {
  data: any[]; // List of questions (you can define the exact shape of each question in your application)
  isLoading: boolean;
  hasMore: boolean; // A flag to check if more questions are available for loading
}

// Initial state for the reducer

const initialState: QuestionState = {
  data: [
    {
      id: "1",
      text: "What is the powerhouse of the cell?",
      options: ["Mitochondria", "Nucleus", "Ribosome", "Cytoplasm"],
      answer: "Mitochondria",
      correctAttempts: 579,
      questionDetail:
        "This question is from university entrance exam NEAEA 2007, it talks about biology of the cell that is found in grade 9 text book specifically chapter 5, Good Luck!",
    },
    {
      id: "2",
      text: "What is the capital of Ethiopia?",
      options: ["Addis Ababa", "Asmara", "Nairobi", "Khartoum"],
      answer: "Addis Ababa",
      correctAttempts: 1350,
      questionDetail:
        "This question is commonly asked in Geography exams and refers to the capital city of Ethiopia.",
    },
    {
      id: "3",
      text: "Which element has the chemical symbol 'O'?",
      options: ["Oxygen", "Osmium", "Ozone", "Oganesson"],
      answer: "Oxygen",
      correctAttempts: 780,
      questionDetail:
        "This question tests your knowledge of basic chemical elements. Oxygen is essential for life on Earth.",
    },
    {
      id: "4",
      text: "Which element has the chemical symbol 'O'?",
      options: ["Oxygen", "Osmium", "Ozone", "Oganesson"],
      answer: "Oxygen",
      correctAttempts: 780,
      questionDetail:
        "This question tests your knowledge of basic chemical elements. Oxygen is essential for life on Earth.",
    },
    {
      id: "5",
      text: "Which element has the chemical symbol 'O'?",
      options: ["Oxygen", "Osmium", "Ozone", "Oganesson"],
      answer: "Oxygen",
      correctAttempts: 780,
      questionDetail:
        "This question tests your knowledge of basic chemical elements. Oxygen is essential for life on Earth.",
    },
  ],
  isLoading: false,
  hasMore: true,
};

// Define the type for actions that will be dispatched
interface QuestionAction {
  type: questionsActionTypes; // Action type will be one of the types defined in the questionActionTypes enum
  payload?: any; // Some actions may have a payload, like loading new questions or setting the 'hasMore' flag
}

// Question reducer to manage state changes based on action types
const questionReducer = (
  state = initialState,
  action: QuestionAction
): QuestionState => {
  switch (action.type) {
    case questionsActionTypes.LOAD_QUESTIONS:
      return { ...state, isLoading: true }; // Start loading questions

    case questionsActionTypes.SET_QUESTIONS:
      return {
        ...state,
        isLoading: false,
        data: action.payload, // Set the questions data in the state
      };

    case questionsActionTypes.LOAD_MORE_QUESTIONS:
      return { ...state, isLoading: true }; // Trigger loading more questions (pagination)

    case questionsActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload }; // Set the loading state

    case questionsActionTypes.SET_HAS_MORE:
      return { ...state, hasMore: action.payload }; // Set if there are more questions available for loading

    default:
      return state; // Default case to return the current state if no matching action
  }
};

export default questionReducer;
