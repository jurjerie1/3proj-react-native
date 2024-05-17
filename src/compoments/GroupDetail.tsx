import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, Image } from 'react-native';
import { Group, User } from '../../Types.ts';
import { axiosUtils } from '../Utils/axiosUtils.ts';
import { fetchUsersTeam } from '../Utils/GestionMethods/fetchUsersTeam.tsx';
import { API_URL_IMAGE } from '../../config.ts';

export const GroupDetails = ({ group }: { group: Group }) => {
    const { ApiGet } = axiosUtils();
    const [showUsers, setShowUsers] = useState<User[]>([]);

    useEffect(() => {
        fetchUsersTeam(ApiGet, group.id, setShowUsers);
    }, [group.id]);

    useEffect(() => {
        console.log("Current users: ", showUsers); // Log the current users whenever they change
    }, [showUsers]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Group Details</Text>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupDescription}>{group.description}</Text>
            {showUsers.length > 0 ? (
                <FlatList
                    data={showUsers}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.userItem}>
                            <Image
                                source={{
                                    uri: `${API_URL_IMAGE}${item.profileImagePath}`,
                                }}
                                style={styles.userImage}
                            />
                            <Text style={styles.userName}>{item.userName}</Text>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noUsersText}>No users found for this group.</Text>
            )}
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
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd', // light grey border
        borderRadius: 8,
        marginBottom: 10,
        width: '100%',
        backgroundColor: '#fff', // white background for user item
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    userName: {
        fontSize: 16,
        color: '#333', // dark grey text
    },
    noUsersText: {
        fontSize: 16,
        color: '#999', // grey text for no users found
    },
});

