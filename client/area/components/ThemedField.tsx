  import { StyleSheet, Text, TextInput, View, Pressable, type ViewProps } from 'react-native';
  import { useThemeColor } from '@/hooks/useThemeColor';
  import React, { useState, useRef } from 'react';

  export type ThemedFieldProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    field: string;
    value: string;
    onChange: (value: string) => void;
    secure?: boolean;
  };

  export function ThemedField({ style, lightColor, darkColor, field, value, onChange, secure = false, ...otherProps }: ThemedFieldProps) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');
    const fieldBackgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'fieldBackground');

    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const handleFocus = () => {
      setIsFocused(true);
      inputRef.current?.focus();
    };

    const handleBlur = () => {
      if (value === '') setIsFocused(false);
    };

    const labelStyle = {
      top: isFocused || value ? 2 : 15,
      left: 10,
      color: tintColor + '80',
      position: 'absolute',
      transition: 'top 0.1s, left 0.1s',
      fontSize: isFocused || value ? 10 : 16,
      fontWeight: 'bold',
      zIndex: 1,
    };

    const styles = StyleSheet.create({
      container: {
        flexDirection: 'column',
        alignSelf: 'stretch',
        backgroundColor: backgroundColor + '80',
        position: 'relative',
        borderRadius: 5,
      },
      input: {
        padding: 10,
        color,
        backgroundColor: fieldBackgroundColor,
        borderRadius: 5,
        outlineStyle: 'none'
      },
    });

    return (
      <Pressable onPress={handleFocus} style={[styles.container, style]} {...otherProps}>
        <Text style={labelStyle}>{field}</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholderTextColor={tintColor}
          secureTextEntry={secure}
        />
      </Pressable>
    );
  }
