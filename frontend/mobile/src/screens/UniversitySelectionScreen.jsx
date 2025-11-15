import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import useTheme from '../hooks/useTheme.jsx';
import { getAllTenants } from '../config/tenants/index.jsx';

const placeholderImage = require('../assets/images/us.png');

const UniversitySelectionScreen = ({ onSelectUniversity }) => {
  const theme = useTheme();
  const universities = getAllTenants();
  const { width } = useWindowDimensions();

  const tiles = useMemo(
    () =>
      universities.map((university) => ({
        id: university.tenantId,
        name: university.branding.universityName,
        logo: university.branding?.logo,
        tenant: university,
      })),
    [universities],
  );

  const { styles, logoDimensions } = useMemo(() => {
    const { colors, spacing, borderRadius } = theme;
    const horizontalPadding = spacing.xxl * 2;
    const columnGap = spacing.md;
    const availableWidth = Math.max(width - horizontalPadding - columnGap, 320);
    const tileWidth = availableWidth / 2;
    const tileHeight = Math.max(spacing.xxxl * 2.5, tileWidth * 1.05);
    const flagSize = Math.max(90, Math.min(tileHeight * 1, 150));
    const flagImageSize = {
      width: flagSize * .9,
      height: flagSize * .9,
    };

    const sheet = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.primary,
      },
      header: {
        paddingTop: 100,
        paddingBottom: spacing.xxl,
        paddingHorizontal: spacing.xxl,
        backgroundColor: colors.primary,
      },
      title: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.surface,
        letterSpacing: 0.5,
        marginBottom: spacing.sm,
      },
      subtitle: {
        fontSize: 16,
        color: colors.surface,
        opacity: 0.9,
        fontWeight: '500',
      },
      scrollContent: {
        paddingHorizontal: spacing.xxl,
        paddingTop: spacing.xxxl,
        paddingBottom: spacing.xxxl,
        backgroundColor: 'transparent',
      },
      sectionLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.surface,
        marginBottom: spacing.xl,
      },
      tileGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      },
      tileWrapper: {
        width: '48%',
        marginBottom: spacing.xxl,
      },
      tile: {
        // backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: borderRadius.xl,
        height: tileHeight,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
        justifyContent: 'space-between',
        // borderWidth: 1,
        // borderColor: 'rgba(255, 255, 255, 0.25)',
      },
      flagWrapper: {
        width: flagSize,
        height: flagSize,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
      },
      flagImage: {
        borderRadius: borderRadius.md,
      },
      tileLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.surface,
        textAlign: 'center',
        lineHeight: 16,
      },
    });

    return {
      styles: sheet,
      logoDimensions: flagImageSize,
    };
  }, [theme, width]);

  const renderLogo = useCallback(
    (logo) => {
      const imageStyle = [
        styles.flagImage,
        { width: logoDimensions.width, height: logoDimensions.height },
      ];

      if (!logo) {
        return (
          <Image
            source={placeholderImage}
            style={imageStyle}
            resizeMode="contain"
          />
        );
      }

      if (typeof logo === 'function') {
        const LogoComponent = logo;
        return (
          <LogoComponent
            width={logoDimensions.width}
            height={logoDimensions.height}
            preserveAspectRatio="xMidYMid meet"
          />
        );
      }

      let source;

      if (typeof logo === 'string') {
        source = { uri: logo };
      } else if (logo && typeof logo === 'object' && typeof logo.uri === 'string') {
        source = { uri: logo.uri };
      } else {
        source = logo;
      }

      return (
        <Image
          source={source || placeholderImage}
          style={imageStyle}
          resizeMode="contain"
        />
      );
    },
    [logoDimensions.height, logoDimensions.width, styles.flagImage],
  );

  const handleSelect = (tenant) => {
    onSelectUniversity(tenant.tenantId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select University</Text>
        <Text style={styles.subtitle}>Choose your institution to continue</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>Universities</Text>
        <View style={styles.tileGrid}>
          {tiles.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.tileWrapper}
              onPress={() => handleSelect(item.tenant)}
              activeOpacity={0.85}
            >
              <View style={styles.tile}>
                <View style={styles.flagWrapper}>
                  {renderLogo(item.logo)}
                </View>
                <Text style={styles.tileLabel} numberOfLines={2}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default UniversitySelectionScreen;