import { StyleSheet, View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedContainerProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    border?: boolean;
    dropShadow?: boolean;
};

export function ThemedContainer({ style, lightColor, darkColor, border, dropShadow, ...otherProps }: ThemedContainerProps) {

    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');

    const styles = StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 15,
            borderRadius: 15,
            gap: 15,
            color,
            backgroundColor,
            borderStyle: 'solid',
            borderWidth: border ? 1 : 0,
            borderColor: tintColor,
            shadowColor: tintColor,
            shadowOffset: {
                width: 0,
                height: 0,
            },
            shadowOpacity: dropShadow ? 1 : 0,
            shadowRadius: 80,
            elevation: dropShadow ? 10 : 0,
        },
    });

    return (
        <View style={ [styles.container, style] } { ...otherProps }
        
        />
    );
}
