import Constants from 'expo-constants';
import { getToken } from './asyncStorage';

const backendUri = Constants.expoConfig?.extra?.BACKEND_URI || Constants.manifest?.extra?.BACKEND_URI;


// async update(trigger) {
//     let sql = 'UPDATE triggers SET ';
//     const values = [];
//     const triggerSnakeCase = await camelCaseToSnakeCase(trigger);
//     for (const key in triggerSnakeCase) {
//         if (triggerSnakeCase[key]) {
//             sql += `${key} = ?, `;
//             values.push(triggerSnakeCase[key]);
//         }
//     }
//     sql = sql.slice(0, -2);
//     sql += ' WHERE id = ?';
//     values.push(trigger.id);
//     return await this.dbConnection.execute(sql, values);
// }

// async create(trigger) {
//     const sql = 'INSERT INTO triggers (workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
//     const values = [trigger.workspaceId, trigger.type, trigger.actionId, trigger.reactionId, trigger.actionData, trigger.reactionData, trigger.actionServiceToken, trigger.reactionServiceToken, trigger.actionServiceRefreshToken, trigger.reactionServiceRefreshToken, trigger.webhookUrl, trigger.webhookSecret];
//     return await this.dbConnection.execute(sql, values);
// }

// async add({ workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret }) {
//     if (!workspace_id || !type || !action_id || !reaction_id || !action_data || !reaction_data || !action_service_token || !reaction_service_token || !action_service_refresh_token || !reaction_service_refresh_token) {
//         throw new Error('Workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token and reaction_service_refresh_token are required');
//     }
//     const triggerExists = this.getByWorkspaceId(workspace_id);
//     if (triggerExists.length > 0) {
//         const trigger = new Trigger({ id: triggerExists[0].id, workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret });
//         await this.update({ id: triggerExists[0].id, workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret });
//         return trigger;

//     } else {
//         const trigger = new Trigger({ workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret });
//         const response = await this.triggerRepository.create(trigger);
//         trigger.id = response[0].insertId;
//         return trigger;
//     }
// }

// router.get('/add', checkToken, (req, res) => triggerController.add(req, res));

    export async function triggerCreateOrUpdate(trigger: any) {
        try {
            const token = await getToken();
            const response = await fetch(`${backendUri}/trigger/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'authorization': `${token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(trigger)
            });
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }