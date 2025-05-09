import { useNavigation } from '@react-navigation/native';
import { Pressable, View, Text, StyleSheet } from 'react-native';
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
        <View style={styles.selectorContainer}>
            <Pressable
                style={[
                    styles.selectorButton,
                    currentScreen === 'AddQuestion' && styles.activeSelector
                ]}
                onPress={() => navigation.navigate('AddQuestion')}
            >
                <Text style={[
                    styles.selectorText,
                    currentScreen === 'AddQuestion' && styles.activeSelectorText
                ]}>
                    Add question
                </Text>
            </Pressable>
            <Pressable
                style={[
                    styles.selectorButton,
                    currentScreen === 'UploadOther' && styles.activeSelector
                ]}
                onPress={() => navigation.navigate('UploadOther')}
            >
                <Text style={[
                    styles.selectorText,
                    currentScreen === 'UploadOther' && styles.activeSelectorText
                ]}>
                    Upload other
                </Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    selectorContainer: {
        flexDirection: "row",
        margin: 16,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    selectorButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeSelector: {
        backgroundColor: '#4F46E5',
        borderRadius: 8,
    },
    selectorText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748b',
    },
    activeSelectorText: {
        color: '#ffffff',
    },
});

export default ContentTypeSelector;