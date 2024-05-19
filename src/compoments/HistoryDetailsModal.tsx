import React from 'react';
import {View, Text, Button, Image, Modal, StyleSheet} from 'react-native';
import {jsPDF} from 'jspdf';
import {Group, Refund} from '../../Types.ts';

interface HistoryItem {
  id: string;
  title: string;
  team: Group;
  category: string;
  amount: number;
  refunds: Refund[];
  justificatif: string;
}

interface Props {
  historyItem: HistoryItem;
  showDetailsModal: {[key: string]: boolean};
  toggleModal: (id: string) => void;
}

export const HistoryDetailsModal: React.FC<Props> = ({
  historyItem,
  showDetailsModal,
  toggleModal,
}) => {
  if (!showDetailsModal[historyItem.id]) return null;

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text(`Nom: ${historyItem.title}`, 10, 10);
    doc.text(`Groupe: ${historyItem.team.name}`, 10, 20);
    doc.text(`Catégorie: ${historyItem.category}`, 10, 30);
    doc.text(`Montant total: ${historyItem.amount}€`, 10, 40);
    doc.text('Membres:', 10, 50);

    historyItem.refunds.forEach((refund, index) => {
      doc.text(
        `${refund.user.userName}: ${refund.amount}€`,
        10,
        60 + index * 10,
      );
    });

    if (historyItem.justificatif) {
      doc.addPage();
      doc.text('Justificatif:', 10, 10);
      doc.addImage(historyItem.justificatif, 'JPEG', 15, 20, 180, 160);
    }

    doc.save(`${historyItem.title}_details.pdf`);
  };

  return (
    <Modal
      visible={!!showDetailsModal[historyItem.id]}
      onRequestClose={() => toggleModal(historyItem.id)}
      transparent={true}
      animationType="slide">
      <View style={styles.modal}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Détails de la transaction</Text>
            <Button title="Close" onPress={() => toggleModal(historyItem.id)} />
          </View>
          <View style={styles.modalBody}>
            <View style={styles.flexRow}>
              <View style={styles.column}>
                <Text>Nom: {historyItem.title}</Text>
                <Text>Groupe: {historyItem.team.name}</Text>
                <Text>Catégorie: {historyItem.category}</Text>
                <Text>Montant total: {historyItem.amount}€</Text>
                <Text>Membres:</Text>
                {historyItem.refunds.map((refund, index) => (
                  <Text key={index}>
                    {refund.user.userName}: {refund.amount}€
                  </Text>
                ))}
              </View>
              <View style={styles.column}>
                <Text>Justificatif:</Text>
                {historyItem.justificatif ? (
                  <Image
                    style={styles.image}
                    source={{uri: historyItem.justificatif}}
                  />
                ) : null}
              </View>
            </View>
          </View>
          <View style={styles.modalFooter}>
            <Button
              title="Fermer"
              onPress={() => toggleModal(historyItem.id)}
            />
            <Button title="Télécharger PDF" onPress={generatePDF} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBody: {
    marginTop: 10,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  modalFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
});
