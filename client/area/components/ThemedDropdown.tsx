import { StyleSheet, ViewProps } from 'react-native';
import { ThemedText } from './ThemedText';
import { Pressable } from 'react-native';
import { useState } from 'react';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { IconButton } from 'react-native-paper';

export type ThemedDropdownProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    options: Array<{
        label: string;
        value: string;
    }>;
    onChange: ((value: any) => void) | null;
};

export function ThemedDropdown({ options, onChange, style, lightColor, darkColor, ...otherProps }: ThemedDropdownProps) {
    const fieldBackgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'fieldBackground');
    const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

    const [selected, setSelected] = useState(0);
    const [opened, setOpened] = useState(false);

    const styles = StyleSheet.create({
        container: {
            alignSelf: 'stretch',
            marginVertical: 8,
            minHeight: 40,
            minWidth: 500,
        },
        mainButton: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: fieldBackgroundColor,
            paddingHorizontal: 10,
            paddingVertical: 12,
        },
        label: {
            color: tintColor,
            fontWeight: 'bold',
            padding: 10,
        },
    });

    if (options.length < 1)
        return null;

    return (
        <ThemedView style={styles.container}>
            <Pressable style={styles.mainButton} onPress={() => {setOpened(!opened)}}>
                <ThemedText style={styles.label}>{options[selected].label}</ThemedText>
                <IconButton
                    icon={opened ? "chevron-up" : "chevron-down"}
                    size={24}
                    onPress={() => {setOpened(!opened)}}
                    iconColor={tintColor}
                />
            </Pressable>
            {opened && options.map((option, index) => {
                return (
                    <Pressable style={{backgroundColor: fieldBackgroundColor}} key={index} onPress={() => {
                        if (onChange)
                            onChange(option.value);
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

