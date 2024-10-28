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
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    const [actionService, setActionService] = useState(null);
    const [reactionService, setReactionService] = useState(null);

    const [actionServiceToken, setActionServiceToken] = useState(null);
    const [reactionServiceToken, setReactionServiceToken] = useState(null);
    const [actionServiceRefreshToken, setActionServiceRefreshToken] = useState(null);
    const [reactionServiceRefreshToken, setReactionServiceRefreshToken] = useState(null);

    const [actionOptions, setActionOptions] = useState([]);
    const [reactionOptions, setReactionOptions] = useState([]);
    const [action, setAction] = useState(null);
    const [reaction, setReaction] = useState(null);
    //TODO: all this should be get from db and setting them should edit db

    useEffect(() => {
        const getInfoFromURL = async () => {
            const workspace = await AsyncStorage.getItem('workspace');
            if (workspace) {
                const workspaceObj = JSON.parse(workspace);
                console.log("workspaceObj", workspaceObj);
                setWorkspaceId(workspaceObj.id);
                setWorkspaceName(workspaceObj.name);
                console.log(workspaceObj.id);
                console.log(workspaceObj.name);
            }
            if (Platform.OS === 'web') {
                const urlParams = new URLSearchParams(window.location.search);
    
                const actionServiceTokenFromURL = urlParams.get('action_token');
                console.log(actionServiceTokenFromURL)
                if (actionServiceTokenFromURL) {
                    // @ts-ignore
                    setActionServiceToken(actionServiceTokenFromURL);
                }
    
                const actionServiceRefreshTokenFromURL = urlParams.get('action_refresh_token');
                console.log(actionServiceRefreshTokenFromURL)
                if (actionServiceRefreshTokenFromURL) {
                    // @ts-ignore
                    setActionServiceRefreshToken(actionServiceRefreshTokenFromURL);
                }
    
                const reactionServiceTokenFromURL = urlParams.get('reaction_token');
                console.log(reactionServiceTokenFromURL)
                if (reactionServiceTokenFromURL) {
                    // @ts-ignore
                    setReactionServiceToken(reactionServiceTokenFromURL);
                }
    
                const reactionServiceRefreshTokenFromURL = urlParams.get('reaction_refresh_token');
                console.log(reactionServiceRefreshTokenFromURL)
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
        // getInfoFromURL();
    }, [actionService, reactionService]);

    const handleCreate = async () => {
        if (!actionService || !reactionService || !action || !reaction || !actionServiceToken || !reactionServiceToken || !actionServiceRefreshToken || !reactionServiceRefreshToken) {
            console.log('Missing fields');
            return;
        }
        console.log('Creating AREA');
        // const response = await createAREA(actionService, reactionService, action, reaction, actionServiceUser, reactionServiceUser);
        // if (response) {
        //     console.log('AREA created');
        // } else {
        //     console.log('AREA not created');
        // }
    }

    const handleConnectActionService = async () => {
        if (Platform.OS === 'web') {
            // const backendConnectionUri = `${backendUri}/auth/${actionService}?redirect_uri=${encodeURIComponent(redirectUri + '/workspace?id=' + workspaceId + '&name=' + workspaceName)}&service_type=action&action_token=${actionServiceToken}&action_refresh_token=${actionServiceRefreshToken}&reaction_token=${reactionServiceToken}&reaction_refresh_token=${reactionServiceRefreshToken}`;
            const backendConnectionUri = `${backendUri}/auth/${actionService}?redirect_uri=${encodeURIComponent(redirectUri + '/workspace?id=' + workspaceId + '&name=' + workspaceName)}&service_type=action`;
            // console.log('backendConnectionUri', backendConnectionUri);
            window.location.href = backendConnectionUri;
        } 
    }

    const handleConnectReactionService = async () => {
        if (Platform.OS === 'web') {
            // const backendConnectionUri = `${backendUri}/auth/${reactionService}?redirect_uri=${encodeURIComponent(redirectUri + '/workspace?id=' + workspaceId + '&name=' + workspaceName)}&service_type=reaction&action_token=${actionServiceToken}&action_refresh_token=${actionServiceRefreshToken}&reaction_token=${reactionServiceToken}&reaction_refresh_token=${reactionServiceRefreshToken}`;
            const backendConnectionUri = `${backendUri}/auth/${reactionService}?redirect_uri=${encodeURIComponent(redirectUri + '/workspace?id=' + workspaceId + '&name=' + workspaceName)}&service_type=reaction`;
            // console.log('backendConnectionUri', backendConnectionUri);
            window.location.href = backendConnectionUri;
        }
    }

    return (
        <ThemedBackground style={{padding: 0}}>
            <WorkspaceContainer>
                <ThemedContainer border={true} dropShadow={true}>
                    <ThemedText>Workspace name</ThemedText>
                    <ThemedText>Choose an action service</ThemedText>
                    <ThemedDropdown options={[{label: "choose a service", value: null, onChange: setActionService}, {label: "Gmail", value: "gmail", onChange: setActionService}]}></ThemedDropdown>
                    <ThemedText>Choose a reaction service</ThemedText>
                    <ThemedDropdown options={[{label: "choose a service", value: null, onChange: setActionService}, {label: "Gmail", value: "gmail", onChange: setReactionService}]}></ThemedDropdown>
                    <ThemedText>Connect to action service</ThemedText>
                    <ThemedButton title={"Connect"} onPress={() => handleConnectActionService()}></ThemedButton>
                    <ThemedText>Connect to reaction service</ThemedText>
                    <ThemedButton title={"Connect"} onPress={() => handleConnectReactionService()}></ThemedButton>
                    <ThemedText>Choose an action</ThemedText>
                    {/* <ThemedDropdown options={actionOptions}></ThemedDropdown> */}
                    <ThemedText>Choose a reaction</ThemedText>
                    {/* <ThemedDropdown options={reactionOptions}></ThemedDropdown> */}
                    <ThemedButton title={"Create"} onPress={() => handleCreate()}></ThemedButton>
                </ThemedContainer>
            </WorkspaceContainer>
        </ThemedBackground>
    );
}
