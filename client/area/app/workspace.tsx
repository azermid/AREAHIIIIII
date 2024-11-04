import { ThemedBackground } from '@/components/ThemedBackground';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { WorkspaceContainer } from '@/components/WorkspaceContainer';
import { ThemedContainer } from '@/components/ThemedContainer';
import { ThemedDropdown } from '@/components/ThemedDropdown';
import { ThemedButton } from '@/components/ThemedButton';
import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { actionGetId, actionGetType, getActions } from '@/utils/actions';
import { getServices } from '@/utils/services';
import { getReactions, reactionGetId } from '@/utils/reactions';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Platform, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { workspaceUpdate } from '@/utils/workspace';
import { ThemedTrigger } from '@/components/ThemedTrigger';
import { ThemedTabContainer } from '@/components/ThemedTabContainer';
import { triggerCreateOrUpdate } from '@/utils/triggers';
import { set } from 'cypress/types/lodash';
import { IconButton } from 'react-native-paper';

WebBrowser.maybeCompleteAuthSession(); 

const backendUri = Constants.expoConfig?.extra?.BACKEND_URI;

const redirectUri = AuthSession.makeRedirectUri({
    // @ts-ignore
    useProxy: Platform.select({ web: false, default: true }),
    native: 'myapp://redirect',
});

export default function WorkspaceScreen() {
    const navigation = useNavigation();
    const [workspaceId, setWorkspaceId] = useState(null);
    const [workspaceName, setWorkspaceName] = useState(null);

    // get from db / workspace obj in async storage
    const [actionService, setActionService] = useState(null);
    const [reactionService, setReactionService] = useState(null);
    const [action, setAction] = useState(null);
    const [reaction, setReaction] = useState(null);

    // store this in db (servcieTokens ?) by user id
    // if null, user did not log or does not want to log for all workspaces
    // get from workspace table
    const [actionServiceToken, setActionServiceToken] = useState(null);
    const [reactionServiceToken, setReactionServiceToken] = useState(null);
    const [actionServiceRefreshToken, setActionServiceRefreshToken] = useState(null);
    const [reactionServiceRefreshToken, setReactionServiceRefreshToken] = useState(null);

    const [serviceOptions, setServiceOptions] = useState([]);

    const [actionOptions, setActionOptions] = useState([]);
    const [reactionOptions, setReactionOptions] = useState([]);

    const [actionData, setActionData] = useState(null);
    const [reactionData, setReactionData] = useState(null);
    //TODO: all this should be get from db and setting them should edit db

    useEffect(() => {
        const getInfoFromURL = async () => {
            const workspace = await AsyncStorage.getItem('workspace');
            let workspaceIdTemp = null;
            if (workspace) {
                const workspaceObj = JSON.parse(workspace);
                setWorkspaceId(workspaceObj.id);
                workspaceIdTemp = workspaceObj.id;
                setWorkspaceName(workspaceObj.name);
                console.log(workspaceObj.action_service_title);
                setActionService(workspaceObj.action_service_title);
                setReactionService(workspaceObj.reaction_service_title);
                // setAction(workspaceObj.action_title);
                // @ts-ignore
                // setAction("new_email"); // placeholder to test
                // setReaction(workspaceObj.reaction_title);
                // @ts-ignore
                // setReaction("send_email"); // placeholder to test
                setActionServiceToken(workspaceObj.action_service_token);
                setReactionServiceToken(workspaceObj.reaction_service_token);
                setActionServiceRefreshToken(workspaceObj.action_service_refresh_token);
                setReactionServiceRefreshToken(workspaceObj.reaction_service_refresh_token);
                setActionData(
                    {
                        // @ts-ignore
                        from: "yann.malaret@outlook.fr",
                        user: "yann.malaret@outlook.fr"
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
                if (actionServiceTokenFromURL) {
                    // @ts-ignore
                    setActionServiceToken(actionServiceTokenFromURL);
                    console.log('workspaceId', workspaceIdTemp);
                    // @ts-ignore
                    await workspaceUpdate({ id: workspaceIdTemp, actionServiceToken: actionServiceTokenFromURL });
                }
                const actionServiceRefreshTokenFromURL = urlParams.get('action_refresh_token');
                if (actionServiceRefreshTokenFromURL) {
                    // @ts-ignore
                    setActionServiceRefreshToken(actionServiceRefreshTokenFromURL);
                    // @ts-ignore
                    await workspaceUpdate({ id: workspaceIdTemp, actionServiceRefreshToken: actionServiceRefreshTokenFromURL });
                }
                const reactionServiceTokenFromURL = urlParams.get('reaction_token');
                if (reactionServiceTokenFromURL) {
                    // @ts-ignore
                    setReactionServiceToken(reactionServiceTokenFromURL);
                    // @ts-ignore
                    await workspaceUpdate({ id: workspaceIdTemp, reactionServiceToken: reactionServiceTokenFromURL });
                }
                const reactionServiceRefreshTokenFromURL = urlParams.get('reaction_refresh_token');
                if (reactionServiceRefreshTokenFromURL) {
                    // @ts-ignore
                    setReactionServiceRefreshToken(reactionServiceRefreshTokenFromURL);
                    // @ts-ignore
                    await workspaceUpdate({ id: workspaceIdTemp, reactionServiceRefreshToken: reactionServiceRefreshTokenFromURL });
                }
                //clear url
                window.history.pushState({}, document.title, "/");
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
    }

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
        setActionService(service);
        setAction(null); // reset selected action
        setActionOptions([]); // reset action options to avoid stale options
        // update workspace
        //@ts-ignore
        await workspaceUpdate({ id: workspaceId, actionServiceTitle: service });
        if (service) {
            const newActionOptions = await getActions(service);
            if (newActionOptions.length === 0) {
                console.log('No actions available for this service');
                return;
            }
            setActionOptions(
                newActionOptions.map((action: any) => {
                    return {
                        label: action.description,
                        value: action.title,
                    };
                })
            );
        }
    };

    const handleReactionServiceChange = async (service: string) => {
        // @ts-ignore
        setReactionService(service);
        setReaction(null);
        // @ts-ignore
        await workspaceUpdate({ id: workspaceId, reactionServiceTitle: service });
        // setReactionOptions(await getReactions(service, setReaction));
        const newReactionOptions = await getReactions(service);
        if (newReactionOptions.length === 0) {
            console.log('No reactions available for this service');
            return
        }
        setReactionOptions(
            newReactionOptions.map((reaction: any) => {
                return {
                    label: reaction.description,
                    value: reaction.title,
                };
            })
        );
        // console.log('changed to', service);
    }

    return (
        <ThemedBackground style={{ padding: 0 }}>
            <WorkspaceContainer>
                <ThemedContainer border={true} dropShadow={true}>
                    <ThemedText>Workspace name placeholder</ThemedText>
                    <ThemedText>Choose an action service and a reaction service to see the actions/reactions available.</ThemedText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <View style={{ flex: 8, marginRight: 8 }}>
                            <ThemedDropdown
                                options={
                                    [
                                        { label: "Choose an action service", value: null },
                                        ...serviceOptions
                                    ]
                                }
                                onChange={handleActionServiceChange}
                            />
                        </View>
                        <IconButton
                            icon={'login-variant'}
                            iconColor='white'
                            style={{ cursor: 'pointer' }}
                            onPress={() => handleConnectActionService()}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <View style={{ flex: 8, marginRight: 8 }}>
                            <ThemedDropdown
                                options={
                                    [
                                        { label: "Choose a reaction service", value: null },
                                        ...serviceOptions
                                    ]
                                }
                                onChange={handleReactionServiceChange}
                            />
                        </View>
                        <IconButton
                            icon={'login-variant'}
                            iconColor='white'
                            style={{ cursor: 'pointer', marginRight: 0 }}
                            onPress={() => handleConnectReactionService()}
                        />
                    </View>
                    <ThemedDropdown options={actionOptions} onChange={setAction}></ThemedDropdown>
                    <ThemedDropdown options={reactionOptions} onChange={setReaction}></ThemedDropdown>
                    <ThemedButton title={"Create"} onPress={() => handleCreate()}></ThemedButton>
                </ThemedContainer>
            </WorkspaceContainer>
        </ThemedBackground>
    );
}

