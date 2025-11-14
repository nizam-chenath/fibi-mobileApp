// components/StatsCard.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useTheme from '../hooks/useTheme.jsx';
import Card from './Card.jsx';

const StatsCard = ({ label, value, icon, color, trend }) => {
  const theme = useTheme();
  const resolvedColor = color || theme.colors.primary;

  const styles = StyleSheet.create({
    statContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    leftSection: {
      flex: 1,
    },
    label: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    value: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    trend: {
      fontSize: 12,
      color: theme.colors.success,
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: resolvedColor + '20',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      fontSize: 32,
      color: resolvedColor,
    },
  });

  return (
    <Card>
      <View style={styles.statContent}>
        <View style={styles.leftSection}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
          {trend && <Text style={styles.trend}>{trend}</Text>}
        </View>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
      </View>
    </Card>
  );
};

export default StatsCard;

