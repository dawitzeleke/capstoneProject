import React from 'react';
import { 
  View, 
  Pressable, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  useWindowDimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type HeaderButton = {
  icon?: keyof typeof Ionicons.glyphMap;
  component?: React.ReactNode;
  onPress: () => void;
  side: 'left' | 'right';
};

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  backIconColor?: string;
  titleColor?: string;
  buttons?: HeaderButton[];
  customTitleComponent?: React.ReactNode;
  gap?: number;
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
}: AppHeaderProps) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width <= 320;

  const renderButton = (button: HeaderButton) => (
    <Pressable
      key={`${button.side}-${button.icon}`}
      onPress={button.onPress}
      style={({ pressed }) => [
        styles.buttonBase,
        pressed && styles.pressedButton,
      ]}
      android_ripple={{ color: '#e0e7ff', borderless: true }}
    >
      {button.component || (
        <Ionicons
          name={button.icon!}
          size={isSmallScreen ? 20 : 24}
          color={backIconColor}
          style={styles.buttonIcon}
        />
      )}
    </Pressable>
  );

  return (
    <View style={[styles.headerContainer, headerStyle]}>
      {/* Left Section */}
      <View style={[styles.leftContainer, { gap }]}>
        {showBackButton && onBack && (
          renderButton({
            icon: 'arrow-back',
            onPress: onBack,
            side: 'left',
          })
        )}
        
        {customTitleComponent || (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.titleText,
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
        
        {buttons?.filter(b => b.side === 'left').map(renderButton)}
      </View>

      {/* Right Section */}
      <View style={styles.rightContainer}>
        {buttons?.filter(b => b.side === 'right').map(renderButton)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 12,
  },
  titleText: {
    fontWeight: '600',
    maxWidth: '80%',
    includeFontPadding: false,
    marginTop: 2, // Fine-tune vertical alignment
  },
  buttonBase: {
    padding: 6,
    borderRadius: 6,
    overflow: 'hidden',
  },
  pressedButton: {
    opacity: 0.8,
  },
  buttonIcon: {
    marginHorizontal: 2,
  },
});

export default AppHeader;