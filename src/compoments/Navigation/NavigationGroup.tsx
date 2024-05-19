import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {History} from '../History/History.tsx';
import {GroupDetails} from '../GroupDetail.tsx';
import {GroupMessage} from '../../screens/Groups/GroupMessage.tsx';
import {Members} from '../../screens/Groups/Members.tsx';
import {Soldes} from '../../screens/Groups/Soldes.tsx';

const Drawer = createDrawerNavigator();

export const NavigationGroup = ({route}) => {
  const {group} = route.params || {};
  const navigation = useNavigation();

  if (!group) {
    navigation.navigate('GroupList');
    return null;
  }

  return (
      // Define the Drawer Navigator with its screens
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
        component={GroupMessage}
        options={{title: 'Chat'}}
        initialParams={{group}}
      />
      <Drawer.Screen
        name="Soldes"
        component={Soldes}
        options={{title: 'Soldes'}}
        initialParams={{group}}
      />
      <Drawer.Screen
        name="Membres"
        component={Members}
        options={{title: 'Membres'}}
        initialParams={{group}}
      />
    </Drawer.Navigator>
  );
};
