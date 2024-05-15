import React from 'react';
import {Text, View} from 'react-native';
import {Group} from '../../../Types.ts';

export const GroupDetails = ({group}: {group: Group}) => {
  if (!group) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Group Details Screen</Text>
        <Text>No group data available</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Group Details Screen</Text>
      <Text>{group.name}</Text>
      {/* Add more details as needed */}
    </View>
  );
};
