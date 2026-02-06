import mqtt, { IClientOptions, MqttClient as MQTTJSClient } from 'mqtt';

export interface MqttConnectionOptions {
    host: string;
    port: number;
    protocol: 'ws' | 'wss';
    username?: string;
    password?: string;
    clientId?: string;
}

export class MqttClient {
    private client: MQTTJSClient | null = null;
    private options: MqttConnectionOptions;

    constructor(options: MqttConnectionOptions) {
        this.options = options;
    }

    public connect(
        onConnect: () => void,
        onError: (err: Error) => void,
        onMessage: (topic: string, message: Buffer) => void
    ) {
        const { protocol, host, port, username, password, clientId } = this.options;

        // Construct the URL. Note: 'mqtt' package handles ws/wss protocols.
        // Standard format: protocol://host:port/path
        const url = `${protocol}://${host}:${port}/mqtt`;
        // /mqtt is a common path for websockets, but might need to be configurable.
        // For now we assume standard paths or root.
        // Actually, many look like ws://broker:8083/mqtt or just ws://broker:8083

        // Let's try to be smart or allow a full URL if needed, but for this form we stick to constructing it.
        // The clean way using options:

        const connectOptions: IClientOptions = {
            clientId: clientId || `mqtt-explorer-${Math.random().toString(16).substr(2, 8)}`,
            username,
            password,
            protocolVersion: 5, // Try v5 first
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
            protocol: protocol,
            hostname: host,
            port: port,
            // path: '/mqtt', // This is often required for WS. We might need to expose this to the user later.
        };

        console.log(`Connecting to ${protocol}://${host}:${port}...`);

        try {
            this.client = mqtt.connect(connectOptions);

            this.client.on('connect', () => {
                console.log('Connected to MQTT Broker');
                onConnect();
            });

            this.client.on('error', (err) => {
                console.error('MQTT Connection Error:', err);
                onError(err);
            });

            this.client.on('offline', () => {
                console.log('MQTT Client Offline');
            });

            this.client.on('message', (topic, message) => {
                onMessage(topic, message);
            });

        } catch (e: any) {
            onError(e);
        }
    }

    public disconnect() {
        if (this.client) {
            this.client.end();
            this.client = null;
        }
    }

    public subscribe(topic: string) {
        if (this.client) {
            this.client.subscribe(topic, (err) => {
                if (err) {
                    console.error(`Failed to subscribe to ${topic}`, err);
                } else {
                    console.log(`Subscribed to ${topic}`);
                }
            });
        }
    }

    public unsubscribe(topic: string) {
        if (this.client) {
            this.client.unsubscribe(topic);
        }
    }

    public publish(topic: string, message: string) {
        if (this.client) {
            this.client.publish(topic, message);
        }
    }

    public isConnected(): boolean {
        return this.client?.connected || false;
    }
}
