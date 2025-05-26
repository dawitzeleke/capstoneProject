import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface DashboardButtonProps {
  href: string;
  icon: string;
  label: string;
  color: string;
  textColor: string;
  isVerySmallScreen: boolean;
}

const DashboardButton = ({ href, icon, label, color, textColor, isVerySmallScreen }: DashboardButtonProps) => {
  return (
    <Link href={href} asChild>
      <TouchableOpacity className={`flex-1 ${color} p-3 rounded-2xl shadow-lg min-h-[90px]`}>
        <View className="flex-1 justify-between h-full">
          <View className="items-end">
            <Ionicons
              name={icon}
              size={isVerySmallScreen ? 18 : 20}
              color={textColor === 'text-white' ? 'white' : '#4F46E5'}
            />
          </View>
          <Text
            className={`${textColor} font-psemibold`}
            style={{
              fontSize: isVerySmallScreen ? 12 : 14,
              lineHeight: isVerySmallScreen ? 16 : 18
            }}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
          >
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default DashboardButton;