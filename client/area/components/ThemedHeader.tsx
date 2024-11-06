import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
// import { ThemedIconButton } from '@/components/ThemedIconButton';
import { ThemedContainer } from '@/components/ThemedContainer';
import { useThemeColor } from '@/hooks/useThemeColor';
// import { ThemedTextButton } from './ThemedTextButton';
// import { handleListPress, handleLogoPress, handleSearchPress, handleLogoutPress, handleProfilePress } from '@/utils/headerActions';
// import { useRouter } from 'expo-router';

// const logoImage = require('@/assets/images/logo.png');

export type ThemedHeaderProps = {
    lightColor?: string;
    darkColor?: string;
    onLogoutPress?: () => void;
    onBackPress?: () => void;
};

export function ThemedHeader({
    lightColor,
    darkColor,
    onLogoutPress,
    onBackPress,
}: ThemedHeaderProps) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return (
        <ThemedContainer style={styles.header}>
            <View style={styles.container}>
                {/* if onBackPress, show pressable text */}
                {onBackPress && (
                    <Pressable onPress={onBackPress} style={styles.container}>
                        <ThemedText style={styles.logoText}>Back</ThemedText>
                    </Pressable>
                )}
            </View>
            <View style={styles.container}>
                {/* <ThemedIconButton
                    iconName="menu"
                    onPress={() => handleListPress()}
                    iconSize={30} 
                    iconColor="#fff"
                    style={[styles.iconButton, { marginRight: 10 }, { backgroundColor} ]}
                /> */}
                <Pressable onPress={() => onLogoutPress && onLogoutPress()} style={styles.textButton}>
                    {/* <Image source={logoImage} style={styles.logo} /> */}
                    <ThemedText style={styles.logoText}>Logout</ThemedText>
                </Pressable>
            </View>
        </ThemedContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        height: 60,
        borderRadius: 0,
    },
    iconButton: {
        padding: 10,
        borderRadius: 30,
    },
    textButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#2196F3',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    logoText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    searchContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
