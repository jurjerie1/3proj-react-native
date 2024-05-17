import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {GroupDetails} from '../../compoments/GroupCompoments/GroupDetail.tsx';
import {NotificationsScreen} from '../../compoments/Notif.tsx';
import {useNavigation} from '@react-navigation/native';
import {History} from '../History/History.tsx';

const Drawer = createDrawerNavigator();

export const NavigationGroup = ({route}) => {
  const {group} = route.params;
  const navigation = useNavigation();

  if (!group) {
    navigation.navigate('GroupList');
  }
  return (
    <Drawer.Navigator initialRouteName="indexGroup">
      <Drawer.Screen name="indexGroup" options={{title: 'Informations'}}>
        {props => <GroupDetails {...props} group={group} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="historiqueGroup"
        component={History}
        options={{title: 'Liste des dépenses'}}
      />
      <Drawer.Screen
        name="chatGroup"
        component={NotificationsScreen}
        options={{title: 'Chat'}}
      />
      <Drawer.Screen
        name="membresGroup"
        component={NotificationsScreen}
        options={{title: 'Soldes'}}
      />
    </Drawer.Navigator>
  );
};
