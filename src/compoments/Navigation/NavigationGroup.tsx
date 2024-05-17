import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NotificationsScreen} from '../../compoments/Notif.tsx';
import {useNavigation} from '@react-navigation/native';
import {History} from '../History/History.tsx';
import {GroupDetails} from "../GroupDetail.tsx";
import {GroupMessage} from '../../screens/GroupMessage/GroupMessage.tsx';

const Drawer = createDrawerNavigator();

export const NavigationGroup = ({route}) => {
    const {group} = route.params || {}; // Add default empty object
    const navigation = useNavigation();

    if (!group) {
        navigation.navigate('GroupList');
        return null; // Add return statement to prevent rendering
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
                component={GroupMessage}
                options={{title: 'Chat'}}
                initialParams={{group}} // Pass the group parameter
            />
            <Drawer.Screen
                name="membresGroup"
                component={NotificationsScreen}
                options={{title: 'Soldes'}}
            />
        </Drawer.Navigator>
    );
};
