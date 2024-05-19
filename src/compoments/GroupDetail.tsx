import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Button,
    ScrollView,
    Alert,
} from 'react-native';
import { Group } from '../../Types';
import { axiosUtils } from '../Utils/axiosUtils';
import DocumentPicker from 'react-native-document-picker';
import { createExpense } from "../Utils/GestionMethods/createExpense.tsx";
import { useNavigation } from '@react-navigation/native';

export const GroupDetails = ({ group }: { group: Group }) => {
    const { ApiGet, ApiPost, ApiPutCustom, ApiDelete } = axiosUtils();
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [participants, setParticipants] = useState('');
    const [justificatif, setJustificatif] = useState(null);
    const [category, setCategory] = useState('');
    const [formError, setFormError] = useState('');
    const [history, setHistory] = useState([]);
    const [memberModalVisible, setMemberModalVisible] = useState(false);
    const [newMember, setNewMember] = useState('');
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [inviteError, setInviteError] = useState('');
    const [inviteSuccess, setInviteSuccess] = useState('');
    const [editGroupModalVisible, setEditGroupModalVisible] = useState(false);
    const [groupName, setGroupName] = useState(group.name);
    const [groupDescription, setGroupDescription] = useState(group.description);
    const [groupImage, setGroupImage] = useState(null);
    const [groupDetails, setGroupDetails] = useState<Group | null>(group);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const handleAddExpense = () => {
        setModalVisible(true);
    };

    const fetchGroup = async () => {
        try {
            const response = await ApiGet("Teams/" + group.id);
            setGroupDetails(response.data);
        } catch (error) {
            console.error('Error fetching group details:', error);
        }
    };

    const handleAddMember = () => {
        setMemberModalVisible(true);
    };

    const handleMemberSubmit = () => {
        setParticipants(prev => (prev ? `${prev},${newMember}` : newMember));
        setNewMember('');
        setMemberModalVisible(false);
    };

    const handleInviteMember = () => {
        setInviteModalVisible(true);
    };

    const handleSendInvite = async () => {
        try {
            const userId = await fetchUserId(newMember);
            if (!userId) {
                throw new Error('User not found');
            }
            await sendInviteRequest(userId);
            setInviteSuccess('Invitation sent successfully!');
            setInviteError('');
            setNewMember('');
            setInviteModalVisible(false);
        } catch (error) {
            setInviteError(error.message);
            setInviteSuccess('');
        }
    };

    const fetchUserId = async (username: string) => {
        try {
            const response = await ApiGet(`/Teams/${group.id}/users`);
            const users = response.data;
            const user = users.find((user: any) => user.userName === username);
            return user ? user.id : null;
        } catch (error) {
            console.error(`Error fetching user ID for ${username}:`, error);
            return null;
        }
    };

    const sendInviteRequest = async (userId: string) => {
        try {
            const response = await ApiPost(`Invitations/invite/${group.id}`, {
                userIds: [userId]
            });
            return response.data;
        } catch (error) {
            console.error('Error sending invite request:', error);
            throw new Error('Error sending invite request');
        }
    };

    const handleFormSubmit = async () => {
        const participantUsernames = participants
            .split(',')
            .map(participant => participant.trim());
        try {
            const parsedParticipants = await Promise.all(
                participantUsernames.map(async username => {
                    const userId = await fetchUserId(username);
                    return { UserId: userId, Amount: null };
                }),
            );

            const validParticipants = parsedParticipants.filter(
                p => p.UserId !== null,
            );

            createExpense(
                ApiPostCustom,
                ApiGet,
                group,
                date,
                title,
                amount,
                category,
                justificatif,
                validParticipants,
                () => setModalVisible(false),
                setFormError,
                setHistory,
            );
        } catch (error) {
            console.error('Error processing form:', error);
            setFormError('Error processing form. Please try again.');
        }
    };

    const handleJustificatifChange = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            setJustificatif(res[0]);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker
            } else {
                throw err;
            }
        }
    };

    const handleEditGroup = () => {
        setEditGroupModalVisible(true);
    };

    const handleGroupImageChange = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });
            setGroupImage(res[0]);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker
            } else {
                throw err;
            }
        }
    };

    const handleGroupSubmit = async () => {
        const formData = new FormData();
        formData.append('Name', groupName);
        formData.append('Description', groupDescription);
        if (groupImage) {
            formData.append('Image', {
                uri: groupImage.uri,
                type: groupImage.type,
                name: groupImage.name,
            });
        } else {
            formData.append('Image', ''); // Explicitly set the image field to empty if no image is provided
        }

        try {
            const response = await ApiPutCustom(`Teams/${group.id}`, formData);
            setEditGroupModalVisible(false);
            fetchGroup();
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('General error:', error.message);
            }
            console.error('Error updating group:', error);
        }
    };

    const handleDeleteGroup = async () => {
        if (deleteConfirmation.toLowerCase() === 'oui') {
            try {
                await ApiDelete(`Teams/${group.id}`);
                Alert.alert('Succès', 'Le groupe a été supprimé avec succès', [
                    { text: 'OK', onPress: () => navigation.navigate('GroupList') },
                ]);
                // Optionally, navigate away or update the UI after deletion
            } catch (error) {
                Alert.alert('Erreur', 'Erreur lors de la suppression du groupe');
                console.error('Error deleting group:', error);
            }
        } else {
            Alert.alert('Erreur', 'Veuillez taper "oui" pour confirmer la suppression');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Group Details</Text>
            <Text style={styles.groupName}>{groupDetails?.name}</Text>
            <Text style={styles.groupDescription}>{groupDetails?.description}</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
                <Text style={styles.addButtonText}>Ajouter une dépense</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleInviteMember}>
                <Text style={styles.addButtonText}>Inviter un membre</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={handleEditGroup}>
                <Text style={styles.editButtonText}>Modifier le groupe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteModalVisible(true)}>
                <Text style={styles.deleteButtonText}>Supprimer le groupe</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Ajouter une dépense</Text>
                        <ScrollView contentContainerStyle={styles.scrollViewContent}>
                            {formError ? (
                                <Text style={styles.errorText}>{formError}</Text>
                            ) : null}
                            <TextInput
                                style={styles.input}
                                placeholder="Date"
                                value={date}
                                onChangeText={setDate}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Titre"
                                value={title}
                                onChangeText={setTitle}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Montant"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Participants"
                                value={participants}
                                onChangeText={setParticipants}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Catégorie"
                                value={category}
                                onChangeText={setCategory}
                            />
                            <Button
                                title="Choisir un fichier"
                                onPress={handleJustificatifChange}
                            />
                            {justificatif ? <Text>{justificatif.name}</Text> : null}
                            <View style={styles.buttonRow}>
                                <Button
                                    title="Annuler"
                                    onPress={() => setModalVisible(false)}
                                />
                                <Button title="Ajouter" onPress={handleFormSubmit} />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={inviteModalVisible}
                onRequestClose={() => setInviteModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Inviter un membre</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom du membre"
                            value={newMember}
                            onChangeText={setNewMember}
                        />
                        {inviteError ? <Text style={styles.errorText}>{inviteError}</Text> : null}
                        {inviteSuccess ? <Text style={styles.successText}>{inviteSuccess}</Text> : null}
                        <View style={styles.buttonRow}>
                            <Button
                                title="Annuler"
                                onPress={() => setInviteModalVisible(false)}
                            />
                            <Button title="Inviter" onPress={handleSendInvite} />
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={editGroupModalVisible}
                onRequestClose={() => setEditGroupModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Modifier le groupe</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom du groupe"
                            value={groupName}
                            onChangeText={setGroupName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Description du groupe"
                            value={groupDescription}
                            onChangeText={setGroupDescription}
                        />
                        <Button
                            title="Choisir une image"
                            onPress={handleGroupImageChange}
                        />
                        {groupImage ? <Text>{groupImage.name}</Text> : null}
                        <View style={styles.buttonRow}>
                            <Button
                                title="Annuler"
                                onPress={() => setEditGroupModalVisible(false)}
                            />
                            <Button title="Enregistrer" onPress={handleGroupSubmit} />
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => setDeleteModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Supprimer le groupe</Text>
                        <Text>Veuillez taper "oui" pour confirmer la suppression:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Tapez 'oui' ici"
                            value={deleteConfirmation}
                            onChangeText={setDeleteConfirmation}
                        />
                        <View style={styles.buttonRow}>
                            <Button
                                title="Annuler"
                                onPress={() => setDeleteModalVisible(false)}
                            />
                            <Button title="Confirmer" onPress={handleDeleteGroup} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7f7f7',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    groupName: {
        fontSize: 22,
        fontWeight: '600',
        color: '#444',
        marginBottom: 10,
        textAlign: 'center',
    },
    groupDescription: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: '#28a745',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scrollViewContent: {
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    successText: {
        color: 'green',
        marginBottom: 10,
    },
});
