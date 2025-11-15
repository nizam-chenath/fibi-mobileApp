// screens/ServiceTrackerScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useTheme from '../hooks/useTheme.jsx';

const ServiceTrackerScreen = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.secondary }]}>
        Service Tracker
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.secondary }]}>
        Monitor onboarding, support tickets, and SLAs in one place.
      </Text>
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.cardLabel, { color: theme.colors.text }]}>Open Tickets</Text>
        <Text style={[styles.cardValue, { color: theme.colors.primary }]}>18</Text>
      </View>
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.cardLabel, { color: theme.colors.text }]}>
          Average Resolution
        </Text>
        <Text style={[styles.cardValue, { color: theme.colors.primary }]}>3.4 days</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 24,
  },
  card: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 6,
  },
});

export default ServiceTrackerScreen;


