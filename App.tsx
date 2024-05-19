import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthStatus, UseAuth} from './src/hooks/UseAuth.ts';
import {Login} from './src/screens/Login.tsx';
import {Navigation} from './src/compoments/Navigation/Navigation.tsx';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Register} from './src/screens/Register.tsx';

const App = () => {
  const Stack = createStackNavigator();

  const {status} = UseAuth();
  const {AuthenticatedTabs} = Navigation();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {status === AuthStatus.AUTHENTICATED ? (
          // Screens for authenticated users
          <Stack.Group screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={AuthenticatedTabs} />

            {/* Add GroupDetails here */}
          </Stack.Group>
        ) : (
          // Authentication screens
          <Stack.Group screenOptions={{headerShown: false}}>
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="register" component={Register} />
          </Stack.Group>
        )}
        {/* Common modal screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
