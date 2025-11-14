// screens/SignUpScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import useTheme from '../hooks/useTheme.jsx';
import useAuth from '../hooks/useAuth.jsx';
import useTenant from '../hooks/useTenant.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import SplashScreen from './SplashScreen.jsx';

const SignUpScreen = ({ onNavigateToLogin }) => {
  const theme = useTheme();
  const { register, loading, error } = useAuth();
  const { currentTenantId } = useTenant();
  const tenantLabel =
    currentTenantId || theme.branding?.universityName || 'Fibi tenant';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      alert('Please fill in all required fields');
      return;
    }

    const result = await register({
      firstName,
      lastName,
      email,
      password,
      department,
      role: 'Researcher',
    });

    if (!result.success && result.error) {
      alert(result.error);
    }
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
    appName: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.secondary,
      marginBottom: theme.spacing.md,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.secondary,
      textAlign: 'center',
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
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    infoBanner: {
      backgroundColor: theme.colors.primary + '10',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.lg,
    },
    infoBannerText: {
      fontSize: 13,
      color: theme.colors.text,
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
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginBottom: theme.spacing.md,
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
            <Text style={styles.appName}>Create your account</Text>
            <Text style={styles.subtitle}>
              Sign up to access the {theme.branding?.universityName} research
              portal
            </Text>
          </View>

          <Card style={styles.formCard}>
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerText}>
                You are registering under tenant{' '}
                <Text style={{ fontWeight: '700' }}>{tenantLabel}</Text>. You
                will be logged in automatically after creating your account.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Personal details</Text>
            <Text style={styles.label}>First name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              placeholderTextColor={theme.colors.textSecondary}
              value={firstName}
              onChangeText={setFirstName}
              editable={!loading}
            />

            <Text style={styles.label}>Last name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              placeholderTextColor={theme.colors.textSecondary}
              value={lastName}
              onChangeText={setLastName}
              editable={!loading}
            />

            <Text style={styles.sectionTitle}>Account details</Text>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor={theme.colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />

            <Text style={styles.label}>Department (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Biomedical Engineering"
              placeholderTextColor={theme.colors.textSecondary}
              value={department}
              onChangeText={setDepartment}
              editable={!loading}
            />

            {error && <Text style={styles.errorText}>❌ {error}</Text>}

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account with us?
              </Text>
              <Text style={styles.footerLink} onPress={onNavigateToLogin}>
                Sign in instead
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

export default SignUpScreen;


