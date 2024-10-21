import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedBackground } from '@/components/ThemedBackground';
import { ThemedContainer } from '@/components/ThemedContainer';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

import { ThemedButton } from '@/components/ThemedButton';

import { userGetId, userVerifyToken } from '@/utils/user';
import { workspaceGetByUserId } from '@/utils/workspace';
// import { userVerifyToken } from '@/utils/user';

//test page for home, will need token to access
export default function MenuScreen() {
  const [workspaces, setWorkspaces] = useState([]);
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
        if (!workspaces) {
          return;
        }
        setWorkspaces(workspaces);
      } catch (error) {
        console.log('Error checking for token:', error);
      }
    };
    checkForToken();
  }, []);

  return (
    <ThemedBackground>
      <ThemedContainer border={true} style={styles.container}>
        <ThemedView style={styles.containerLabelContainer}>
          <ThemedText style={styles.containerLabel}>Workspaces</ThemedText>
          <MaterialCommunityIcons name='plus-box' style={styles.containerLabelPlus}></MaterialCommunityIcons>
        </ThemedView>
        <ThemedContainer border={true} style={{width: '100%', height: 1, padding: 0, margin: 0}}></ThemedContainer>
        {workspaces.map((workspace, index) => {
          return (
            <ThemedView key={index} style={{width: '100%', padding: 10, margin: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <ThemedText>{workspace.name}</ThemedText>
              <ThemedButton title={'Enter'} onPress={handleNavigation}></ThemedButton>
            </ThemedView>
          );
        })}
      </ThemedContainer>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '55%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  containerLabelContainer: {
    width: '100%',
    padding: 10,
    margin: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  containerLabel: {
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 26,
  },
  containerLabelPlus: {
    fontSize: 34,
    color: 'white',
  }
});