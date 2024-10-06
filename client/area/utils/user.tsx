import Constants from 'expo-constants';

const machineIp = Constants.expoConfig.extra.MACHINE_IP;

export async function userLogin(username: string, password: string) {
    try {
        const response = await fetch(`http://${machineIp}:8080/user/login`, {
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
        const response = await fetch(`http://${machineIp}:8080/user/register`, {
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
        const response = await fetch(`http://${machineIp}:8080/user/third-party-login`, {
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
