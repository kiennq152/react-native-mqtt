import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useMqtt } from '../context/MqttContext';

export default function PublishControl() {
    const { publish } = useMqtt();
    const [topic, setTopic] = useState('test/topic');
    const [payload, setPayload] = useState('Hello World');
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'light';

    const handlePublish = () => {
        if (topic && payload) {
            publish(topic, payload);
            // Optional: clear payload? setPayload('');
        }
    };

    const styles = StyleSheet.create({
        container: {
            padding: 10,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#444' : '#eee',
            backgroundColor: isDark ? '#222' : '#f9f9f9',
        },
        input: {
            borderWidth: 1,
            borderColor: isDark ? '#444' : '#ddd',
            borderRadius: 5,
            padding: 8,
            marginBottom: 8,
            backgroundColor: isDark ? '#333' : '#fff',
            color: isDark ? '#fff' : '#000',
        },
        button: {
            backgroundColor: '#28a745', // Green
            padding: 12,
            borderRadius: 5,
            alignItems: 'center',
        },
        buttonText: {
            color: '#fff',
            fontWeight: 'bold',
        },
        title: {
            fontWeight: 'bold',
            marginBottom: 5,
            color: isDark ? '#ddd' : '#555',
        }
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Publish Message</Text>
            <TextInput
                style={styles.input}
                value={topic}
                onChangeText={setTopic}
                placeholder="Topic"
                placeholderTextColor="#888"
            />
            <TextInput
                style={styles.input}
                value={payload}
                onChangeText={setPayload}
                placeholder="Message Payload"
                placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.button} onPress={handlePublish}>
                <Text style={styles.buttonText}>Publish</Text>
            </TouchableOpacity>
        </View>
    );
}
