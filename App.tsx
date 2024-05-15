import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {AuthStatus} from './src/hooks/UseAuth.ts';
import {Login} from './src/screens/Login.tsx';
import {Group_list} from './src/compoments/GroupCompoments/Group_list/Group_list.tsx';
import {Group} from './src/screens/Group.tsx';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthenticatedTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="groupes" component={Group_list} />
      {/* Add more tabs as needed */}
    </Tab.Navigator>
  );
};

const App = () => {
  const status = AuthStatus.AUTHENTICATED;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {status === AuthStatus.AUTHENTICATED ? (
          // Screens for authenticated users
          <Stack.Group screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={AuthenticatedTabs} />
            <Stack.Screen name="GroupDetails" component={Group} />
            {/* Add GroupDetails here */}
          </Stack.Group>
        ) : (
          // Authentication screens
          <Stack.Group screenOptions={{headerShown: false}}>
            <Stack.Screen name="login" component={Login} />
          </Stack.Group>
        )}
        {/* Common modal screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
