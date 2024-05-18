import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Button,
    ScrollView,
} from 'react-native';
import { Group } from '../../Types.ts';
import { axiosUtils } from '../Utils/axiosUtils.ts';
import { createExpense } from '../Utils/GestionMethods/createExpense.tsx'; // Import the createExpense function
import DocumentPicker from 'react-native-document-picker'; // Import DocumentPicker

export const GroupDetails = ({ group }: { group: Group }) => {
    const { ApiGet, ApiPost } = axiosUtils();
    const [modalVisible, setModalVisible] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Adjust the date format
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [participants, setParticipants] = useState('');
    const [justificatif, setJustificatif] = useState(null);
    const [category, setCategory] = useState('');
    const [formError, setFormError] = useState('');
    const [history, setHistory] = useState([]); // Assuming you need to manage history
    const [memberModalVisible, setMemberModalVisible] = useState(false);
    const [newMember, setNewMember] = useState('');
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [inviteError, setInviteError] = useState('');
    const [inviteSuccess, setInviteSuccess] = useState('');

    const handleAddExpense = () => {
        setModalVisible(true);
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
            console.log(newMember)
            const userId = await fetchUserId(newMember);
            console.log(userId)
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

    const fetchUserId = async (username) => {
        try {
            const response = await ApiPost('Users/search', {
                query: username,
                teamId: "",
                includeTeamMembers: true,
                limit: 20
            });
            const users = response.data; // Assume this is an array of user objects
            const user = users.find(user => user.userName === username);
            return user ? user.id : null;
        } catch (error) {
            console.error(`Error fetching user ID for ${username}:`, error);
            return null;
        }
    };


    const sendInviteRequest = async (userId) => {
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
        // Parse participants string into array of usernames
        const participantUsernames = participants
            .split(',')
            .map(participant => participant.trim());

        try {
            // Fetch user IDs for all participants
            const parsedParticipants = await Promise.all(
                participantUsernames.map(async username => {
                    const userId = await fetchUserId(username);
                    return { UserId: userId, Amount: null };
                }),
            );

            // Filter out participants where userId could not be fetched
            const validParticipants = parsedParticipants.filter(
                p => p.UserId !== null,
            );

            // Log the form data
            console.log('Form Data:', {
                date,
                title,
                amount,
                participants: validParticipants,
                category,
                justificatif,
            });

            // Create expense
            createExpense(
                ApiPost,
                ApiGet,
                group,
                date,
                title,
                amount,
                category,
                justificatif,
                validParticipants,
                () => setModalVisible(false), // toggleCreateExpenseModal
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

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Group Details</Text>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupDescription}>{group.description}</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
                <Text style={styles.addButtonText}>Ajouter une dépense</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleInviteMember}>
                <Text style={styles.addButtonText}>Inviter un membre</Text>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7f7f7', // light grey background
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333', // dark grey text
        marginBottom: 10,
    },
    groupName: {
        fontSize: 22, // Large font size for group name
        fontWeight: '600',
        color: '#444', // medium grey text
        marginBottom: 10,
        textAlign: 'center',
    },
    groupDescription: {
        fontSize: 16, // Smaller font size for description
        color: '#555', // dark grey text
        marginBottom: 20,
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: '#007bff', // blue background
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20, // Add space between description and button
    },
    addButtonText: {
        color: '#fff', // white text color
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
