import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity } from 'react-native';
import { ThemedBackground } from '@/components/ThemedBackground';
import { ThemedContainer } from '@/components/ThemedContainer';
import { ThemedFields } from '@/components/ThemedFields';
import { ThemedButton } from '@/components/ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userLogin, userThirdPartyLogin, userVerifyToken } from '@/utils/user';

const envAndroidId = Constants.expoConfig?.extra?.ANDROID_CLIENT_ID;
const envIosId = Constants.expoConfig?.extra?.IOS_CLIENT_ID;
const envWebId = Constants.expoConfig?.extra?.WEB_CLIENT_ID;

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const textColor = useThemeColor({}, 'tint');

  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: envAndroidId,
    iosClientId: envIosId,
    webClientId: envWebId,
  });

  useEffect(() => {
    const checkForToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token && await userVerifyToken(token)) {
          // @ts-ignore
          navigation.navigate('menu');
        }
      } catch (error) {
        console.log('Error checking for token:', error);
      }
    };
    checkForToken();
  }, []);

  const loginThirdParty = async ( accessToken: string) => {
    const userInfo = await getGoogleUserInfo(accessToken);
    const user = {
      username: userInfo.given_name,
      email: userInfo.email,
      oauth_id: userInfo.sub,
      oauth_provider: 'google',
      password: Math.random().toString(36).slice(-12),
    };
    const response = await userThirdPartyLogin(user);
    if (response) {
      // console.log('Response:', response);
      if (response.token) {
        await AsyncStorage.setItem('token', response.token);
      } else {
        setErrorMessage(response.error);
        return;
      }
      // @ts-ignore
      navigation.navigate('menu');
    } else {
      setErrorMessage('Error logging in with third party account');
    }
  }

  const getGoogleUserInfo = async (accessToken: string) => {
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userInfo = await userInfoResponse.json();
    // console.log('Google User Info:', userInfo);
    return userInfo;
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        // const userInfo = getGoogleUserInfo(authentication.accessToken);
        loginThirdParty(authentication.accessToken);
      }
    }
  }, [response]);

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Please fill in both fields');
      return;
    }
    const response = await userLogin(username, password);
    console.log('Response:', response);
    if (response) {
      if (response.token) {
        await AsyncStorage.setItem('token', response.token);
      } else {
        setErrorMessage(response.error);
        return;
      }
      // @ts-ignore
      navigation.navigate('menu');
    } else {
      setErrorMessage('Incorrect username or password');
    }
  };

  const handleLoginHelperNavigation = () => {
    // @ts-ignore
    navigation.navigate('loginHelper');
  }

  const handleSignUpNavigation = () => {
    // @ts-ignore
    navigation.navigate('signUp');
  }

  const buttonStyles = {
    activeColor: {
      Button: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        paddingVertical: 0
      },
      Text: {
        color: textColor,
        fontWeight: 'normal',
      }
    }
  }

  return (
    <ThemedBackground>
      <ThemedContainer border={true} dropShadow={true}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 8,
          marginTop: 10,
          color: textColor,
        }}>Log In</Text>
        <ThemedFields
          fields={[
            { label: 'Username', value: username, onChange: setUsername },
            { label: 'Password', value: password, onChange: setPassword, secure: true },
          ]}
        />
        {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
        {/* third paties buttons here */} 
        <Button
          title="Login with Google"
          disabled={!request}
          onPress={() => promptAsync()}
        />
        <ThemedButton title="-->" onPress={handleLogin} />
        <ThemedView style={styles.textContainer}>
          <ThemedButton title={"Trouble logging in?"} onPress={handleLoginHelperNavigation}
            //@ts-ignore
            style={buttonStyles}
          />
        </ThemedView>
        <ThemedView style={styles.textContainer}>
          <ThemedButton title={"Sign up for an account"} onPress={handleSignUpNavigation}
            //@ts-ignore
            style={buttonStyles}
          />
        </ThemedView>
      </ThemedContainer>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
});
