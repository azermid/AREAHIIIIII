import { ThemedBackground } from '@/components/ThemedBackground';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { WorkspaceContainer } from '@/components/WorkspaceContainer';
import { ThemedContainer } from '@/components/ThemedContainer';
import { ThemedDropdown } from '@/components/ThemedDropdown';
import { ThemedButton } from '@/components/ThemedButton';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';

const envAndroidId = Constants.expoConfig?.extra?.ANDROID_CLIENT_ID;
const envIosId = Constants.expoConfig?.extra?.IOS_CLIENT_ID;
const envWebId = Constants.expoConfig?.extra?.WEB_CLIENT_ID;

export default function WorkspaceScreen() {
    const navigation = useNavigation();

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: envAndroidId,
        iosClientId: envIosId,
        webClientId: envWebId,
        scopes: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send', 'openid', 'profile', 'email'],
    });

    useEffect(() => {
        if (response?.type === 'success') {
          const { authentication } = response;
          if (authentication?.accessToken) {
            console.log('Access Token:', authentication.accessToken);
          }
        }
      }, [response]);

    return (
        <ThemedBackground style={{padding: 0}}>
            <WorkspaceContainer>
                <ThemedContainer border={true} dropShadow={true}>
                    <ThemedText>Welcome to your workspace !</ThemedText>
                    <ThemedButton title={'Login to Gmail'} onPress={() => promptAsync()}></ThemedButton>
                    <ThemedDropdown options={[{label: "test", value: "idk", onChange: null}, {label: "lol", value: "lem", onChange: null}, {label: "tetfygst", value: "hbjidk", onChange: null}]}></ThemedDropdown>
                    <ThemedDropdown options={[{label: "test", value: "idk", onChange: null}, {label: "test", value: "idk", onChange: null}, {label: "test", value: "idk", onChange: null}]}></ThemedDropdown>
                </ThemedContainer>
            </WorkspaceContainer>
        </ThemedBackground>
    );
}
