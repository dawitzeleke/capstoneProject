import { View, TextInput, FlatList, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import ChatBubble from "../../../components/ChatBubble";

interface Message {
  id: string;
  message: string;
  sender: string;
  avatar: string;
}

const messages: Message[] = [
  {
    id: "1",
    message:
      "Student Tamiru has taken the lead of Rank #1 doing a total of 200 questions this month. Congratulations Tamiru! We are grateful to have such a valuable and energetic student!",
    sender: "FunIQ Team",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    message:
      "Take part in my latest contest, where I have provided 40 biology questions ranging from grade 11 - grade 12. Test yourselves! Here is the link: http://100linktocontest",
    sender: "Birhanu Temesgen",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: "3",
    message:
      "Student Tamiru has taken the lead of Rank #1 doing a total of 200 questions this month. Congratulations Tamiru! We are grateful to have such a valuable and energetic student!",
    sender: "FunIQ Team",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "4",
    message:
      "Take part in my latest contest, where I have provided 40 biology questions ranging from grade 11 - grade 12. Test yourselves! Here is the link: http://100linktocontest",
    sender: "Birhanu Temesgen",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
];

const Home: React.FC = () => {
  return (
    <View className="flex-1 bg-primary">
      {/* Search Bar */}
      <View className="flex-row items-center justify-end p-1 rounded-full mx-4 mt-6">
        <TouchableOpacity
          className="p-4 bg-gray-700 rounded-full"
          onPress={() => router.push("/student/SearchScreen")}>
          <AntDesign name="search1" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble
            message={item.message}
            sender={item.sender}
            avatar={item.avatar}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }} // Ensures space at the bottom
      />
    </View>
  );
};

export default Home;
