// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   Pressable,
//   Modal,
//   Platform,
//   UIManager,
//   LayoutAnimation,
// } from "react-native";
// import LottieView from "lottie-react-native";

// if (
//   Platform.OS === "android" &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// const HIGH_SCORE_CONST = 7;
// const operations = ["+", "-", "*", "/", "^2", "√"];

// const getRandomInt = (min: number, max: number) =>
//   Math.floor(Math.random() * (max - min + 1)) + min;

// const generateQuestion = () => {
//   const op = operations[Math.floor(Math.random() * operations.length)];
//   let left = getRandomInt(1, 20);
//   let right = getRandomInt(1, 20);

//   if (op === "√") {
//     const sqrts = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100];
//     left = sqrts[Math.floor(Math.random() * sqrts.length)];
//     return { question: `√${left}`, answer: Math.sqrt(left) };
//   } else if (op === "^2") {
//     return { question: `${left}²`, answer: Math.pow(left, 2) };
//   } else if (op === "-") {
//     // Ensure the first number is greater for subtraction
//     if (left < right) {
//       [left, right] = [right, left]; // Swap if left is smaller
//     }
//     const expression = `${left} - ${right}`;
//     const answer = left - right;
//     return { question: expression, answer };
//   } else {
//     const expression = `${left} ${op} ${right}`;
//     const answer = eval(expression);
//     return { question: expression, answer };
//   }
// };

// export default function MathQuizGame() {
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [score, setScore] = useState(0);
//   const [highScore, setHighScore] = useState(HIGH_SCORE_CONST);
//   const [question, setQuestion] = useState(generateQuestion());
//   const [input, setInput] = useState("");
//   const [gameOver, setGameOver] = useState(false);
//   const [newHigh, setNewHigh] = useState(false);
//   const animationRef = useRef(null);

//   const handleAnswer = () => {
//     const parsedInput = parseFloat(input);
//     if (!isNaN(parsedInput) && Math.abs(parsedInput - question.answer) < 0.01) {
//       setScore(score + 1);
//       setTimeLeft((prev) => prev + 10);
//     } else {
//       setTimeLeft((prev) => prev - 5);
//     }
//     setQuestion(generateQuestion());
//     setInput("");
//   };

//   const resetGame = () => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     setScore(0);
//     setTimeLeft(30);
//     setQuestion(generateQuestion());
//     setInput("");
//     setGameOver(false);
//     setNewHigh(false);
//   };

//   const handleKeyPress = (key: string) => {
//     if (key === "⌫") {
//       setInput((prev) => prev.slice(0, -1));
//     } else if (key === "." && input.includes(".")) {
//       return;
//     } else {
//       setInput((prev) => prev + key);
//     }
//   };

//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       if (score > highScore) {
//         setNewHigh(true);
//         setHighScore(score);
//       }
//       setGameOver(true);
//     }
//   }, [timeLeft]);

//   const KEYS = [
//     ["1", "2", "3"],
//     ["4", "5", "6"],
//     ["7", "8", "9"],
//     [".", "0", "⌫"], // Removed "-" here
//   ];

//   return (
//     <View className="flex-1 bg-[#fefefe] px-4 pt-16">
//       {/* Header */}
//       <View className="flex-row justify-between items-center mb-6">
//         <Pressable
//           onPress={() => setGameOver(true)}
//           className="bg-red-100 px-3 py-1 rounded-full">
//           <Text className="text-red-700 font-semibold">Quit</Text>
//         </Pressable>
//         <Text className="text-xl font-bold text-indigo-700">Score: {score}</Text>
//         <Text className="text-base text-green-700 font-medium">
//           High: {highScore}
//         </Text>
//       </View>

//       {/* Main Area */}
//       <View className="flex-1 items-center">
//         <Text className="text-3xl font-bold text-gray-900 mb-2">
//           Time: {timeLeft}s
//         </Text>
//         <Text className="text-2xl font-semibold text-indigo-800 mb-4">
//           {question.question}
//         </Text>

//         {/* Display Input */}
//         <View className="w-40 mb-4">
//           <View className="border border-indigo-500 rounded-xl py-3 px-2 bg-white shadow-md">
//             <Text className="text-center text-2xl font-semibold text-gray-800">
//               {input || "Answer"}
//             </Text>
//           </View>
//         </View>

//         {/* Number Pad */}
//         <View className="w-full px-4">
//           {KEYS.map((row, rowIndex) => (
//             <View key={rowIndex} className="flex-row justify-around mb-3">
//               {row.map((key) => (
//                 <Pressable
//                   key={key}
//                   onPress={() => handleKeyPress(key)}
//                   className="w-16 h-16 bg-indigo-200 rounded-full justify-center items-center">
//                   <Text className="text-2xl font-bold text-indigo-800">{key}</Text>
//                 </Pressable>
//               ))}
//             </View>
//           ))}
//         </View>

//         {/* Submit */}
//         <Pressable
//           onPress={handleAnswer}
//           className="mt-4 bg-indigo-600 px-6 py-3 rounded-xl">
//           <Text className="text-white font-semibold text-lg">Submit</Text>
//         </Pressable>
//       </View>

//       {/* Game Over Modal */}
//       <Modal transparent visible={gameOver} animationType="fade">
//         <View className="flex-1 justify-center items-center bg-black bg-opacity-80">
//           <View className="bg-white p-6 rounded-xl items-center w-4/5">
//             {newHigh ? (
//               <>
//                 <LottieView
//                   ref={animationRef}
//                   source={require("../../../assets/animations/winner.json")}
//                   autoPlay
//                   loop
//                   style={{ width: 200, height: 200 }}
//                 />
//                 <Text className="mt-4 text-xl font-bold text-green-700">
//                   New High Score: {score}!
//                 </Text>
//               </>
//             ) : (
//               <Text className="text-lg text-gray-800 mb-2 font-semibold">
//                 Game Over. Your Score: {score}
//               </Text>
//             )}

//             <View className="flex-row gap-4 mt-6">
//               <Pressable
//                 onPress={resetGame}
//                 className="bg-indigo-600 px-4 py-2 rounded-lg">
//                 <Text className="text-white font-medium">Retry</Text>
//               </Pressable>
//               <Pressable
//                 onPress={() => {
//                   setGameOver(false);
//                   setScore(0);
//                   setTimeLeft(30);
//                 }}
//                 className="bg-gray-400 px-4 py-2 rounded-lg">
//                 <Text className="text-white font-medium">Back</Text>
//               </Pressable>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }
