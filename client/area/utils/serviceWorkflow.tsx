import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from './asyncStorage';

const machineIp = Constants.expoConfig?.extra?.MACHINE_IP;

export async function getServices() {
    try {
        const token = await getToken();
        const response = await fetch(`http://${machineIp}:8080/services`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'authorization': `${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching services:', error);
        return null;
    }
}

export async function getActionsByService(serviceId: string) {
    try {
        const token = await getToken();
        const response = await fetch(`http://${machineIp}:8080/services/${serviceId}/actions`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'authorization': `${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching actions:', error);
        return null;
    }
}

export async function getReactionsByAction(actionId: string) {
    try {
        const token = await getToken();
        const response = await fetch(`http://${machineIp}:8080/actions/${actionId}/reactions`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'authorization': `${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching reactions:', error);
        return null;
    }
}
