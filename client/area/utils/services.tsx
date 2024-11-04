import { getToken } from './asyncStorage';
import Constants from "expo-constants";

const backendUri = Constants.expoConfig?.extra?.BACKEND_URI;

export async function getServices() {
    const token = await getToken();
    const response = await fetch(`${backendUri}/service/get`, {
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
    return data.map((service: any) => {
        return {
            label: service.description,
            value: service.title,
        };
    });
}