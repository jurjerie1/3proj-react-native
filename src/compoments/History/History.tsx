import React, {useState, useEffect} from 'react';
import {View, Text, Button, ScrollView, StyleSheet} from 'react-native';
import {axiosUtils} from '../../Utils/axiosUtils.ts';
import {fetchHistory} from '../../Utils/GestionMethods/fetchHistory.tsx';

interface Refund {
  user: {
    userName: string;
  };
  amount: number;
}

interface Team {
  name: string;
}

interface HistoryItem {
  id: string;
  title: string;
  team: Team;
  category: string;
  amount: number;
  refunds: Refund[];
  justificatif: string;
  isRefunded: string;
  date: string;
}

export const History: React.FC = () => {
  const {ApiGet} = axiosUtils();
  const [showHistoryModal, setShowHistoryModal] = useState<{
    [key: string]: boolean;
  }>({});
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const toggleHistoryModal = (id: string) => {
    setShowHistoryModal(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  useEffect(() => {
    fetchHistory(ApiGet, setHistory);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Historique</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Nom</Text>
          <Text style={styles.headerCell}>Groupe</Text>
          <Text style={styles.headerCell}>Catégorie</Text>
          <Text style={styles.headerCell}>Montant</Text>
          <Text style={styles.headerCell}>Statut</Text>
          <Text style={styles.headerCell}>Date</Text>
          <Text style={styles.headerCell} />
        </View>
        {history.map(historyItem => (
          <View key={historyItem.id} style={styles.tableRow}>
            <Text style={styles.cell}>{historyItem.title}</Text>
            <Text style={styles.cell}>{historyItem.team.name}</Text>
            <Text style={styles.cell}>{historyItem.category}</Text>
            <Text style={styles.cell}>{historyItem.amount}€</Text>
            <Text style={styles.cell}>
              {historyItem.isRefunded === 'True'
                ? 'Remboursé'
                : 'Non remboursé'}
            </Text>
            <Text style={styles.cell}>{historyItem.date}</Text>
            <View style={styles.cell}>
              <Button
                title="Détails"
                onPress={() => toggleHistoryModal(historyItem.id)}
              />
              {/*<HistoryDetailsModal*/}
              {/*  historyItem={historyItem}*/}
              {/*  showDetailsModal={showHistoryModal}*/}
              {/*  toggleModal={toggleHistoryModal}*/}
              {/*/>*/}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
  },
});
