  import React from "react";
  import { View, Image, ImageSourcePropType, Text } from "react-native";
  import { Tabs } from "expo-router";
  import icons from "../../../constants/icons"

  // Define props for the TabIcon component
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
            className={`w-9 h-9 rounded-full items-center justify-center overflow-hidden 
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
          className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
          style={{ color: color }}>
          {name}
        </Text>
      </View>
    );
  };

  const TabsLayout: React.FC = () => {
    return (
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false, 
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveBackgroundColor: "CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
            display: "flex",
            justifyContent: "center",
          },
          tabBarItemStyle: {
            marginTop:20,
            display:"flex",
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
                size={{ width: 28, height: 28 }}
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
                size={{ width: 28, height: 28 }}
                name="Questions"
                focused={focused}
              />
            ),
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
                size={{ width: 28, height: 28 }}
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
    );
  };

  export default TabsLayout;
