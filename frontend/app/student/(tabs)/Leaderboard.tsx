// Leaderboard.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator, Dimensions, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as signalR from "@microsoft/signalr";
import { useSelector } from "react-redux";
import httpRequest from "@/util/httpRequest";
import { getUserData } from "@/scripts/storage";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get('window');

type StudentRank = {
  id: string;
  name: string;
  score: number;
  trend: "up" | "down";
  avatar: string;
  division: string;
  username: string;
  rank?: number;
};

const Leaderboard = () => {
  const isDark = useSelector((state: any) => state.theme.mode === "dark");
  const [leaderboardData, setLeaderboardData] = useState<StudentRank[]>([]);
  const [userRank, setUserRank] = useState<StudentRank>({
    id: "",
    name: "You",
    score: 0,
    trend: "up",
    avatar: "",
    division: "Bronze",
    username: "",
    rank: 0,
  });
  const [loading, setLoading] = useState(true);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const fetchRankings = async () => {
    // To avoid a jarring refresh, we won't set loading to true
    // if the leaderboard data already exists.
    if (leaderboardData.length === 0) {
      setLoading(true);
    }

    try {
      const userData = await getUserData();
      if (!userData?.token) throw new Error("Missing auth token");

      const [topThreeRes, restRes] = await Promise.all([
        httpRequest("/students/rank", {}, "GET", userData.token),
        httpRequest("/students/leader-students", {}, "GET", userData.token),
      ]);

      console.log(topThreeRes.data, restRes.data)

      const topData = Array.isArray(topThreeRes?.data)
        ? topThreeRes.data
        : [];
      const restData = Array.isArray(restRes?.data)
        ? restRes.data
        : [];

      const all: StudentRank[] = [
        ...topData.map((s: any, i: number) => ({
          id: s.id,
          name: s.name ?? (((s.firstName || '') + ' ' + (s.lastName || '')).trim() || s.userName || 'Unknown User'),
          score: s.totalPoints ?? s.score ?? 0,
          trend: s.trend ?? "up",
          avatar: s.avatar ?? s.profilePictureUrl ?? "",
          division: s.division ?? "Beginner",
          username: s.userName ?? (s.name?.toLowerCase().replace(" ", "") ?? ""),
          rank: i + 1,
        })),
        ...restData.map((s: any, i: number) => ({
          id: s.id,
          name: s.name ?? (((s.firstName || '') + ' ' + (s.lastName || '')).trim() || s.userName || 'Unknown User'),
          score: s.totalPoints ?? s.score ?? 0,
          trend: s.trend ?? "up",
          avatar: s.avatar ?? s.profilePictureUrl ?? "",
          division: s.division ?? "Beginner",
          username: s.userName ?? (s.name?.toLowerCase().replace(" ", "") ?? ""),
          rank: i + 4,
        })),
      ];

      // <--- MODIFICATION 1: LOG THE PROCESSED DATA
      // This will log the final data structure right before it's set to state.
      // JSON.stringify makes the object readable in the console.
      console.log("--- Fetched and Processed Leaderboard Data ---");
      console.log(JSON.stringify(all, null, 2));
      // <--- END MODIFICATION 1

      setLeaderboardData(all);

      // Always set user rank based on the leaderboardData array
      const userIndex = all.findIndex((s) => s.id === userData.id);
      if (userIndex !== -1) {
        setUserRank({ ...all[userIndex], rank: userIndex + 1 });
      }
    } catch (err) {
      console.error("fetchRankings error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();

    const setupSignalR = async () => {
      try {
        const userData = await getUserData();
        if (!userData?.token) {
          console.log("No auth token available for SignalR");
          return;
        }

        if (connectionRef.current) {
          await connectionRef.current.stop();
        }

        const conn = new signalR.HubConnectionBuilder()
          .withUrl("https://cognify-d5we.onrender.com/hubs/leaderboard", {
            accessTokenFactory: () => userData.token,
            withCredentials: true,
            skipNegotiation: false,
            transport: signalR.HttpTransportType.WebSockets,
          })
          .withAutomaticReconnect([0, 2000, 10000, 30000])
          .configureLogging(signalR.LogLevel.Warning)
          .build();

        conn.onreconnecting((error) => console.log("SignalR reconnecting...", error?.message || ""));
        conn.onreconnected((connectionId) => console.log("SignalR reconnected with ID:", connectionId));
        conn.onclose((error) => console.error("SignalR connection closed", error?.message || ""));

        // <--- MODIFICATION 2: LOG THE DATA FROM THE SOCKET EVENT
        // We add `...args` to capture any data sent with the event.
        conn.on("LeaderboardUpdated", (...args) => {
          console.log("✅ 'LeaderboardUpdated' event received from socket!");
          
          // This will log any arguments the server sends with the event.
          // If the server sends no data, this will log an empty array: []
          console.log("Data received directly from socket:", args);
          
          // Now, we call fetchRankings to get the updated data as per the original logic.
          fetchRankings();
        });
        // <--- END MODIFICATION 2

        connectionRef.current = conn;
        
        const startPromise = conn.start();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Connection timeout")), 10000)
        );
        
        await Promise.race([startPromise, timeoutPromise]);
        console.log("✅ SignalR connected successfully");
        
      } catch (err) {
        console.error("SignalR setup error:", err);
      }
    };

    setupSignalR();

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop().catch(err => 
          console.log("Error stopping SignalR connection:", err)
        );
      }
    };
  }, []);

  const getDivisionColor = (division: string): readonly [string, string] => {
    switch (division.toLowerCase()) {
      case "gold": return ["#FFD700", "#FFA500"];
      case "silver": return ["#C0C0C0", "#A0A0A0"];
      case "bronze": return ["#CD7F32", "#B8860B"];
      case "platinum": return ["#E5E4E2", "#BCC6CC"];
      default: return ["#6B7280", "#4B5563"];
    }
  };

  const getRankBadge = (rank: number): { emoji: string; color: readonly [string, string] } => {
    if (rank === 1) return { emoji: "🥇", color: ["#FFD700", "#FFA500"] };
    if (rank === 2) return { emoji: "🥈", color: ["#E5E4E2", "#C0C0C0"] };
    if (rank === 3) return { emoji: "🥉", color: ["#DAA520", "#B8860B"] };
    return { emoji: `#${rank}`, color: ["#6B7280", "#4B5563"] };
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: isDark ? "#000000" : "#f1f3fc" }}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ color: isDark ? "#ffffff" : "#111827", marginTop: 16, fontSize: 16, fontFamily: "Poppins-Medium" }}>
          Loading leaderboard...
        </Text>
      </SafeAreaView>
    );
  }

  // The rest of the file (the JSX for rendering) remains exactly the same.
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? "#000000" : "#f1f3fc" }}>
      <Animated.ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], paddingHorizontal: 24, paddingTop: 20, paddingBottom: 30 }}>
          <Text style={{ fontSize: 36, fontFamily: "Poppins-Bold", color: isDark ? "#ffffff" : "#111827", textAlign: "center", marginBottom: 8 }}>
            🏆 Leaderboard
          </Text>
          <Text style={{ fontSize: 16, color: isDark ? "rgba(255, 255, 255, 0.7)" : "#6B7280", textAlign: "center", fontFamily: "Poppins-Medium" }}>
            Beginner Division
          </Text>
        </Animated.View>

        {/* Top 3 Podium */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], paddingHorizontal: 20, marginBottom: 30, marginTop:30 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "flex-end", height: 280 }}>
            {/* Second Place */}
            <View style={{ alignItems: "center", flex: 1 }}>
              <LinearGradient colors={isDark ? ["#4F46E5", "#7C3AED"] : ["#4F46E5", "#6366F1"]} style={{ width: 80, height: 80, borderRadius: 40, justifyContent: "center", alignItems: "center", marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 }}>
                {leaderboardData[1]?.avatar ? (<Image source={{ uri: leaderboardData[1].avatar }} style={{ width: 70, height: 70, borderRadius: 35 }} />) : (<Ionicons name="person" size={40} color="#fff" />)}
              </LinearGradient>
              <LinearGradient colors={isDark ? ["#4F46E5", "#7C3AED"] : ["#4F46E5", "#6366F1"]} style={{ width: 60, height: 120, borderRadius: 12, justifyContent: "flex-end", alignItems: "center", paddingBottom: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 }}>
                <Text style={{ fontSize: 24, fontFamily: "Poppins-Bold", color: "#fff" }}>{getRankBadge(2).emoji}</Text>
              </LinearGradient>
              <Text style={{ fontSize: 16, fontFamily: "Poppins-Medium", color: isDark ? "#ffffff" : "#111827", marginTop: 12, textAlign: "center" }} numberOfLines={1}>
                {(() => {
                  const name = leaderboardData[1]?.name || "No data";
                  const parts = name.split(' ');
                  if (parts.length >= 2) {
                    return `${parts[0]} ${parts[1].charAt(0)}.`;
                  }
                  return name;
                })()}
              </Text>
              <Text style={{ fontSize: 14, color: isDark ? "rgba(255, 255, 255, 0.7)" : "#6B7280", fontFamily: "Poppins-Medium" }}>{leaderboardData[1]?.score || 0} pts</Text>
            </View>

            {/* First Place */}
            <View style={{ alignItems: "center", flex: 1 }}>
              <LinearGradient colors={isDark ? ["#4F46E5", "#7C3AED"] : ["#4F46E5", "#6366F1"]} style={{ width: 100, height: 100, borderRadius: 50, justifyContent: "center", alignItems: "center", marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 12 }}>
                {leaderboardData[0]?.avatar ? (<Image source={{ uri: leaderboardData[0].avatar }} style={{ width: 90, height: 90, borderRadius: 45 }} />) : (<Ionicons name="person" size={50} color="#fff" />)}
              </LinearGradient>
              <LinearGradient colors={isDark ? ["#4F46E5", "#7C3AED"] : ["#4F46E5", "#6366F1"]} style={{ width: 60, height: 160, borderRadius: 12, justifyContent: "flex-end", alignItems: "center", paddingBottom: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 12 }}>
                <Text style={{ fontSize: 28, fontFamily: "Poppins-Bold", color: "#fff" }}>{getRankBadge(1).emoji}</Text>
              </LinearGradient>
              <Text style={{ fontSize: 18, fontFamily: "Poppins-Bold", color: isDark ? "#ffffff" : "#111827", marginTop: 12, textAlign: "center" }} numberOfLines={1}>
                {(() => {
                  const name = leaderboardData[0]?.name || "No data";
                  const parts = name.split(' ');
                  if (parts.length >= 2) {
                    return `${parts[0]} ${parts[1].charAt(0)}.`;
                  }
                  return name;
                })()}
              </Text>
              <Text style={{ fontSize: 16, color: isDark ? "rgba(255, 255, 255, 0.8)" : "#6B7280", fontFamily: "Poppins-Medium" }}>{leaderboardData[0]?.score || 0} pts</Text>
            </View>

            {/* Third Place */}
            <View style={{ alignItems: "center", flex: 1 }}>
              <LinearGradient colors={isDark ? ["#4F46E5", "#7C3AED"] : ["#4F46E5", "#6366F1"]} style={{ width: 80, height: 80, borderRadius: 40, justifyContent: "center", alignItems: "center", marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 }}>
                {leaderboardData[2]?.avatar ? (<Image source={{ uri: leaderboardData[2].avatar }} style={{ width: 70, height: 70, borderRadius: 35 }} />) : (<Ionicons name="person" size={40} color="#fff" />)}
              </LinearGradient>
              <LinearGradient colors={isDark ? ["#4F46E5", "#7C3AED"] : ["#4F46E5", "#6366F1"]} style={{ width: 60, height: 80, borderRadius: 12, justifyContent: "flex-end", alignItems: "center", paddingBottom: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 }}>
                <Text style={{ fontSize: 24, fontFamily: "Poppins-Bold", color: "#fff" }}>{getRankBadge(3).emoji}</Text>
              </LinearGradient>
              <Text style={{ fontSize: 16, fontFamily: "Poppins-Medium", color: isDark ? "#ffffff" : "#111827", marginTop: 12, textAlign: "center" }} numberOfLines={1}>
                {(() => {
                  const name = leaderboardData[2]?.name || "No data";
                  const parts = name.split(' ');
                  if (parts.length >= 2) {
                    return `${parts[0]} ${parts[1].charAt(0)}.`;
                  }
                  return name;
                })()}
              </Text>
              <Text style={{ fontSize: 14, color: isDark ? "rgba(255, 255, 255, 0.7)" : "#6B7280", fontFamily: "Poppins-Medium" }}>{leaderboardData[2]?.score || 0} pts</Text>
            </View>
          </View>
        </Animated.View>

        {/* Current User Rank */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], marginHorizontal: 20, marginBottom: 30 }}>
          <View style={{ borderRadius: 20, padding: 20, backgroundColor: isDark ? "#1f2937" : "#ffffff", borderWidth: 1, borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#f3f4f6", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                {/* Avatar with initials and gradient if no avatar */}
                {userRank.avatar ? (
                  <Image source={{ uri: userRank.avatar }} style={{ width: 56, height: 56, borderRadius: 28, marginRight: 16 }} />
                ) : (
                  <LinearGradient colors={isDark ? ["#4F46E5", "#7C3AED"] : ["#4F46E5", "#6366F1"]} style={{ width: 56, height: 56, borderRadius: 28, marginRight: 16, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "#fff", fontFamily: "Poppins-Bold", fontSize: 18 }}>
                      {(() => {
                        const parts = userRank.name?.trim().split(" ") || [];
                        if (parts.length >= 2) {
                          return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
                        } else if (parts.length === 1) {
                          return `${parts[0][0] ?? ''}`.toUpperCase();
                        }
                        return "";
                      })()}
                    </Text>
                  </LinearGradient>
                )}
                <View style={{ flex: 1 }}>
                  {/* Name as FirstName L. */}
                  <Text style={{ fontSize: 18, fontFamily: "Poppins-Medium", color: isDark ? "#ffffff" : "#111827", marginBottom: 4 }}>
                    {(() => {
                      const parts = userRank.name?.trim().split(" ") || [];
                      if (parts.length >= 2) {
                        return `${parts[0]} ${parts[1][0] ?? ''}.`;
                      } else if (parts.length === 1) {
                        return parts[0];
                      }
                      return userRank.name;
                    })()}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: 14, color: isDark ? "rgba(255, 255, 255, 0.7)" : "#6B7280", fontFamily: "Poppins-Medium", marginRight: 8 }}>{userRank.division}</Text>
                    <Ionicons name={userRank.trend === "up" ? "trending-up" : "trending-down"} size={16} color={userRank.trend === "up" ? "#4ADE80" : "#F87171"}/>
                  </View>
                </View>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                {/* Rank number styled and visible */}
                <Text style={{ fontSize: 24, fontFamily: "Poppins-Bold", color: isDark ? "#6366F1" : "#4F46E5", marginBottom: 4 }}>#{userRank.rank}</Text>
                <Text style={{ fontSize: 16, fontFamily: "Poppins-Medium", color: isDark ? "rgba(255, 255, 255, 0.8)" : "#6B7280" }}>{userRank.score} pts</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Top 10 Individuals */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], paddingHorizontal: 20, marginTop: 30, marginBottom:40 }}>
          <Text style={{ fontSize: 20, fontFamily: "Poppins-Bold", color: isDark ? "#ffffff" : "#111827", marginBottom: 20, textAlign: "center" }}>Top 10 Individuals In Beginner Division</Text>
          {leaderboardData.slice(0, 10).map((student, index) => {
            // Format name: First name + first letter of last name
            let displayName = student.name;
            if (student.name) {
              const parts = student.name.trim().split(" ");
              if (parts.length >= 2) {
                displayName = `${parts[0]} ${parts[1][0] ?? ''}.`;
              } else {
                displayName = parts[0];
              }
            }
            // Get initials for avatar if no image
            let initials = "";
            if (student.name) {
              const parts = student.name.trim().split(" ");
              if (parts.length >= 2) {
                initials = `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
              } else if (parts.length === 1) {
                initials = `${parts[0][0] ?? ''}`.toUpperCase();
              }
            }
            return (
              <View key={`top10-${student.id}`} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, marginBottom: 12, borderRadius: 16, backgroundColor: isDark ? "#1f2937" : "#ffffff", borderWidth: 1, borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#f3f4f6", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
                <View  style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  <Text style={{ fontSize: 18, fontFamily: "Poppins-Bold", color: isDark ? "rgba(255, 255, 255, 0.7)" : "#6B7280", marginRight: 16, minWidth: 40 }}>#{index + 1}</Text>
                  {student.avatar ? (
                    <Image source={{ uri: student.avatar }} style={{ width: 56, height: 56, borderRadius: 21, marginRight: 16 }} />
                  ) : (
                    <LinearGradient colors={isDark ? ["#4F46E5", "#7C3AED"] : ["#4F46E5", "#6366F1"]} style={{ width: 56, height: 56, borderRadius: 21, marginRight: 16, justifyContent: "center", alignItems: "center" }}>
                      <Text className="font-psemibold color-white">{initials}</Text>
                    </LinearGradient>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontFamily: "Poppins-Medium", color: isDark ? "#ffffff" : "#111827", marginBottom: 2 }}>{displayName}</Text>
                    <Text style={{ fontSize: 12, color: isDark ? "rgba(255, 255, 255, 0.6)" : "#6B7280", fontFamily: "Poppins-Medium" }}>{student.division}</Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 18, fontFamily: "Poppins-Medium", color: isDark ? "#ffffff" : "#111827", marginBottom: 2 }}>{student.score} pts</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name={student.trend === "up" ? "trending-up" : "trending-down"} size={14} color={student.trend === "up" ? "#4ADE80" : "#F87171"}/>
                    <Text style={{ fontSize: 12, color: student.trend === "up" ? "#4ADE80" : "#F87171", marginLeft: 4, fontFamily: "Poppins-Medium" }}>{student.trend === "up" ? "Rising" : "Falling"}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default Leaderboard;