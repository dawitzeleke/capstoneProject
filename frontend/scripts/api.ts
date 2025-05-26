import axios from 'axios';
import { Platform } from 'react-native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const getBaseUrl = () => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return 'https://cognify-d5we.onrender.com'; 
  } else {
    return 'https://cognify-d5we.onrender.com'; 
  }
};




export default getBaseUrl