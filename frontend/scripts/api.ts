import axios from 'axios';
import { Platform } from 'react-native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const getBaseUrl = () => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return 'http://192.168.137.1:5019'; 
  } else {
    return 'http://localhost:5019'; 
  }
};




export default getBaseUrl