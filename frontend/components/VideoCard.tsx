import React, { useRef, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useWindowDimensions } from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  AntDesign,
  Feather,
} from "@expo/vector-icons";
import { useSelector } from "react-redux";

interface VideoCardProps {
  videoUrl: string;
  isVisible: boolean;
  _id: string;
  uri: string;
  ViewableItem: string;
  postProfile?: {
    username?: string;
    profileImage?: string;
  };
  title?: string;
  description?: string;
  likes?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  videoUrl,
  isVisible,
  _id,
  uri,
  ViewableItem,
  postProfile,
  title,
  description,
  likes,
}) => {
  const videoRef = useRef<Video>(null);
  const { width, height } = useWindowDimensions();
  const currentTheme = useSelector((state: any) => state.theme.mode);

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.playAsync();
    } else if (!isVisible && videoRef.current) {
      videoRef.current.pauseAsync();
    }
  }, [isVisible]);

  const formatCount = (num: number) => {
    if (num >= 1_000_000) return `+${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `+${(num / 1_000).toFixed(1)}k`;
    return `+${num}`;
  };

  return (
    <View className="relative w-full h-full bg-black mt-3">
      {/* Background Video */}
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={{ width: "100%", height: "100%" }}
        resizeMode={ResizeMode.COVER}
        shouldPlay={isVisible}
        isLooping
        useNativeControls={false}
      />

      {/* Reels Badge */}
      <View className="absolute top-4 left-4 mt-6 bg-black/50 px-3 py-1 rounded-full">
        <Text className="text-white text-base font-pregular">BrainBits</Text>
      </View>

      {/* Profile and Caption */}
      <View className="absolute bottom-10 left-4 right-20">
        <View className="flex-row items-center mb-2">
          <Image
            source={{
              uri:
                postProfile?.profileImage || "https://via.placeholder.com/40",
            }}
            className="w-10 h-10 rounded-full mr-2"
          />
          <View>
            <Text className="text-white font-psemibold">
              {postProfile?.username || "Anonymous"}
            </Text>
            <Text className="text-gray-300 text-sm">• Following</Text>
          </View>
        </View>
        <Text className="text-white font-psemibold">{title}</Text>
        <Text className="text-white font-pregular text-sm w-26">
          {description}
        </Text>
      </View>

      {/* Social Actions */}
      <View className="absolute w-12 right-6 top-2/3 transform -translate-y-5 items-center">
        {/* Like */}
        <TouchableOpacity className="mb-4" onPress={() => setLiked(!liked)}>
          <AntDesign
            name={liked ? "heart" : "hearto"}
            size={26}
            color={liked ? "red" : "white"}
          />
          <Text
            className={`text-xs text-center font-pmedium ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
            {formatCount(liked ? 1201 : 1200)}
          </Text>
        </TouchableOpacity>

        {/* Save */}
        <TouchableOpacity className="mb-4" onPress={() => setSaved(!saved)}>
          <Feather
            name="bookmark"
            size={26}
            color={saved ? "#ffd700" : "white"}
          />
          <Text
            className={`text-xs text-center font-pmedium ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
            {formatCount(saved ? 800 : 799)}
          </Text>
        </TouchableOpacity>

        {/* More Options */}
        <TouchableOpacity>
          <Feather name="more-vertical" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VideoCard;
