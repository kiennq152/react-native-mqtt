import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    darkContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1a1a1a',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    darkInput: {
        borderWidth: 1,
        borderColor: '#444',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#333',
        color: '#fff',
    },
    button: {
        backgroundColor: '#007AFF', // Blue
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 10,
    },
    darkLabel: {
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 10,
        color: '#eee',
    }
});
