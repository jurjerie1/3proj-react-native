import React, {useState, useEffect} from 'react';
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

export const Group_list = () => {
  const [groups, setGroups] = useState<Group[]>([]); // pour stocker la liste des groupes
  const [showAddGroupModal, setShowAddGroupModal] = useState(false); // pour afficher le modal de création
  const [groupName, setGroupName] = useState(''); // pour stocker le nom du groupe à créer
  const [showEditGroupModal, setShowEditGroupModal] = useState(false); // pour afficher le modal de modification
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null); // pour stocker le groupe à modifier
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // pour stocker l'image sélectionnée

  const {ApiGet, ApiPost, ApiPut, ApiDelete} = axiosUtils();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = () => {
    ApiGet('Teams')
      .then(response => {
        setGroups(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des groupes:', error);
      });
  };

  const handleCreateGroup = () => {
    ApiPost('Teams', {name: groupName})
      .then(() => {
        fetchGroups(); // Rafraîchir la liste des groupes après la création
        setShowAddGroupModal(false); // Fermer le modal
        setGroupName(''); // Réinitialiser le nom du groupe
      })
      .catch(error => {
        console.error('Erreur lors de la création du groupe:', error);
      });
  };

  const handleDeleteGroup = (groupId: string) => {
    ApiDelete(`Teams/${groupId}`)
      .then(() => {
        fetchGroups(); // Rafraîchir la liste des groupes après la suppression
      })
      .catch(error => {
        console.error('Erreur lors de la suppression du groupe:', error);
      });
  };

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
        fetchGroups(); // Rafraîchir la liste des groupes après la mise à jour
        setShowEditGroupModal(false); // Fermer le modal
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du groupe:', error);
      });
  };

  const handleCardClick = (group: Group) => {
    // Navigation logic here
  };

  return (
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
              <Text style={styles.header}>Liste des groupes</Text>
              <Image
                style={styles.cardImage}
                source={{uri: `${API_URL_IMAGE}${group.imageUrl}`}}
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
              <TouchableOpacity style={styles.btnCollapse} onPress={() => {}}>
                <Text style={styles.collapseIcon}>▼</Text>
              </TouchableOpacity>
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
    width: '100%',
    paddingBottom: '100%',
    position: 'relative',
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
  btnCollapse: {
    marginTop: 8,
    marginBottom: 8,
  },
  collapseIcon: {
    fontSize: 24,
    color: '#07c9a3',
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

export default Group_list;
