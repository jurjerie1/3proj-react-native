import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Group_list} from '../GroupCompoments/Group_list/Group_list.tsx';
import {NavigationGroup} from './NavigationGroup.tsx';
import {Profile} from '../../screens/Profile.tsx';
import React from 'react';
import {ContactScreen} from '../../screens/PrivateChatScreens/ContactScreen.tsx';
import {Image} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NavigationPrivateChat} from './NavigationPrivateChat.tsx';
import {NavigationHistoriqueUser} from './NavigationHistoriqueUser.tsx';

export const Navigation = () => {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  function GroupStack() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="GroupList"
          component={Group_list}
          options={{title: 'Groupes'}}
        />
        <Stack.Screen
          name="GroupDetails"
          component={NavigationGroup}
          options={{title: 'Détails du Groupe'}}
        />
      </Stack.Navigator>
    );
  }

  const AuthenticatedTabs = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#07c9a3',
        }}>
        <Tab.Screen
          name="Groupes"
          component={GroupStack}
          options={{
            title: 'groupes',
            tabBarIcon: ({color, size}) => (
              <Image
                source={require('../../assets/group.png')}
                style={{width: size, height: size, tintColor: color}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="HistorricUser"
          component={NavigationHistoriqueUser}
          options={{
            title: 'Historique',
            tabBarIcon: ({color, size}) => (
              <Image
                source={require('../../assets/historique.png')}
                style={{width: size, height: size, tintColor: color}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="PrivateChat"
          component={NavigationPrivateChat}
          options={{
            title: 'Messages',
            // tabBarBadge: 3,
            tabBarIcon: ({color, size}) => (
              <Image
                source={require('../../assets/chat.png')}
                style={{width: size, height: size, tintColor: color}}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            title: 'profile',
            tabBarIcon: ({color, size}) => (
              <Image
                source={require('../../assets/profile.png')}
                style={{width: size, height: size, tintColor: color}}
              />
            ),
          }}
        />

      </Tab.Navigator>
    );
  };

  return {AuthenticatedTabs};
};
