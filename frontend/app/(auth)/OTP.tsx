import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView as SafeAreaViewRN } from "react-native-safe-area-context";
import { ScrollView as ScrollViewRN } from "react-native-gesture-handler";

const OTP_LENGTH = 6;
const OTP_TIMEOUT = 3 * 60 + 12; // 3:12 in seconds

const OTP = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(OTP_TIMEOUT);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text: string, idx: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[idx] = text;
      setOtp(newOtp);
      if (text && idx < OTP_LENGTH - 1) {
        inputRefs.current[idx + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = () => {
    // TODO: Implement OTP verification logic
    // Placeholder: just go back
    // router.back();
  };

  const handleResend = () => {
    setTimer(OTP_TIMEOUT);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    // TODO: Implement resend OTP logic
  };

  const formattedTime = `${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`;

  return (
    <SafeAreaViewRN style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollViewRN>
        <View className="flex-1 px-6 justify-center">
          {/* Go Back */}
          <TouchableOpacity onPress={() => router.back()} className="absolute left-4 top-10 flex-row items-center z-10">
            <Ionicons name="chevron-back" size={28} color="#4F46E5" />
            <Text className="ml-1 text-[#4F46E5] text-lg font-psemibold">Back</Text>
          </TouchableOpacity>

          {/* Main Content */}
          <View className="items-center mt-10">
            <Text className="text-2xl font-pbold text-gray-900 mb-2">Check your phone</Text>
            <Text className="text-gray-500 mb-8">We've sent the code to your phone</Text>
            <View className="flex-row justify-center mb-6">
              {otp.map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={ref => (inputRefs.current[idx] = ref)}
                  value={digit}
                  onChangeText={text => handleChange(text, idx)}
                  onKeyPress={e => handleKeyPress(e, idx)}
                  keyboardType="number-pad"
                  maxLength={1}
                  className={`w-12 h-14 mx-1 rounded-lg border-2 text-center text-2xl font-psemibold bg-white ${digit ? 'border-indigo-600' : 'border-gray-300'}`}
                  style={{ color: '#4F46E5' }}
                  returnKeyType="next"
                />
              ))}
            </View>
            <Text className="mb-8 text-gray-500">
              Code expires in: <Text className="font-pbold text-indigo-600">{formattedTime}</Text>
            </Text>
            <TouchableOpacity
              className="w-full py-4 rounded-full bg-indigo-600 mb-4"
              onPress={handleVerify}
              disabled={otp.some(d => !d)}
            >
              <Text className="text-white text-lg text-center font-pbold">Verify</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full py-4 rounded-full border border-indigo-600"
              onPress={handleResend}
              disabled={timer > 0}
            >
              <Text className="text-indigo-600 text-lg text-center font-pbold">Send again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollViewRN>
    </SafeAreaViewRN>
  );
};

export default OTP; 