import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {axiosUtils} from '../../Utils/axiosUtils.ts';
import {Contact, User} from '../../../Types.ts';
import {API_URL_IMAGE} from '../../../config.ts';
import {SearchUser} from '../../compoments/SearchUser/SearchUser.tsx';

export const ContactScreen = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<User | null>(null);
  const {ApiGet} = axiosUtils();
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);
    ApiGet('Users/contacts')
      .then(response => {
        console.log('Contacts:', response.data); // Log to check data structure
        setContacts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des contacts:', error);
        setLoading(false);
      });
  }, []);

  const handleContactClick = (contact: Contact) => {
    navigation.navigate('PrivateChat', {contact});
  };

  return (
    <View style={styles.sidebar}>
      <SearchUser
        setSearchResults={setSearchResults}
        isMultiple={false}
        textValue={''}
      />
      {loading ? (
        <Text>Loading ...</Text>
      ) : (
        <ScrollView style={styles.scrollArea}>
          {contacts.length > 0 ? (
            contacts.map(contact => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactItem}
                onPress={() => handleContactClick(contact)}>
                <Image
                  source={{
                    uri: `${API_URL_IMAGE}${contact.user.profileImagePath}`,
                  }}
                  style={styles.profileImage}
                />
                <Text style={styles.contactName}>{contact.user.userName}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>Auccun contact trouvé</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    top: 1,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8f9fa',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  scrollArea: {
    padding: 10,
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  contactName: {
    fontSize: 16,
  },
});
