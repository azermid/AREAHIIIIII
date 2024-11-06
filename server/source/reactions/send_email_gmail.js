async function trySendEmailGmail(token, encodedEmail) {
    try {
        const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                raw: encodedEmail
            })
        });

        const result = await response.json();
        if (!response.ok) {
            console.error("Failed to send email:", result.error);
        }
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
    return true;
}

async function refreshAccessToken(refreshToken) {
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        })
    });
    if (!response.ok) {
        console.error('Failed to refresh token:', response.statusText);
        return;
    }
    const data = await response.json();
    return data.access_token;
}

async function send_email_gmail(token, refreshToken, data, additionalData) {
    try {
        const { to, text, subject } = data;

        // Create raw email content
        const emailContent = [
            `To: ${to}`,
            `Subject: ${subject}`,
            '',
            text,
        ].join('\n');

        // Encode email content in base64 and make it URL-safe
        const encodedEmail = Buffer.from(emailContent).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        if (!await trySendEmailGmail(token, encodedEmail)) {
            const newToken = await refreshAccessToken(refreshToken);
            if (!newToken) {
                return;
            }
            if (!await trySendEmailGmail(newToken, encodedEmail)) {
                console.error('Failed to send email after token refresh');
                return;
            }
            return newToken;
        }
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

module.exports = send_email_gmail;
