import { questionsActionTypes } from "./questionActionTypes"; // Assuming the file is named `questionActionTypes`

// Define the structure of the state
interface QuestionState {
  data: any[]; // List of questions (you can define the exact shape of each question in your application)
  isLoading: boolean; // A flag to indicate if questions are being loaded
  hasMore: boolean; // A flag to check if more questions are available for loading
}

// Initial state for the reducer

const initialState: QuestionState = {
  data: [
    {
      id: "q1",
      questionText: "What is the capital of France?",
      options: [
        "Berlin - The largest city in Germany and its capital since 1990",
        "Madrid - The capital and largest city of Spain",
        "Paris - The capital and most populous city of France, known for the Eiffel Tower",
        "Rome - The capital city of Italy and home to the Vatican City"
      ],
      correctOption: "Paris - The capital and most populous city of France, known for the Eiffel Tower",
      description: "Paris is the capital and most populous city of France.",
      TotalCorrectAnswers: 120,
      courseName: "Geography 101",
      createdBy: "teacher_001",
      difficulty: "Easy",
      feedbacks: [],
      grade: 9,
      point: 5,
      questionType: "Multiple Choice",
      report: null,
    },
    {
      id: "q2",
      questionText: "Which planet is known as the Red Planet?",
      options: [
        "Earth - The third planet from the Sun and the only astronomical object known to harbor life",
        "Venus - The second planet from the Sun and the hottest planet in our solar system",
        "Mars - The fourth planet from the Sun and the second-smallest planet in the Solar System",
        "Jupiter - The fifth planet from the Sun and the largest in the Solar System"
      ],
      correctOption: "Mars - The fourth planet from the Sun and the second-smallest planet in the Solar System",
      description: "Mars is called the Red Planet due to its reddish appearance.",
      TotalCorrectAnswers: 98,
      courseName: "Astronomy Basics",
      createdBy: "teacher_002",
      difficulty: "Medium",
      feedbacks: [],
      grade: 8,
      point: 5,
      questionType: "Multiple Choice",
      report: null,
    },
    {
      id: "q3",
      questionText: "Who wrote 'Romeo and Juliet'?",
      options: [
        "William Shakespeare - An English playwright and poet, widely regarded as the greatest writer in the English language",
        "Charles Dickens - An English writer and social critic who created some of the world's best-known fictional characters",
        "Jane Austen - An English novelist known primarily for her six major novels",
        "Leo Tolstoy - A Russian writer who is regarded as one of the greatest authors of all time"
      ],
      correctOption: "William Shakespeare - An English playwright and poet, widely regarded as the greatest writer in the English language",
      description: "Shakespeare is widely regarded as the greatest writer in the English language.",
      TotalCorrectAnswers: 105,
      courseName: "English Literature",
      createdBy: "teacher_003",
      difficulty: "Medium",
      feedbacks: [],
      grade: 10,
      point: 6,
      questionType: "Multiple Choice",
      report: null,
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
      return { ...state, isLoading: !state.isLoading }; // Set the loading state

    case questionsActionTypes.SET_HAS_MORE:
      return { ...state, hasMore: action.payload }; // Set if there are more questions available for loading

    default:
      return state; // Default case to return the current state if no matching action
  }
};

export default questionReducer;
