import React, {useEffect, useState} from 'react';
import {View, TextInput, Button, StyleSheet, ScrollView} from 'react-native';
import {Contact, Message} from '../../../Types';
import {Chat} from './Chat.tsx';
import {axiosUtils} from '../../Utils/axiosUtils.ts';

interface PrivateChatProps {
  contact: Contact;
}

export const PrivateChat: React.FC<PrivateChatProps> = ({contact}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const {ApiGet, ApiPost} = axiosUtils();

  useEffect(() => {
    if (contact !== null) {
      // récupérer les messages depuis le serveur
      ApiGet(`Users/contacts/${contact.user.id}/messages`)
        .then(response => {
          setMessages(response.data);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des messages:', error);
        });
    }
  }, [contact]);

  const handleInputChange = (text: string) => {
    setInputMessage(text);
  };

  const handleSendMessage = () => {
    if (inputMessage === '') {
      return;
    }

    ApiPost(`Users/contacts/${contact.user.id}/messages`, {
      content: inputMessage,
    })
      .then(response => {
        setMessages([...messages, response.data]);
      })
      .catch(error => {
        console.error("Erreur lors de l'envoie du message", error);
      });
    setInputMessage('');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatmsg}>
        <Chat messages={messages} />
      </ScrollView>
      <View style={styles.inputzone}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={handleInputChange}
        />
        <Button title="Send" onPress={handleSendMessage} color="#07c9a3" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '60vh',
    margin: 0,
    maxHeight: '100vh',
    overflow: 'hidden',
  },
  chatmsg: {
    flexGrow: 1,
    overflowY: 'auto',
  },
  inputzone: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    borderColor: '#07c9a3',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
});
