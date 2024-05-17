import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_URL, API_URL_IMAGE } from '../../../../../config.ts';
import { User } from '../../../Types';

interface SearchUserProps {
    setSearchResults: (users: User[]) => void;
    isMultiple: boolean;
    textValue: string;
    textOnclick?: string;
}

export const SearchUser: React.FC<SearchUserProps> = ({ setSearchResults, isMultiple, textValue }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [userList, setUserList] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    // Function to perform the search
    const handleSearch = () => {
        if (searchTerm.length < 1) return;
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(`${API_URL}Users/search`, {
                Query: searchTerm,
                Limit: 20,
                TeamId: null,
            })
                .then(response => {
                    console.log('Search results:', response.data);
                    setUserList(response.data);
                })
                .catch(error => {
                    console.error('Error fetching search results:', error);
                });
        }
    };

    // Effect to trigger the search automatically when the search term length is greater than 3
    useEffect(() => {
        if (searchTerm.length > 3) {
            handleSearch();
        } else {
            setUserList([]); // Reset the user list if the search term length is less than 3
        }
    }, [searchTerm]);

    // Function to select a user and reset the list
    const handleSelectUser = (user: User) => {
        setSearchTerm('');
        setUserList([]);
        setSearchResults([user]); // Trigger search result update in the parent component
    };

    const renderUserItem = ({ item }: { item: User }) => (
        isMultiple ? (
            <View style={styles.userItem}>
                <Image
                    source={{ uri: `${API_URL_IMAGE}${item.profileImagePath}` }}
                    style={styles.profileImage}
                />
                <Text style={styles.userName}>{item.userName}</Text>
                <Button
                    title={textValue}
                    onPress={() => setSearchResults([item])}
                />
            </View>
        ) : (
            <TouchableOpacity
                key={item.id}
                style={styles.userItem}
                onPress={() => handleSelectUser(item)}
            >
                <Image
                    source={{ uri: `${API_URL_IMAGE}${item.profileImagePath}` }}
                    style={styles.profileImage}
                />
                <Text style={styles.userName}>{item.userName}</Text>
            </TouchableOpacity>
        )
    );

    return (
        <View>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher un utilisateur"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
                <Button
                    title="Rechercher"
                    onPress={handleSearch}
                />
            </View>
            <FlatList
                data={userList}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        marginRight: 8,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: {
        flex: 1,
        fontSize: 16,
    },
});
