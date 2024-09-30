import { StyleSheet } from 'react-native';
import { ThemedBackground } from '@/components/ThemedBackground';
import { ThemedContainer } from '@/components/ThemedContainer';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from '@react-navigation/native';

//test page for home, will need token to access
export default function HomeScreen() {
  const navigation = useNavigation();

  const handleLogin = () => {
    // @ts-ignore
    navigation.navigate('login');
  }

  return (
    <ThemedBackground>
      <ThemedContainer border={true} dropShadow={true}>
        <ThemedView>
          <ThemedText>Welcome to the home page !</ThemedText>
          <ThemedText>You're logged in</ThemedText>
        </ThemedView>
      </ThemedContainer>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
});