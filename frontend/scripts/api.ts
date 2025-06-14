import axios from 'axios';
import { Platform } from 'react-native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const getBaseUrl = () => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    // return 'https://cognify-d5we.onrender.com'; 
    return 'http://localhost:5019'; // Use localhost for mobile development
  } else {
    // return 'https://cognify-d5we.onrender.com'; 
    return 'http://localhost:5019'; // Use localhost for web development
  }
};




export default getBaseUrl