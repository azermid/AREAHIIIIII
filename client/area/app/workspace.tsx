import { ThemedBackground } from '@/components/ThemedBackground';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { WorkspaceContainer } from '@/components/WorkspaceContainer';
import { ThemedContainer } from '@/components/ThemedContainer';

export default function WorkspaceScreen() {
    const navigation = useNavigation();

    return (
        <ThemedBackground style={{padding: 0}}>
            <WorkspaceContainer>
                <ThemedContainer border={true} dropShadow={true}>
                    <ThemedText>Welcome to your workspace !</ThemedText>
                </ThemedContainer>
            </WorkspaceContainer>
        </ThemedBackground>
    );
}
