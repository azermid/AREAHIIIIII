import React, { useState } from 'react';
import { StyleSheet, View, type ViewProps, PanResponder, Dimensions } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedContainerProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
};

export function WorkspaceContainer({ style, lightColor, darkColor, ...otherProps }: ThemedContainerProps) {

    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
            width: screenWidth + (position.x > 0 ? (+position.x*2) : (-position.x*2)),
            height: screenHeight + (position.y > 0 ? (+position.y*2) : (-position.y*2)),
            gap: 25,
            userSelect: 'none',
            color,
            backgroundColor,
            transform: [
                { translateX: position.x },
                { translateY: position.y }
            ]
        },
    });

    return (
        <View style={ styles.container } { ...otherProps } { ...panResponder.panHandlers }
        
        />
    );
}
