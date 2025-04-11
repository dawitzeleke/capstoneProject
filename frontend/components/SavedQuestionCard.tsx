import { View, Text, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { FC } from 'react';

interface SavedQuestionCardProps {
  subject: string;
  question: string;
  author: string;
}

export const SavedQuestionCard: FC<SavedQuestionCardProps> = ({
  subject,
  question,
  author,
}) => {
  return (
    <View className="bg-card p-6 rounded-xl mb-4 relative">
      <TouchableOpacity className="absolute right-4 top-4">
        <Entypo name="dots-three-vertical" size={16} color="gray" />
      </TouchableOpacity>
      <Text className="text-xl text-gray-300 font-pbold mb-1">{subject}</Text>
      <Text className="text-lg font-pregular text-gray-400 mb-2">{question}</Text>
      <Text className="text-lg text-gray-400 font-pthin">By {author}</Text>
    </View>
  );
};
