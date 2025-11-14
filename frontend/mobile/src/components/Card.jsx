// components/Card.jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import useTheme from '../hooks/useTheme.jsx';

const Card = ({ children, style }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  });

  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

export default Card;

