import { View, Text } from 'react-native';

export default function NotFoundScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 22, color: '#333', fontWeight: 'bold' }}>Página no encontrada</Text>
            <Text style={{ color: '#666', marginTop: 8 }}>La ruta seleccionada no existe.</Text>
        </View>
    );
}
