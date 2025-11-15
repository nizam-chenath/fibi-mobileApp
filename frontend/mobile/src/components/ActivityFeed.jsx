// components/ActivityFeed.jsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import useTheme from '../hooks/useTheme.jsx';
import Card from './Card.jsx';

const ActivityFeed = ({ activities = [] }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginTop: theme.spacing.lg,
    },
    header: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.secondary,
      marginBottom: theme.spacing.lg,
      marginHorizontal: theme.spacing.lg,
    },
    activityItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
    },
    timelineIcon: {
      fontSize: 20,
      marginRight: theme.spacing.md,
      width: 24,
    },
    activityContent: {
      flex: 1,
    },
    action: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    title: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    timestamp: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recent Activities</Text>
      <Card>
        <ScrollView showsVerticalScrollIndicator={false}>
          {activities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <Text style={styles.timelineIcon}>{activity.icon}</Text>
              <View style={styles.activityContent}>
                <Text style={styles.action}>{activity.action}</Text>
                <Text style={styles.title}>{activity.title}</Text>
                <Text style={styles.timestamp}>{activity.timestamp}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </Card>
    </View>
  );
};

export default ActivityFeed;

