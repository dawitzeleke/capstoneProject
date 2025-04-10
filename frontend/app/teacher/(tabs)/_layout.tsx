import React from "react";
import { View, Image, ImageSourcePropType, Text } from "react-native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import icons from "../../../constants/icons";

interface TabIconProps {
  icon?: ImageSourcePropType;
  color: string;
  focused: boolean;
  name: string;
  size?: object;
  isProfile?: boolean;
  profileImage?: ImageSourcePropType;
}

const TabIcon: React.FC<TabIconProps> = ({
  name,
  icon,
  color,
  size,
  focused,
  isProfile = false,
  profileImage,
}) => {
  return (
    <View className="items-center justify-center gap-1">
      {isProfile && profileImage ? (
        <View
          className={`w-6 h-6 rounded-full items-center justify-center overflow-hidden 
            ${focused ? "border-2" : "border-0"} `}
          style={{ borderColor: focused ? color : "transparent" }}>
          <Image
            source={profileImage}
            style={{ width: "100%", height: "100%", borderRadius: 18 }}
          />
        </View>
      ) : (
        <Image
          source={icon}
          resizeMode="contain"
          tintColor={color}
          style={size}
        />
      )}
      <Text
        className={`font-psemibold text-xs`}
        style={{ color: color }}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout: React.FC = () => {
  return (
    <>
      <StatusBar backgroundColor="#161622" style="light" />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarActiveTintColor: "cyan",
          tabBarInactiveBackgroundColor: "CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 64,
            display: "flex",
            justifyContent: "center",
          },
          tabBarItemStyle: {
            marginTop: 15,
            display: "flex",
            alignItems: "center",
          },
        }}>
        <Tabs.Screen
          name="Home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                size={{ width: 18, height: 18 }}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Questions"
          options={{
            title: "Questions",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.pencil}
                color={color}
                size={{ width: 18, height: 18 }}
                name="Questions"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Leaderboard"
          options={{
            href: null, 
          }}
        />
        <Tabs.Screen
          name="Progress"
          options={{
            href: null, 
          }}
        />
        <Tabs.Screen
          name="SearchScreen"
          options={{
            href: null, 
          }}
        />
        <Tabs.Screen
          name="TeacherDetail"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="Activity"
          options={{
            href: null, 
          }}
        />
        <Tabs.Screen
          name="Notification"
          options={{
            title: "Notifications",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.notification}
                color={color}
                size={{ width: 18, height: 18 }}
                name="Notifications"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                isProfile
                profileImage={require("../../../assets/images/favicon.png")}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
