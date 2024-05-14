// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   Button,
//   TouchableOpacity,
//   ScrollView,
//   Image,
// } from 'react-native';
// import {useNavigation, useRoute} from '@react-navigation/native';
// // import {History_lastest} from '../../History_lastest/History_lastest'; // Assurez-vous que ce composant est compatible avec React Native
// // import {UserList} from '../../UserCompoments/UserList/UserList'; // Assurez-vous que ce composant est compatible avec React Native
// import {TransactionDetailsModal} from '../../GroupCompoments/TransactionDetailsModal/TransactionDetailsModal'; // Assurez-vous que ce composant est compatible avec React Native
// import {CreateExpenseModal} from '../../GroupCompoments/CreateExpenseModal/CreateExpenseModal'; // Assurez-vous que ce composant est compatible avec React Native
// import {fetchExpenses} from '../../../utils/GestionMethods/fetchExpenses.tsx';
// import {createExpense} from '../../../utils/GestionMethods/createExpense.tsx';
// import {updateExpense} from '../../../utils/GestionMethods/updateExpense.tsx';
// import {deleteExpense} from '../../../utils/GestionMethods/deleteExpense.tsx';
// import {axiosUtils} from '../../../utils/axiosUtils';
//
// export const Group1 = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const {ApiGet, ApiDelete, ApiPost, ApiPut} = axiosUtils();
//
//   useEffect(() => {
//     if (!route.params) {
//       navigation.navigate('home');
//     }
//   }, [route.params]);
//
//   const [group, setGroup] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [categories, setCategory] = useState([]);
//   const [currentView, setCurrentView] = useState('details');
//   const [participants, setParticipants] = useState([]);
//   const [selectedUserId, setSelectedUserId] = useState('');
//   const [formError, setFormError] = useState('');
//   const [showDetailsModal, setShowDetailsModal] = useState({});
//   const [showCreateExpenseModal, setShowCreateExpenseModal] = useState(false);
//   const [showModifyExpenseModal, setShowModifyExpenseModal] = useState(false);
//
//   useEffect(() => {
//     if (route.params) {
//       setGroup(route.params.group);
//     }
//
//     if (group) {
//       ApiGet(`Teams/${group.id}/users`)
//         .then(response => {
//           setUsers(response.data);
//         })
//         .catch(error => {
//           console.error('Erreur lors de la recherche:', error);
//         });
//
//       ApiGet(`Expenses/categories`)
//         .then(response => {
//           setCategory(response.data);
//           console.log('Liste des catégories de dépenses: ', response.data);
//         })
//         .catch(error => {
//           console.error('Erreur lors de la recherche:', error);
//         });
//     }
//   }, [group, route.params]);
//
//   const handleSubmit = (event, participants) => {
//     createExpense(
//       ApiPost,
//       ApiGet,
//       group,
//       event,
//       participants,
//       toggleCreateExpenseModal,
//       setFormError,
//       setHistory,
//     );
//   };
//
//   const handleDeleteExpense = expenseId => {
//     deleteExpense(ApiDelete, ApiGet, expenseId, toggleDetailsModal, setHistory);
//   };
//
//   const handleUpdateExpense = (expenseId, event, allParticipants) => {
//     updateExpense(
//       ApiPut,
//       ApiGet,
//       expenseId,
//       event,
//       allParticipants,
//       toggleModifyExpenseModal,
//       setFormError,
//       setHistory,
//       group,
//     );
//   };
//
//   const toggleView = view => {
//     setCurrentView(view);
//     if (view === 'history') {
//       fetchExpenses(ApiGet, group.id, setHistory);
//     }
//   };
//
//   const toggleDetailsModal = id => {
//     setShowDetailsModal(prevState => ({
//       ...prevState,
//       [id]: !prevState[id],
//     }));
//   };
//
//   const toggleCreateExpenseModal = () => {
//     setShowCreateExpenseModal(prevState => !prevState);
//     setSelectedUserId('');
//     setParticipants([]);
//     setFormError('');
//   };
//
//   const toggleModifyExpenseModal = () => {
//     setShowModifyExpenseModal(prevState => !prevState);
//     setSelectedUserId('');
//     setParticipants([]);
//     setFormError('');
//   };
//
//   return (
//     <View style={{flex: 1}}>
//       {group ? (
//         <>
//           <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
//             <Button title="Groupe" onPress={() => toggleView('details')} />
//             <Button title="Historique" onPress={() => toggleView('history')} />
//             <Button title="Membres" onPress={() => toggleView('users')} />
//           </View>
//           {currentView === 'details' && (
//             <View style={{flex: 1, flexDirection: 'row'}}>
//               <UserList
//                 users={users}
//                 adminId={group.adminId}
//                 groupId={group.id}
//               />
//               <View style={{flex: 1}}>
//                 <GroupChat teamId={group.id} />
//               </View>
//               <View style={{flex: 1}}>
//                 <Button
//                   title="Créer une dépense"
//                   onPress={() => setShowCreateExpenseModal(true)}
//                 />
//                 <CreateExpenseModal
//                   showCreateExpenseModal={showCreateExpenseModal}
//                   toggleCreateExpenseModal={toggleCreateExpenseModal}
//                   handleSubmit={handleSubmit}
//                   categories={categories}
//                   users={users}
//                   selectedUserId={selectedUserId}
//                   setSelectedUserId={setSelectedUserId}
//                   formError={formError}
//                 />
//                 <History_lastest />
//               </View>
//             </View>
//           )}
//           {currentView === 'history' && (
//             <ScrollView>
//               <Text>Historique des dépenses du groupe</Text>
//               {history.map(historyItem => (
//                 <View
//                   key={historyItem.id}
//                   style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     padding: 10,
//                   }}>
//                   <Text>{historyItem.title}</Text>
//                   <Text>{historyItem.category}</Text>
//                   <Text>{historyItem.amount} €</Text>
//                   <Text>
//                     {historyItem.isRefunded === 'True'
//                       ? 'Remboursé'
//                       : 'Non remboursé'}
//                   </Text>
//                   <Text>{historyItem.date}</Text>
//                   <Button
//                     title="Détails"
//                     onPress={() => toggleDetailsModal(historyItem.id)}
//                   />
//                   <TransactionDetailsModal
//                     historyItem={historyItem}
//                     showDetailsModal={showDetailsModal}
//                     toggleDetailsModal={toggleDetailsModal}
//                     deleteExpense={handleDeleteExpense}
//                     showModifyExpenseModal={showModifyExpenseModal}
//                     toggleModifyExpenseModal={toggleModifyExpenseModal}
//                     updateExpense={handleUpdateExpense}
//                     categories={categories}
//                     users={users}
//                     selectedUserId={selectedUserId}
//                     setSelectedUserId={setSelectedUserId}
//                     participants={participants}
//                     formError={formError}
//                   />
//                 </View>
//               ))}
//             </ScrollView>
//           )}
//           {currentView === 'users' && (
//             <View>
//               <Text>Liste des utilisateurs</Text>
//             </View>
//           )}
//         </>
//       ) : (
//         <Text>Loading group data...</Text>
//       )}
//     </View>
//   );
// };
