import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedBackground } from '@/components/ThemedBackground';
import { ThemedContainer } from '@/components/ThemedContainer';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from '@react-navigation/native';
import { ThemedButton } from '@/components/ThemedButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userGetId, userVerifyToken } from '@/utils/user';
import { workspaceGetByUserId } from '@/utils/workspace';
// import { userVerifyToken } from '@/utils/user';

//test page for home, will need token to access
export default function MenuScreen() {
  const [worspaces, setWorkspaces] = useState([]);
  const navigation = useNavigation();

  const handleNavigation = () => {
    // @ts-ignore
    navigation.navigate('workspace');
  }

  useEffect(() => {
    const checkForToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          // @ts-ignore
          navigation.navigate('index');
        } else if (!userVerifyToken(token)) {
          // @ts-ignore
          navigation.navigate('index');
        }
        const id = await userGetId(token);
        console.log('ID:', id);
        if (!id) {
          // @ts-ignore
          navigation.navigate('index');
        }
        const workspaces = await workspaceGetByUserId(id);
        console.log('Workspaces:', workspaces);
        setWorkspaces(workspaces);
      } catch (error) {
        console.log('Error checking for token:', error);
      }
    };
    checkForToken();
  }, []);

  return (
    <ThemedBackground>
      <ThemedContainer border={true} dropShadow={true}>
        <ThemedView>
          <ThemedText>Welcome to the home page !</ThemedText>
          <ThemedText style={{marginBottom: 10}}>You're logged in</ThemedText>
          <ThemedButton onPress={handleNavigation} title='Go to your workspace.'></ThemedButton>
        </ThemedView>
      </ThemedContainer>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
});