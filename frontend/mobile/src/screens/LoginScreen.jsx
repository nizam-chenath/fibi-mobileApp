// screens/LoginScreen.jsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import useTheme from '../hooks/useTheme.jsx';
import useAuth from '../hooks/useAuth.jsx';
import useTenant from '../hooks/useTenant.jsx';
import Button from '../components/Button.jsx';
import SplashScreen from './SplashScreen.jsx';
import Icon from 'react-native-vector-icons/Ionicons';

const placeholderLogo = require('../assets/images/us.png');

const LoginScreen = () => {
  const theme = useTheme();
  const { login, loading, error } = useAuth();
  const { currentTenantId, currentUniversityUid } = useTenant();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('polus@123');
  const [showPassword, setShowPassword] = useState(false);

  const brandingLogoSource = useMemo(() => {
    if (!theme.branding?.logo) {
      return placeholderLogo;
    }

    if (typeof theme.branding.logo === 'string') {
      return { uri: theme.branding.logo };
    }

    if (theme.branding?.logo?.uri) {
      return { uri: theme.branding.logo.uri };
    }

    return theme.branding.logo;
  }, [theme.branding]);

  const secondaryBackground = theme.colors?.Lightbackground || theme.colors?.background;
  const mutedText = 'rgba(28, 28, 28, 0.65)';

  const handleLogin = async () => {
    console.log('[LoginScreen] Login button pressed. currentUniversityUid:', currentUniversityUid);
    
    if (!username || !password) {
      alert('Please enter username and password');
      return;
    }

    if (!currentUniversityUid || (typeof currentUniversityUid === 'string' && currentUniversityUid.trim() === '')) {
      console.warn('[LoginScreen] No university selected. currentUniversityUid:', currentUniversityUid);
      Alert.alert(
        'University Required',
        'Please select a university before logging in.',
        [{ text: 'OK' }]
      );
      return;
    }

    console.log('[LoginScreen] Proceeding with login. universityUid:', currentUniversityUid);
    const result = await login(username, password);

    if (result?.success) {
      const university = theme.branding?.universityName || currentTenantId;
      console.log(
        `[Auth] Sign-in successful for tenant "${currentTenantId}". Navigating to ${university} dashboard.`,
      );
    } else if (result?.error) {
      Alert.alert('Login Failed', result.error, [{ text: 'OK' }]);
    }
  };

  const hasSelectedUniversity = Boolean(currentUniversityUid);
  const selectedUniversityName = theme.branding?.universityName || 'No university selected';

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: secondaryBackground,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      marginTop: 150,
      // backgroundColor: 'red',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xxxl,
    },
    pageHeader: {
      alignItems: 'center',
      marginBottom: 20,
    },
    logoWrapper: {
      width: 90,
      height: 90,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    logoImage: {
      width: '80%',
      height: '80%',
      resizeMode: 'contain',
    },
    brandName: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.surface,
    },
    universityName: {
      marginTop: theme.spacing.xs,
      fontSize: 20,
      fontWeight: '800',
      color: theme.colors.surface,
    },
    formCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xxxl,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    badge: {
      alignSelf: 'flex-start',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary + '15',
      marginBottom: theme.spacing.md,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.primary,
      letterSpacing: 0.5,
    },
    formTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
    },
    formSubtitle: {
      fontSize: 14,
      color: mutedText,
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.xxl,
    },
    inputGroup: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: '#FDFDFD',
      fontSize: 14,
      color: theme.colors.text,
    },
    passwordRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: '#FDFDFD',
    },
    passwordInput: {
      flex: 1,
      height: 50,
      fontSize: 14,
      color: theme.colors.text,
    },
    togglePasswordButton: {
      padding: theme.spacing.sm,
    },
    tenantSummary: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.xxl,
      backgroundColor: theme.colors.surface + '10',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    tenantSummaryLogoWrapper: {
      width: 46,
      height: 46,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      marginRight: theme.spacing.md,
    },
    tenantSummaryLogo: {
      width: '80%',
      height: '80%',
      resizeMode: 'contain',
    },
    tenantSummaryInfo: {
      flex: 1,
    },
    tenantSummaryLabel: {
      fontSize: 11,
      color: mutedText,
      marginBottom: 2,
    },
    tenantSummaryText: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '600',
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      fontWeight: '600',
      marginBottom: theme.spacing.md,
    },
    loginButton: {
      marginBottom: theme.spacing.lg,
    },
    socialDivider: {
      fontSize: 12,
      color: mutedText,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    socialRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    socialButton: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
    },
    demoCredentials: {
      fontSize: 12,
      color: mutedText,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    loaderOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.Lightbackground || theme.colors.background,
      zIndex: 999,
    },
  });

  const socialProviders = [
    { icon: 'logo-facebook', name: 'Facebook', key: 'facebook' },
    { icon: 'logo-google', name: 'Google', key: 'google' },
    { icon: 'logo-apple', name: 'Apple', key: 'apple' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.pageHeader}>
            <View style={styles.logoWrapper}>
              <Image source={brandingLogoSource} style={styles.logoImage} />
            </View>
            {/* <Text style={styles.brandName}>{theme.branding?.appName}</Text> */}
            <Text style={styles.universityName}>{theme.branding?.universityName}</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor={theme.colors.textSecondary}
                value={username}
                onChangeText={setUsername}
                editable={!loading}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.togglePasswordButton}
                  onPress={() => setShowPassword((prev) => !prev)}
                >
                  <Icon
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* <View style={styles.tenantSummary}>
              <View style={styles.tenantSummaryLogoWrapper}>
                <Image source={brandingLogoSource} style={styles.tenantSummaryLogo} />
              </View>
              <View style={styles.tenantSummaryInfo}>
                <Text style={styles.tenantSummaryLabel}>Selected University</Text>
                <Text style={styles.tenantSummaryText} numberOfLines={2}>
                  {hasSelectedUniversity ? selectedUniversityName : 'Please choose a university'}
                </Text>
              </View>
            </View> */}

            {error && <Text style={styles.errorText}>❌ {error}</Text>}

            <View style={styles.loginButton}>
              <Button title="Sign In" onPress={handleLogin} loading={loading} disabled={loading} />
            </View>

            <Text style={styles.socialDivider}>or continue with</Text>
            <View style={styles.socialRow}>
              {socialProviders.map((provider) => (
                <TouchableOpacity key={provider.key} style={styles.socialButton} activeOpacity={0.8}>
                  <Icon name={provider.icon} size={22} color={theme.colors.text} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {loading && (
        <View style={styles.loaderOverlay} pointerEvents="none">
          <SplashScreen />
        </View>
      )}
    </SafeAreaView>
  );
};

export default LoginScreen;

