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
import {useEffect, useState} from 'react';
import {axiosUtils} from '../../Utils/axiosUtils.ts';
import {Message} from '../../../Types.ts';
import {Chat} from '../../compoments/ChatCompoments/Chat.tsx';

export const GroupMessage = ({route, navigation}) => {
  const {group} = route.params || {}; // Add default empty object
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20); // Taille de page fixe
  const {ApiGet, ApiPost} = axiosUtils();

  const fetchMessages = pageNum => {
    if (!group.id) return; // Check if group.id exists
    setLoading(true);
    ApiGet(`teams/${group.id}/messages?page=${pageNum}&pageSize=${pageSize}`)
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
    if (group && group.id) {
      fetchMessages(page);
    }
  }, [group, page]);

  const sendMessage = () => {
    if (newMessage.trim() && group.id) {
      ApiPost(`Teams/${group.id}/messages`, {
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

  if (!group || !group.id) {
    return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No group data available.</Text>
        </View>
    );
  }

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
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Tapez un message"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Envoyer</Text>
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
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
