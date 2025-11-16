// screens/ScanHubScreen.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';

const ScanHubScreen = ({ onBack, onOpenCamera, onOpenSignature }) => {
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
    card: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 16,
      backgroundColor: theme.colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    cardLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
    },
    cardSubtitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
      maxWidth: '90%',
      flexShrink: 1,
    },
    action: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
      alignSelf: 'center',
      flexShrink: 0,
    },
    actionText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Icon name="arrow-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Scan & Sign</Text>
        <View style={{ width: 30 }} />
      </View>

      <TouchableOpacity style={styles.card} onPress={onOpenCamera} activeOpacity={0.9}>
        <View style={styles.cardLeft}>
          <Icon name="camera-outline" size={26} color={theme.colors.primary} />
          <View>
            <Text style={styles.cardTitle}>Camera Scan</Text>
            <Text style={styles.cardSubtitle}>Open camera to scan a document or signature.</Text>
          </View>
        </View>
        <View style={styles.action}>
          <Text style={styles.actionText}>Open</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={onOpenSignature} activeOpacity={0.9}>
        <View style={styles.cardLeft}>
          <Icon name="create-outline" size={26} color={theme.colors.primary} />
          <View>
            <Text style={styles.cardTitle}>Signature Pad</Text>
            <Text style={styles.cardSubtitle}>Open a white space to draw your signature.</Text>
          </View>
        </View>
        <View style={styles.action}>
          <Text style={styles.actionText}>Open</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ScanHubScreen;
