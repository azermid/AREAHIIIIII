import React, { useState } from 'react';
import { StyleSheet, Pressable, PressableProps, Text, BackHandler } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedButtonProps = PressableProps & {
    lightColor?: string;
    darkColor?: string;
    title: string;
};

export function ThemedButton({ style, lightColor, darkColor, title, ...otherProps }: ThemedButtonProps) {
    const [isPressed, setIsPressed] = useState(false); // State to track press

    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');

    // @ts-ignore
    const activeColor = style?.activeColor || null;
    // @ts-ignore
    const inactiveColor = style?.inactiveColor || null;
    const buttonStyle = activeColor?.Button || null;
    const textStyle = activeColor?.Text || null;

    const styles = StyleSheet.create({
        button: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'stretch',
            padding: 4.5,
            borderRadius: 10,
            color,
            backgroundColor: isPressed ? backgroundColor : tintColor, // Change background on hover
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: tintColor,
            cursor: 'pointer', // Ensure pointer cursor on hover
            ...buttonStyle
        },
        text: {
            color: isPressed ? color : backgroundColor, // Change text color on hover
            fontSize: 18,
            fontWeight: 'bold',
            userSelect: 'none', // Prevent text selection
            ...textStyle
        }
    });

    return (
        <Pressable
            // @ts-ignore
            style={styles.button}
            onPressIn={() => setIsPressed(true)} // When pressed, set pressed to true
            onPressOut={() => setIsPressed(false)} // When released, set pressed to false
            {...otherProps}
        >
            <Text style={ styles.text }>{title}</Text>
        </Pressable>
    );
}
