// screens/SignaturePadScreen.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';

const SignaturePadScreen = ({ onBack }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.colors.text,
    },
    padWrapper: {
      flex: 1,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
    },
    pad: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    hint: {
      marginTop: 12,
      textAlign: 'center',
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Icon name="arrow-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Signature Pad</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.padWrapper}>
        <View style={styles.pad}>
          <Icon name="pencil-outline" size={48} color={theme.colors.primary} />
          <Text style={styles.hint}>White space to sign. (Placeholder)</Text>
        </View>
      </View>
    </View>
  );
};

export default SignaturePadScreen;
