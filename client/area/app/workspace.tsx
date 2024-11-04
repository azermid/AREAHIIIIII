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
                setAction("new_email"); // placeholder to test
                // setReaction(workspaceObj.reaction_title);
                // @ts-ignore
                setReaction("send_email"); // placeholder to test
                setActionServiceToken(workspaceObj.action_service_token);
                setReactionServiceToken(workspaceObj.reaction_service_token);
                setActionServiceRefreshToken(workspaceObj.action_service_refresh_token);
                setReactionServiceRefreshToken(workspaceObj.reaction_service_refresh_token);
                setActionData(
                    {
                        // @ts-ignore
                        from: "yann.malaret@outlook.fr",
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
    }, []);

    useEffect(() => {
        const setNewActionOptions = async () => {
            // @ts-ignore
            setActionOptions(await getActions(actionService, setAction));
        }
        setNewActionOptions();
    }, [actionService]);

    useEffect(() => {
        const setNewReactionOptions = async () => {
            // @ts-ignore
            setReactionOptions(await getReactions(reactionService, setReaction));
        }
        setNewReactionOptions();
    }, [reactionService]);

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
        // @ts-ignore
        setActionService(service);
        setAction(null);
        // @ts-ignore
        await workspaceUpdate({ id: workspaceId, actionServiceTitle: service });
        console.log('changed to', service);
    }

    const handleReactionServiceChange = async (service: string) => {
        // @ts-ignore
        setReactionService(service);
        setReaction(null);
        // @ts-ignore
        await workspaceUpdate({ id: workspaceId, reactionServiceTitle: service });
        console.log('changed to', service);
    }

    return (
        //add options to action and reactions
        <ThemedBackground style={{padding: 0}}>
            <WorkspaceContainer>
                <ThemedContainer border={true} dropShadow={true}>
                    <ThemedText>Workspace name placeholder</ThemedText>
                    <ThemedText>Choose an action service, might be set put need chnage on dropdown</ThemedText>
                    <ThemedDropdown
                        options={
                            [
                                // @ts-ignore
                                {label: "choose a service", value: null, onChange: handleActionServiceChange},
                                {label: "Gmail", value: "gmail", onChange: handleActionServiceChange},
                                {label: "Outlook", value: "outlook", onChange: handleActionServiceChange},
                                {label: "Spotify", value: "spotify", onChange: handleActionServiceChange},
                                {label: "GitHub", value: "github", onChange: handleActionServiceChange},
                            ]
                        }
                    />
                    <ThemedText>Choose a reaction service, might be set put need chnage on dropdown</ThemedText>
                    <ThemedDropdown
                        options={
                            [
                                // @ts-ignore
                                {label: "choose a service", value: null, onChange: handleReactionServiceChange},
                                {label: "Gmail", value: "gmail", onChange: handleReactionServiceChange},
                                {label: "Outlook", value: "outlook", onChange: handleReactionServiceChange},
                                {label: "Spotify", value: "spotify", onChange: handleReactionServiceChange},
                                {label: "GitHub", value: "github", onChange: handleReactionServiceChange},
                            ]
                        }
                    />
                    <ThemedText>Connect to action service, u might already be connected</ThemedText>
                    <ThemedButton title={"Connect"} onPress={() => handleConnectActionService()}></ThemedButton>
                    <ThemedText>Connect to reaction service, u might already be connected</ThemedText>
                    <ThemedButton title={"Connect"} onPress={() => handleConnectReactionService()}></ThemedButton>
                    {/* <ThemedText>Choose an action</ThemedText> */}
                    <ThemedText>action set to new_email for test</ThemedText>
                    <ThemedDropdown options={actionOptions}></ThemedDropdown>
                    {/* add action data here */}
                    {/* <ThemedText>Choose a reaction</ThemedText> */}
                    <ThemedText>reaction set to send_email for test</ThemedText>
                    <ThemedDropdown options={reactionOptions}></ThemedDropdown>
                    {/* add reaction data here */}
                    <ThemedButton title={"Create"} onPress={() => handleCreate()}></ThemedButton>
                </ThemedContainer>
                {/* <ThemedTrigger></ThemedTrigger> */}
                {/* <ThemedTabContainer tabs={['Actions', 'Reactions']} tabsScreen={[testNode(), null]}/> */}
            </WorkspaceContainer>
        </ThemedBackground>
    );
}
