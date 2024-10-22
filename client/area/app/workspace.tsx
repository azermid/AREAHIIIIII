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

// Mock data for services, actions, and reactions
const mockServices = [
    { id: 1, title: 'Google Calendar' },
    { id: 2, title: 'Twitter' },
    { id: 3, title: 'Slack' },
];

const mockActions = {
    1: [
        { id: 1, title: 'Create Event' },
        { id: 2, title: 'Event Time Trigger' },
    ],
    2: [
        { id: 1, title: 'Send Tweet' },
        { id: 2, title: 'Receive Mention' },
    ],
};

const mockReactions = {
    1: [
        { id: 1, title: 'Send Email' },
        { id: 2, title: 'Post on Slack' },
    ],
    2: [
        { id: 1, title: 'Like Tweet' },
        { id: 2, title: 'Retweet' },
    ],
};

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

      const [selectedService, setSelectedService] = useState(null);
      const [selectedAction, setSelectedAction] = useState(null);
      const [selectedReaction, setSelectedReaction] = useState(null);

      // Draggable containers for actions and reactions
      const [actionContainerVisible, setActionContainerVisible] = useState(false);
      const [reactionContainerVisible, setReactionContainerVisible] = useState(false);

      const handleServiceChange = (serviceId) => {
          setSelectedService(serviceId);
          setActionContainerVisible(true);
          setReactionContainerVisible(false);
      };

      const handleActionChange = (actionId) => {
          setSelectedAction(actionId);
          setReactionContainerVisible(true);
      };
  
      const handleReactionChange = (reactionId) => {
          setSelectedReaction(reactionId);
          // Display save trigger button
      };
  
      return (
          <ThemedBackground style={{ padding: 0 }}>
              {/* Service Container */}
              <WorkspaceContainer>
                  <ThemedContainer border={true} dropShadow={true}>
                      <ThemedText>Select a Service</ThemedText>
                      <ThemedDropdown
                          options={mockServices.map(service => ({ label: service.title, value: service.id }))}
                          onChange={handleServiceChange}
                          placeholder="Select a service"
                      />
                  </ThemedContainer>
              </WorkspaceContainer>
  
              {/* Action Container */}
              {actionContainerVisible && selectedService && (
                  <WorkspaceContainer>
                      <ThemedContainer border={true} dropShadow={true}>
                          <ThemedText>Select an Action</ThemedText>
                          <ThemedDropdown
                              options={mockActions[selectedService]?.map(action => ({ label: action.title, value: action.id }))}
                              onChange={handleActionChange}
                              placeholder="Select an action"
                          />
                      </ThemedContainer>
                  </WorkspaceContainer>
              )}
  
              {/* Reaction Container */}
              {reactionContainerVisible && selectedAction && (
                  <WorkspaceContainer>
                      <ThemedContainer border={true} dropShadow={true}>
                          <ThemedText>Select a Reaction</ThemedText>
                          <ThemedDropdown
                              options={mockReactions[selectedAction]?.map(reaction => ({ label: reaction.title, value: reaction.id }))}
                              onChange={handleReactionChange}
                              placeholder="Select a reaction"
                          />
                      </ThemedContainer>
                  </WorkspaceContainer>
              )}
          </ThemedBackground>
      );
  }