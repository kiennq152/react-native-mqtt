import ConnectionForm from '@/components/ConnectionForm';
import { globalStyles } from '@/constants/Styles';
import { ScrollView, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConnectionScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView style={[globalStyles.container, isDark ? { backgroundColor: '#1a1a1a' } : {}]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={{ marginBottom: 40, marginTop: 20 }}>
                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: isDark ? '#fff' : '#000' }}>
                        MQTT Explorer
                    </Text>
                    <Text style={{ fontSize: 16, color: '#888' }}>
                        Connect to a broker via WebSockets
                    </Text>
                </View>

                <ConnectionForm />

                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: '#888', fontStyle: 'italic', fontSize: 12 }}>
                        Note: Standard TCP (1883) is not supported in Expo Go / Web directly. Please use WS (8083) or WSS (8084).
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
