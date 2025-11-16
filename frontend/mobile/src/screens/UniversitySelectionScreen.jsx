// import React, { useMemo, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image,
//   useWindowDimensions,
// } from 'react-native';
// import useTheme from '../hooks/useTheme.jsx';
// import { getAllTenants } from '../config/tenants/index.jsx';

// const placeholderImage = require('../assets/images/us.png');

// const UniversitySelectionScreen = ({ onSelectUniversity }) => {
//   const theme = useTheme();
//   const universities = getAllTenants();
//   const { width } = useWindowDimensions();

//   const tiles = useMemo(
//     () =>
//       universities.map((university) => ({
//         id: university.tenantId,
//         name: university.branding.universityName,
//         logo: university.branding?.logo,
//         tenant: university,
//       })),
//     [universities],
//   );

//   const { styles, logoDimensions } = useMemo(() => {
//     const { colors, spacing, borderRadius } = theme;
//     const horizontalPadding = spacing.xxl * 2;
//     const columnGap = spacing.md;
//     const availableWidth = Math.max(width - horizontalPadding - columnGap, 320);
//     const tileWidth = availableWidth / 2;
//     const tileHeight = Math.max(spacing.xxxl * 2.5, tileWidth * 1.05);
//     const flagSize = Math.max(90, Math.min(tileHeight * 1, 150));
//     const flagImageSize = {
//       width: flagSize * .9,
//       height: flagSize * .9,
//     };

//     const sheet = StyleSheet.create({
//       container: {
//         flex: 1,
//         backgroundColor: colors.primary,
//       },
//       header: {
//         paddingTop: 100,
//         paddingBottom: spacing.xxl,
//         paddingHorizontal: spacing.xxl,
//         backgroundColor: colors.primary,
//       },
//       title: {
//         fontSize: 32,
//         fontWeight: '800',
//         color: colors.surface,
//         letterSpacing: 0.5,
//         marginBottom: spacing.sm,
//       },
//       subtitle: {
//         fontSize: 16,
//         color: colors.surface,
//         opacity: 0.9,
//         fontWeight: '500',
//       },
//       scrollContent: {
//         paddingHorizontal: spacing.xxl,
//         paddingTop: spacing.xxxl,
//         paddingBottom: spacing.xxxl,
//         backgroundColor: 'transparent',
//       },
//       sectionLabel: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: colors.surface,
//         marginBottom: spacing.xl,
//       },
//       tileGrid: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'space-between',
//       },
//       tileWrapper: {
//         width: '48%',
//         marginBottom: spacing.xxl,
//       },
//       tile: {
//         // backgroundColor: 'rgba(255, 255, 255, 0.12)',
//         borderRadius: borderRadius.xl,
//         height: tileHeight,
//         paddingVertical: spacing.lg,
//         paddingHorizontal: spacing.md,
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         // borderWidth: 1,
//         // borderColor: 'rgba(255, 255, 255, 0.25)',
//       },
//       flagWrapper: {
//         width: flagSize,
//         height: flagSize,
//         borderRadius: borderRadius.lg,
//         backgroundColor: colors.surface,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: spacing.md,
//       },
//       flagImage: {
//         borderRadius: borderRadius.md,
//       },
//       tileLabel: {
//         fontSize: 12,
//         fontWeight: '600',
//         color: colors.surface,
//         textAlign: 'center',
//         lineHeight: 16,
//       },
//     });

//     return {
//       styles: sheet,
//       logoDimensions: flagImageSize,
//     };
//   }, [theme, width]);

//   const renderLogo = useCallback(
//     (logo) => {
//       const imageStyle = [
//         styles.flagImage,
//         { width: logoDimensions.width, height: logoDimensions.height },
//       ];

//       if (!logo) {
//         return (
//           <Image
//             source={placeholderImage}
//             style={imageStyle}
//             resizeMode="contain"
//           />
//         );
//       }

//       if (typeof logo === 'function') {
//         const LogoComponent = logo;
//         return (
//           <LogoComponent
//             width={logoDimensions.width}
//             height={logoDimensions.height}
//             preserveAspectRatio="xMidYMid meet"
//           />
//         );
//       }

//       let source;

//       if (typeof logo === 'string') {
//         source = { uri: logo };
//       } else if (logo && typeof logo === 'object' && typeof logo.uri === 'string') {
//         source = { uri: logo.uri };
//       } else {
//         source = logo;
//       }

//       return (
//         <Image
//           source={source || placeholderImage}
//           style={imageStyle}
//           resizeMode="contain"
//         />
//       );
//     },
//     [logoDimensions.height, logoDimensions.width, styles.flagImage],
//   );

//   const handleSelect = (tenant) => {
//     onSelectUniversity(tenant.tenantId);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Select University</Text>
//         <Text style={styles.subtitle}>Choose your institution to continue</Text>
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <Text style={styles.sectionLabel}>Universities</Text>
//         <View style={styles.tileGrid}>
//           {tiles.map((item) => (
//             <TouchableOpacity
//               key={item.id}
//               style={styles.tileWrapper}
//               onPress={() => handleSelect(item.tenant)}
//               activeOpacity={0.85}
//             >
//               <View style={styles.tile}>
//                 <View style={styles.flagWrapper}>
//                   {renderLogo(item.logo)}
//                 </View>
//                 <Text style={styles.tileLabel} numberOfLines={2}>
//                   {item.name}
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default UniversitySelectionScreen;
import React, { useMemo, useCallback, useState, useEffect } from 'react';
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
import { fetchUniversities } from '../api/universityApi.js';
import Logo1 from '../assets/universitylogo/Logo1.png';
import Logo2 from '../assets/universitylogo/Logo2.png';
import Logo3 from '../assets/universitylogo/logo3.png';
import Logo4Webp from '../assets/universitylogo/logo4.webp';
import MITPng from '../assets/universitylogo/MIT.png';

const placeholderImage = require('../assets/images/us.png');

const UniversitySelectionScreen = ({ onSelectUniversity }) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [selectedId, setSelectedId] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadUniversities = async () => {
      try {
        setLoading(true);
        const response = await fetchUniversities();
        if (isMounted) {
          setUniversities(response);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch universities');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUniversities();
    return () => {
      isMounted = false;
    };
  }, []);

  const logoPool = useMemo(() => [Logo1, Logo2, Logo3, Logo4Webp, MITPng], [],);

  const tiles = useMemo(
    () =>
      universities.map((university, index) => ({
        id: university.uid,
        name: university.name,
        logoAsset: logoPool[index % logoPool.length],
        themeColor: typeof university.theme === 'string' ? university.theme : null,
      })),
    [universities, logoPool],
  );

  const { styles, logoDimensions } = useMemo(() => {
    const { colors, spacing, borderRadius } = theme;
    const horizontalPadding = spacing.xxl * 2;
    const columnGap = spacing.md;
    const availableWidth = Math.max(width - horizontalPadding - columnGap, 320);
    const tileWidth = availableWidth / 2;
    const tileHeight = 160;

    const sheet = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingTop: 80,
      },
      header: {
        paddingTop: 60,
        paddingBottom: spacing.xxl,
        paddingHorizontal: spacing.xxl,
        backgroundColor: colors.primary,
      },
      title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.surface,
        letterSpacing: 0.5,
        marginBottom: spacing.sm,
      },
      subtitle: {
        fontSize: 14,
        color: colors.surface,
        opacity: 0.8,
        fontWeight: '500',
      },
      scrollContent: {
        paddingHorizontal: spacing.xxl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xxxl,
        backgroundColor: 'transparent',
      },
      sectionLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.surface,
        marginBottom: spacing.lg,
      },
      tileGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: spacing.xxxl,
      },
      tileWrapper: {
        width: '48%',
        marginBottom: spacing.lg,
      },
      tile: {
        borderRadius: 20,
        height: tileHeight,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
      tileSelected: {
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        borderColor: '#34d399',
        borderWidth: 2,
      },
      logoWrapper: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
      },
      logoImage: {
        borderRadius: 10,
      },
      tileLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.surface,
        textAlign: 'center',
        lineHeight: 16,
        flex: 1,
        textAlignVertical: 'center',
      },
      checkIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#34d399',
        alignItems: 'center',
        justifyContent: 'center',
      },
      checkText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
      },
    });

    return {
      styles: sheet,
      logoDimensions: { width: 48, height: 48 },
    };
  }, [theme, width]);

  const applyOpacity = useCallback((hexColor, alpha = 0.2) => {
    if (!hexColor || typeof hexColor !== 'string') {
      return `rgba(255, 255, 255, ${alpha})`;
    }
    const normalized = hexColor.replace('#', '');
    if (![3, 6].includes(normalized.length)) {
      return hexColor;
    }
    const expandHex =
      normalized.length === 3
        ? normalized
            .split('')
            .map((char) => char + char)
            .join('')
        : normalized;
    const r = parseInt(expandHex.slice(0, 2), 16);
    const g = parseInt(expandHex.slice(2, 4), 16);
    const b = parseInt(expandHex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }, []);

  const renderLogo = useCallback((logoAsset) => {
    const imageStyle = [
      styles.logoImage,
      { width: logoDimensions.width, height: logoDimensions.height },
    ];
    const source = logoAsset || placeholderImage;
    return <Image source={source} style={imageStyle} resizeMode="contain" />;
  }, [logoDimensions.height, logoDimensions.width, styles.logoImage]);

  const handleSelect = (item) => {
    setSelectedId(item.id);
    onSelectUniversity({
      universityUid: item.id,
      name: item.name,
      themeColor: item.themeColor,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select a University</Text>
        <Text style={styles.subtitle}>Choose your institution to continue</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>Universities</Text>
        {loading && (
          <Text style={[styles.subtitle, { color: theme.colors.surface, marginBottom: theme.spacing.md }]}>
            Loading universities...
          </Text>
        )}
        {error && (
          <Text style={[styles.subtitle, { color: theme.colors.error, marginBottom: theme.spacing.md }]}>
            {error}
          </Text>
        )}
        <View style={styles.tileGrid}>
          {tiles.map((item) => (
            <View key={item.id} style={styles.tileWrapper}>
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                activeOpacity={0.85}
              >
              <View
                style={[
                  styles.tile,
                  {
                    backgroundColor: item.themeColor
                      ? applyOpacity(item.themeColor, 0.18)
                      : styles.tile.backgroundColor,
                    borderColor: item.themeColor || styles.tile.borderColor,
                  },
                  selectedId === item.id && {
                    backgroundColor: item.themeColor
                      ? applyOpacity(item.themeColor, 0.35)
                      : styles.tileSelected.backgroundColor,
                    borderColor: item.themeColor || styles.tileSelected.borderColor,
                  },
                ]}
              >
                  {selectedId === item.id && (
                    <View style={styles.checkIcon}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}

                  <View style={styles.logoWrapper}>
                    {renderLogo(item.logoAsset)}
                  </View>

                  <Text style={styles.tileLabel} numberOfLines={2}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* selection info / confirm button removed per request */}
    </View>
  );
};

export default UniversitySelectionScreen;