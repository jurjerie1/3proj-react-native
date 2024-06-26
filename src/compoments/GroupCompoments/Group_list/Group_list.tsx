import React, {useState, useCallback} from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {API_URL_IMAGE} from '../../../../config';
import {axiosUtils} from '../../../Utils/axiosUtils';
import {Group} from '../../../../Types';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

export const Group_list = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [imageKey, setImageKey] = useState(0); // Key unique pour les images
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const navigation = useNavigation();
  const {ApiGet, ApiPost, ApiPut, ApiDelete} = axiosUtils();

  // Fetch groups when the component mounts or when focused
  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, []),
  );

  // Function to fetch groups from the API
  const fetchGroups = () => {
    ApiGet('Teams')
      .then(response => {
        setGroups(response.data);
        setImageKey(prevKey => prevKey + 1);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des groupes:', error);
      });
  };

  // Function to handle creating a new group
  const handleCreateGroup = () => {
    ApiPost('Teams', {name: groupName})
      .then(() => {
        fetchGroups();
        setShowAddGroupModal(false);
        setGroupName('');
      })
      .catch(error => {
        console.error('Erreur lors de la création du groupe:', error);
      });
  };

  // Function to handle deleting a group
  const handleDeleteGroup = (groupId: string) => {
    ApiDelete(`Teams/${groupId}`)
      .then(() => {
        fetchGroups();
      })
      .catch(error => {
        console.error('Erreur lors de la suppression du groupe:', error);
      });
  };

  // Function to handle updating a group
  const handleUpdateGroup = () => {
    const formData = new FormData();
    formData.append('Id', currentGroup.id);
    formData.append('Name', currentGroup.name);
    formData.append('Description', currentGroup.description);
    if (selectedImage) {
      formData.append('Image', selectedImage);
    }

    ApiPut('Teams', formData)
      .then(() => {
        fetchGroups();
        setShowEditGroupModal(false);
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du groupe:', error);
      });
  };

  // Function to handle group card click
  const handleCardClick = (group: Group) => {
    navigation.navigate('GroupDetails', {group});
  };

  return (
      // ScrollView to display the group list and modals
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Liste des groupes</Text>
      <TouchableOpacity
        style={[styles.btnPrimary, styles.button]}
        onPress={() => setShowAddGroupModal(true)}>
        <Text style={styles.btnText}>Créer un groupe</Text>
      </TouchableOpacity>

      <View style={styles.groupsContainer}>
        {groups.map((group, index) => (
          <View key={index} style={styles.groupCard}>
            <TouchableOpacity
              style={styles.cardImageContainer}
              onPress={() => handleCardClick(group)}>
              <Image
                style={styles.cardImage}
                source={{
                  uri: `${API_URL_IMAGE}${group.imageUrl}?key=${imageKey}`,
                }}
              />
            </TouchableOpacity>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>
                {group.name}
                {group.isAdmin && (
                  <Image
                    source={require('../../../assets/crown.png')}
                    style={styles.crownIcon}
                  />
                )}
              </Text>
              <Text style={styles.cardText}>
                Rôle: {group.isAdmin ? 'Admin' : 'Membre'}
              </Text>
              <View style={styles.collapseContent}>
                <Text style={styles.descriptionTitle}>
                  Description du groupe :
                </Text>
                <Text style={styles.cardText}>{group.description}</Text>
                {group.isAdmin && (
                  <View style={styles.adminButtons}>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleDeleteGroup(group.id)}>
                      <Text>🗑</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => {
                        setCurrentGroup(group);
                        setShowEditGroupModal(true);
                      }}>
                      <Text>✏️</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>

      <Modal
        visible={showAddGroupModal}
        transparent={true}
        animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Créer un nouveau groupe</Text>
              <TouchableOpacity onPress={() => setShowAddGroupModal(false)}>
                <Text style={styles.closeButton}>✖</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Nom du groupe"
                value={groupName}
                onChangeText={setGroupName}
              />
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.btnSecondary, styles.button]}
                onPress={() => setShowAddGroupModal(false)}>
                <Text style={styles.btnText}>Fermer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnPrimary, styles.button]}
                onPress={handleCreateGroup}>
                <Text style={styles.btnText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showEditGroupModal}
        transparent={true}
        animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier le groupe</Text>
              <TouchableOpacity onPress={() => setShowEditGroupModal(false)}>
                <Text style={styles.closeButton}>✖</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Nom du groupe"
                value={currentGroup ? currentGroup.name : ''}
                onChangeText={name => setCurrentGroup({...currentGroup, name})}
              />
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Description"
                multiline
                value={currentGroup ? currentGroup.description : ''}
                onChangeText={description =>
                  setCurrentGroup({...currentGroup, description})
                }
              />
              <TouchableOpacity style={styles.input} onPress={() => {}}>
                <Text>Sélectionner une image</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.btnSecondary, styles.button]}
                onPress={() => setShowEditGroupModal(false)}>
                <Text style={styles.btnText}>Fermer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnPrimary, styles.button]}
                onPress={handleUpdateGroup}>
                <Text style={styles.btnText}>
                  Sauvegarder les modifications
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    color: '#000',
  },
  button: {
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  btnPrimary: {
    backgroundColor: '#07c9a3',
    borderColor: '#07c9a3',
  },
  btnSecondary: {
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
  groupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  groupCard: {
    flexBasis: '48%',
    marginBottom: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImageContainer: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  cardImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardBody: {
    padding: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  crownIcon: {
    width: 25,
    height: 25,
    marginLeft: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
  },
  collapseContent: {
    display: 'none',
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  adminButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  iconButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 18,
  },
  closeButton: {
    fontSize: 24,
  },
  modalBody: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  textarea: {
    height: 100,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});
