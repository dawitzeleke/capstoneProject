import { View, Text, Image } from "react-native";

interface ChatBubbleProps {
  message: string;
  sender: string;
  avatar: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, sender, avatar }) => {
  return (
    <View className="flex-column items-start my-2 border-l-2 border-gray-400 py-3 px-3">
      <View className=" bg-gray-300 mx-2" />
      <View className="bg-card p-4 my-3 rounded-2xl w-full">
        <Text className="text-white font-plight text-base">{message}</Text>
      </View>
      <View className="w-full flex-row items-center">
        <Image source={{ uri: avatar }} className="w-10 h-10 rounded-full" />
        <Text className="text-gray-300 mx-4 text-right text-lg font-pregular mt-2">
          {sender}
        </Text>
      </View>
    </View>
  );
};

export default ChatBubble;