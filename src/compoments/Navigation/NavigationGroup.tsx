import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {GroupDetails} from '../../compoments/GroupCompoments/GroupDetail.tsx';
import {NotificationsScreen} from '../../compoments/Notif.tsx';
import {useNavigation} from '@react-navigation/native';

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
        component={NotificationsScreen}
        options={{title: 'Historique'}}
      />
      <Drawer.Screen
        name="chatGroup"
        component={NotificationsScreen}
        options={{title: 'Conversation'}}
      />
      <Drawer.Screen
        name="membresGroup"
        component={NotificationsScreen}
        options={{title: 'Membres'}}
      />
    </Drawer.Navigator>
  );
};
