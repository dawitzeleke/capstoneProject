import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { FC, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

type FieldType = 'text' | 'email' | 'password' | 'phone';

interface FieldProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label: string;
  type?: FieldType;
}

export const Field: FC<FieldProps> = ({
  label,
  type = 'text',
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  const isPassword = type === 'password';
  const keyboardType =
    type === 'email' ? 'email-address' :
    type === 'phone' ? 'phone-pad' :
    'default';

  return (
    <View>
      <Text className="text-sm text-gray-200 font-pregular mb-1">{label}</Text>
      <View className={`flex-row items-center bg-card rounded-xl px-4 ${isPassword ? 'pr-2' : ''}`}>
        <TextInput
          className="flex-1 py-3 text-sm font-pregular text-gray-200"
          placeholderTextColor="#999"
          keyboardType={keyboardType}
          secureTextEntry={isPassword && !visible}
          {...props}
        />  
        {isPassword && (
          <TouchableOpacity onPress={() => setVisible(!visible)}>
            <MaterialIcons
              name={visible ? 'visibility' : 'visibility-off'}
              size={20}
              color="#555"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
