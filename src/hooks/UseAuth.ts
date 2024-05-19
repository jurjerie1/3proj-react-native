import axios from 'axios';
import {API_URL} from '../../config';
import {useAccountStore} from './UseAccountStore.ts';
import {useCallback} from 'react';

export enum AuthStatus {
  UNKNOWN,
  AUTHENTICATED,
  GUEST,
}

export const UseAuth = () => {
  const {account, setAccount} = useAccountStore();

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

  const login = async (email, password) => {
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
        return {success: true, message: 'Login successful'};
      } else {
        return {success: false, message: 'Missing token or user information'};
      }
    } catch (error) {
      return {success: false, message: 'An unexpected error occurred'};
    }
  };

  const loginWithGoogle = useCallback(
    async (token: string | undefined) => {
      try {
        const response = await axios.post(API_URL + 'Users/loginWithGoogle', {
          credential: token,
        });
        setAccount({
          user: response.data.user,
          token: response.data.token,
        });
        return {success: true, message: 'Connexion avec Google réussie!'};
      } catch (error: any) {
        setAccount(null);
        return {
          success: false,
          message:
            error.response?.data?.error ||
            error.response?.data ||
            'Erreur de connexion avec Google!',
        };
      }
    },
    [setAccount],
  );
  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      dateOfBirth: Date,
      passwordConfirmation: string,
      userName: string,
    ) => {
      try {
        const response = await axios.post(`${API_URL}Users/register`, {
          email,
          firstName,
          lastName,
          dateOfBirth,
          password,
          passwordConfirmation,
          userName,
        });
        return {success: true, message: 'Inscription réussie!'};
      } catch (error: any) {
        return {
          success: false,
          message:
            error.response?.data?.error ||
            error.response?.data ||
            "Erreur d'inscription!",
        };
      }
    },
    [],
  );

  const logout = () => {
    setAccount(null);
  };

  return {
    loginWithGoogle,
    register,
    status,
    account,
    login,
    logout,
  };
};
