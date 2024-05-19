import axios from 'axios';
import {API_URL} from '../../config';
import {useNavigation} from '@react-navigation/native';
import {UseAuth} from '../hooks/UseAuth.ts';

const axiosInstance = axios.create();

const useAxiosSetup = () => {
  const {logout} = UseAuth();
  const navigation = useNavigation();

  axiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      console.error('Response Error:', error);
      if (error.response && error.response.status === 401) {
        if (!error.response.data) {
          logout();
          navigation.navigate('Login');
        } else {
        }
      }
      return Promise.reject(error);
    },
  );
};

export const axiosUtils = () => {
  const {account} = UseAuth();
  useAxiosSetup(); // Ensure interceptors are set up

  const config = {
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${account?.token}`,
    },
  };

  const customConfig = {
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${account?.token}`,
      'Content-Type': 'multipart/form-data',
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
