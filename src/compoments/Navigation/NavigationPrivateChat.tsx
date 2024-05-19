import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ContactScreen} from '../../screens/PrivateChatScreens/ContactScreen.tsx';
import {PrivateChatScreen} from '../../screens/PrivateChatScreens/PrivateChatScreen.tsx';

export const NavigationPrivateChat = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Chat">
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen
        name="PrivateChat"
        component={PrivateChatScreen}
        options={({route}) => ({
          title: route.params.contact.user.userName,
        })}
      />
    </Stack.Navigator>
  );
};
