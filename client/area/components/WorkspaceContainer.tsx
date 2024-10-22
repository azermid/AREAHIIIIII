import React, { useState } from 'react';
import { StyleSheet, View, PanResponder } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedContainerProps = {
    lightColor?: string;
    darkColor?: string;
};

export function WorkspaceContainer({ style, lightColor, darkColor, ...otherProps }: ThemedContainerProps) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');

    // Independent position state for each container
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [lastClick, setLastClick] = useState({ time: 0 });

    // Create PanResponder to handle drag events
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gestureState) => {
            // Update the position state to trigger a re-render
            setPosition({
                x: position.x + gestureState.dx,
                y: position.y + gestureState.dy
            });
        },
        onPanResponderRelease: () => {
            if (Date.now() - lastClick.time < 200) {
                // Double click to reset position
                setPosition({ x: 0, y: 0 });
            }
            setLastClick({ time: Date.now() });
        }
    });

    const styles = StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            // Set static width/height, avoid dynamic changes based on position
            width: 300,  // Or any fixed size for the container
            height: 200, // Or any fixed size for the container
            userSelect: 'none',
            color,
            backgroundColor,
            // Only translate the container's position, no dimension adjustments
            transform: [
                { translateX: position.x },
                { translateY: position.y }
            ]
        },
    });

    return (
        <View style={styles.container} {...otherProps} {...panResponder.panHandlers}>
            {/* Content of the container goes here */}
        </View>
    );
}
