import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Message } from '../../../Types';

type ChatProps = {
    messages: Message[];
};

export const Chat: React.FC<ChatProps> = ({ messages }) => {
    const renderItem = ({ item }: { item: Message }) => (
        <View key={item.id} style={styles.message}>
            <Text style={styles.userName}>{item.user.userName}</Text>
            <Text style={styles.timestamp}>
                {new Date(item.createdAt).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </Text>
            <Text style={styles.content}>{item.content}</Text>
        </View>
    );

    return (
        <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
        />
    );
};

const styles = StyleSheet.create({
    message: {
        marginBottom: 16,
        padding: 12,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
    },
    userName: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    timestamp: {
        color: '#555',
        marginBottom: 8,
    },
    content: {
        fontSize: 16,
    },
});
