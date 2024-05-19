import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
} from 'react-native';
import {Chat} from '../Chat/Chat';
import {Message} from '../../../Types';
import {CustomLoader} from '../CustomLoader/CustomLoader.tsx';
import {axiosUtils} from '../../../../Utils/axiosUtils.ts'; // Ensure this component is adapted for React Native

export const GroupChat = ({teamId}: {teamId: string}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true); // State to track loading state
  const [inputMessage, setInputMessage] = useState<string>('');
  const {ApiGet, ApiPost} = axiosUtils();

  // Fetch messages when the component mounts or teamId changes
  useEffect(() => {
    if (teamId !== '') {
      ApiGet(`Teams/${teamId}/messages`)
        .then(response => {
          setMessages(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des messages:', error);
        });
    }
  }, [teamId]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (inputMessage === '') {
      return;
    }

    ApiPost(`Teams/${teamId}/messages`, {
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
      // Container for the group chat
    <View style={styles.groupChatContainer}>
      <Text style={styles.header}>Team Chat</Text>
      <View style={styles.chatMessages}>
        {loading ? (
          <CustomLoader /> // Render CustomLoader while loading
        ) : messages && messages.length > 0 ? (
          <FlatList
            data={messages}
            renderItem={({item}) => <Chat message={item} />} // Ensure Chat component is adapted for React Native
            keyExtractor={item => item.id}
          />
        ) : (
          <Text>No messages</Text>
        )}
      </View>
      <View style={styles.chatInputContainer}>
        <TextInput
          style={styles.chatInput}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type your message"
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  groupChatContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  chatMessages: {
    flex: 1,
    marginBottom: 16,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
});
