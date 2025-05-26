import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useWindowDimensions } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

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

  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.playAsync();
    } else if (!isVisible && videoRef.current) {
      videoRef.current.pauseAsync();
    }
  }, [isVisible]);

  return (
    <View className="relative w-full h-full bg-black">
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
        <Text className="text-white text-xs font-psemibold">Reels</Text>
      </View>

      {/* Profile + Caption */}
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
        <Text className="text-white font-pregular text-sm w-26">{description}</Text>
      </View>

      {/* Actions (Like, Comment, More) */}
      <View className="absolute bottom-10 right-4 items-center space-y-5">
        <TouchableOpacity className="items-center mb-2">
          <Ionicons name="heart" size={28} color="white" />
          <Text className="text-white text-sm">{likes || "0"}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center mb-2">
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={28}
            color="white"
          />
          <Text className="text-white font-pregular text-sm">Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Feather name="more-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VideoCard;
