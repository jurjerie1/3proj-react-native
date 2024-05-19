import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

export const ModifyExpenseModal = ({
  historyItem,
  showModifyExpenseModal,
  toggleModifyExpenseModal,
  updateExpense,
  categories,
  users,
  selectedUserId,
  setSelectedUserId,
  participants,
  formError,
}) => {
  const [allParticipants, setAllParticipants] = useState([]);

  // Effect to initialize participants when the component mounts or historyItem changes
  useEffect(() => {
    if (historyItem) {
      const defaultParticipants = historyItem.refunds.map(refund => ({
        UserId: refund.user.id,
        amount: refund.amount,
      }));
      setAllParticipants([
        ...defaultParticipants,
        ...participants.filter(
          p => !defaultParticipants.some(dp => dp.UserId === p.UserId),
        ),
      ]);
    }
  }, [historyItem, participants]);

  if (!showModifyExpenseModal || !historyItem) return null;


  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault();
    updateExpense(historyItem.id, e, allParticipants);
  };

  // Handle adding a participant locally
  const handleLocalAddParticipant = () => {
    if (allParticipants.some(p => p.UserId === selectedUserId)) return;
    const user = users.find(u => u.id === selectedUserId);
    if (!user) return;
    const newParticipant = {UserId: user.id, amount: 0};
    setAllParticipants([...allParticipants, newParticipant]);
  };

  // Handle changing the amount for a participant locally
  const handleLocalParticipantAmountChange = (userId, amount) => {
    const updatedParticipants = allParticipants.map(p =>
      p.UserId === userId ? {...p, amount: parseFloat(amount)} : p,
    );
    setAllParticipants(updatedParticipants);
  };

  // Handle removing a participant locally
  const handleLocalRemoveParticipant = userId => {
    const updatedParticipants = allParticipants.filter(
      p => p.UserId !== userId,
    );
    setAllParticipants(updatedParticipants);
  };

  return (
    <Modal
      visible={showModifyExpenseModal}
      animationType="slide"
      transparent={true}
      onRequestClose={toggleModifyExpenseModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Modifier une dépense</Text>
          <ScrollView contentContainerStyle={styles.modalBody}>
            {formError && <Text style={styles.errorText}>{formError}</Text>}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={styles.input}
                placeholder="Nom"
                defaultValue={historyItem?.title}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Catégorie</Text>
              <Picker
                selectedValue={selectedUserId}
                onValueChange={itemValue => setSelectedUserId(itemValue)}
                style={styles.picker}>
                {categories.map((category, index) => (
                  <Picker.Item key={index} label={category} value={category} />
                ))}
              </Picker>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Montant</Text>
              <TextInput
                style={styles.input}
                placeholder="Montant"
                keyboardType="numeric"
                defaultValue={String(historyItem?.amount)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Justificatif</Text>
              <Button
                title="Choisir un fichier"
                onPress={() => Alert.alert('Function not implemented')}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Ajouter un participant</Text>
              <Picker
                selectedValue={selectedUserId}
                onValueChange={itemValue => setSelectedUserId(itemValue)}
                style={styles.picker}>
                <Picker.Item label="Sélectionner un utilisateur" value="" />
                {users.map(user => (
                  <Picker.Item
                    key={user.id}
                    label={user.userName}
                    value={user.id}
                  />
                ))}
              </Picker>
              <Button title="Ajouter" onPress={handleLocalAddParticipant} />
            </View>
            <FlatList
              data={allParticipants}
              keyExtractor={item => item.UserId}
              renderItem={({item}) => (
                <View style={styles.participant}>
                  <Text>
                    {users.find(u => u.id === item.UserId)?.userName ||
                      'Unknown User'}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Montant"
                    value={String(item.amount)}
                    onChangeText={value =>
                      handleLocalParticipantAmountChange(item.UserId, value)
                    }
                    keyboardType="numeric"
                  />
                  <Button
                    title="Supprimer"
                    color="red"
                    onPress={() => handleLocalRemoveParticipant(item.UserId)}
                  />
                </View>
              )}
            />
            <Button title="Modifier" onPress={handleSubmit} />
            <Button
              title="Fermer"
              color="gray"
              onPress={toggleModifyExpenseModal}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  participant: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
