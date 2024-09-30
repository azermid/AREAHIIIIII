import { StyleSheet, View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedBackgroundProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedBackground({ style, lightColor, darkColor, ...otherProps }: ThemedBackgroundProps) {

    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            color,
            backgroundColor
        },
    });

    return (
        <View style={ [styles.container, style] } { ...otherProps }
        
        />
    );
}
