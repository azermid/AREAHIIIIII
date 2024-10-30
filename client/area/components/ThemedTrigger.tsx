import React, { useState } from 'react';
import { StyleSheet,} from 'react-native';
import { ThemedContainer, ThemedContainerProps } from './ThemedContainer';
import { ThemedText } from './ThemedText';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from './ThemedView';

export type ThemedTriggerProps = ThemedContainerProps & {

};

export function ThemedTrigger({ style, lightColor, darkColor, ...otherProps }: ThemedTriggerProps) {

    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');
    const fieldBackground = useThemeColor({ light: lightColor, dark: darkColor }, 'fieldBackground');

    const styles = StyleSheet.create({
        textBox: {
            width: '100%',
            borderRadius: 0,
        },
        textBoxText: {
            width: '100%',
            fontWeight: 'bold',
            paddingHorizontal: 10,
            paddingVertical: 5,
            color: '#cccccc',
            backgroundColor: fieldBackground
        }
    });

    return (
        <ThemedContainer border={true}>
            <ThemedText style={{fontWeight: 'bold'}}>Auto Reply: Thomas</ThemedText>
            <ThemedView style={styles.textBox}>
                <ThemedText style={{fontWeight: 'bold', color: tintColor}}>Action:</ThemedText>
                <ThemedText style={styles.textBoxText}>Got An Email From Thomas</ThemedText>
            </ThemedView>
            <ThemedView style={styles.textBox}>
                <ThemedText style={{fontWeight: 'bold', color: tintColor}}>Reaction:</ThemedText>
                <ThemedText style={styles.textBoxText}>Reply with blablablablabla</ThemedText>
            </ThemedView>
        </ThemedContainer>
    );
}
