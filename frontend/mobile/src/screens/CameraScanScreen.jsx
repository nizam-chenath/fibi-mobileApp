// screens/CameraScanScreen.jsx
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, PermissionsAndroid, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';
import { launchCamera } from 'react-native-image-picker';

const CameraScanScreen = ({ onBack }) => {
  const theme = useTheme();
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);

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
    body: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    note: {
      color: theme.colors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: 12,
    },
    placeholder: {
      width: '100%',
      aspectRatio: 3/4,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imagePreview: {
      width: '100%',
      aspectRatio: 3/4,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    row: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 12,
    },
    actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    actionLabel: {
      fontWeight: '700',
      color: theme.colors.text,
    },
    errorText: {
      color: theme.colors.error,
      textAlign: 'center',
      marginTop: 8,
    },
  });

  const ensureCameraPermission = async () => {
    if (Platform.OS !== 'android') return 'granted';
    try {
      // If already granted
      const already = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (already) return 'granted';

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'Allow access to your camera to scan documents and signatures.',
          buttonPositive: 'Allow',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) return 'granted';
      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) return 'blocked';
      return 'denied';
    } catch (e) {
      return 'denied';
    }
  };

  const handleOpenCamera = useCallback(async () => {
    setError(null);
    try {
      const perm = await ensureCameraPermission();
      if (perm === 'granted') {
        const result = await launchCamera({
          mediaType: 'photo',
          cameraType: 'back',
          includeBase64: false,
          quality: 0.9,
          saveToPhotos: false,
        });
        if (result.didCancel) return;
        if (result.errorCode) {
          setError(result.errorMessage || result.errorCode);
          return;
        }
        const asset = result.assets && result.assets[0];
        if (asset?.uri) {
          setPhoto({ uri: asset.uri, fileName: asset.fileName, type: asset.type, width: asset.width, height: asset.height });
        } else {
          setError('No image captured');
        }
        return;
      }

      if (perm === 'blocked') {
        setError('Camera permission blocked. Open settings to enable.');
        Alert.alert(
          'Camera Permission',
          'Camera permission is blocked. Open settings to enable it and then try again.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
          { cancelable: true },
        );
        return;
      }

      // perm === 'denied' (user declined). Offer to ask again.
      setError('Camera permission denied');
      Alert.alert(
        'Camera Permission',
        'We need access to your camera to scan. Allow permission?',
        [
          { text: 'Not now', style: 'cancel' },
          {
            text: 'Allow',
            onPress: async () => {
              try {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.CAMERA,
                  {
                    title: 'Camera Permission',
                    message: 'Allow access to your camera to scan documents and signatures.',
                    buttonPositive: 'Allow',
                  },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                  // Open camera immediately after grant
                  const result = await launchCamera({
                    mediaType: 'photo',
                    cameraType: 'back',
                    includeBase64: false,
                    quality: 0.9,
                    saveToPhotos: false,
                  });
                  if (result.didCancel) return;
                  if (result.errorCode) {
                    setError(result.errorMessage || result.errorCode);
                    return;
                  }
                  const asset = result.assets && result.assets[0];
                  if (asset?.uri) {
                    setPhoto({ uri: asset.uri, fileName: asset.fileName, type: asset.type, width: asset.width, height: asset.height });
                  } else {
                    setError('No image captured');
                  }
                } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                  setError('Camera permission blocked. Open settings to enable.');
                  Linking.openSettings();
                } else {
                  setError('Camera permission denied');
                }
              } catch (err) {
                setError('Failed to request camera permission');
              }
            },
          },
        ],
        { cancelable: true },
      );
    } catch (e) {
      setError(e?.message || 'Failed to open camera');
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Icon name="arrow-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Camera Scan</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.body}>
        {photo ? (
          <>
            <Image source={{ uri: photo.uri }} style={styles.imagePreview} resizeMode="contain" />
            <View style={styles.row}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setPhoto(null)}>
                <Icon name="refresh-outline" size={18} color={theme.colors.text} />
                <Text style={styles.actionLabel}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={onBack}>
                <Icon name="checkmark-outline" size={18} color={theme.colors.text} />
                <Text style={styles.actionLabel}>Use Photo</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.placeholder}>
              <Icon name="camera-outline" size={64} color={theme.colors.primary} />
            </View>
            <TouchableOpacity style={styles.actionBtn} onPress={handleOpenCamera}>
              <Icon name="camera" size={18} color={theme.colors.text} />
              <Text style={styles.actionLabel}>Open Camera</Text>
            </TouchableOpacity>
            <Text style={styles.note}>
              Open the camera to scan a document or signature.
            </Text>
            {!!error && (
              <>
                <Text style={styles.errorText}>{error}</Text>
                {error?.toLowerCase()?.includes('blocked') && (
                  <TouchableOpacity
                    style={[styles.actionBtn, { marginTop: 8 }]}
                    onPress={() => Linking.openSettings()}
                  >
                    <Icon name="settings-outline" size={18} color={theme.colors.text} />
                    <Text style={styles.actionLabel}>Open Settings</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default CameraScanScreen;
