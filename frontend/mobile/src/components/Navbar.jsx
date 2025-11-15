// components/Navbar.jsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';

const Navbar = ({
  user,
  title,
  tenantLogo,
  onSidebarToggle,
  notificationCount = 0,
  onNotificationPress,
}) => {
  const theme = useTheme();
  const logoSize = 40;
  const resolvedUniversity =
    theme.branding?.universityName || title || theme.branding?.appName || 'Fibi';

  const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      paddingTop: theme.spacing.xl,
      backgroundColor: theme.colors.primary,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
    bar: {
      marginTop: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    leftArea: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
    },
    userName: {
      color: theme.colors.secondary,
      fontSize: 18,
      fontWeight: '700',
    },
    tenantLogo: {
      width: logoSize,
      height: logoSize,
    },
    notificationButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      backgroundColor: 'rgba(255,255,255,0.15)',
      marginLeft: theme.spacing.sm,
    },
    notificationIcon: {
      color: theme.colors.secondary,
    },
    badge: {
      position: 'absolute',
      top: -4,
      right: -4,
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.error,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    badgeLabel: {
      color: theme.colors.secondary,
      fontSize: 10,
      fontWeight: '700',
    },
  });

  const renderTenantLogo = () => {
    if (!tenantLogo) return null;

    if (typeof tenantLogo === 'function') {
      const LogoComponent = tenantLogo;
      return <LogoComponent width={logoSize} height={logoSize} />;
    }

    const source =
      typeof tenantLogo === 'string'
        ? { uri: tenantLogo }
        : tenantLogo && typeof tenantLogo.uri === 'string'
          ? { uri: tenantLogo.uri }
          : tenantLogo;

    return <Image source={source} style={styles.tenantLogo} resizeMode="contain" />;
  };

  return (
    <LinearGradient
      colors={[theme.colors.brandPrimary || theme.colors.primary, theme.colors.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.wrapper}
    >
      <View style={styles.bar}>
        <TouchableOpacity
          style={styles.leftArea}
          activeOpacity={0.85}
          onPress={onSidebarToggle}
        >
          {renderTenantLogo()}
          <View>
            <Text style={styles.userName}>
              {user?.firstName || ''} {user?.lastName || ''}
            </Text>
            <Text style={[styles.userName, { fontSize: 12, fontWeight: '500', opacity: 0.85 }]}>
              {resolvedUniversity}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={onNotificationPress || (() => {})}
          activeOpacity={0.85}
        >
          <Icon
            name="notifications-outline"
            size={22}
            style={styles.notificationIcon}
          />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeLabel}>
                {notificationCount > 99 ? '99+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Navbar;

