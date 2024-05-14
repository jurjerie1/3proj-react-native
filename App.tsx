import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GroupNavigation} from './src/screens/GroupNavigation';
import {Register} from './src/screens/Register.tsx';
import {Login} from './src/screens/Login.tsx';
import {Navigation} from './src/compoments/Navigation/Navigation.tsx';

type RootStackParamList = {
  login: undefined;
  register: undefined;
  Home: undefined;
  group: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="group"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="Home" component={Navigation} />
        <Stack.Screen name="group" component={GroupNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
