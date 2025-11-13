// components/Header.jsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import useTheme from '../hooks/useTheme.jsx';

const Header = ({ title, onMenuPress, showLogo = true, logo }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    header: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    logo: {
      width: 40,
      height: 40,
      marginRight: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.secondary,
    },
    menuButton: {
      padding: theme.spacing.sm,
    },
  });

  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        {showLogo && logo && (
          <Image source={logo} style={styles.logo} />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
        <Text style={{ fontSize: 24 }}>☰</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

