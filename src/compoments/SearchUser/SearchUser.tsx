import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {User} from '../../../Types.ts';
import {axiosUtils} from '../../Utils/axiosUtils.ts';
import {API_URL_IMAGE} from '../../../config.ts';

interface SearchUserProps {
  setSearchResults: (user: User | User[]) => void;
  isMultiple: boolean;
  textValue: string | null;
  textOnclick?: string | null;
}

export const SearchUser: React.FC<SearchUserProps> = ({
  setSearchResults,
  isMultiple,
  textValue,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userList, setUserList] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [hoveredUser, setHoveredUser] = useState<number | null>(null);
  const {ApiGet, ApiPost} = axiosUtils();

  // Fonction pour effectuer la recherche
  const handleSearch = () => {
    if (searchTerm.length < 1) return;
    ApiPost(`Users/search`, {
      Query: searchTerm,
      Limit: 20,
      TeamId: null,
    })
      .then(response => {
        console.log('Résultats de la recherche:', response.data);
        setUserList(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la recherche:', error);
      });
  };

  // Effet pour déclencher la recherche automatique lorsque la longueur du terme de recherche est supérieure à 3
  useEffect(() => {
    if (searchTerm.length > 3) {
      handleSearch();
    } else {
      setUserList([]); // Réinitialise la liste des utilisateurs si la longueur du terme de recherche est inférieure à 3
    }
  }, [searchTerm]);

  // Fonction pour sélectionner un utilisateur et réinitialiser la liste
  const handleSelectUser = (user: User) => {
    setSearchTerm('');
    setUserList([]);
    setSearchResults(user); // Déclenche la mise à jour du résultat de recherche dans le composant parent
  };

  const renderItem = ({item}: {item: User}) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.userItem,
        hoveredUser === item.id && styles.userItemHovered,
      ]}
      onPress={() => handleSelectUser(item)}
      onMouseEnter={() => setHoveredUser(item.id)}
      onMouseLeave={() => setHoveredUser(null)}>
      <Image
        source={{uri: `${API_URL_IMAGE}${item.profileImagePath}`}}
        style={styles.profileImage}
      />
      <Text style={styles.userName}>{item.userName}</Text>
      {isMultiple && (
        <Button
          title={textValue || 'Select'}
          onPress={() => setSearchResults([item])}
          color="#07c9a3"
        />
      )}
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
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        style={styles.userList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  searchInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  userList: {
    marginTop: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userItemHovered: {
    backgroundColor: '#f0f0f0',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    flexGrow: 1,
    fontSize: 16,
  },
  btnPrimary: {
    backgroundColor: '#07c9a3',
    borderWidth: 1,
    borderColor: '#07c9a3',
    padding: 10,
  },
  btnPrimaryHovered: {
    backgroundColor: '#ffffff',
    borderColor: '#07c9a3',
    color: '#000000',
  },
  btnPrimaryIcon: {
    color: '#ffffff',
  },
  btnPrimaryIconHovered: {
    color: '#07c9a3',
  },
});
