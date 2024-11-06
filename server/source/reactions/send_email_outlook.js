async function send_email_outlook(token, refreshToken, data, additionalData) {
    const { to, text, subject } = data;
    const response = await fetch(
        "https://graph.microsoft.com/v1.0/me/sendMail",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: {
                    subject,
                    body: {
                        contentType: "Text",
                        content: text,
                    },
                    toRecipients: [{ emailAddress: { address: to } }],
                },
            }),
        }
    );
    if (response.status !== 202) {
        console.error('Error:', response.statusText);
        return;
    }
}

module.exports = send_email_outlook;