import React from 'react';
import {
  View,
  Pressable,
  Text,
  ViewStyle,
  TextStyle,
  useWindowDimensions,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import useRouter
import ResetFormButton from './ResetFormButton';

type HeaderButton = {
  icon?: keyof typeof Ionicons.glyphMap;
  component?: React.ReactNode;
  onPress: () => void;
  side: 'left' | 'right';
  key?: string;
};

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  backIconColor?: string;
  titleColor?: string;
  buttons?: HeaderButton[]; // Add buttons prop back
  customTitleComponent?: React.ReactNode;
  gap?: number;
  onReset?: () => void;
  showResetButton?: boolean;
  right?: React.ReactNode;
}

const AppHeader = ({
  title,
  onBack,
  showBackButton = true,
  headerStyle,
  titleStyle,
  backIconColor = '#4F46E5',
  titleColor = '#1e293b',
  buttons, 
  customTitleComponent,
  gap = 12,
  onReset,
  showResetButton = false,
  right,
}: AppHeaderProps) => {
  const { width } = useWindowDimensions();
  const router = useRouter(); // Initialize useRouter
  const isSmallScreen = width <= 320;

  const renderButton = (button: HeaderButton) => (
    <Pressable
      key={('key' in button && button.key) ? button.key : `${button.side}-${button.icon}`}
      onPress={button.onPress}
      className="p-1.5 rounded-lg active:opacity-80"
      android_ripple={{ color: '#e0e7ff', borderless: true }}
    >
      {button.component || (
        <Ionicons
          name={button.icon!}
          size={isSmallScreen ? 20 : 24}
          color={backIconColor}
          className="mx-0.5"
        />
      )}
    </Pressable>
  );

  return (
    <View className="flex-row items-center justify-between py-3 px-4 bg-white" style={headerStyle}>
      {/* Left Section */}
      <View className="flex-1 flex-row items-center flex-shrink" style={{ gap }}>
        {showBackButton && onBack && (
          <TouchableOpacity onPress={onBack} style={{ marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color="#334155" />
          </TouchableOpacity>
        )}

        {customTitleComponent || (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="font-psemibold max-w-[80%] mt-0.5"
            style={[
              {
                color: titleColor,
                fontSize: isSmallScreen ? 18 : 20,
                lineHeight: isSmallScreen ? 24 : 28,
              },
              titleStyle,
            ]}
          >
            {title}
          </Text>
        )}

      </View>

      {/* Right Section */}
      <View className="flex-row items-center gap-2 ml-3">
        {showResetButton && onReset && (
          <ResetFormButton
            onResetConfirm={onReset}
            isVisible={false}
          />
        )}
        {buttons?.filter(b => b.side === 'right').map(renderButton)}
        {right && (
          <View style={{ marginLeft: 8 }}>{right}</View>
        )}
      </View>
    </View>
  );
};

export default AppHeader;
