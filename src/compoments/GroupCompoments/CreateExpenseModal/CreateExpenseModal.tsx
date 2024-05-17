import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    Modal,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export const CreateExpenseModal = ({
                                       showCreateExpenseModal,
                                       toggleCreateExpenseModal,
                                       handleSubmit,
                                       categories,
                                       users,
                                       selectedUserId,
                                       setSelectedUserId,
                                       formError,
                                   }) => {
    const [participants, setParticipants] = useState([]);

    if (!showCreateExpenseModal) return null;

    const handleLocalAddParticipant = () => {
        if (participants.some((p) => p.UserId === selectedUserId)) return;
        const user = users.find((u) => u.id === selectedUserId);
        if (!user) return;
        const newParticipant = { UserId: user.id, Amount: 0 };
        setParticipants([...participants, newParticipant]);
    };

    const handleLocalParticipantAmountChange = (userId, amount) => {
        const updatedParticipants = participants.map((p) =>
            p.UserId === userId ? { ...p, Amount: parseFloat(amount) } : p
        );
        setParticipants(updatedParticipants);
    };

    const handleLocalRemoveParticipant = (userId) => {
        const updatedParticipants = participants.filter((p) => p.UserId !== userId);
        setParticipants(updatedParticipants);
    };

    const localHandleSubmit = (event) => {
        handleSubmit(event, participants);
    };

    return (
        <Modal
            visible={showCreateExpenseModal}
            animationType="slide"
            transparent={true}
            onRequestClose={toggleCreateExpenseModal}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Créer une dépense</Text>
                    {formError && <Text style={styles.errorText}>{formError}</Text>}
                    <ScrollView contentContainerStyle={styles.modalBody}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Nom</Text>
                            <TextInput style={styles.input} placeholder="Nom" />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Catégorie</Text>
                            <Picker
                                selectedValue={selectedUserId}
                                onValueChange={(itemValue) => setSelectedUserId(itemValue)}
                                style={styles.picker}
                            >
                                {categories.map((category, index) => (
                                    <Picker.Item key={index} label={category} value={category} />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Montant</Text>
                            <TextInput style={styles.input} placeholder="Montant" keyboardType="numeric" />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Justificatif</Text>
                            <Button title="Choisir un fichier" onPress={() => Alert.alert('Function not implemented')} />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Ajouter un participant</Text>
                            <Picker
                                selectedValue={selectedUserId}
                                onValueChange={(itemValue) => setSelectedUserId(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Sélectionner un utilisateur" value="" />
                                {users.map((user) => (
                                    <Picker.Item key={user.id} label={user.userName} value={user.id} />
                                ))}
                            </Picker>
                            <Button title="Ajouter" onPress={handleLocalAddParticipant} />
                        </View>
                        <FlatList
                            data={participants}
                            keyExtractor={(item) => item.UserId}
                            renderItem={({ item }) => (
                                <View style={styles.participant}>
                                    <Text>
                                        {users.find((u) => u.id === item.UserId)?.userName || 'Unknown User'}
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Montant"
                                        value={String(item.Amount)}
                                        onChangeText={(value) => handleLocalParticipantAmountChange(item.UserId, value)}
                                        keyboardType="numeric"
                                    />
                                    <Button
                                        title="Supprimer"
                                        color="red"
                                        onPress={() => handleLocalRemoveParticipant(item.UserId)}
                                    />
                                </View>
                            )}
                        />
                        <Button title="Créer" onPress={localHandleSubmit} />
                        <Button title="Fermer" color="gray" onPress={toggleCreateExpenseModal} />
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
    errorText: {
        color: 'red',
        marginBottom: 16,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        fontSize: 16,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    participant: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
});
