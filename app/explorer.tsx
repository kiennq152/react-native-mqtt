import MessageLog from '@/components/MessageLog';
import PublishControl from '@/components/PublishControl';
import TopicTree from '@/components/TopicTree';
import { globalStyles } from '@/constants/Styles';
import { useMqtt } from '@/context/MqttContext';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExplorerScreen() {
    const { isConnected, disconnect, subscribe, unsubscribe, messages } = useMqtt();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [subTopic, setSubTopic] = useState('#');
    const [isSubModalVisible, setIsSubModalVisible] = useState(false);
    const [viewMode, setViewMode] = useState<'log' | 'tree'>('tree'); // Toggle state

    useEffect(() => {
        if (!isConnected) {
            //   router.replace('/'); // Allow browsing history even if disconnected? Maybe not for now.
        } else {
            subscribe('#');
        }
    }, [isConnected]);

    const handleDisconnect = () => {
        disconnect();
        router.replace('/');
    };

    const handleSubscribe = () => {
        subscribe(subTopic);
        setIsSubModalVisible(false);
    };

    return (
        <SafeAreaView style={[globalStyles.container, isDark ? { backgroundColor: '#1a1a1a' } : {}, { padding: 0 }]}>
            <Stack.Screen options={{
                headerShown: true,
                headerRight: () => (
                    <TouchableOpacity onPress={handleDisconnect} style={{ marginRight: 10 }}>
                        <Text style={{ color: 'red' }}>Disconnect</Text>
                    </TouchableOpacity>
                ),
                headerTitle: isConnected ? 'Connected' : 'Disconnected',
                headerStyle: { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
                headerTintColor: isDark ? '#fff' : '#000',
            }} />

            <View style={styles.topBar}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.headerText, { color: isDark ? '#fff' : '#000', marginRight: 10 }]}>Messages</Text>
                    {/* View Toggle */}
                    <View style={{ flexDirection: 'row', backgroundColor: isDark ? '#333' : '#eee', borderRadius: 8, padding: 2 }}>
                        <TouchableOpacity
                            onPress={() => setViewMode('log')}
                            style={[
                                styles.toggleBtn,
                                viewMode === 'log' && { backgroundColor: isDark ? '#555' : '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2 }
                            ]}
                        >
                            <Text style={{ color: isDark ? '#fff' : '#000', fontSize: 12 }}>Log</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setViewMode('tree')}
                            style={[
                                styles.toggleBtn,
                                viewMode === 'tree' && { backgroundColor: isDark ? '#555' : '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2 }
                            ]}
                        >
                            <Text style={{ color: isDark ? '#fff' : '#000', fontSize: 12 }}>Tree</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => setIsSubModalVisible(true)}
                >
                    <Text style={styles.smallButtonText}>+ Subscribe</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
                {viewMode === 'log' ? (
                    <MessageLog />
                ) : (
                    <TopicTree messages={messages} />
                )}
            </View>

            <PublishControl />

            <Modal visible={isSubModalVisible} transparent animationType="slide">
                <View style={styles.modalCenter}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#333' : '#fff' }]}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}>Subscribe to Topic</Text>
                        <TextInput
                            value={subTopic}
                            onChangeText={setSubTopic}
                            style={[globalStyles.input, isDark ? globalStyles.darkInput : {}]}
                            placeholder="#"
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => setIsSubModalVisible(false)} style={{ padding: 10 }}>
                                <Text style={{ color: 'red' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSubscribe} style={{ padding: 10 }}>
                                <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Subscribe</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    smallButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    smallButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    toggleBtn: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    modalCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 15,
        textAlign: 'center',
    }
});
