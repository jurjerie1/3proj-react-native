import {History} from '../History/History.tsx';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {StatistiqueUser} from '../StatistiqueUser.tsx';

export const NavigationHistoriqueUser = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator initialRouteName="indexGroup">
      <Drawer.Screen
        name="historicUser"
        component={History}
        options={{title: 'Historique'}}
      />
      <Drawer.Screen
        name="statisticUser"
        component={StatistiqueUser}
        options={{title: 'Statistiques'}}
      />
    </Drawer.Navigator>
  );
};
