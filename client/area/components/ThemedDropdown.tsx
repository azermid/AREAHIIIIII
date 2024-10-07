import { StyleSheet, ViewProps } from 'react-native';
import { ThemedText } from './ThemedText';
import { Pressable } from 'react-native';
import { useState } from 'react';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type ThemedDropdownProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    options: Array<{
        label: string;
        value: string;
        onChange: ((value: any) => void) | null;
    }>;
};

export function ThemedDropdown({ options, style, lightColor, darkColor, ...otherProps }: ThemedDropdownProps) {
    if (options.length < 1)
        return null;

    const fieldBackgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'fieldBackground');
    const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

    const [selected, setSelected] = useState(0);
    const [opened, setOpened] = useState(true);

    const styles = StyleSheet.create({
        container: {
            alignSelf: 'stretch',
        },
        mainButton: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: fieldBackgroundColor,
        },
        label: {
            color: tintColor,
            fontWeight: 'bold',
            padding: 7.5,
        },
        arrow: {
            color: tintColor,
        }
    });

    return (
        <ThemedView style={styles.container}>
            <Pressable style={styles.mainButton} onPress={() => {setOpened(!opened)}}>
                <ThemedText style={styles.label}>{options[selected].label}</ThemedText>
                <MaterialCommunityIcons name={opened ? "chevron-up" : "chevron-down"} size={24} style={styles.arrow} />
            </Pressable>
            {opened && options.map((option, index) => {
                return (
                    <Pressable style={{backgroundColor: fieldBackgroundColor}} key={index} onPress={() => {
                        if (option.onChange)
                            option.onChange(option.value);
                        setSelected(index);
                        setOpened(false);
                    }}>
                        <ThemedText style={styles.label}>{option.label}</ThemedText>
                    </Pressable>
                );
            })}
        </ThemedView>
    );
}
