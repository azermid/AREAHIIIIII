import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from './asyncStorage';

const backendUri = Constants.expoConfig?.extra?.BACKEND_URI;

export async function workspaceCreate(name: string, userId: string) {
    try {
        const token = await getToken();
        const response = await fetch(`${backendUri}/workspace/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'authorization': `${token}`,
                'ngrok-skip-browser-warning': 'true'
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
        const response = await fetch(`${backendUri}/workspace/get`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'authorization': `${token}`,
                'ngrok-skip-browser-warning': 'true'
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
        const response = await fetch(`${backendUri}/workspace/get/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'authorization': `${token}`,
                'ngrok-skip-browser-warning': 'true'
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
        const response = await fetch(`${backendUri}/workspace/get/user/${encodeURIComponent(user_id)}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `${token}`,
                'ngrok-skip-browser-warning': 'true'
            },
            credentials: 'include'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

// export async function workspaceUpdate(id: string, name: string) {
//     try {
//         const token = await getToken();
//         const response = await fetch(`${backendUri}/workspace/update`, {
//             method: "PUT",
//             headers: {
//                 'Content-Type': 'application/json',
//                 'accept': 'application/json',
//                 'authorization': `${token}`
//             },
//             body: JSON.stringify({
//                 id: id,
//                 name: name
//             })
//         });
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('Fetch error:', error);
//         return null;
//     }
// }

// @ts-ignore
export async function workspaceUpdate({ id, name, userId, actionTitle, reactionTitle, actionData, reactionData, actionServiceTitle, reactionServiceTitle, actionServiceToken, reactionServiceToken, actionServiceRefreshToken, reactionServiceRefreshToken }) {
    try {
        const token = await getToken();
        const response = await fetch(`${backendUri}/workspace/update`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'authorization': `${token}`,
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
                id: id,
                name: name,
                userId: userId,
                actionTitle: actionTitle,
                reactionTitle: reactionTitle,
                actionData: actionData,
                reactionData: reactionData,
                actionServiceTitle: actionServiceTitle,
                reactionServiceTitle: reactionServiceTitle,
                actionServiceToken: actionServiceToken,
                reactionServiceToken: reactionServiceToken,
                actionServiceRefreshToken: actionServiceRefreshToken,
                reactionServiceRefreshToken: reactionServiceRefreshToken,
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
        const response = await fetch(`${backendUri}/workspace/delete`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'authorization': `${token}`,
                'ngrok-skip-browser-warning': 'true'
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