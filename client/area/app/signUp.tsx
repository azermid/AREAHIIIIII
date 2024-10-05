import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedBackground } from '@/components/ThemedBackground';
import { ThemedContainer } from '@/components/ThemedContainer';
import { ThemedFields } from '@/components/ThemedFields';
import { ThemedButton } from '@/components/ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from '@/components/ThemedView';
import { userRegister } from '@/utils/user';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifiedPassword, setVerifiedPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!email || !username || !password) {
        setErrorMessage('Please fill in all fields');
        return;
    }
    if (password !== verifiedPassword) {
        setErrorMessage('Passwords do not match');
        return;
    }
    const response = await userRegister(username, email, password);
    if (response) {
        console.log('Response:', response);
        // handle token here
        // @ts-ignore
        navigation.navigate('menu');
    } else {
        setErrorMessage('Username or email already exists');
    }
  };

  const handleSignInNavigation = () => {
    // @ts-ignore
    navigation.navigate('login');
  };

  return (
    <ThemedBackground>
      <ThemedContainer border={true} dropShadow={true}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 8,
          marginTop: 10,
          color: textColor,
        }}>Sign Up</Text>
        <ThemedFields
          fields={[
            { label: 'Email', value: email, onChange: setEmail },
            { label: 'Username', value: username, onChange: setUsername },
            { label: 'Password', value: password, onChange: setPassword, secure: true },
            { label: 'Verify Password', value: verifiedPassword, onChange: setVerifiedPassword, secure: true },
          ]}
        />
        {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
        {/* third paties buttons here */} 
        <ThemedButton title="-->" onPress={() => handleSignUp()} />
        <ThemedView style={styles.textContainer}>
          <TouchableOpacity onPress={() => handleSignInNavigation()}>
            <Text style={{ color: tintColor }}>Already have an account?</Text>
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