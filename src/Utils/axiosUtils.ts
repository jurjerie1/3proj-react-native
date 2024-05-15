import axios from 'axios';
import {UseAccount} from '../hooks/UseAccount.ts';
import {API_URL} from '../../config.ts';

const axiosInstance = axios.create();

// Response interceptor
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
        // cas ou on est pas connecté
        console.log(
          'Unauthorized access detected with no response data. Redirecting to login page...',
        );

        // localStorage.removeItem('account');
        // window.location.href = '/login';
      } else {
        // cas ou on est connecté mais on a pas les droits
        console.log(
          'Unauthorized access detected with response data:',
          error.response.data,
        );
      }
    }
    return Promise.reject(error);
  },
);

export const axiosUtils = () => {
  //const {account} = UseAccount();

  const config = {
    headers: {
      accept: '*/*',
      // Authorization: `Bearer ${account.token}`,
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjEyMDJlZGY4LTczYWYtNDJjYS05YTNhLTM5MzJkNDJlZWU1NyIsImp0aSI6WyIxMjAyZWRmOC03M2FmLTQyY2EtOWEzYS0zOTMyZDQyZWVlNTciLCIyZDEyY2Q1ZS0wZTUyLTRiMzktYWQ3YS0xZDI3ODdkZWNiYjQiXSwiZW1haWwiOiJtb2JpbGUxQGVtYWlsLmNvbSIsIm5iZiI6MTcxNTc1ODQzOSwiZXhwIjoxNzE1NzgwMDM5LCJpYXQiOjE3MTU3NTg0Mzl9.552VH6Ic9uz1Kjx9a7J1hoXWRg4fNfD56J3Rv3Dfw7I`,
    },
  };

  return {
    ApiGet: (url: string) => axiosInstance.get(API_URL + url, config),
    ApiPost: (url: string, data: unknown) =>
      axiosInstance.post(API_URL + url, data, config),
    ApiPut: (url: string, data: unknown) =>
      axiosInstance.put(API_URL + url, data, config),
    ApiDelete: (url: string) => axiosInstance.delete(API_URL + url, config),
  };
};
