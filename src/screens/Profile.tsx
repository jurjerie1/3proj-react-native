import React, { useState, useEffect } from 'react';
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
  Platform,
  Alert,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { axiosUtils } from '../Utils/axiosUtils.ts';
import { API_URL_IMAGE } from '../../config.ts';
import { useNavigation } from '@react-navigation/native';
import { UseAuth } from '../hooks/UseAuth.ts';
import DocumentPicker from 'react-native-document-picker';

export const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const { ApiPost, ApiPutCustom } = axiosUtils();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [editProfile, setEditProfile] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    languagePreference: '',
    profileImage: null,
  });
  const [newProfileImage, setNewProfileImage] = useState<any>(null); // Change to any to accommodate object
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

  const { ApiGet } = axiosUtils();
  const { logout } = UseAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    logout();
    navigation.navigate('login');
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    ApiGet('Users/profile')
        .then((response) => {
          setProfile(response.data);
          setEditProfile({
            userName: response.data.userName,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            dateOfBirth: response.data.dateOfBirth || '',
            languagePreference: response.data.languagePreference || '',
            profileImage: null,
          });
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération du profil:', error);
        });
  };

  const handleEditProfileChange = (name: string, value: string | File) => {
    setEditProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditProfileSubmit = async () => {
    const formData = new FormData();

    Object.keys(editProfile).forEach((key) => {
      if (editProfile[key] !== null && editProfile[key] !== undefined) {
        formData.append(key, editProfile[key]);
      }
    });

    if (newProfileImage) {
      formData.append('profileImage', {
        uri: newProfileImage.uri,
        type: newProfileImage.type,
        name: newProfileImage.name,
      });
    }

    try {
      console.log('Sending formData:', formData);

      const response = await ApiPutCustom('Users/profile', formData, {
      });
      console.log('Profile updated successfully:', response.data);
      setShowEditModal(false);
      setNewProfileImage(null);
      fetchProfile(); // Fetch the profile again to update the UI
    } catch (error) {
      if (error.response) {
        console.error('Erreur lors de la mise à jour du profil:', error.response.data);
      } else {
        console.error('Erreur lors de la mise à jour du profil:', error.message);
      }
      Alert.alert('Erreur', 'La mise à jour du profil a échoué.');
    }
  };

  const requestPermission = async (permission: any) => {
    const result = await request(permission);
    return result === RESULTS.GRANTED;
  };

  const handleTakePhoto = async () => {
    const permission = Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA;
    const granted = await requestPermission(permission);
    if (granted) {
      launchCamera({}, (response) => {
        if (response.didCancel || response.errorCode) {
          console.error('User cancelled image picker or error occurred');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setNewProfileImage({
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
          });
        } else {
          console.error('No assets found in the response');
        }
      });
    } else {
      Alert.alert('Accès refusé', "L'accès à la caméra a été refusé.");
    }
  };

  const handleSelectPhoto = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      setNewProfileImage({
        uri: res[0].uri,
        type: res[0].type,
        name: res[0].name,
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        throw err;
      }
    }
  };

  const handleForgotPassword = () => {
    setShowResetPasswordModal(true);
  };

  const resetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    try {
      const payload = {
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
      };
      console.log('Payload:', payload);
      const response = await ApiPost('Users/changePassword', payload);
      console.log('Response:', response.data);
      setShowResetPasswordModal(false);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error.response?.data || error.message);
      Alert.alert('Erreur', 'La réinitialisation du mot de passe a échoué.');
    }
  };

  if (!profile) {
    return <Text>Chargement...</Text>;
  }
  return (
      <ScrollView contentContainerStyle={styles.mainmarge}>
        <View style={styles.profilecontainer}>
          <View style={styles.profileimagesection}>
            <Image
                source={{ uri: newProfileImage ? newProfileImage.uri : `${API_URL_IMAGE}${profile.profileImagePath}` }}
                style={styles.profileimg}
            />
          </View>
          <View style={styles.profileinfosection}>
            <View style={styles.infofield}>
              <Text style={styles.infotitle}>Email</Text>
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
          <TouchableOpacity onPress={() => setShowEditModal(true)} style={styles.editprofilebtn}>
            <Text style={styles.editprofilebtntext}>Modifier le profil</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showEditModal} transparent={true} animationType="slide">
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Modifier le Profil</Text>
                <Button title="Fermer" onPress={() => setShowEditModal(false)} />
              </View>
              <View style={styles.modalBody}>
                <View style={styles.imageContainer}>
                  <Image
                      source={{
                        uri: newProfileImage ? newProfileImage.uri : `${API_URL_IMAGE}${profile.profileImagePath}`,
                      }}
                      style={styles.profileimg}
                  />
                </View>
                <Text style={styles.label}>Nom d'utilisateur</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nom d'utilisateur"
                    value={editProfile.userName}
                    onChangeText={(text) => handleEditProfileChange('userName', text)}
                />
                <Text style={styles.label}>Prénom</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Prénom"
                    value={editProfile.firstName}
                    onChangeText={(text) => handleEditProfileChange('firstName', text)}
                />
                <Text style={styles.label}>Nom de famille</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nom de famille"
                    value={editProfile.lastName}
                    onChangeText={(text) => handleEditProfileChange('lastName', text)}
                />
                <View style={styles.buttonContainer}>
                  <Button title="Prendre une photo" onPress={handleTakePhoto} />
                </View>
              <View style={styles.buttonContainer}>
                  <Button title="Sélectionner une photo" onPress={handleSelectPhoto} />
                </View>
                <Button title="Sauvegarder les modifications" onPress={handleEditProfileSubmit} />
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={showResetPasswordModal} transparent={true} animationType="slide">
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Réinitialiser le mot de passe</Text>
                <Button title="Fermer" onPress={() => setShowResetPasswordModal(false)} />
              </View>
              <View style={styles.modalBody}>
                <Text style={styles.label}>Ancien mot de passe</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ancien mot de passe"
                    secureTextEntry={true}
                    value={oldPassword}
                    onChangeText={(text) => setOldPassword(text)}
                />
                <Text style={styles.label}>Nouveau mot de passe</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nouveau mot de passe"
                    secureTextEntry={true}
                    value={newPassword}
                    onChangeText={(text) => setNewPassword(text)}
                />
                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirmer le mot de passe"
                    secureTextEntry={true}
                    value={confirmNewPassword}
                    onChangeText={(text) => setConfirmNewPassword(text)}
                />
                <Button title="Réinitialiser le mot de passe" onPress={resetPassword} />
              </View>
            </View>
          </View>
        </Modal>

        <View>
          <Button title="Logout" onPress={handleLogout} />
        </View>
        <View style={styles.forgotPasswordContainer}>
          <Button title="Mot de passe oublié" onPress={handleForgotPassword} />
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainmarge: {
    paddingHorizontal: '5%',
  },
  profilecontainer: {
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  profileimagesection: {
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    color: '#2cc4b5',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  forgotPasswordContainer: {
    marginTop: 10,
    paddingHorizontal: '5%',
  },
});