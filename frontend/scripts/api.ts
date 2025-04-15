import axios from 'axios';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return 'http://192.168.137.1:5019'; // Hotspot IP
  } else {
    return 'http://localhost:5019'; // Web or local development
  }
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
});