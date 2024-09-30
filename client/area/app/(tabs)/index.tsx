import { StyleSheet } from 'react-native';
import { ThemedBackground } from '@/components/ThemedBackground';
import { ThemedContainer } from '@/components/ThemedContainer';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from '@react-navigation/native';

export default function PresentationScreen() {
  const navigation = useNavigation();

  const handleLogin = () => {
    // @ts-ignore
    navigation.navigate('login');
  }

  // Need to make a reel presentation page but for now this is fine
  return (
    <ThemedBackground>
      <ThemedContainer border={true} dropShadow={true}>
        <ThemedView>
          <ThemedText>Welcome to area !</ThemedText>
          <ThemedButton title="Log In" onPress={() => handleLogin()} />
        </ThemedView>
      </ThemedContainer>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
});