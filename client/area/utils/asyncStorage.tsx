import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeToken(token: string) {
    try {
        await AsyncStorage.setItem('token', token);
    } catch (error) {
        console.error(error);
    }
}

export async function getToken() {
    try {
        return await AsyncStorage.getItem('token');
    } catch (error) {
        console.error(error);
    }
}
  