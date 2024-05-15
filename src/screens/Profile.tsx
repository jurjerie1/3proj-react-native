import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Button,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {axiosUtils} from '../Utils/axiosUtils.ts';
import {API_URL_IMAGE} from '../../config.ts';

export const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProfile, setEditProfile] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    languagePreference: '',
    profileImage: null,
  });

  const {ApiGet, ApiPost} = axiosUtils();

  useEffect(() => {
    ApiGet('Users/profile')
      .then(response => {
        setProfile(response.data);
        setEditProfile({
          userName: response.data.userName,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          dateOfBirth: '', // Valeur vide ou valeur par défaut
          languagePreference: '', // Valeur vide ou valeur par défaut
          profileImage: null,
        });
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du profil:', error);
      });
  }, []);

  const handleEditProfileChange = (name: string, value: string | File) => {
    setEditProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditProfileSubmit = () => {
    const formData = new FormData();
    Object.keys(editProfile).forEach(key => {
      formData.append(key, editProfile[key]);
    });

    ApiPost('Users/updateProfile', formData)
      .then(response => {
        setProfile(response.data);
        setShowEditModal(false);
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du profil:', error);
      });
  };

  if (!profile) {
    return <Text>Chargement...</Text>;
  }
  return (
    <ScrollView contentContainerStyle={styles.mainmarge}>
      <View style={styles.profilecontainer}>
        <View style={styles.profileimagesection}>
          <Image
            source={{uri: `${API_URL_IMAGE}${profile.profileImagePath}`}}
            style={styles.profileimg}
          />
          <TouchableOpacity
            onPress={() => setShowEditModal(true)}
            style={styles.editprofilebtn}>
            <Text style={styles.editprofilebtntext}>Modifier le profil</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.profileinfosection}>
          <View style={styles.infofield}>
            <Text style={styles.infotitle}>Email Address</Text>
            <Text style={styles.info}>{profile.email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infofield}>
            <Text style={styles.infotitle}>Name</Text>
            <Text style={styles.info}>
              {profile.firstName} {profile.lastName}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infofield}>
            <Text style={styles.infotitle}>Pseudo</Text>
            <Text style={styles.info}>{profile.userName}</Text>
          </View>
        </View>
      </View>

      <Modal visible={showEditModal} transparent={true} animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier le Profil</Text>
              <Button title="Fermer" onPress={() => setShowEditModal(false)} />
            </View>
            <View style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                value={editProfile.userName}
                onChangeText={text => handleEditProfileChange('userName', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Prénom"
                value={editProfile.firstName}
                onChangeText={text =>
                  handleEditProfileChange('firstName', text)
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Nom de famille"
                value={editProfile.lastName}
                onChangeText={text => handleEditProfileChange('lastName', text)}
              />
              {/* Ajoutez d'autres champs de formulaire ici selon les besoins */}
              <Button
                title="Sauvegarder les modifications"
                onPress={handleEditProfileSubmit}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainmarge: {
    paddingHorizontal: '5%',
  },
  profilecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  profileimagesection: {
    flex: 1,
    alignItems: 'center',
  },
  profileimg: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 20,
  },
  editprofilebtn: {
    backgroundColor: '#2cc4b5',
    borderColor: '#07c9a3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editprofilebtntext: {
    color: '#fff',
  },
  profileinfosection: {
    flex: 2,
    padding: 20,
  },
  infofield: {
    marginBottom: 10,
  },
  infotitle: {
    color: '#2cc4b5',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  info: {
    marginBottom: 10,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
