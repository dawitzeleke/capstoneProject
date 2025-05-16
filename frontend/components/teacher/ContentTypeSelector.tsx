import { useNavigation } from '@react-navigation/native';
import { Pressable, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    UploadOtherScreen: undefined;
    AddQuestionScreen: undefined;
};

type ContentTypeSelectorProps = {
    currentScreen: 'UploadOther' | 'AddQuestion';
};

const ContentTypeSelector = ({ currentScreen }: ContentTypeSelectorProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View className="flex-row m-4 bg-white rounded-lg shadow-slate-300 shadow-sm">
            <Pressable
                className={`flex-1 py-3 items-center ${
                    currentScreen === 'AddQuestion' ? 'bg-indigo-600 rounded-lg' : ''
                }`}
                onPress={() => navigation.navigate('AddQuestion')}
            >
                <Text className={`text-sm font-pmedium ${
                    currentScreen === 'AddQuestion' ? 'text-white' : 'text-slate-500'
                }`}>
                    Add question
                </Text>
            </Pressable>
            
            <Pressable
                className={`flex-1 py-3 items-center ${
                    currentScreen === 'UploadOther' ? 'bg-indigo-600 rounded-lg' : ''
                }`}
                onPress={() => navigation.navigate('UploadOther')}
            >
                <Text className={`text-sm font-pmedium ${
                    currentScreen === 'UploadOther' ? 'text-white' : 'text-slate-500'
                }`}>
                    Upload other
                </Text>
            </Pressable>
        </View>
    );
};

export default ContentTypeSelector;