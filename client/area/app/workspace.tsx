import { ThemedBackground } from '@/components/ThemedBackground';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { WorkspaceContainer } from '@/components/WorkspaceContainer';
import { ThemedContainer } from '@/components/ThemedContainer';
import { ThemedDropdown } from '@/components/ThemedDropdown';
import { ThemedButton } from '@/components/ThemedButton';
import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { getActions } from '@/utils/actions';
import { getReactions } from '@/utils/reactions';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { workspaceUpdate } from '@/utils/workspace';
import { ThemedTrigger } from '@/components/ThemedTrigger';

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
    //TODO: all this should be get from db and setting them should edit db

    useEffect(() => {
        const getInfoFromURL = async () => {
            const workspace = await AsyncStorage.getItem('workspace');
            if (workspace) {
                const workspaceObj = JSON.parse(workspace);
                // console.log("workspaceObj", workspaceObj);
                setWorkspaceId(workspaceObj.id);
                setWorkspaceName(workspaceObj.name);
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
                }
                const actionServiceRefreshTokenFromURL = urlParams.get('action_refresh_token');
                if (actionServiceRefreshTokenFromURL) {
                    // @ts-ignore
                    setActionServiceRefreshToken(actionServiceRefreshTokenFromURL);
                }
                const reactionServiceTokenFromURL = urlParams.get('reaction_token');
                if (reactionServiceTokenFromURL) {
                    // @ts-ignore
                    setReactionServiceToken(reactionServiceTokenFromURL);
                }    
                const reactionServiceRefreshTokenFromURL = urlParams.get('reaction_refresh_token');
                if (reactionServiceRefreshTokenFromURL) {
                    // @ts-ignore
                    setReactionServiceRefreshToken(reactionServiceRefreshTokenFromURL);
                }
            }
        }
        getInfoFromURL();
    }, []);

    useEffect(() => {
        const setOptions = async () => {
            const actions = await getActions(actionService, setAction);
            // @ts-ignore
            setActionOptions(actions);
            const reactions = await getReactions(reactionService, setReaction);
            // @ts-ignore
            setReactionOptions(reactions);
        }
        setOptions();
    }, [actionService, reactionService]);

    const handleCreate = async () => {
        if (!actionService || !reactionService || !action || !reaction || !actionServiceToken || !reactionServiceToken || !actionServiceRefreshToken || !reactionServiceRefreshToken) {
            console.log('Missing fields');
            console.log(actionService, reactionService, action, reaction, actionServiceToken, reactionServiceToken, actionServiceRefreshToken, reactionServiceRefreshToken);
            return;
        }
        console.log('Creating AREA');
        console.log(actionService, reactionService, action, reaction, actionServiceToken, reactionServiceToken, actionServiceRefreshToken, reactionServiceRefreshToken);
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
            const backendConnectionUri = `${backendUri}/auth/${reactionService}?redirect_uri=${encodeURIComponent(redirectUri + '/workspace')}?service_type=reaction`;
            window.location.href = backendConnectionUri;
        } else {
            const backendConnectionUri = `${backendUri}/auth/${reactionService}?redirect_uri=${encodeURIComponent(redirectUri + '/workspace')}?service_type=reaction`;
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
        // setAction(null); // reset action, commented for test
        // @ts-ignore
        setActionOptions(await getActions(service, setAction));
        // @ts-ignore
        await workspaceUpdate({ id: workspaceId, actionServiceTitle: service });
        console.log('changed to', service);
    }

    const handleReactionServiceChange = async (service: string) => {
        // @ts-ignore
        setReactionService(service);
        // setReaction(null); // reset reaction, commented for test
        // @ts-ignore
        setReactionOptions(await getReactions(service, setReaction));
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
                            // @ts-ignore
                            [{label: "choose a service", value: null, onChange: handleActionServiceChange}, {label: "Gmail", value: "gmail", onChange: handleActionServiceChange}]
                        }
                    />
                    <ThemedText>Choose a reaction service, might be set put need chnage on dropdown</ThemedText>
                    <ThemedDropdown
                        options={
                            // @ts-ignore
                            [{label: "choose a service", value: null, onChange: handleReactionServiceChange}, {label: "Gmail", value: "gmail", onChange: handleReactionServiceChange}]
                        }
                    />
                    <ThemedText>Connect to action service, u might already be connected</ThemedText>
                    <ThemedButton title={"Connect"} onPress={() => handleConnectActionService()}></ThemedButton>
                    <ThemedText>Connect to reaction service, u might already be connected</ThemedText>
                    <ThemedButton title={"Connect"} onPress={() => handleConnectReactionService()}></ThemedButton>
                    {/* <ThemedText>Choose an action</ThemedText> */}
                    {/* <ThemedDropdown options={actionOptions}></ThemedDropdown> */}
                    <ThemedText>action set to new_email for test</ThemedText>
                    {/* <ThemedText>Choose a reaction</ThemedText> */}
                    {/* <ThemedDropdown options={reactionOptions}></ThemedDropdown> */}
                    <ThemedText>reaction set to send_email for test</ThemedText>
                    <ThemedButton title={"Create"} onPress={() => handleCreate()}></ThemedButton>
                </ThemedContainer>
                <ThemedTrigger></ThemedTrigger>
            </WorkspaceContainer>
        </ThemedBackground>
    );
}
