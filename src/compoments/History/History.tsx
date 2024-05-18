import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {axiosUtils} from '../../Utils/axiosUtils.ts';
import {fetchHistory} from '../../Utils/GestionMethods/fetchHistory.tsx';
import {HistoryDetailsModal} from '../HistoryDetailsModal.tsx';

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
          <Text style={styles.headerCell}>Catégorie</Text>
          <Text style={styles.headerCell}>Montant</Text>
          <Text style={styles.headerCell}>Info</Text>
        </View>
        {history.map(historyItem => (
          <View key={historyItem.id} style={styles.tableRow}>
            <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">
              {historyItem.title}
            </Text>
            <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">
              {historyItem.category}
            </Text>
            <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">
              {historyItem.amount}€
            </Text>
            <View style={styles.cell}>
              <TouchableOpacity
                onPress={() => toggleHistoryModal(historyItem.id)}>
                <Image
                  source={require('../../assets/info.png')} // Remplacez ceci par le chemin de votre image
                  style={styles.image}
                />
              </TouchableOpacity>
              <HistoryDetailsModal
                historyItem={historyItem}
                showDetailsModal={showHistoryModal}
                toggleModal={toggleHistoryModal}
              />
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
    backgroundColor: '#f9f9f9', // Ajout d'une couleur de fond
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', // Centrage du titre
  },
  table: {
    width: '100%',
    borderRadius: 10, // Ajout de coins arrondis
    overflow: 'hidden', // Pour s'assurer que le contenu respecte les bords arrondis
    backgroundColor: '#fff', // Couleur de fond de la table
    shadowColor: '#000', // Ombre pour l'effet d'élévation
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0', // Couleur de fond de l'en-tête de table
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    paddingHorizontal: 5,
    textAlign: 'center',
    color: '#333', // Couleur du texte de l'en-tête
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Couleur plus claire pour les lignes de séparation
    paddingVertical: 15, // Espacement vertical plus grand pour les lignes de contenu
  },
  cell: {
    flex: 1,
    paddingHorizontal: 5,
    textAlign: 'center',
    justifyContent: 'center', // Centrage vertical du contenu
  },
  image: {
    width: 24,
    height: 24,
  },
});
