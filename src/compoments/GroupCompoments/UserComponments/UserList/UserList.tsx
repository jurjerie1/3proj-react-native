import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // or any other icon library
import { useNavigation } from '@react-navigation/native';
import { User } from '../../../Types';
import { API_URL_IMAGE } from '../../../../../config.ts';
import { ModalInviteUserToTeam } from '../../ModalInviteUserToTeam/ModalInviteUserToTeam.tsx';

interface UserListProps {
    users: User[];
    adminId: string;
    groupId: string;
}

export const UserList: React.FC<UserListProps> = ({ users, adminId, groupId }) => {
    const [showModal, setShowModal] = useState(false);
    const navigation = useNavigation();

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const renderItem = ({ item }: { item: User }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: item.id })}>
            <View style={styles.userContainer}>
                <Image
                    source={{ uri: `${API_URL_IMAGE}${item.profileImagePath}` }}
                    style={styles.profileImage}
                    alt={`profile image ${item.userName}`}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                        {item.userName} {item.id === adminId ? <Icon name="star" size={16} color="#FFD700" /> : null}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ModalInviteUserToTeam showModal={showModal} handleCloseModal={handleCloseModal} groupId={groupId} />
            <View style={styles.actionIcons}>
                <TouchableOpacity onPress={handleOpenModal}>
                    <Icon name="plus-circle" size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleOpenModal}>
                    <Icon name="minus-circle" size={24} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
    },
    actionIcons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 8,
    },
    userContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'center',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    userInfo: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 8,
    },
    userName: {
        fontSize: 16,
    },
});
