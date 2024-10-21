import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from './asyncStorage';

const machineIp = Constants.expoConfig?.extra?.MACHINE_IP;

export async function workspaceCreate(name: string, userId: string) {
    try {
        const token = await getToken();
        const response = await fetch(`http://${machineIp}:8080/workspace/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify({
                name: name,
                userId: userId
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

export async function workspaceGetAll() {
    try {
        const token = await getToken();
        const response = await fetch(`http://${machineIp}:8080/workspace/get`, {
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
        console.error('Fetch error:', error);
        return null;
    }
}

export async function workspaceGetById(id: string) {
    try {
        const token = await getToken();
        const response = await fetch(`http://${machineIp}:8080/workspace/get/${id}`, {
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
        console.error('Fetch error:', error);
        return null;
    }
}

export async function workspaceGetByUserId(user_id: string) {
    try {
        const token = await getToken();
        const response = await fetch(`http://${machineIp}:8080/workspace/get/user/${user_id}`, {
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
        console.error('Fetch error:', error);
        return null;
    }
}

export async function workspaceUpdate(id: string, name: string) {
    try {
        const token = await getToken();
        const response = await fetch(`http://${machineIp}:8080/workspace/update`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify({
                id: id,
                name: name
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

export async function workspaceDelete(id: string) {
    try {
        const token = await getToken();
        const response = await fetch(`http://${machineIp}:8080/workspace/delete`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify({
                id: id
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}