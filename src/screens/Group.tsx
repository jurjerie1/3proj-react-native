import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {GroupDetails} from '../compoments/GroupCompoments/GroupDetail.tsx';
import {NotificationsScreen} from '../compoments/Notif.tsx';

const Drawer = createDrawerNavigator();

export const Group = ({route}) => {
  const {group} = route.params; // Récupérer le paramètre 'group' de la route

  return (
    <Drawer.Navigator initialRouteName="GroupDetails">
      <Drawer.Screen name="GroupDetails">
        {props => <GroupDetails {...props} group={group} />}
        {/* Passer le groupe en tant que prop */}
      </Drawer.Screen>
      <Drawer.Screen name="notification" component={NotificationsScreen} />
    </Drawer.Navigator>
  );
};
