async function delete_github_repository(token, refreshToken, data, additionalData) {
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

        // Step 2: Delete the specified repository for that user
        const repoResponse = await fetch(`https://api.github.com/repos/${username}/${data.name}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!repoResponse.ok) {
            const repoErrorData = await repoResponse.json();
            throw new Error(`Error deleting repository: ${repoErrorData.message}`);
        }

        console.log(`Repository ${data.name} successfully deleted.`);
    } catch (error) {
        console.error("Error deleting GitHub repo:", error);
        throw error;
    }
}

module.exports = delete_github_repository;