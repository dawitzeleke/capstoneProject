import { View, Text, ScrollView } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SavedQuestionCard } from "@/components/SavedQuestionCard";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState, useCallback} from "react";
import httpRequest from "@/util/httpRequest";
import { AppDispatch } from "@/redux/store";
import { setSavedQuestions } from "@/redux/savedQuestionsReducer/savedQuestionActions";


export default function SavedQuestions() {
  const savedQuestions = useSelector(
    (state: RootState) => state.savedQuestions.list
  );
  const dispatch = useDispatch() as AppDispatch; // Use AppDispatch type for dispatch

  // set saved questions state
  const theme = useSelector((state: RootState) => state.theme.mode);
  // Fetch saved questions from the APIconst [savedQuestions, setSavedQuestion] = useState([]); // Use a more descriptive name
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null);   // Add error state

  // Memoize the fetchData function using useCallback to prevent unnecessary re-creations
  const fetchSavedQuestions = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null);   // Clear any previous errors
    const studentId = '67f62af02a53696c6eec6a58';
    try {
      const response = await httpRequest(`/api/students/save-question?studentId=${studentId}`, null, 'GET');
      if (response && response.data) {
        console.log("Saved Questions:", response.data);
        dispatch(setSavedQuestions(response.Data)); 
      } else {
        // Handle cases where response or response.data is null/undefined
        console.warn("API response was successful but contained no data.");
      }
    } catch (err) {
      console.error("Error fetching saved questions:", err);
    } finally {
      setLoading(false); 
    }
  }, []); 

  useEffect(() => {
    fetchSavedQuestions(); // Call the memoized fetch function
  }, [dispatch])

  return (
    <View className={`flex-1 p-4 ${theme === "dark" ? "bg-black" : "bg-[#f1f3fc]"}`}>
      <View className="flex-row justify-center absolute top-4 left-4 align-middle mb-6">
        <Link href="/student/(tabs)/Profile" className="text-lg font-pregular">
          <Ionicons
            name="chevron-back"
            size={20}
            color={theme === "dark" ? "#ccc" : "gray"}
          />
        </Link>
      </View>

      <Text
        className={`text-center text-xl font-pbold mt-4 mb-4 ${
          theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        Saved Questions
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {savedQuestions.map((q) => (
          <SavedQuestionCard
            key={q.id}
            id={q.id}
            subject={q.subject}
            question={q.question}
            author={q.author}
          />
        ))}
      </ScrollView>
    </View>
  );
}
