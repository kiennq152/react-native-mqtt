import AsyncStorage from '@react-native-async-storage/async-storage';
import { MqttConnectionOptions } from './MqttClient';

const LAST_CONNECTION_KEY = 'mqtt_explorer_last_connection';
const SAVED_SESSIONS_KEY = 'mqtt_explorer_saved_sessions';

export interface ConnectionProfile extends MqttConnectionOptions {
    id: string;
    name: string;
}

export const Storage = {
    saveLastConnection: async (options: MqttConnectionOptions) => {
        try {
            await AsyncStorage.setItem(LAST_CONNECTION_KEY, JSON.stringify(options));
        } catch (e) {
            console.error('Failed to save last connection', e);
        }
    },

    getLastConnection: async (): Promise<MqttConnectionOptions | null> => {
        try {
            const json = await AsyncStorage.getItem(LAST_CONNECTION_KEY);
            return json ? JSON.parse(json) : null;
        } catch (e) {
            console.error('Failed to load last connection', e);
            return null;
        }
    },

    saveSession: async (profile: ConnectionProfile) => {
        try {
            const existing = await Storage.getSavedSessions();
            const updated = [...existing.filter(p => p.id !== profile.id), profile];
            await AsyncStorage.setItem(SAVED_SESSIONS_KEY, JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to save session', e);
        }
    },

    getSavedSessions: async (): Promise<ConnectionProfile[]> => {
        try {
            const json = await AsyncStorage.getItem(SAVED_SESSIONS_KEY);
            return json ? JSON.parse(json) : [];
        } catch (e) {
            console.error('Failed to load sessions', e);
            return [];
        }
    },

    deleteSession: async (id: string) => {
        try {
            const existing = await Storage.getSavedSessions();
            const updated = existing.filter(p => p.id !== id);
            await AsyncStorage.setItem(SAVED_SESSIONS_KEY, JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to delete session', e);
        }
    }
};
