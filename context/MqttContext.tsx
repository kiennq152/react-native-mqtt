import { Buffer } from 'buffer';
import React, { createContext, useContext, useRef, useState } from 'react';
import { MqttClient, MqttConnectionOptions } from '../lib/MqttClient';

// Polyfill Buffer for MQTT.js
if (typeof global.Buffer === 'undefined') {
    global.Buffer = Buffer;
}

export interface MqttMessage {
    topic: string;
    payload: string;
    timestamp: number;
    id: string;
}

interface MqttContextType {
    isConnected: boolean;
    messages: MqttMessage[];
    connect: (options: MqttConnectionOptions) => void;
    disconnect: () => void;
    subscribe: (topic: string) => void;
    unsubscribe: (topic: string) => void;
    publish: (topic: string, message: string) => void;
    connectionError: string | null;
}

const MqttContext = createContext<MqttContextType>({
    isConnected: false,
    messages: [],
    connect: () => { },
    disconnect: () => { },
    subscribe: () => { },
    unsubscribe: () => { },
    publish: () => { },
    connectionError: null,
});

export const useMqtt = () => useContext(MqttContext);

export const MqttProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<MqttMessage[]>([]);
    const [connectionError, setConnectionError] = useState<string | null>(null);

    const mqttRef = useRef<MqttClient | null>(null);

    const connect = (options: MqttConnectionOptions) => {
        disconnect(); // Ensure clean slate
        setConnectionError(null);

        const client = new MqttClient(options);
        mqttRef.current = client;

        client.connect(
            () => {
                setIsConnected(true);
                setConnectionError(null);
            },
            (err) => {
                setIsConnected(false);
                setConnectionError(err.message);
            },
            (topic, payload) => {
                const newMessage: MqttMessage = {
                    topic,
                    payload: payload.toString(),
                    timestamp: Date.now(),
                    id: Math.random().toString(36).substr(2, 9),
                };
                setMessages((prev) => [newMessage, ...prev].slice(0, 500)); // Keep last 500
            }
        );
    };

    const disconnect = () => {
        if (mqttRef.current) {
            mqttRef.current.disconnect();
            mqttRef.current = null;
        }
        setIsConnected(false);
    };

    const subscribe = (topic: string) => {
        mqttRef.current?.subscribe(topic);
    };

    const unsubscribe = (topic: string) => {
        mqttRef.current?.unsubscribe(topic);
    };

    const publish = (topic: string, message: string) => {
        mqttRef.current?.publish(topic, message);
    };

    return (
        <MqttContext.Provider
            value={{
                isConnected,
                messages,
                connect,
                disconnect,
                subscribe,
                unsubscribe,
                publish,
                connectionError,
            }}
        >
            {children}
        </MqttContext.Provider>
    );
};
