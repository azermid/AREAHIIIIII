import { getToken } from './asyncStorage';
import Constants from 'expo-constants';

const backendUri = Constants.expoConfig?.extra?.BACKEND_URI;

export async function getReactions(service: string | null, setReaction: any) {
    if (service == null) {
        return [];
    }
    const token = await getToken();
    const response = await fetch(`${backendUri}/reaction/get/service/${service}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'authorization': `${token}`,
            'ngrok-skip-browser-warning': 'true'
        }
    });
    const data = await response.json();
    if (response.status !== 200) {
        return [];
    }
    return data.map((reaction: any) => {
        return {
            label: reaction.description,
            value: reaction.name,
            onchange: setReaction
        };
    });
}

export async function reactionGetId(reaction: any) {
    const token = await getToken();
    const response = await fetch(`${backendUri}/reaction/get/id/${reaction}`, {
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
}
