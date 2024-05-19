import {useEffect} from 'react';
import {useAccountStore} from './UseAccountStore.ts';
import {useNavigation} from '@react-navigation/native';

export const UseAccount = () => {
  const {account} = useAccountStore();
  const navigation = useNavigation();

  useEffect(() => {
    if (!account) {
      navigation.navigate('login');
    }
  }, [account, navigation]);
  console.log('Account ==> ' + account);

  return {
    account,
  };
};
