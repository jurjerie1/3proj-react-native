import {useEffect} from 'react';
import {useAccountStore} from './UseAccountStore.ts';
import {useNavigation} from '@react-navigation/native';

export const UseAccount = () => {
  const {account} = useAccountStore();
  const navigation = useNavigation();

  useEffect(() => {
    if (!account) {
      console.log('Account ==> ' + account);
      navigation.navigate('login');
      throw new Error('User is not authenticated');
    }
  }, [account, navigation]);
  console.log('Account ==> ' + account);

  return {
    account,
  };
};
