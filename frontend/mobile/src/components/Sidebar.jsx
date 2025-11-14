// components/Sidebar.jsx
import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import useTheme from '../hooks/useTheme.jsx';
import Icon from 'react-native-vector-icons/Ionicons';

const Sidebar = ({
  modules = [],
  activeModuleId,
  onSelectModule,
  user,
  onLogout,
  onClose,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 1000,
      flexDirection: 'row',
    },
    container: {
      width: 260,
      backgroundColor: theme.colors.surface,
      paddingTop: theme.spacing.xxxl,
      paddingBottom: theme.spacing.lg,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 16,
      shadowOffset: { width: -6, height: 0 },
      elevation: 20,
      borderTopLeftRadius: theme.borderRadius.xxxl,
      borderBottomLeftRadius: theme.borderRadius.xxxl,
    },
    scrollArea: {
      flexGrow: 1,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing.lg,
      marginVertical: theme.spacing.sm,
    },
    userCard: {
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      marginBottom: theme.spacing.md,
      borderWidth: 3,
      borderColor: theme.colors.primary + '55',
    },
    userName: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
    },
    userRole: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    userEmail: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    navRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      marginHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.full,
      marginBottom: theme.spacing.sm,
    },
    navIcon: {
      width: 34,
      height: 34,
      borderRadius: 17,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary + '15',
      marginRight: theme.spacing.md,
    },
    navLabel: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    navBadge: {
      backgroundColor: theme.colors.primary + '20',
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
    },
    navBadgeText: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '700',
    },
    footer: {
      paddingHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    logoutButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
    },
    logoutText: {
      color: theme.colors.secondary,
      fontWeight: '700',
    },
  });

  const navItems = useMemo(() => {
    const items = [];
    const awardsModule = modules.find((m) => m.id === 'grants');
    items.push({
      id: 'awards',
      label: 'Awards',
      description: 'Track latest awards and recognitions',
      icon: 'gift-outline',
    });
    if (awardsModule) {
      items.push({
        id: awardsModule.id,
        label: awardsModule.name || 'Grants',
        description: awardsModule.description || 'View and manage your awards',
        icon: 'trophy-outline',
      });
    }
    return items;
  }, [modules]);

  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollArea}
        >
          <View style={styles.userCard}>
            <Image
              source={
                user?.avatar ? { uri: user.avatar } : require('../assets/images/us.png')
              }
              style={styles.avatar}
            />
            <Text style={styles.userName}>
              {user?.firstName || ''} {user?.lastName || ''}
            </Text>
            {user?.email ? <Text style={styles.userEmail}>{user.email}</Text> : null}
            <Text style={styles.userRole}>{user?.role || 'Member'}</Text>
          </View>

          <View style={styles.divider} />
          {navItems.map((item) => {
            const isActive = item.id === activeModuleId;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.navRow,
                  isActive && { backgroundColor: theme.colors.primary + '15' },
                ]}
                onPress={() =>
                  onSelectModule?.(modules.find((module) => module.id === item.id))
                }
              >
                <View style={styles.navIcon}>
                  <Icon
                    name={item.icon}
                    size={16}
                    color={isActive ? theme.colors.primary : theme.colors.text}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.navLabel}>{item.label}</Text>
                  {item.description ? (
                    <Text style={styles.itemDescription}>{item.description}</Text>
                  ) : null}
                </View>
                {item.badge ? (
                  <View style={styles.navBadge}>
                    <Text style={styles.navBadgeText}>{item.badge}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {onLogout && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={onLogout}
              activeOpacity={0.9}
            >
              <Text style={styles.logoutText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
    </View>
  );
};

export default Sidebar;

