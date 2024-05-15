import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Group_list} from '../GroupCompoments/Group_list/Group_list.tsx';
import {NavigationGroup} from './NavigationGroup.tsx';
import {Profile} from '../../screens/Profile.tsx';
import React from 'react';
import {ChatScreen} from '../../screens/ChatScreen.tsx';
import {Image} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
            tabBarIcon: ({focused, color, size}) => (
              <Image
                source={require('../../assets/group.png')}
                style={{width: size, height: size, tintColor: color}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="PrivateChat"
          component={ChatScreen}
          options={{
            title: 'Messages',
            tabBarBadge: 3,
            tabBarIcon: ({focused, color, size}) => (
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
            tabBarIcon: ({focused, color, size}) => (
              <Image
                source={require('../../assets/profile.png')}
                style={{width: size, height: size, tintColor: color}}
              />
            ),
          }}
        />

        {/* Add more tabs as needed */}
      </Tab.Navigator>
    );
  };

  return {AuthenticatedTabs};
};
