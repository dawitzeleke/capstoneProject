import { Pressable, Text, View } from "react-native";
import React from "react";
import { ContentStatus } from "@/types/questionTypes";
import { MediaStatus } from "@/types/mediaTypes";

type Tab = "all" | ContentStatus | MediaStatus;

interface TabSwitcherProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TabSwitcher = ({ activeTab, onTabChange }: TabSwitcherProps) => {
  return (
    <View className="flex-row m-4 bg-white rounded-lg p-1 shadow">
      {(["all", "posted", "draft"] as Tab[]).map((tab) => (
        <Pressable
          key={tab}
          className={`flex-1 py-2 rounded-md items-center ${
            activeTab === tab ? "bg-indigo-600" : ""
          }`}
          onPress={() => onTabChange(tab)}
        >
          <Text
            className={`${
              activeTab === tab ? "text-white" : "text-gray-500"
            } font-pmedium text-sm`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </Pressable>
      ))} 
    </View>
  );
};

export default TabSwitcher;