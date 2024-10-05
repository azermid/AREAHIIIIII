import { ThemedBackground } from '@/components/ThemedBackground';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { WorkspaceContainer } from '@/components/WorkspaceContainer';

export default function WorkspaceScreen() {
    const navigation = useNavigation();

    return (
        <ThemedBackground style={{padding: 0}}>
            <WorkspaceContainer>
                <ThemedText style={{fontSize: 24, fontWeight: 'bold', textAlign: 'center', padding: 15}}>Workspace</ThemedText>
            </WorkspaceContainer>
        </ThemedBackground>
    );
}
