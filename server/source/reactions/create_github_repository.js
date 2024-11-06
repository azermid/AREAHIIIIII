async function create_github_repository(token, refreshToken, data, additionalData) {
    try {
        // Step 1: Get the authenticated user (owner) using the GitHub token
        const userResponse = await fetch(`https://api.github.com/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!userResponse.ok) {
            const errorData = await userResponse.json();
            throw new Error(`Error fetching user info: ${errorData.message}`);
        }

        const userData = await userResponse.json();
        const username = userData.login; // This is the GitHub username

        // Step 2: Create a new repository for that user
        const repoResponse = await fetch(`https://api.github.com/user/repos`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,                     // Repository name
                description: data.description || "",  // Optional description
                private: data.private || false       // Privacy setting
            })
        });

        if (!repoResponse.ok) {
            const repoErrorData = await repoResponse.json();
            throw new Error(`Error creating repository: ${repoErrorData.message}`);
        }

        const repoData = await repoResponse.json();
    } catch (error) {
        console.error("Error creating GitHub repo:", error);
        throw error;
    }
}

module.exports = create_github_repository;
