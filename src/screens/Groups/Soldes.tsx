import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {axiosUtils} from '../../Utils/axiosUtils.ts';
import {fetchCategories} from '../../Utils/GestionMethods/fetchCategories.tsx';
import {deleteExpense} from '../../Utils/GestionMethods/deleteExpense.tsx';
import {updateExpense} from '../../Utils/GestionMethods/updateExpense.tsx';
import {fetchExpenses} from '../../Utils/GestionMethods/fetchExpenses.tsx';

export const Soldes = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {ApiGet, ApiDelete, ApiPost, ApiPut} = axiosUtils();

  const [group, setGroup] = useState(null);
  const [, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [, setCategory] = useState([]);
  const [formError, setFormError] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    title: '',
    category: '',
    minAmount: '',
    maxAmount: '',
  });

  useEffect(() => {
    if (!route.params) {
      navigation.navigate('Home');
    } else {
      setGroup(route.params.group);
      fetchCategories(ApiGet, setCategory);
    }
  }, [route.params]);

  useEffect(() => {
    if (group) {
      ApiGet(`Teams/${group.id}/users`)
        .then(response => {
          if (response.headers['content-type'].includes('application/json')) {
            setUsers(response.data);
          } else {
            console.error('Unexpected response format:', response);
          }
        })
        .catch(error => {
          console.error('Erreur lors de la recherche:', error);
        });

      fetchExpenses(ApiGet, group.id, setHistory, {}, setFormError);
    }
  }, [group]);

  const handleDeleteExpense = expenseId => {
    deleteExpense(
      ApiDelete,
      ApiGet,
      expenseId,
      toggleDetailsModal,
      setHistory,
      group,
    );
  };
    const toggleDetailsModal = id => {
    setShowDetailsModal(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  const applyFilters = () => {
    fetchExpenses(ApiGet, group.id, setHistory, filterCriteria, setFormError);
    toggleFilterModal();
  };

  const formatDate = dateString => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderHistoryItem = ({item}) => (
    <View style={styles.historyItem}>
      <Text style={styles.itemText}>{item.title}</Text>
      <Text style={styles.itemText}>{item.category}</Text>
      <Text style={styles.itemText}>{item.amount} €</Text>
      <Text style={styles.itemText}>
        {item.isRefunded ? 'Remboursé' : 'Non remboursé'}
      </Text>
      <Text style={styles.itemText}>{formatDate(item.date)}</Text>
      <Button title="Détails" onPress={() => toggleDetailsModal(item.id)} />
      <Modal
        visible={!!showDetailsModal[item.id]}
        onRequestClose={() => toggleDetailsModal(item.id)}>
        <View style={styles.modalView}>
          <Text>Transaction Details for {item.title}</Text>
          <Button title="Fermer" onPress={() => toggleDetailsModal(item.id)} />
          <Button
            title="Supprimer"
            onPress={() => handleDeleteExpense(item.id)}
          />
        </View>
      </Modal>
    </View>
  );

  return (
    <View style={styles.container}>
      {group ? (
        <View>
          <Text>Historique des dépenses du groupe</Text>
          {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
          <Button title="Filtrer" onPress={toggleFilterModal} />
          <Modal visible={showFilterModal} onRequestClose={toggleFilterModal}>
            <View style={styles.modalView}>
              <Text>Filter Modal</Text>
              <TextInput
                style={styles.input}
                placeholder="Titre"
                value={filterCriteria.title}
                onChangeText={text =>
                  setFilterCriteria({...filterCriteria, title: text})
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Catégorie"
                value={filterCriteria.category}
                onChangeText={text =>
                  setFilterCriteria({...filterCriteria, category: text})
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Montant minimum"
                keyboardType="numeric"
                value={filterCriteria.minAmount}
                onChangeText={text =>
                  setFilterCriteria({...filterCriteria, minAmount: text})
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Montant maximum"
                keyboardType="numeric"
                value={filterCriteria.maxAmount}
                onChangeText={text =>
                  setFilterCriteria({...filterCriteria, maxAmount: text})
                }
              />
              <Button title="Fermer" onPress={toggleFilterModal} />
              <Button title="Appliquer les filtres" onPress={applyFilters} />
            </View>
          </Modal>
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      ) : (
        <Text>Loading group data...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  historyItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '80%',
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
