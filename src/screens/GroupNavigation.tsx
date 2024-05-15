import * as React from 'react';
import {Button, View} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useState} from 'react';
import {Group} from '../../Types.ts';

export const GroupNavigation: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  return (
    <View>
      <Button title="Open Drawer" onPress={() => {}} />
    </View>
  );
};
