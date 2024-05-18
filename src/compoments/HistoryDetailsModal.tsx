import React from 'react';
import {
  View,
  Text,
  Button,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface HistoryDetailsModal {
  historyItem: {
    id: string;
    title: string;
    team: {name: string};
    category: string;
    amount: number;
    refunds: {user: {userName: string}; amount: number}[];
    justificatif?: string;
  };
  showDetailsModal: {[key: string]: boolean};
  toggleModal: (id: string) => void;
}

export const HistoryDetailsModal: React.FC<HistoryDetailsModalProps> = ({
  historyItem,
  showDetailsModal,
  toggleModal,
}) => {
  if (!showDetailsModal[historyItem.id]) return null;

  return (
    <Modal
      visible={showDetailsModal[historyItem.id]}
      transparent={true}
      animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Détails de la transaction</Text>
            <Button
              title="Fermer"
              onPress={() => toggleModal(historyItem.id)}
            />
          </View>
          <ScrollView>
            <View style={styles.body}>
              <View style={styles.section}>
                <Text>Nom: {historyItem.title}</Text>
                <Text>Groupe: {historyItem.team.name}</Text>
                <Text>Catégorie: {historyItem.category}</Text>
                <Text>Montant total: {historyItem.amount}€</Text>
                <Text>
                  Status :{' '}
                  {historyItem.isRefunded === 'True'
                    ? 'Remboursé'
                    : 'Non remboursé'}{' '}
                </Text>
                <Text>Membres:</Text>
                <View>
                  {historyItem.refunds.map((refund, index) => (
                    <Text key={index}>
                      {refund.user.userName}: {refund.amount}€
                    </Text>
                  ))}
                </View>
              </View>
              <View style={styles.section}>
                <Text>Justificatif:</Text>
                {historyItem.justificatif && (
                  <Image
                    style={styles.image}
                    source={{uri: historyItem.justificatif}}
                  />
                )}
              </View>
            </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
