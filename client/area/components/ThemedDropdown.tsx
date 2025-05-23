// import { StyleSheet, ViewProps } from 'react-native';
// import { ThemedText } from './ThemedText';
// import { Pressable } from 'react-native';
// import { useState } from 'react';
// import { ThemedView } from './ThemedView';
// import { useThemeColor } from '@/hooks/useThemeColor';
// import { IconButton } from 'react-native-paper';

// export type ThemedDropdownProps = ViewProps & {
//     lightColor?: string;
//     darkColor?: string;
//     options: Array<{
//         label: string;
//         value: string;
//     }>;
//     selectedOptionValue?: string;
//     onChange: ((value: any) => void) | null;
// };

// export function ThemedDropdown({ options, selectedOptionValue, onChange, style, lightColor, darkColor, ...otherProps }: ThemedDropdownProps) {
//     const fieldBackgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'fieldBackground');
//     const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
//     console.log('selectedOptionValue', selectedOptionValue);
//     console.log('options', options);
//     const selectedIndex = options.findIndex(option => option.value === selectedOptionValue);
//     const firstIndex = selectedIndex !== -1 ? selectedIndex : 0;
//     console.log('selectedIndex', selectedIndex);
//     console.log('firstIndex', firstIndex);

//     const [selected, setSelected] = useState(firstIndex);
//     const [opened, setOpened] = useState(false);

//     console.log('selected', selected);

//     const styles = StyleSheet.create({
//         container: {
//             alignSelf: 'stretch',
//             marginVertical: 8,
//             minHeight: 40,
//             minWidth: 500,
//         },
//         mainButton: {
//             display: 'flex',
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center', // this centers the text and chevron vertically
//             backgroundColor: fieldBackgroundColor,
//             paddingHorizontal: 12,
//             paddingVertical: 10, // adjust this to balance top and bottom padding
//         },
//         label: {
//             color: tintColor,
//             fontWeight: 'bold',
//             marginHorizontal: 8, // change padding to margin for better control
//             fontSize: 16, // slightly adjust the font size if needed
//         },
//     });

//     if (options.length < 1)
//         return null;

//     console.log('option selected', options[selected]);
//     console.log('selected', selected);

//     return (
//         <ThemedView style={styles.container}>
//             <Pressable style={[styles.mainButton, style]} onPress={() => { setOpened(!opened) }}>
//                 <ThemedText style={styles.label}>{options[selected].label}</ThemedText>
//                 <IconButton
//                     icon={opened ? "chevron-up" : "chevron-down"}
//                     size={24}
//                     onPress={() => { setOpened(!opened) }}
//                     iconColor={tintColor}
//                 />
//             </Pressable>
//             {opened && options.map((option, index) => {
//                 return (
//                     <Pressable style={{ backgroundColor: fieldBackgroundColor, paddingVertical: 8 }} key={index} onPress={() => {
//                         if (onChange)
//                             onChange(option.value);
//                         setSelected(index);
//                         setOpened(false);
//                     }}>
//                         <ThemedText style={[styles.label, { paddingVertical: 4 }]}>{option.label}</ThemedText>
//                     </Pressable>
//                 );
//             })}
//         </ThemedView>
//     );
// }

import { StyleSheet, ViewProps } from 'react-native';
import { ThemedText } from './ThemedText';
import { Pressable } from 'react-native';
import { useState, useEffect } from 'react';
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
    selectedOptionValue?: string;
    onChange: ((value: any) => void) | null;
};

export function ThemedDropdown({ options, selectedOptionValue, onChange, style, lightColor, darkColor, ...otherProps }: ThemedDropdownProps) {
    const fieldBackgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'fieldBackground');
    const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

    // Initialize selected with the index of `selectedOptionValue`
    const [selected, setSelected] = useState(() => {
        const initialSelectedIndex = options.findIndex(option => option.value === selectedOptionValue);
        return initialSelectedIndex !== -1 ? initialSelectedIndex : 0;
    });
    const [opened, setOpened] = useState(false);

    // Update selected index if `selectedOptionValue` changes
    useEffect(() => {
        const newIndex = options.findIndex(option => option.value === selectedOptionValue);
        if (newIndex !== -1) {
            setSelected(newIndex);
        }
    }, [selectedOptionValue, options]);

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
            alignItems: 'center',
            backgroundColor: fieldBackgroundColor,
            paddingHorizontal: 12,
            paddingVertical: 10,
        },
        label: {
            color: tintColor,
            fontWeight: 'bold',
            marginHorizontal: 8,
            fontSize: 16,
        },
    });

    if (options.length < 1) return null;

    return (
        <ThemedView style={styles.container}>
            <Pressable style={[styles.mainButton, style]} onPress={() => setOpened(!opened)}>
                <ThemedText style={styles.label}>{options[selected]?.label}</ThemedText>
                <IconButton
                    icon={opened ? "chevron-up" : "chevron-down"}
                    size={24}
                    onPress={() => setOpened(!opened)}
                    iconColor={tintColor}
                />
            </Pressable>
            {opened && options.map((option, index) => (
                <Pressable
                    style={{ backgroundColor: fieldBackgroundColor, paddingVertical: 8 }}
                    key={index}
                    onPress={() => {
                        if (onChange) onChange(option.value);
                        setSelected(index);  // Update selected index
                        setOpened(false);
                    }}
                >
                    <ThemedText style={[styles.label, { paddingVertical: 4 }]}>{option.label}</ThemedText>
                </Pressable>
            ))}
        </ThemedView>
    );
}
