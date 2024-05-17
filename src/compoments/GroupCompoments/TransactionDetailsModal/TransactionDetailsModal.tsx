import React from 'react';
import {
  View,
  Text,
  Image,
  Button,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {ModifyExpenseModal} from '../ModifyExpenseModal/ModifyExpenseModal.tsx';
import {UseAuth} from '../../../hooks/UseAuth';

export const TransactionDetailsModal = ({
  historyItem,
  showDetailsModal,
  toggleDetailsModal,
  deleteExpense,
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
  const {account} = UseAuth();

  if (!showDetailsModal[historyItem.id]) return null;

  return (
    <Modal
      visible={showDetailsModal[historyItem.id]}
      animationType="slide"
      transparent={true}
      onRequestClose={() => toggleDetailsModal(historyItem.id)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Détails de la transaction</Text>
          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text>Nom: {historyItem.title}</Text>
                <Text>Catégorie: {historyItem.category}</Text>
                <Text>Montant total: {historyItem.amount}€</Text>
                <Text>Membres:</Text>
                <View style={styles.membersList}>
                  {historyItem.refunds.map((refund, index) => (
                    <Text key={index}>
                      {refund.user.userName}: {refund.amount}€
                    </Text>
                  ))}
                </View>
              </View>
              <View style={styles.column}>
                <Text>Justificatif:</Text>
                <Image
                  style={styles.justificatifImage}
                  source={{uri: historyItem.justificatif}}
                  resizeMode="contain"
                />
              </View>
            </View>
          </ScrollView>
          {account?.user?.id === historyItem.payer.id && (
            <View style={styles.modalFooter}>
              <Button title="Modifier" onPress={toggleModifyExpenseModal} />
              <Button
                title="Supprimer"
                color="red"
                onPress={() => deleteExpense(historyItem.id)}
              />
              <Button
                title="Fermer"
                color="gray"
                onPress={() => toggleDetailsModal(historyItem.id)}
              />
            </View>
          )}
        </View>
        {showModifyExpenseModal && (
          <ModifyExpenseModal
            historyItem={historyItem}
            showModifyExpenseModal={showModifyExpenseModal}
            toggleModifyExpenseModal={toggleModifyExpenseModal}
            updateExpense={updateExpense}
            categories={categories}
            users={users}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            participants={participants}
            formError={formError}
          />
        )}
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
  modalBody: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginRight: 8,
  },
  membersList: {
    marginTop: 8,
  },
  justificatifImage: {
    width: '100%',
    height: 200,
    marginTop: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
});
