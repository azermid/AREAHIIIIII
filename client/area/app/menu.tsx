import { StyleSheet } from 'react-native';
import { ThemedBackground } from '@/components/ThemedBackground';
import { ThemedContainer } from '@/components/ThemedContainer';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from '@react-navigation/native';
import { ThemedButton } from '@/components/ThemedButton';

//test page for home, will need token to access
export default function MenuScreen() {
  const navigation = useNavigation();

  const handleNavigation = () => {
    // @ts-ignore
    navigation.navigate('workspace');
  }

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