import { ThemedBackground } from '@/components/ThemedBackground';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { WorkspaceContainer } from '@/components/WorkspaceContainer';
import { ThemedContainer } from '@/components/ThemedContainer';
import { ThemedDropdown } from '@/components/ThemedDropdown';
import { ThemedButton } from '@/components/ThemedButton';

export default function WorkspaceScreen() {
    const navigation = useNavigation();

    return (
        <ThemedBackground style={{padding: 0}}>
            <WorkspaceContainer>
                <ThemedContainer border={true} dropShadow={true}>
                    <ThemedText>Welcome to your workspace !</ThemedText>
                    <ThemedButton title={'Login to Gmail'} onPress={() => {}}></ThemedButton>
                    <ThemedDropdown options={[{label: "test", value: "idk", onChange: null}, {label: "lol", value: "lem", onChange: null}, {label: "tetfygst", value: "hbjidk", onChange: null}]}></ThemedDropdown>
                    <ThemedDropdown options={[{label: "test", value: "idk", onChange: null}, {label: "test", value: "idk", onChange: null}, {label: "test", value: "idk", onChange: null}]}></ThemedDropdown>
                </ThemedContainer>
            </WorkspaceContainer>
        </ThemedBackground>
    );
}
