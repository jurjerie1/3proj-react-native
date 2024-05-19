import axios from 'axios';
import {API_URL} from '../../config';
import {useNavigation} from '@react-navigation/native';
import {UseAuth} from '../hooks/UseAuth.ts';

const axiosInstance = axios.create();

// Create a custom hook to handle axios setup and interceptors
const useAxiosSetup = () => {
  const {logout} = UseAuth();
  const navigation = useNavigation();

  axiosInstance.interceptors.response.use(
    response => {
      // Handle successful response
      return response;
    },
    error => {
      // Handle response error
      console.error('Response Error:', error);
      if (error.response && error.response.status === 401) {
        // Check if there's no response data
        if (!error.response.data) {
          // Case where the user is not logged in
          logout();
          console.log(
            'Unauthorized access detected with no response data. Redirecting to login page...',
          );
          navigation.navigate('Login'); // Redirect to login page
        } else {
          // Case where the user is logged in but lacks proper authorization
          console.log(
            'Unauthorized access detected with response data:',
            error.response.data,
          );
        }
      }
      return Promise.reject(error);
    },
  );
};

export const axiosUtils = () => {
  const {account} = UseAuth();
  useAxiosSetup(); // Ensure interceptors are set up

  // Dynamic configuration for headers, including token from account state
  const config = {
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${account?.token}`,
    },
  };


  return {
    ApiGet: (url: string) => axiosInstance.get(`${API_URL}${url}`, config),
    ApiPost: (url: string, data: unknown) =>
      axiosInstance.post(API_URL + url, data, config),
    ApiPostCustom: (url: string, data: unknown) =>
        axiosInstance.post(API_URL + url, data, customConfig),
    ApiPut: (url: string, data: unknown) =>
      axiosInstance.put(API_URL + url, data, config),
    ApiPutCustom: (url: string, data: unknown) =>
        axiosInstance.put(API_URL + url, data, customConfig),
    ApiDelete: (url: string) => axiosInstance.delete(API_URL + url, config),

  };
};
