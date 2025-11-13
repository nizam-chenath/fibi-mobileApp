import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import useTheme from '../hooks/useTheme.jsx';
import { getAllTenants } from '../config/tenants/index.jsx';

const placeholderImage = require('../assets/images/us.png');

const imageMap = {
  'harvard-001': placeholderImage,
  'stanford-001': placeholderImage,
  'mit-001': placeholderImage,
  'yale-001': placeholderImage,
};

const UniversitySelectionScreen = ({ onSelectUniversity }) => {
  const theme = useTheme();
  const universities = getAllTenants();

  const tiles = useMemo(
    () =>
      universities.map((university) => ({
        id: university.tenantId,
        name: university.branding.universityName,
        image: imageMap[university.tenantId] || placeholderImage,
        tenant: university,
      })),
    [universities],
  );

  const styles = useMemo(() => {
    const { colors, spacing, borderRadius } = theme;
    const tileHeight = spacing.xxxl * 2 + spacing.lg;

    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.primary,
      },
      header: {
        paddingTop: spacing.xxxl + spacing.lg,
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.xxl,
        backgroundColor: colors.primary,
        // borderBottomLeftRadius: borderRadius.xl * 2,
        // borderBottomRightRadius: borderRadius.xl * 2,
        // shadowColor: colors.primary,
        // shadowOffset: { width: 0, height: 8 },
        // shadowOpacity: 0.2,
        // shadowRadius: 18,
        // elevation: 6,
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
        width: 56,
        height: 56,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
      },
      flagImage: {
        width: 44,
        height: 32,
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
  }, [theme]);

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
                  <Image source={item.image} style={styles.flagImage} resizeMode="contain" />
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