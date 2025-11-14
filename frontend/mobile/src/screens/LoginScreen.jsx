// screens/LoginScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import useTheme from '../hooks/useTheme.jsx';
import useAuth from '../hooks/useAuth.jsx';
import useTenant from '../hooks/useTenant.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import SplashScreen from './SplashScreen.jsx';

const placeholderLogo = require('../assets/images/us.png');

const LoginScreen = ({ onNavigateToSignUp = () => {} }) => {
  const theme = useTheme();
  const { login, loading, error } = useAuth();
  const { currentTenantId } = useTenant();
  const [email, setEmail] = useState('john.smith@harvard.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    await login(email, password);
  };

  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xxl,
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xxxl,
    },
    logoWrapper: {
      width: 72,
      height: 72,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      overflow: 'hidden',
    },
    logoImage: {
      width: '80%',
      height: '80%',
      resizeMode: 'contain',
    },
    appName: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.secondary,
      marginBottom: theme.spacing.md,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.secondary,
    },
    formCard: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    passwordInput: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      fontSize: 14,
      color: theme.colors.text,
    },
    showPasswordButton: {
      padding: theme.spacing.sm,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginBottom: theme.spacing.md,
      fontWeight: '600',
    },
    loginButton: {
      marginBottom: theme.spacing.lg,
    },
    footer: {
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    footerText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    footerLink: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
      marginTop: theme.spacing.sm,
    },
    tenantInfo: {
      backgroundColor: theme.colors.primary + '10',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.lg,
    },
    tenantInfoText: {
      fontSize: 13,
      color: theme.colors.text,
      fontWeight: '600',
    },
    loaderOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      zIndex: 999,
    },
  });

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoWrapper}>
              <Image
                source={
                  theme.branding?.logo
                    ? typeof theme.branding.logo === 'string'
                      ? { uri: theme.branding.logo }
                      : theme.branding.logo
                    : placeholderLogo
                }
                style={styles.logoImage}
              />
            </View>
            <Text style={styles.appName}>{theme.branding?.appName}</Text>
            <Text style={styles.subtitle}>{theme.branding?.universityName}</Text>
          </View>

          <Card style={styles.formCard}>
            <View style={styles.tenantInfo}>
              <Text style={styles.tenantInfoText}>
                🏢 {theme.branding?.universityName}
              </Text>
            </View>

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor={theme.colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <Text
                style={styles.showPasswordButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </Text>
            </View>

            {error && <Text style={styles.errorText}>❌ {error}</Text>}

            <View style={styles.loginButton}>
              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Demo credentials:</Text>
              {currentTenantId === 'stanford-001' ? (
                <Text style={styles.footerText}>
                  robert.wilson@stanford.edu / password123
                </Text>
              ) : (
                <Text style={styles.footerText}>
                  john.smith@harvard.edu / password123
                </Text>
              )}
              <Text style={styles.footerLink} onPress={onNavigateToSignUp}>
                Need an account? Sign up
              </Text>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      {loading && (
        <View style={styles.loaderOverlay} pointerEvents="none">
          <SplashScreen />
        </View>
      )}
    </View>
  );
};

export default LoginScreen;

