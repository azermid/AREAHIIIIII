import { getToken } from './asyncStorage';
import Constants from "expo-constants";

const backendUri = Constants.expoConfig?.extra?.BACKEND_URI;

export async function getActions(service: string | null, setAction: any) {
    if (service == null) {
        return [];
    }
    const token = await getToken();
    const response = await fetch(`${backendUri}/action/get/service/${service}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'authorization': `${token}`,
            'ngrok-skip-browser-warning': 'true'
        }
    });
    const data = await response.json();
    return data.map((action: any) => {
        return {
            label: action.description,
            value: action.name,
            onchange: setAction
        };
    });
}

export async function actionGetId(action: any) {
    const token = await getToken();
    const response = await fetch(`${backendUri}/action/get/id/${action}`, {
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

export async function actionGetType(action: any) {
    const token = await getToken();
    const response = await fetch(`${backendUri}/action/get/type/${action}`, {
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
