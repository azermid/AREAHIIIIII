import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';

import { ThemedBackground } from '@/components/ThemedBackground';
import { ThemedContainer } from '@/components/ThemedContainer';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

import { userVerifyToken } from '@/utils/user';
import { workspaceGetByUserId, workspaceCreate, workspaceDelete, workspaceUpdate } from '@/utils/workspace';

export default function MenuScreen() {
  const [id, setId] = useState('');
  const [workspaces, setWorkspaces] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const checkForToken = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            // @ts-ignore
            navigation.navigate('index');
            return;
          }
          // @ts-ignore
          const token_validity = await userVerifyToken(token);
          if (!token_validity.valid) {
            AsyncStorage.removeItem('token');
            // @ts-ignore
            navigation.navigate('index');
            return;
          }
          // @ts-ignore
          // const id = await userGetId(token);
          const id = token_validity.decoded.id;
          // console.log('Id', id);
          if (!id) {
            // @ts-ignore
            navigation.navigate('index');
            return;
          }
          setId(id);

          const workspaces = await workspaceGetByUserId(id);
          // console.log('Workspaces', workspaces);
          if (!workspaces) {
            return;
          }
          setWorkspaces(workspaces);
        } catch (error) {
          console.log('Error checking for token:', error);
        }
      };
      checkForToken();
    }, [])
  );

  async function createWorkspace() {
    workspaceCreate('Test Workspace', id).then(
      // @ts-ignore
      (data) => setWorkspaces([...workspaces, data])
    );
  }

  return (
    <ThemedBackground>
      <ThemedContainer border={true} style={styles.container}>
        <ThemedView style={styles.containerLabelContainer}>
          <ThemedText style={styles.containerLabel}>Workspaces</ThemedText>
          <IconButton
            icon='plus-box'
            size={30}
            onPress={createWorkspace}
            iconColor='white'
          />
        </ThemedView>
        <ThemedContainer border={true} style={{width: '100%', height: 1, padding: 0, margin: 0}}></ThemedContainer>
        {workspaces.map((workspace, index) => {
          return (
            <ThemedView key={index}  style={{width: '100%', padding: 10, margin: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <TextInput
                style={
                  {padding: 10, margin: 0, backgroundColor: 'transparent', color: 'white', fontWeight: '500', fontSize: 18, maxWidth: '60%'}
                }
                defaultValue={
                  // @ts-ignore
                  workspace.name
                }
                onChangeText={(text) => {
                  // @ts-ignore
                  workspace.name = text;
                }}
                onBlur={() => {
                  // @ts-ignore
                  workspaceUpdate({ id: workspace.id, name: workspace.name });
                }}
              />
              <ThemedView style={{display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'center'}}>
                <IconButton
                  icon='arrow-right-bold-box'
                  size={30}
                  onPress={async () => {
                    await AsyncStorage.setItem('workspace', JSON.stringify(workspace));
                    // @ts-ignore
                    navigation.navigate('workspace');
                  }}
                  iconColor='white'
                />
                <IconButton
                  icon='delete'
                  size={30}
                  onPress={() => {
                    // @ts-ignore
                    workspaceDelete(workspace.id);
                    // @ts-ignore
                    const newWorkspaces = workspaces.filter((value) => value.id !== workspace.id);
                    setWorkspaces(newWorkspaces);
                  }}
                  iconColor='red'
                />
              </ThemedView>
            </ThemedView>
          );
        })}
      </ThemedContainer>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 0,
    width: '80%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90%',
    // @ts-ignore
    overflow: 'auto'
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
    cursor: 'pointer'
  },
  containerWorkspace: {
    width: '100%',
    padding: 10,
    margin: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});