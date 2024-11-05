async function send_email_gmail(token, data) {
    try {
        const { to, text, subject } = data;
        console.log('token:', token);

        // Create raw email content
        const emailContent = [
            `To: ${to}`,
            `Subject: ${subject}`,
            '',
            text,
        ].join('\n');

        // Encode email content in base64 and make it URL-safe
        const encodedEmail = Buffer.from(emailContent).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

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
                return result;
            }

            // console.log("Email sent successfully:", result);
            return result;
        } catch (error) {
            //TODO refresh token
            console.error("Error sending email:", error);
        }
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

module.exports = send_email_gmail;
