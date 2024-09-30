import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { ThemedBackground } from '@/components/ThemedBackground';
import { ThemedContainer } from '@/components/ThemedContainer';
import { ThemedFields } from '@/components/ThemedFields';
import { ThemedButton } from '@/components/ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { userLogin, userThirdPartyLogin } from '@/utils/user';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "821820123303-5rpm4sdr84vm0rlnvcc40fpinmlrhbf4.apps.googleusercontent.com",
    iosClientId:
      "821820123303-0ijjqnhhrgjr1ptrgutuhjg87ekc11o5.apps.googleusercontent.com",
    webClientId:
      "821820123303-1so1fjti9d97i5jgptn5664t530s14dn.apps.googleusercontent.com",
  });

  const loginThirdParty = async ( accessToken: string) => {
    const userInfo = await getGoogleUserInfo(accessToken);
    const user = {
      username: userInfo.given_name,
      email: userInfo.email,
      oauth_id: userInfo.sub,
      oauth_provider: 'google',
      password: Math.random().toString(36).slice(-12),
    };
    // console.log('User:', user);
    const response = await userThirdPartyLogin(user);
    if (response) {
      console.log('Response:', response);
      // handle token here
      // @ts-ignore
      navigation.navigate('home');
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
    if (response) {
      //response can be "Incorrect username or password" or "User not found", so we need to handle this
      console.log('Response:', response);
      // handle token here
      // @ts-ignore
      navigation.navigate('home');
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
          <TouchableOpacity onPress={() => handleLoginHelperNavigation()}>
            <Text style={{ color: tintColor }}>Trouble logging in?</Text>
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={styles.textContainer}>
          <TouchableOpacity onPress={() => handleSignUpNavigation()}>
            <Text style={{ color: tintColor }}>Sign up for an account</Text>
          </TouchableOpacity>
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
