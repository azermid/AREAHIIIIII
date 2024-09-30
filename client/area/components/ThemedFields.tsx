import { StyleSheet, View, ViewProps } from 'react-native';
import { ThemedField } from './ThemedField';

export type ThemedFieldsProps = ViewProps & {
  fields: Array<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    secure?: boolean; // New prop to handle password fields
  }>;
};

export function ThemedFields({ fields, style, ...otherProps }: ThemedFieldsProps) {
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'column',
      gap: 10,
    },
  });

  return (
    <View style={[styles.container, style]} {...otherProps}>
      {fields.map((field, index) => (
        <ThemedField
          key={index}
          field={field.label}
          value={field.value}
          onChange={field.onChange}
          secure={field.secure || false} // Pass secure prop to ThemedField
        />
      ))}
    </View>
  );
}
