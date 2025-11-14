import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const COLORS = {
  primary: '#48BD92',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#999999',
  lightGray: '#F5F5F5',
  borderGray: '#EEEEEE',
  darkGray: '#666666',
  lightestGray: '#CCCCCC',
  darkPrimary: '#3DA17A',
  error: '#FF4444',
};

const CustomInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  isPassword = false,
  secureTextEntry,
  onTogglePassword,
  error,
}) => (
  <View style={{ marginBottom: 16 }}>
    <Text
      style={{
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 8,
      }}
    >
      {label}
    </Text>
    <View style={{ position: 'relative' }}>
      <TextInput
        style={{
          height: 48,
          borderWidth: 1,
          borderColor: error ? COLORS.error : COLORS.borderGray,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: COLORS.white,
          fontSize: 14,
          color: COLORS.black,
          paddingRight: isPassword ? 48 : 16,
        }}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      {isPassword && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 12,
            height: 48,
            justifyContent: 'center',
            paddingHorizontal: 8,
          }}
          onPress={onTogglePassword}
        >
          <Icon name={secureTextEntry ? 'eye-off' : 'eye'} size={20} color={COLORS.gray} />
        </TouchableOpacity>
      )}
    </View>
    {error && (
      <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 4 }}>
        {error}
      </Text>
    )}
  </View>
);

const SmartNestSignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const containerPadding = isTablet ? 32 : 16;

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.includes('@')) newErrors.email = 'Valid email is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!agreedToTerms) newErrors.terms = 'Must agree to terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post('YOUR_API_ENDPOINT/auth/signup', {
        name,
        email,
        password,
      });
      Alert.alert('Success', 'Account created successfully!');
      navigation?.navigate('Login');
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Signup failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    Alert.alert('Social Login', `${provider} login coming soon!`);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGray }}>
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={100}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: 16, paddingHorizontal: containerPadding }}>
          <TouchableOpacity
            onPress={() => navigation?.goBack?.()}
            style={{ paddingVertical: 8, width: 40 }}
            accessible
            accessibilityLabel="Go back"
          >
            <Icon name="chevron-back" size={28} color={COLORS.darkGray} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: COLORS.primary,
              textAlign: 'center',
              marginVertical: 12,
            }}
          >
            SmartNest
          </Text>
        </View>

        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 12,
            padding: 24,
            margin: containerPadding,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: COLORS.black,
              marginBottom: 24,
            }}
          >
            Create an Account?
          </Text>

          <CustomInput
            label="Name"
            placeholder="Johan orindo"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />

          <CustomInput
            label="Email"
            placeholder="joedoe75@gmail.com"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />

          <CustomInput
            label="Password"
            placeholder="..........."
            value={password}
            onChangeText={setPassword}
            isPassword
            secureTextEntry={!showPassword}
            onTogglePassword={togglePasswordVisibility}
            error={errors.password}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <TouchableOpacity
              onPress={() => setAgreedToTerms((prev) => !prev)}
              style={{
                width: 20,
                height: 20,
                borderWidth: 1,
                borderColor: COLORS.borderGray,
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
                backgroundColor: agreedToTerms ? COLORS.primary : COLORS.white,
              }}
              accessible
              accessibilityLabel="Accept terms and conditions"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: agreedToTerms }}
            >
              {agreedToTerms && <Icon name="checkmark" size={14} color={COLORS.white} />}
            </TouchableOpacity>

            <Text style={{ fontSize: 12, color: COLORS.darkGray }}>
              I agree to this{' '}
              <Text
                style={{
                  color: COLORS.primary,
                  fontWeight: 'bold',
                  textDecorationLine: 'underline',
                }}
                onPress={() => navigation?.navigate?.('Terms')}
              >
                Terms of Service
              </Text>
            </Text>
          </View>

          {errors.terms && (
            <Text style={{ color: COLORS.error, fontSize: 12, marginBottom: 12 }}>
              {errors.terms}
            </Text>
          )}

          <TouchableOpacity
            style={{
              height: 48,
              backgroundColor: COLORS.primary,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
              opacity: loading ? 0.7 : 1,
            }}
            onPress={handleSignup}
            activeOpacity={0.7}
            disabled={loading}
            accessible
            accessibilityLabel="Create account button"
            accessibilityRole="button"
            accessibilityState={{ disabled: loading }}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                Create account
              </Text>
            )}
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 12,
              color: COLORS.lightestGray,
              textAlign: 'center',
              marginVertical: 16,
            }}
          >
            Or Sign in with
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
            {[
              { icon: 'logo-facebook', name: 'Facebook', key: 'facebook' },
              { icon: 'logo-google', name: 'Google', key: 'google' },
              { icon: 'logo-apple', name: 'Apple', key: 'apple' },
            ].map((social) => (
              <TouchableOpacity
                key={social.key}
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: COLORS.lightGray,
                  borderWidth: 1,
                  borderColor: COLORS.borderGray,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => handleSocialLogin(social.name)}
                activeOpacity={0.7}
                accessible
                accessibilityLabel={`Sign up with ${social.name}`}
                accessibilityRole="button"
              >
                <Icon name={social.icon} size={24} color={COLORS.darkGray} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => navigation?.navigate?.('Login')}
            style={{ marginTop: 16 }}
            accessible
            accessibilityLabel="Already have an account? Sign In"
            accessibilityRole="button"
          >
            <Text style={{ fontSize: 12, color: COLORS.gray, textAlign: 'center' }}>
              Already have an account?{' '}
              <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SmartNestSignupScreen;

