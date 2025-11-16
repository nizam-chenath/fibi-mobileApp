// components/Button.jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import useTheme from '../hooks/useTheme.jsx';
import LinearGradient from 'react-native-linear-gradient';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  gradientColors,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 0 },
}) => {
  const theme = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.border;
    return variant === 'primary' ? theme.colors.primary : theme.colors.surface;
  };

  const getTextColor = () => {
    if (gradientColors?.length) return theme.colors.surface;
    return variant === 'primary' ? theme.colors.secondary : theme.colors.text;
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: gradientColors?.length ? 'transparent' : getBackgroundColor(),
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
      opacity: disabled ? 0.6 : 1,
    },
    gradientWrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: theme.borderRadius.md,
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
      {gradientColors?.length ? (
        <LinearGradient
          colors={gradientColors}
          start={gradientStart}
          end={gradientEnd}
          style={styles.gradientWrapper}
        />
      ) : null}
      <View style={{ zIndex: 1 }}>
        <Text style={styles.text}>{loading ? 'Loading...' : title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

