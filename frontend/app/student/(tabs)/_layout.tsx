import React from "react";
import {
  View,
  Image,
  ImageSourcePropType,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import icons from "../../../constants/icons";
import LoadingOverlay from "../../../components/AnimationOverlay";

interface TabIconProps {
  icon?: ImageSourcePropType;
  color: string;
  focused: boolean;
  name: string;
  size?: object;
  isProfile?: boolean;
  profileImage?: ImageSourcePropType;
  testID?: string;
}

const TabIcon: React.FC<TabIconProps> = ({
  name,
  icon,
  color,
  size,
  focused,
  isProfile = false,
  profileImage,
  testID,
}) => {
  return (
    <View className="items-center justify-center gap-1" testID={testID}>
      {isProfile && profileImage ? (
        <View
          className={`w-6 h-6 rounded-full items-center justify-center overflow-hidden 
            ${focused ? "border-2" : "border-0"}`}
          style={{ borderColor: focused ? color : "transparent" }}
        >
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
        className="font-psemibold text-xs w-20 text-center"
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const CustomTabButton = (props: any) => (
  <TouchableWithoutFeedback onPress={props.onPress}>
    <View style={{ flex: 1 }}>{props.children}</View>
  </TouchableWithoutFeedback>
);

const TabsLayout: React.FC = () => {
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const isDark = currentTheme === "dark";
  const loading = useSelector((state: any) => state.animation.loading);

  return (
    <>
      <StatusBar
        backgroundColor={isDark ? "#161622" : "#ffffff"}
        style={isDark ? "light" : "dark"}
      />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarActiveTintColor: isDark ? "#00FFFF" : "#4F46E5",
          tabBarInactiveTintColor: isDark ? "#aaa" : "#777",
          tabBarStyle: {
            backgroundColor: isDark ? "#000000" : "#f1f3fc",
            borderTopWidth: 0,
            height: 64,
            display: "flex",
            justifyContent: "center",
            position: 'absolute',
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarItemStyle: {
            marginTop: 15,
            display: "flex",
            width: 30,
            alignItems: "center",
          },
          tabBarHideOnKeyboard: true,
          tabBarVisibilityAnimationConfig: {
            show: {
              animation: 'timing',
              config: {
                duration: 200,
              },
            },
            hide: {
              animation: 'timing',
              config: {
                duration: 200,
              },
            },
          },
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                size={{ width: 18, height: 18 }}
                name="Home"
                focused={focused}
                testID="tab-home"
              />
            ),
            tabBarButton: (props) => (
              <CustomTabButton {...props} />
            ),
          }}
        />
        <Tabs.Screen   
          name="Questions"
          options={{
            title: "Question",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.edit}
                color={color}
                size={{ width: 18, height: 18 }}
                name="Question"
                focused={focused}
                testID="tab-questions"
              />
            ),
            tabBarButton: (props) => (
              <CustomTabButton {...props} />
            ),
          }}
        />
        <Tabs.Screen
          name="Facts"
          options={{
            title: "Facts",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.earth}
                color={color}
                size={{ width: 18, height: 18 }}
                name="Facts"
                focused={focused}
                testID="tab-facts"
              />
            ),
            tabBarButton: (props) => (
              <CustomTabButton {...props} />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.account}
                color={color}
                size={{ width: 18, height: 18 }}
                name="Profile"
                focused={focused}
                testID="tab-facts"
              />
            ),
            tabBarButton: (props) => (
              <CustomTabButton {...props} />
            ),
          }}
        />
       

        {/* Screens not visible in tab bar */}
        <Tabs.Screen name="Leaderboard" options={{ href: null }} />
        <Tabs.Screen name="Blog" options={{ href: null }} />
        <Tabs.Screen name="Game" options={{ href: null }} />
        <Tabs.Screen name="Notification" options={{ href: null }} />
        <Tabs.Screen name="CreateExam" options={{ href: null }} />
        <Tabs.Screen name="Exam" options={{ href: null }} />
        <Tabs.Screen name="Progress" options={{ href: null }} />
        <Tabs.Screen name="SearchScreen" options={{ href: null }} />
        <Tabs.Screen name="FollowingList" options={{ href: null }} />
        <Tabs.Screen name="EditProfileScreen" options={{ href: null }} />
        <Tabs.Screen name="SavedQuestions" options={{ href: null }} />
        <Tabs.Screen name="TeacherDetail" options={{ href: null }} />
        <Tabs.Screen name="Activity" options={{ href: null }} />
        <Tabs.Screen name="QuestionsDone" options={{ href: null }} />
        <Tabs.Screen name="Settings" options={{ href: null }} />
      </Tabs>

      {loading && <LoadingOverlay />}
    </>
  );
};

export default TabsLayout;
