import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {axiosUtils} from '../../Utils/axiosUtils';
import {Message} from '../../../Types';
import {Chat} from '../../compoments/ChatCompoments/Chat.tsx';

export const PrivateChatScreen = ({route, navigation}) => {
  const {contact} = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20); // Taille de page fixe
  const {ApiGet, ApiPost} = axiosUtils();

  const fetchMessages = pageNum => {
    setLoading(true);
    ApiGet(
      `Users/contacts/${contact.user.id}/messages?page=${pageNum}&pageSize=${pageSize}`,
    )
      .then(response => {
        setMessages(prevMessages => [...response.data, ...prevMessages]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des messages:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (contact !== null) {
      fetchMessages(page);
    }
  }, [contact, page]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: contact.user.userName,
    });
  }, [navigation, contact]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      ApiPost(`Users/contacts/${contact.user.id}/messages`, {
        content: newMessage,
      })
        .then(response => {
          setMessages(prevMessages => [response.data, ...prevMessages]);
          setNewMessage('');
        })
        .catch(error => {
          console.error("Erreur lors de l'envoi du message:", error);
        });
    }
  };

  const loadMoreMessages = () => {
    if (!loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({item}) => <Chat messages={[item]} />}
        keyExtractor={(item, index) => index.toString()}
        inverted
        onEndReached={loadMoreMessages}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loading && <ActivityIndicator size="small" color="#0000ff" />
        }
        style={styles.chatList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.chatinput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Tapez un message"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.btnsend}>
          <Image source={require('../../assets/send.svg')} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatList: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    padding: 10,
  },
  sendButtonText: {},
  chatmsg: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  chatinputcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 20,
  },
  chatinput: {
    flex: 1,
    borderWidth: 0,
    padding: 10,
    borderRadius: 20,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    marginRight: 10,
  },
  btnsend: {
    padding: 10,
    backgroundColor: '#9ACD32',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnsendHover: {
    backgroundColor: '#fff',
    transform: [{scale: 1.2}],
  },
});
