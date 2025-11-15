// screens/AwardsScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useTheme from '../hooks/useTheme.jsx';

const AwardsScreen = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.secondary }]}>Awards</Text>
      <Text style={[styles.subtitle, { color: theme.colors.secondary }]}>
        Track awarded proposals, funding breakdown, and milestones.
      </Text>
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.cardLabel, { color: theme.colors.text }]}>Awarded FY25</Text>
        <Text style={[styles.cardValue, { color: theme.colors.primary }]}>$12.4M</Text>
      </View>
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.cardLabel, { color: theme.colors.text }]}>Milestones Met</Text>
        <Text style={[styles.cardValue, { color: theme.colors.primary }]}>83%</Text>
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

export default AwardsScreen;


