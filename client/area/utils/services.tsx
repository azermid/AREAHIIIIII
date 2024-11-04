import { getToken } from './asyncStorage';
import Constants from "expo-constants";

const backendUri = Constants.expoConfig?.extra?.BACKEND_URI;

export async function getServices(service: string | null, setService: any) {
    if (service == null) {
        return [];
    }
    const token = await getToken();
    const response = await fetch(`${backendUri}/service/get/service/${service}`, {
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
    return data.map((action: any) => {
        return {
            label: action.description,
            value: action.name,
            onchange: setService
        };
    });
}