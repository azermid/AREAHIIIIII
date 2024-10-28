import Constants from 'expo-constants';

const backendUri = Constants.expoConfig?.extra?.BACKEND_URI;

export async function userLogin(username: string, password: string) {
    try {
        const response = await fetch(`${backendUri}/user/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

export async function userRegister(username: string, email: string, password: string) {
    try {
        const response = await fetch(`${backendUri}/user/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

export async function userThirdPartyLogin(userInfo: any) {
    try {
        const response = await fetch(`${backendUri}/user/third-party-login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify(userInfo)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

export async function userVerifyToken(token: string) {
    try {
        const response = await fetch(`${backendUri}/user/verify-token`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify({
                token: token
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

export async function userGetId(token: string) {
    try {
        const response = await fetch(`${backendUri}/user/get-id`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify({
                token: token
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}
