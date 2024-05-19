import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Button,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import {API_URL, API_URL_IMAGE} from '../../../../../config.ts';
import {User} from '../../../Types';

interface SearchUserProps {
  setSearchResults: (users: User[]) => void;
  isMultiple: boolean;
  textValue: string;
  textOnclick?: string;
}

export const SearchUser: React.FC<SearchUserProps> = ({
  setSearchResults,
  isMultiple,
  textValue,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userList, setUserList] = useState<User[]>([]);

  // Function to handle searching for users
  const handleSearch = () => {
    if (searchTerm.length < 1) return;
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .post(`${API_URL}Users/search`, {
          Query: searchTerm,
          Limit: 20,
          TeamId: null,
        })
        .then(response => {
          setUserList(response.data);
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
        });
    }
  };

  // Effect to handle searching when the search term changes
  useEffect(() => {
    if (searchTerm.length > 3) {
      handleSearch();
    } else {
      setUserList([]);
    }
  }, [searchTerm]);

  // Function to handle selecting a user
  const handleSelectUser = (user: User) => {
    setSearchTerm('');
    setUserList([]);
    setSearchResults([user]);
  };

  // Function to render each user item in the list
  const renderUserItem = ({item}: {item: User}) =>
    isMultiple ? (
      <View style={styles.userItem}>
        <Image
          source={{uri: `${API_URL_IMAGE}${item.profileImagePath}`}}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{item.userName}</Text>
        <Button title={textValue} onPress={() => setSearchResults([item])} />
      </View>
    ) : (
      <TouchableOpacity
        key={item.id}
        style={styles.userItem}
        onPress={() => handleSelectUser(item)}>
        <Image
          source={{uri: `${API_URL_IMAGE}${item.profileImagePath}`}}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{item.userName}</Text>
      </TouchableOpacity>
    );

  return (
    <View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un utilisateur"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Button title="Rechercher" onPress={handleSearch} />
      </View>
      <FlatList
        data={userList}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    flex: 1,
    fontSize: 16,
  },
});
