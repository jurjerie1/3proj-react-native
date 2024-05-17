import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {GroupChat} from '../../GroupCompoments/ChatCompoments/GroupChat/GroupChat.tsx';
import {UserList} from '../../GroupCompoments/UserComponments/UserList/UserList.tsx';
import {CreateExpenseModal} from '../../GroupCompoments/CreateExpenseModal/CreateExpenseModal.tsx';
import {TransactionDetailsModal} from '../../GroupCompoments/TransactionDetailsModal/TransactionDetailsModal.tsx';
import {HistoryLastest} from '../../GroupCompoments/History_lastest/History_lastest.tsx';
import {fetchExpense} from '../../../Utils/GestionMethods/fetchExpenses.tsx';
import {createExpense} from '../../../Utils/GestionMethods/createExpense.tsx';
import {updateExpense} from '../../../Utils/GestionMethods/updateExpense.tsx';
import {deleteExpense} from '../../../Utils/GestionMethods/deleteExpense.tsx';

import {axiosUtils} from '../../../Utils/axiosUtils.ts';

export const Group = ({group}) => {
  const {groupItem} = group.params || {}; // Safely access route.params
  console.log(groupItem)
  const navigation = useNavigation();
  const {ApiGet, ApiDelete, ApiPost, ApiPut} = axiosUtils();

  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [categories, setCategory] = useState([]);
  const [currentView, setCurrentView] = useState('details');
  const [participants, setParticipants] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [formError, setFormError] = useState('');

  const [showDetailsModal, setShowDetailsModal] = useState({});
  const [showCreateExpenseModal, setShowCreateExpenseModal] = useState(false);
  const [showModifyExpenseModal, setShowModifyExpenseModal] = useState(false);

  useEffect(() => {
    if (!groupItem) {
      navigation.navigate('Home');
      return;
    }

    ApiGet(`Teams/${groupItem.id}/users`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la recherche:', error);
      });

    ApiGet('Expenses/categories')
      .then(response => {
        setCategory(response.data);
        console.log('Liste des catégories de dépenses: ', response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la recherche:', error);
      });
  }, [groupItem]);

  const handleSubmit = (event, participants) => {
    createExpense(
      ApiPost,
      ApiGet,
      groupItem,
      event,
      participants,
      toggleCreateExpenseModal,
      setFormError,
      setHistory,
    );
  };

  const handleDeleteExpense = expenseId => {
    deleteExpense(ApiDelete, ApiGet, expenseId, toggleDetailsModal, setHistory);
  };

  const handleUpdateExpense = (expenseId, event, allParticipants) => {
    updateExpense(
      ApiPut,
      ApiGet,
      expenseId,
      event,
      allParticipants,
      toggleModifyExpenseModal,
      setFormError,
      setHistory,
      groupItem,
    );
  };

  const toggleView = view => {
    setCurrentView(view);
    if (view === 'history') {
      fetchExpenses(ApiGet, groupItem.id, setHistory);
    }
  };

  const toggleDetailsModal = id => {
    setShowDetailsModal(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const toggleCreateExpenseModal = () => {
    setShowCreateExpenseModal(prevState => !prevState);
    setSelectedUserId('');
    setParticipants([]);
    setFormError('');
  };

  const toggleModifyExpenseModal = () => {
    setShowModifyExpenseModal(prevState => !prevState);
    setSelectedUserId('');
    setParticipants([]);
    setFormError('');
  };

  if (!groupItem) {
    return <Text>Loading group data...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button title="Groupe" onPress={() => toggleView('details')} />
        <Button title="Historique" onPress={() => toggleView('history')} />
        <Button title="Membres" onPress={() => toggleView('users')} />
      </View>

      {currentView === 'details' && (
        <View style={styles.row}>
          <UserList
            users={users}
            adminId={groupItem.adminId}
            groupId={groupItem.id}
          />
          <View style={styles.col6}>
            <GroupChat teamId={groupItem.id} />
          </View>
          <View style={styles.col4}>
            <Button
              title="Créer une dépense"
              onPress={() => setShowCreateExpenseModal(true)}
            />
            <CreateExpenseModal
              showCreateExpenseModal={showCreateExpenseModal}
              toggleCreateExpenseModal={toggleCreateExpenseModal}
              handleSubmit={handleSubmit}
              categories={categories}
              users={users}
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              formError={formError}
            />
            <HistoryLastest />
          </View>
        </View>
      )}

      {currentView === 'history' && (
        <View>
          <Text>Historique des dépenses du groupe</Text>
          <FlatList
            data={history}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={styles.historyItem}>
                <Text>{item.title}</Text>
                <Text>{item.category}</Text>
                <Text>{item.amount} €</Text>
                <Text>
                  {item.isRefunded === 'True' ? 'Remboursé' : 'Non remboursé'}
                </Text>
                <Text>{item.date}</Text>
                <Button
                  title="Détails"
                  onPress={() => toggleDetailsModal(item.id)}
                />
                <TransactionDetailsModal
                  historyItem={item}
                  showDetailsModal={showDetailsModal}
                  toggleDetailsModal={toggleDetailsModal}
                  deleteExpense={handleDeleteExpense}
                  showModifyExpenseModal={showModifyExpenseModal}
                  toggleModifyExpenseModal={toggleModifyExpenseModal}
                  updateExpense={handleUpdateExpense}
                  categories={categories}
                  users={users}
                  selectedUserId={selectedUserId}
                  setSelectedUserId={setSelectedUserId}
                  participants={participants}
                  formError={formError}
                />
              </View>
            )}
          />
        </View>
      )}

      {currentView === 'users' && (
        <View>
          <Text>Liste des utilisateurs</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  col6: {
    flex: 6,
  },
  col4: {
    flex: 4,
    padding: 16,
  },
  historyItem: {
    marginVertical: 8,
  },
});
