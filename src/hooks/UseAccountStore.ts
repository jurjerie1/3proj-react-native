import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Account} from '../../Types';

type AccountState = {
  account: Account | null;
  setAccount: (account: Account | null) => void;
  loadAccount: () => void;
};

export const useAccountStore = create<AccountState>(set => ({
  account: null,
  setAccount: async (account: Account | null) => {
    console.log('Setting account:', account);
    await AsyncStorage.setItem('account', JSON.stringify(account));
    set({account});
    console.log('Account get:', await AsyncStorage.getItem('account'));
  },
  loadAccount: async () => {
    try {
      const accountString = await AsyncStorage.getItem('account');
      if (accountString) {
        set({account: JSON.parse(accountString)});
      }
    } catch (error) {
      console.error('Error loading account from AsyncStorage:', error);
    }
  },
}));
