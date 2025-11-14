// components/ModuleCard.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useTheme from '../hooks/useTheme.jsx';
import Card from './Card.jsx';

const ModuleCard = ({
  name,
  description,
  icon,
  badgeCount,
  onPress,
  accentColor,
}) => {
  const theme = useTheme();
  const resolvedAccentColor = accentColor || theme.colors.primary;

  const styles = StyleSheet.create({
    moduleContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    leftContent: {
      flex: 1,
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: theme.borderRadius.md,
      backgroundColor: resolvedAccentColor + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.lg,
    },
    icon: {
      fontSize: 24,
      color: resolvedAccentColor,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    description: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    badge: {
      backgroundColor: theme.colors.error,
      borderRadius: theme.borderRadius.full,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeText: {
      color: theme.colors.secondary,
      fontSize: 12,
      fontWeight: '700',
    },
  });

  return (
    <TouchableOpacity onPress={onPress}>
      <Card>
        <View style={styles.moduleContent}>
          <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{icon}</Text>
            </View>
            <View style={styles.leftContent}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
          </View>
          {badgeCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeCount}</Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default ModuleCard;

