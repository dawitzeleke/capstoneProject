import { View, Text, Image } from "react-native";
import ChatBubbleVideo from "./ui/ChatBubbleVideo";
import { useSelector } from "react-redux";

interface ChatBubbleProps {
  message: string;
  sender: string;
  avatar: string;
  time?: string;
  image?: string;
  video?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  sender,
  avatar,
  time = "2h ago",
  image,
  video,
}) => {
  const currentTheme = useSelector((state: any) => state.theme.mode);

  return (
    <View
      className={`flex-col items-start my-2 py-3 px-3 border-l-2 ${
        currentTheme === "dark" ? "border-neutral-700" : "border-gray-200"
      }`}
    >
      {/* Bubble container */}
      <View
        className={`p-4 my-3 rounded-2xl w-full shadow-xl border ${
          currentTheme === "dark"
            ? "bg-neutral-800 border-neutral-700"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        {/* Optional Image */}
        {image && (
          <Image
            source={{ uri: image }}
            className="w-full h-48 rounded-xl mb-3"
            resizeMode="cover"
          />
        )}

        {/* Optional Video */}
        {video && (
          <View className="w-full h-52 rounded-xl overflow-hidden mb-3">
            <ChatBubbleVideo video={video} />
          </View>
        )}

        {/* Message text */}
        <Text
          className={`font-plight text-base ${
            currentTheme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
        >
          {message}
        </Text>

        {/* Timestamp */}
        <Text
          className={`text-xs font-pregular text-right mt-2 ${
            currentTheme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {time}
        </Text>
      </View>

      {/* Sender row */}
      <View className="w-full flex-row items-center mt-1">
        <Image source={{ uri: avatar }} className="w-10 h-10 rounded-full" />
        <Text
          className={`mx-4 text-lg font-pregular ${
            currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {sender}
        </Text>
      </View>
    </View>
  );
};

export default ChatBubble;
