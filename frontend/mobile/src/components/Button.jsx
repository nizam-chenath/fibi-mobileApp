// components/Button.jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import useTheme from '../hooks/useTheme.jsx';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}) => {
  const theme = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.border;
    return variant === 'primary' ? theme.colors.primary : theme.colors.surface;
  };

  const getTextColor = () => {
    return variant === 'primary' ? theme.colors.secondary : theme.colors.text;
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: getBackgroundColor(),
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
      opacity: disabled ? 0.6 : 1,
    },
    buttonBorder: {
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    text: {
      color: getTextColor(),
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'secondary' && styles.buttonBorder,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text style={styles.text}>{loading ? 'Loading...' : title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

