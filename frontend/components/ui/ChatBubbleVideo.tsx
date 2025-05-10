import { Video, ResizeMode } from "expo-av";
import { useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const ChatBubbleVideo = ({ video }: { video: string }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      // @ts-ignore
      await videoRef.current?.pauseAsync(); // Pause the video
    } else {
      setIsPlaying(true);
      // @ts-ignore
      await videoRef.current?.playAsync(); // Play the video
    }
  };

  return (
    <View className="w-full h-64 rounded-xl overflow-hidden bg-transparent relative">
      <Video
        ref={videoRef}
        source={{ uri: video }}
        style={{ width: "100%", height: "100%" }}
        resizeMode={ResizeMode.COVER}  // Ensures video fills container properly
        useNativeControls={false} // Disable default controls
        shouldPlay={isPlaying} // Use state to control play/pause
        isMuted={false}
      />

      {/* Play/Pause button */}
      <TouchableOpacity
        className="absolute inset-0 justify-center items-center"
        onPress={handlePlayPause}
        activeOpacity={0.7}
      >
        <View className="flex justify-center items-center bg-black/60 p-4 rounded-full">
          <AntDesign
            name={isPlaying ? "pause" : "play"} // Toggle between play and pause icons
            size={40}
            color="#fff"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChatBubbleVideo;
