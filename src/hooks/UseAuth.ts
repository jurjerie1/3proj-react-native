import axios from 'axios';
import {API_URL} from '../../config';
import {useAccountStore} from './UseAccountStore.ts';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useEffect} from 'react';

export enum AuthStatus {
  UNKNOWN,
  AUTHENTICATED,
  GUEST,
}

export const UseAuth = () => {
  const {account, setAccount} = useAccountStore();
  const navigation = useNavigation<NavigationProp<any>>();

  let status;
  switch (account) {
    case null:
      status = AuthStatus.GUEST;
      break;
    case undefined:
      status = AuthStatus.UNKNOWN;
      break;
    default:
      status = AuthStatus.AUTHENTICATED;
      break;
  }

  // useEffect(() => {
  //   const checkAuthentication = async () => {
  //     try {
  //       const response = await axios.get(`${API_URL}checkAuthentication`);
  //       if (response.data.success) {
  //         setAccount({
  //           user: response.data.user,
  //           token: response.data.token,
  //         });
  //       } else {
  //         setAccount(null);
  //       }
  //     } catch (error) {
  //       console.error('Error checking authentication:', error);
  //       setAccount(null);
  //     }
  //   };
  //   checkAuthentication();
  // }, [setAccount]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}Users/login`, {
        email,
        password,
      });
      if (response.data.token && response.data.user) {
        setAccount({
          user: response.data.user,
          token: response.data.token,
        });
        navigation.navigate('Home');
        return {success: true, message: 'Login successful'};
      } else {
        return {success: false, message: 'Missing token or user information'};
      }
    } catch (error) {
      return {success: false, message: 'An unexpected error occurred'};
    }
  };

  const logout = () => {
    setAccount(null);
    navigation.navigate('login');
  };

  return {
    status,
    account,
    login,
    logout,
  };
};
