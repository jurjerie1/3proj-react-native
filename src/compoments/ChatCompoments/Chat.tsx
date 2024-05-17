import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Message} from '../../../Types';

type ChatProps = {
  messages: Message[];
};

export const Chat: React.FC<ChatProps> = ({messages}) => {
  return (
    <>
      {messages?.map(message => (
        <View key={message.id} style={[styles.message, styles.msg]}>
          <Text>{message.user.userName}</Text>
          <Text>
            {new Date(message.createdAt).toLocaleString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          <Text>{message.content}</Text>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  message: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#000',
    padding: 8,
  },
  msg: {
    width: '60%',
    alignSelf: 'center',
  },
});
