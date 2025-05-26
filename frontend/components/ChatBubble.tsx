import { View, Text, Image, Pressable } from "react-native";
import ChatBubbleVideo from "./ui/ChatBubbleVideo";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

interface ChatBubbleProps {
  message: string;
  sender: string;
  avatar: string;
  time?: string;
  image?: string;
  video?: string;
  onOptionsPress?: () => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  sender,
  avatar,
  time = "2h ago",
  image,
  video,
  onOptionsPress,
}) => {
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const isDark = currentTheme === "dark";

  return (
    <View className="px-4 py-2">
      {/* Sender row */}
      <View className="flex-row items-center mb-2">
        <Image source={{ uri: avatar }} className="w-10 h-10 rounded-full" />
        <View className="ml-3 flex-1">
          <Text className={`text-base font-psemibold ${isDark ? "text-white" : "text-gray-900"}`}>
            {sender}
          </Text>
          <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {time}
          </Text>
        </View>
        <Pressable className="p-2" onPress={onOptionsPress}>
          <Ionicons 
            name="ellipsis-horizontal" 
            size={20} 
            color={isDark ? "#e5e5e5" : "#64748b"} 
          />
        </Pressable>
      </View>

      {/* Content container */}
      <View className="ml-13">
        {/* Message text */}
        <Text className={`text-base leading-6 mb-3 ${isDark ? "text-gray-100" : "text-gray-800"}`}>
          {message}
        </Text>

        {/* Optional Image */}
        {image && (
          <Image
            source={{ uri: image }}
            className="w-full h-64 rounded-2xl mb-3"
            resizeMode="cover"
          />
        )}

        {/* Optional Video */}
        {video && (
          <View className="w-full h-64 rounded-2xl overflow-hidden mb-3">
            <ChatBubbleVideo video={video} />
          </View>
        )}
      </View>
    </View>
  );
};

export default ChatBubble;
