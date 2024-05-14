import create from 'zustand';
       import AsyncStorage from '@react-native-async-storage/async-storage';
       import { Account } from '../../Types'; // Assurez-vous que le chemin est correct


export const useAccountStore = create((set) => ({
         account: null as null | Account,
         setAccount: async (account: Account | null) => {
           try {
             if (account) {
               await AsyncStorage.setItem('account', JSON.stringify(account));
             } else {
               await AsyncStorage.removeItem('account');
             }
             set({ account });
           } catch (error) {
             console.error('Error setting account in AsyncStorage:', error);
           }
         },
         loadAccount: async () => {
           try {
             const accountString = await AsyncStorage.getItem('account');
             if (accountString) {
               set({ account: JSON.parse(accountString) });
             }
           } catch (error) {
             console.error('Error loading account from AsyncStorage:', error);
           }
         },
       }));