import React from 'react';
import { FlatList, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { MqttMessage, useMqtt } from '../context/MqttContext';

export default function MessageLog() {
    const { messages } = useMqtt();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'light';

    const renderItem = ({ item }: { item: MqttMessage }) => (
        <View style={[styles.messageItem, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}>
            <View style={styles.header}>
                <Text style={[styles.topic, { color: isDark ? '#4dabf7' : '#007AFF' }]}>{item.topic}</Text>
                <Text style={[styles.time, { color: isDark ? '#aaa' : '#666' }]}>
                    {new Date(item.timestamp).toLocaleTimeString()}
                </Text>
            </View>
            <Text style={[styles.payload, { color: isDark ? '#eee' : '#333' }]}>{item.payload}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {messages.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={{ color: isDark ? '#666' : '#bbb' }}>No messages yet</Text>
                </View>
            ) : (
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 10 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageItem: {
        padding: 10,
        marginBottom: 8,
        borderRadius: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    topic: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    time: {
        fontSize: 10,
    },
    payload: {
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
});

import { Platform } from 'react-native';

