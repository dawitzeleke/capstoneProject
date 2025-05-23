import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'indigo' | 'emerald' | 'rose' | 'amber';
}

const iconColors: Record<string, string> = {
  indigo: '#4F46E5',
  emerald: '#10B981',
  rose: '#F43F5E',
  amber: '#F59E0B',
};

const backgroundColors: Record<string, string> = {
  indigo: '#E0E7FF',  
  emerald: '#ECFDF5', 
  rose: '#FFF1F2',    
  amber: '#FFFBEB',   
};

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, color }) => {
  const { width: screenWidth } = useWindowDimensions();
  const columns = screenWidth > 1024 ? 4 : screenWidth > 600 ? 2 : 1;
  const paddingHorizontal = 32;
  const gap = 16;
  const cardWidth = (screenWidth - paddingHorizontal - gap * (columns - 1)) / columns;

  return (
    <View
      className="flex-row items-center p-4 rounded-2xl shadow-md mb-4"
      style={{
        width: cardWidth,
        marginRight: gap,
        marginBottom: gap,
        backgroundColor: backgroundColors[color],
      }}
    >
      <View
        className="w-12 h-12 rounded-xl items-center justify-center mr-4"
        style={{ backgroundColor: iconColors[color] }}
      >
        <Ionicons name={icon as any} size={28} color="#ffffff" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-slate-700">{title}</Text>
        <Text className="text-2xl font-bold text-slate-900 mt-1">{value}</Text>
      </View>
    </View>
  );
};