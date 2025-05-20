import React, { useRef, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Pressable, Animated } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { useWindowDimensions } from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  AntDesign,
  Feather,
} from "@expo/vector-icons";
import { useSelector,useDispatch } from "react-redux";
import { setDisplayOption } from "@/redux/optionReducer/optionActions";

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
  isLike?: boolean;
  onDoubleTap?: () => void;
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
  isLike = false,
  onDoubleTap,
}) => {
  const videoRef = useRef<Video>(null);
  const { width, height } = useWindowDimensions();
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(isLike);
  const [saved, setSaved] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const dispatch = useDispatch();
  
  const handleOpenOption = () => {
    dispatch(setDisplayOption());
  };

  useEffect(() => {
    if (isVisible && videoRef.current && !isPaused) {
      videoRef.current.playAsync();
    } else if (!isVisible && videoRef.current) {
      videoRef.current.pauseAsync();
    }
  }, [isVisible, isPaused]);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPaused) {
        await videoRef.current.playAsync();
      } else {
        await videoRef.current.pauseAsync();
      }
      setIsPaused(!isPaused);
    }
  };

  const toggleMute = async () => {
    try {
      if (videoRef.current) {
        const newMuteState = !isMuted;
        await videoRef.current.setIsMutedAsync(newMuteState);
        setIsMuted(newMuteState);
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsMuted(status.isMuted);
    }
  };

  const animateHeart = () => {
    // Reset animations
    heartScale.setValue(0);
    heartOpacity.setValue(1);

    // Animate heart
    Animated.parallel([
      Animated.spring(heartScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.sequence([
        Animated.timing(heartOpacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(heartOpacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const formatCount = (num: number) => {
    if (num >= 1_000_000) return `+${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `+${(num / 1_000).toFixed(1)}k`;
    return `+${num}`;
  };

  return (
    <View className="relative w-full h-full bg-black mt-3">
      {/* Video Container */}
      <View className="flex-1 relative">
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isVisible && !isPaused}
          isLooping
          useNativeControls={false}
          isMuted={isMuted}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
        
        {/* Play/Pause Overlay */}
        <TouchableOpacity 
          activeOpacity={1}
          onPress={handlePlayPause}
          className="absolute inset-0 z-10"
        >
          {isPaused && (
            <View className="flex-1 justify-center items-center bg-black/30">
              <AntDesign name="play" size={50} color="white" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Mute Button */}
      <TouchableOpacity
        onPress={toggleMute}
        className="absolute top-4 mt-5 right-4 bg-black/50 p-2 rounded-full z-20">
        <Ionicons
          name={isMuted ? "volume-mute" : "volume-high"}
          size={20}
          color="white"
        />
      </TouchableOpacity>

      {/* Animated Heart Overlay */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: heartOpacity,
          transform: [{ scale: heartScale }],
        }}>
        <AntDesign name="heart" size={100} color="white" />
      </Animated.View>

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
      <View className="absolute right-2 bottom-20 bg-black/60 py-2 w-10 flex flex-col justify-center items-center rounded-full z-20">
        {/* Like */}
        <TouchableOpacity 
          className="mb-4" 
          onPress={() => {
            if (!liked) {
              animateHeart();
            }
            setLiked(!liked);
            onDoubleTap?.();
          }}>
          <AntDesign
            name={liked ? "heart" : "hearto"}
            size={26}
            color={liked ? "red" : "white"}
          />
          <Text
            className={`text-xs text-center text-white font-pmedium ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
            {likes || formatCount(liked ? 1201 : 1200)}
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
            className={`text-xs text-center text-white  font-pmedium ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
            {formatCount(saved ? 800 : 799)}
          </Text>
        </TouchableOpacity>

        {/* More Options */}
        <TouchableOpacity onPress={handleOpenOption}>
          <Feather name="more-vertical" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VideoCard;
