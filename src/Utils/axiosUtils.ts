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
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjVkMTBmOTdkLTZiZDAtNGU5My1iNzM5LWQxYTE3N2U4NTdkNSIsImp0aSI6WyI1ZDEwZjk3ZC02YmQwLTRlOTMtYjczOS1kMWExNzdlODU3ZDUiLCI5YmJhMzZiMS05NjM2LTRmZDMtOGU3Yy04MmZlMzBkMTM2MmMiXSwiZW1haWwiOiJ3aW5kQGxvbC5jb20iLCJuYmYiOjE3MTU3MTQxNjcsImV4cCI6MTcxNTczNTc2NywiaWF0IjoxNzE1NzE0MTY3fQ.4fmcg18hSANwcZIPATBWTTnKdP4Eetf2puh_8OIQVAg`,
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
