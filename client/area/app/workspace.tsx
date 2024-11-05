import { ThemedBackground } from '@/components/ThemedBackground';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { WorkspaceContainer } from '@/components/WorkspaceContainer';
import { ThemedContainer } from '@/components/ThemedContainer';
import { ThemedDropdown } from '@/components/ThemedDropdown';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedField } from '@/components/ThemedField';
import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { actionGetId, actionGetType, getActions } from '@/utils/actions';
import { getServices } from '@/utils/services';
import { getReactions, reactionGetId } from '@/utils/reactions';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { workspaceUpdate } from '@/utils/workspace';
import { triggerCreateOrUpdate } from '@/utils/triggers';
import { IconButton } from 'react-native-paper';

WebBrowser.maybeCompleteAuthSession();

const backendUri = Constants.expoConfig?.extra?.BACKEND_URI;

const redirectUri = AuthSession.makeRedirectUri({
    useProxy: Platform.select({ web: false, default: true }),
    native: 'myapp://redirect',
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    dropdownContainer: {
        flex: 8,
        marginRight: 8,
    },
    iconButtonContainer: {
        flex: 1,
    },
    inputFieldContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 16,
        gap: 10,
    },
    inputField: {
        flexBasis: '48%',
        paddingHorizontal: 10,
        marginBottom: 8,
    },
});

export default function WorkspaceScreen() {
    const navigation = useNavigation();
    const [workspaceId, setWorkspaceId] = useState(null);
    const [workspaceName, setWorkspaceName] = useState(null);

    const [actionService, setActionService] = useState(null);
    const [reactionService, setReactionService] = useState(null);
    const [action, setAction] = useState(null);
    const [reaction, setReaction] = useState(null);

    const [actionServiceToken, setActionServiceToken] = useState(null);
    const [reactionServiceToken, setReactionServiceToken] = useState(null);
    const [actionServiceRefreshToken, setActionServiceRefreshToken] = useState(null);
    const [reactionServiceRefreshToken, setReactionServiceRefreshToken] = useState(null);

    const [serviceOptions, setServiceOptions] = useState([]);
    const [actionOptions, setActionOptions] = useState([]);
    const [reactionOptions, setReactionOptions] = useState([]);

    const [actionData, setActionData] = useState({}); // initialize with empty object
    const [reactionData, setReactionData] = useState({}); // initialize with empty object

    useEffect(() => {
        const getInfoFromURL = async () => {
            const workspace = await AsyncStorage.getItem('workspace');
            let workspaceIdTemp = null;
            if (workspace) {
                const workspaceObj = JSON.parse(workspace);
                setWorkspaceId(workspaceObj.id);
                workspaceIdTemp = workspaceObj.id;
                setWorkspaceName(workspaceObj.name);
                setActionService(workspaceObj.action_service_title);
                setReactionService(workspaceObj.reaction_service_title);
                setAction(workspaceObj.action_title);
                setReaction(workspaceObj.reaction_title);
                setActionServiceToken(workspaceObj.action_service_token);
                setReactionServiceToken(workspaceObj.reaction_service_token);
                setActionServiceRefreshToken(workspaceObj.action_service_refresh_token);
                setReactionServiceRefreshToken(workspaceObj.reaction_service_refresh_token);
                setActionData(
                    {
                        // @ts-ignore
                        from: "yann.malaret@outlook.fr",
                        user: "webepitech@gmail.com",
                    }
                );
                setReactionData(
                    {
                        // @ts-ignore
                        to: "yann.malaret@outlook.fr",
                        subject: "test",
                        text: "test",
                    }
                );
            }
            if (Platform.OS === 'web') {
                const urlParams = new URLSearchParams(window.location.search);
                if (!urlParams) {
                    return;
                }
                const actionServiceTokenFromURL = urlParams.get('action_token');
                if (actionServiceTokenFromURL && actionServiceTokenFromURL != 'undefined') {
                    // @ts-ignore
                    setActionServiceToken(actionServiceTokenFromURL);
                    await workspaceUpdate({ id: workspaceIdTemp, actionServiceToken: actionServiceTokenFromURL });
                }
                const actionServiceRefreshTokenFromURL = urlParams.get('action_refresh_token');
                if (actionServiceRefreshTokenFromURL && actionServiceRefreshTokenFromURL != 'undefined') {
                    // @ts-ignore
                    setActionServiceRefreshToken(actionServiceRefreshTokenFromURL);
                    await workspaceUpdate({ id: workspaceIdTemp, actionServiceRefreshToken: actionServiceRefreshTokenFromURL });
                }
                const reactionServiceTokenFromURL = urlParams.get('reaction_token');
                if (reactionServiceTokenFromURL && reactionServiceTokenFromURL != 'undefined') {
                    // @ts-ignore
                    setReactionServiceToken(reactionServiceTokenFromURL);
                    await workspaceUpdate({ id: workspaceIdTemp, reactionServiceToken: reactionServiceTokenFromURL });
                }
                const reactionServiceRefreshTokenFromURL = urlParams.get('reaction_refresh_token');
                if (reactionServiceRefreshTokenFromURL && reactionServiceRefreshTokenFromURL != 'undefined') {
                    // @ts-ignore
                    setReactionServiceRefreshToken(reactionServiceRefreshTokenFromURL);
                    await workspaceUpdate({ id: workspaceIdTemp, reactionServiceRefreshToken: reactionServiceRefreshTokenFromURL });
                }
                //clear url
                window.history.pushState({}, document.title, "/workspace");
            }
        }
        getInfoFromURL();
        const getServicesFromBackend = async () => {
            const services = await getServices();
            setServiceOptions(services);
        }
        getServicesFromBackend();
    }, []);

    const handleCreate = async () => {
        if (!actionService || !reactionService || !action || !reaction || !actionServiceToken || !reactionServiceToken) {
            console.log('Missing fields');
            console.log(actionService, reactionService, action, reaction, actionServiceToken, reactionServiceToken);
            return;
        }
        console.log('Creating AREA');
        const trigger = {
            workspace_id: workspaceId,
            type: await actionGetType(action), // get type from action title
            action_id: await actionGetId(action), // get id from action title
            reaction_id: await reactionGetId(reaction), // get id from reaction title
            action_data: actionData,
            reaction_data: reactionData,
            action_service_token: actionServiceToken,
            reaction_service_token: reactionServiceToken,
            action_service_refresh_token: actionServiceRefreshToken,
            reaction_service_refresh_token: reactionServiceRefreshToken,
            webhook_url: null, // get from action, if type is webhook
            webhook_secret: null, // get from action, if type is webhook
        }
        console.log('trigger', trigger);
        await triggerCreateOrUpdate(trigger);
    };

    const handleConnectActionService = async () => {
        if (Platform.OS === 'web') {
            const backendConnectionUri = `${backendUri}/auth/${actionService}?redirect_uri=${encodeURIComponent(redirectUri + '/workspace?id=' + workspaceId + '&name=' + workspaceName)}&service_type=action`;
            window.location.href = backendConnectionUri;
        } else {
            const backendConnectionUri = `${backendUri}/auth/${actionService}?redirect_uri=${encodeURIComponent(redirectUri + '/workspace?id=' + workspaceId + '&name=' + workspaceName)}&service_type=action`;
            const result = await WebBrowser.openAuthSessionAsync(backendConnectionUri, redirectUri);
            if (result.type === 'success' && result.url) {
                const params = Linking.parse(result.url).queryParams;
                if (!params) {
                    console.log('No params, no token');
                    return;
                }
                if (params.action_token && params.action_refresh_token) {
                    // @ts-ignore
                    setActionServiceToken(params.action_token);
                    // @ts-ignore
                    setActionServiceRefreshToken(params.action_refresh_token);
                    // @ts-ignore
                    await workspaceUpdate({ id: workspaceId, actionServiceToken: params.action_token, actionServiceRefreshToken: params.action_refresh_token });
                }
            }
        }
    }

    const handleConnectReactionService = async () => {
        if (Platform.OS === 'web') {
            const backendConnectionUri = `${backendUri}/auth/${reactionService}?redirect_uri=${encodeURIComponent(redirectUri + '/workspace?id=' + workspaceId + '&name=' + workspaceName)}&service_type=reaction`;
            window.location.href = backendConnectionUri;
        } else {
            const backendConnectionUri = `${backendUri}/auth/${reactionService}?redirect_uri=${encodeURIComponent(redirectUri + '/workspace?id=' + workspaceId + '&name=' + workspaceName)}&service_type=reaction`;
            const result = await WebBrowser.openAuthSessionAsync(backendConnectionUri, redirectUri);
            if (result.type === 'success' && result.url) {
                const params = Linking.parse(result.url).queryParams;
                if (!params) {
                    console.log('No params, no token');
                    return;
                }
                if (params.reaction_token && params.reaction_refresh_token) {
                    // @ts-ignore
                    setReactionServiceToken(params.reaction_token);
                    // @ts-ignore
                    setReactionServiceRefreshToken(params.reaction_refresh_token);
                    // @ts-ignore
                    await workspaceUpdate({ id: workspaceId, reactionServiceToken: params.reaction_token, reactionServiceRefreshToken: params.reaction_refresh_token });
                }
            }
        }
    }

    const handleActionServiceChange = async (service: string) => {
        // @ts-ignore
        setActionService(service);
        setAction(null);
        setActionOptions([]);
        setActionData({});
        await workspaceUpdate({ id: workspaceId, actionServiceTitle: service });
        if (service) {
            try {
                const newActionOptions = await getActions(service);
                if (newActionOptions.length > 0) {
                    setActionOptions(
                        newActionOptions.map((action) => {
                            const data = typeof action.data === 'string' ? JSON.parse(action.data) : action.data || {};
                            // clean up default values
                            Object.keys(data).forEach((key) => {
                                if (data[key] === "string") {
                                    data[key] = ""; // replace "string" with empty string
                                }
                            });
                            return {
                                label: action.description,
                                value: action.title,
                                data,
                            };
                        })
                    );
                }
            } catch (error) {
                console.error('Failed to fetch actions:', error);
            }
        }
    };

    const handleReactionServiceChange = async (service) => {
        setReactionService(service);
        setReaction(null);
        setReactionOptions([]);
        setReactionData({});
        await workspaceUpdate({ id: workspaceId, reactionServiceTitle: service });
        if (service) {
            try {
                const newReactionOptions = await getReactions(service);
                if (newReactionOptions.length > 0) {
                    setReactionOptions(
                        newReactionOptions.map((reaction) => {
                            const data = typeof reaction.data === 'string' ? JSON.parse(reaction.data) : reaction.data || {};
                            // clean up default values
                            Object.keys(data).forEach((key) => {
                                if (data[key] === "string") {
                                    data[key] = ""; // replace "string" with empty string
                                }
                            });
                            return {
                                label: reaction.description,
                                value: reaction.title,
                                data,
                            };
                        })
                    );
                }
            } catch (error) {
                console.error('Failed to fetch reactions:', error);
            }
        }
    };

    const handleActionChange = (selectedAction) => {
        setAction(selectedAction);
        const actionDetails = actionOptions.find((act) => act.value === selectedAction);
        if (actionDetails) {
            setActionData(actionDetails.data || {});
        }
    };

    const handleReactionChange = (selectedReaction) => {
        setReaction(selectedReaction);
        const reactionDetails = reactionOptions.find((react) => react.value === selectedReaction);
        if (reactionDetails) {
            setReactionData(reactionDetails.data || {});
        }
    };

    return (
        <ThemedBackground style={{ padding: 0 }}>
            <WorkspaceContainer>
                <ThemedContainer border={true} dropShadow={true}>
                    <ThemedText>{workspaceName}</ThemedText>

                    <ThemedText>Choose an action service and a reaction service to see the actions/reactions available.</ThemedText>

                    {/* Action Service Selection */}
                    <View style={styles.container}>
                        <View style={styles.dropdownContainer}>
                            <ThemedDropdown
                                options={[
                                        // @ts-ignore
                                    { label: "Choose an action service", value: null },
                                    ...serviceOptions
                                ]}
                                onChange={handleActionServiceChange}
                            />
                        </View>
                        <View style={styles.iconButtonContainer}>
                            <IconButton
                                icon={'login-variant'}
                                iconColor='white'
                                style={{ cursor: 'pointer' }}
                                onPress={() => handleConnectActionService()}
                            />
                        </View>
                    </View>

                    {/* Action Dropdown */}
                    {(actionService && actionOptions.length > 0) && (
                        <View style={styles.container}>
                            <View style={styles.dropdownContainer}>
                                <ThemedDropdown
                                    options={[{ label: "Choose an action", value: null }, ...actionOptions]}
                                    onChange={handleActionChange}
                                />
                            </View>
                        </View>
                    )}

                    {/* Action Data Fields (scalable with multiple rows) */}
                    {action && (
                        <View style={styles.inputFieldContainer}>
                            {Object.keys(actionData).map((key) => (
                                <ThemedField
                                    key={key}
                                    field={key}
                                    value={actionData[key]}
                                    onChange={(text) => setActionData({ ...actionData, [key]: text })}
                                    style={styles.inputField}
                                />
                            ))}
                        </View>
                    )}

                    {/* Reaction Service Selection */}
                    <View style={styles.container}>
                        <View style={styles.dropdownContainer}>
                            <ThemedDropdown
                                options={[
                                        // @ts-ignore
                                    { label: "Choose a reaction service", value: null },
                                    ...serviceOptions
                                ]}
                                onChange={handleReactionServiceChange}
                            />
                        </View>
                        <View style={styles.iconButtonContainer}>
                            <IconButton
                                icon={'login-variant'}
                                iconColor='white'
                                style={{ cursor: 'pointer' }}
                                onPress={() => handleConnectReactionService()}
                            />
                        </View>
                    </View>

                    {/* Reaction Dropdown */}
                    {(reactionService && reactionOptions.length > 0) && (
                        <View style={styles.container}>
                            <View style={styles.dropdownContainer}>
                                <ThemedDropdown
                                    options={[{ label: "Choose a reaction", value: null }, ...reactionOptions]}
                                    onChange={handleReactionChange}
                                />
                            </View>
                        </View>
                    )}

                    {/* Reaction Data Fields (scalable with multiple rows) */}
                    {reaction && (
                        <View style={styles.inputFieldContainer}>
                            {Object.keys(reactionData).map((key) => (
                                <ThemedField
                                    key={key}
                                    field={key}
                                    value={reactionData[key]}
                                    onChange={(text) => setReactionData({ ...reactionData, [key]: text })}
                                    style={styles.inputField}
                                />
                            ))}
                        </View>
                    )}

                    <ThemedButton title={"Create"} onPress={() => handleCreate()} />
                </ThemedContainer>
            </WorkspaceContainer>
        </ThemedBackground>
    );
}
