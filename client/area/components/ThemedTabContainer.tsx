import { StyleSheet, View } from 'react-native';
import { useState } from 'react';

import { ThemedContainer, ThemedContainerProps } from './ThemedContainer';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';

export type ThemedTabContainerProps = ThemedContainerProps & {
    tabs: Array<string>;
    tabsScreen: Array<React.ReactNode>;
};

function brightenHex(hexColor: string, factor: number = 1.2): string {
    // Remove `#` if present
    hexColor = hexColor.replace("#", "");

    // Parse hex color components
    let r = parseInt(hexColor.slice(0, 2), 16);
    let g = parseInt(hexColor.slice(2, 4), 16);
    let b = parseInt(hexColor.slice(4, 6), 16);

    // Apply brightening factor and clamp values to 255
    r = Math.min(Math.floor(r * factor), 255);
    g = Math.min(Math.floor(g * factor), 255);
    b = Math.min(Math.floor(b * factor), 255);

    // Convert back to hex and ensure two characters per component
    const brightenedHex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    return brightenedHex.toUpperCase(); // Optional: convert to uppercase
}

export function ThemedTabContainer({ style, lightColor, darkColor, border = true, dropShadow = false, ...otherProps }: ThemedTabContainerProps) {

    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const activeBackgroundColor = brightenHex(backgroundColor, 1.2);
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');

    const [activeTab, setActiveTab] = useState<number>(0);

    const styles = StyleSheet.create({
        tabsContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            gap: 0,
            color,
            backgroundColor,
        },
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
            padding: 10,
            color,
            backgroundColor,
        },
        activeContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
            padding: 10,
            color,
            backgroundColor: activeBackgroundColor,
            borderBottomWidth: 2,
            borderBottomColor: tintColor,
        }
    });

    return (
        <ThemedContainer border={border} dropShadow={dropShadow}>
            <View style={styles.tabsContainer}>
                {otherProps.tabs.map((tab, index) => (
                    // @ts-ignore
                    <View key={index}  onPointerDown={(event: PointerEvent) => {setActiveTab(index)}} style={index == activeTab? styles.activeContainer : styles.container}>
                        <ThemedText>{tab}</ThemedText>
                    </View>
                ))}
            </View>
            {otherProps.tabsScreen.map((tabScreen, index) => (
                <View key={index} style={{display: index == activeTab? 'flex' : 'none'}}>
                    {tabScreen}
                </View>
            ))}
        </ThemedContainer>
    );
}
