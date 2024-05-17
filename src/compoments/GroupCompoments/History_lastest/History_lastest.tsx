import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const HistoryLatest = () => {
    const test = [
        {
            group_name: 'Groupe 1',
            state: 'En attente',
            date: '2021-10-01',
            somme: '+ 100 €',
            id: '1',
            member_list: ['Pierre', 'Noah', 'Yanis'],
            description: 'Restaurant',
        },
        {
            group_name: 'Groupe 2',
            state: 'En attente',
            date: '2021-10-01',
            somme: '- 100 €',
            id: '2',
            member_list: ['Pierre'],
            description: 'Cinéma',
        },
        {
            group_name: 'Groupe 3',
            state: 'Remboursé',
            date: '2021-10-01',
            somme: '- 1000 €',
            id: '3',
            member_list: ['Pierre', 'Noah', 'Yanis'],
            description: 'Piscine',
        },
    ];

    const [expanded, setExpanded] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpanded(expanded === id ? null : id);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Historique récent</Text>
            {test.map((group, index) => (
                <View key={index} style={styles.row}>
                    <View style={styles.card}>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>{group.group_name}</Text>
                            <Text style={styles.cardText}>Description: {group.description}</Text>
                            <Text style={styles.cardText}>Date: {group.date}</Text>
                            {group.somme.startsWith('+') ? (
                                <Text style={styles.cardText}>En attente d'être remboursé de : {group.somme}</Text>
                            ) : (
                                <Text style={styles.cardText}>Vous devez rembourser : {group.somme}</Text>
                            )}
                            <Text style={styles.cardText}>Etat: {group.state}</Text>
                            <TouchableOpacity
                                style={styles.caretButton}
                                onPress={() => toggleExpand(group.id)}
                            >
                                <Text style={styles.caretText}>⌄</Text>
                            </TouchableOpacity>
                            {expanded === group.id && (
                                <View style={styles.collapseContent}>
                                    <Text style={styles.cardText}>
                                        Membres: {group.member_list.join(', ')}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        marginBottom: 16,
    },
    row: {
        marginBottom: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardBody: {
        flexDirection: 'column',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 16,
        marginBottom: 8,
    },
    caretButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    caretText: {
        fontSize: 24,
    },
    collapseContent: {
        marginTop: 8,
    },
});
