async function send_email_outlook(token, data) {
    const { to, text, subject } = data;
    console.log('Sending email to:', to);
    console.log('Email subject:', subject);
    console.log('Email text:', text);
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