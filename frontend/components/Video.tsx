import React, { useRef, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";

interface VideoReelProps {
  videoUrl: string;
}

const VideoReel: React.FC<VideoReelProps> = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const currentTheme = useSelector((state: any) => state.theme.mode);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <View className="w-full h-[300px] rounded-2xl overflow-hidden mb-4 relative">
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={{ width: "100%", height: "100%" }}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
        isMuted={isMuted}
      />
      <TouchableOpacity
        onPress={toggleMute}
        className="absolute top-2 right-2 bg-black/40 p-2 rounded-full">
        <Feather
          name={isMuted ? "volume-x" : "volume-2"}
          size={20}
          color={currentTheme === "dark" ? "white" : "white"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default VideoReel;
