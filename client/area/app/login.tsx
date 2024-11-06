import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity } from 'react-native';
import { ThemedBackground } from '@/components/ThemedBackground';
import { ThemedContainer } from '@/components/ThemedContainer';
import { ThemedFields } from '@/components/ThemedFields';
import { ThemedButton } from '@/components/ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userLogin, userVerifyToken } from '@/utils/user';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const backendUri = Constants.expoConfig?.extra?.BACKEND_URI || Constants.manifest?.extra?.BACKEND_URI;

const redirectUri = AuthSession.makeRedirectUri({
  // @ts-ignore
  useProxy: Platform.select({ web: false, default: true }),
  native: 'myapp://redirect',
});

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const textColor = useThemeColor({}, 'tint');

  const navigation = useNavigation();

  useEffect(() => {
    const checkForToken = async () => {
      try {
        let token;
  
        if (Platform.OS === 'web') {
          const urlParams = new URLSearchParams(window.location.search);
          token = urlParams.get('token');
          window.history.replaceState({}, document.title, window.location.pathname); // Clears token from URL
          if (token) {
            await AsyncStorage.setItem('token', token);
          }
        }
        if (!token) {
          token = await AsyncStorage.getItem('token');
          if (!token) {
            return;
          }
        }
        // @ts-ignore
        const token_validity = await userVerifyToken(token);
        if (token && token_validity.valid) {
          // @ts-ignore
          navigation.navigate('menu');
        }
      } catch (error) {
        console.log('Error checking for token:', error);
      }
    };
    checkForToken();
  }, []);
  

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Please fill in both fields');
      return;
    }
    const response = await userLogin(username, password);
    // console.log('Response:', response);
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

  const handleGoogleLogin = async () => {
    if (Platform.OS === 'web') {
      console.log('redirectUri:', redirectUri);
      window.location.href = `${backendUri}/auth/google?redirect_uri=${encodeURIComponent(redirectUri + '/login')}`;
      // window.open(`${backendUri}/auth/google?redirect_uri=${encodeURIComponent(redirectUri + '/login')}`, '_self'); //same
    } else {
      const backendAuthUrl = `${backendUri}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
      const result = await WebBrowser.openAuthSessionAsync(backendAuthUrl, redirectUri);
      if (result.type === 'success' && result.url) {
        const token = Linking.parse(result.url).queryParams?.token;
        if (token) {
          // @ts-ignore
          // console.log('mobile Token:', token);
          // @ts-ignore
          await AsyncStorage.setItem('token', token);
          // @ts-ignore
          navigation.navigate('menu');
        }
      }
    }
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
        <ThemedButton title="Login with Google" onPress={handleGoogleLogin} />
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
