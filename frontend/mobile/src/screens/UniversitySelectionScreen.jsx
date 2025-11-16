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
  FlatList,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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
  const [selectedItem, setSelectedItem] = useState(null);
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

    const sheet = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: 80,
      },
      header: {
        paddingBottom: spacing.xxl,
        paddingHorizontal: spacing.xxl,
        backgroundColor: 'transparent',
        alignItems: 'center',
      },
      headerIconWrap: {
        alignItems: 'center',
        marginBottom: spacing.md,
      },
      headerIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerIconText: {
        fontSize: 34,
      },
      title: {
        fontSize: 18,
        fontWeight: '800',
        color: (colors && colors.text) || '#111827',
        letterSpacing: 0.5,
        marginBottom: spacing.sm,
        textAlign: 'center',
      },
      subtitle: {
        fontSize: 14,
        color: (colors && colors.mutedText) || '#4b5563',
        opacity: 0.95,
        fontWeight: '500',
        textAlign: 'center',
      },
      listContent: {
        paddingHorizontal: spacing.xxl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xxxl,
      },
      sectionLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: (colors && colors.text) || '#111827',
        marginBottom: spacing.lg,
      },
      gridItemWrapper: {
        width: '100%',
        marginBottom: spacing.sm,
      },
      itemTouchable: {
        borderRadius: 14,
      },
      gradientBorder: {
        borderRadius: 16,
        padding: 1.5,
      },
      neutralBorder: {
        borderRadius: 16,
        padding: 1.5,
        borderWidth: 1,
        borderColor: '#e5e7eb', // light grey
      },
      item: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 72,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: 16,
        backgroundColor: '#ffffff',
      },
      itemSelected: {
        backgroundColor: 'rgba(38, 166, 153, 0.06)',
      },
      logoWrapper: {
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: (colors && colors.card) || '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
      },
      logoImage: {
        borderRadius: 8,
      },
      itemLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: (colors && colors.text) || '#111827',
        flex: 1,
        textTransform: 'capitalize',
      },
      rightCheck: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(38, 166, 153, 0.55)',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(134, 255, 255, 0.08)',
      },
      rightCheckText: {
        color: 'rgba(38, 166, 153, 0.9)',
        fontWeight: '900',
      },
      footer: {
        paddingHorizontal: spacing.xxl,
        paddingBottom: spacing.xxxl,
        paddingTop: spacing.md,
      },
      continueBtn: {
        borderRadius: 24,
      },
      continueText: {
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: '800',
        fontSize: 16,
        paddingVertical: spacing.md,
      },
    });

    return {
      styles: sheet,
      logoDimensions: { width: 40, height: 40 },
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
    setSelectedItem(item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIconWrap} accessible accessibilityRole="image" accessibilityLabel="Globe">
          <LinearGradient
            colors={['#48bd92', '#26a699']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerIconCircle}
          >
            <FontAwesome5 name="university" size={28} color="#ffffff" />
          </LinearGradient>
        </View>
        <Text style={styles.title}>Select a University</Text>
        <Text style={styles.subtitle}>Choose your institution to continue</Text>
      </View>

      <FlatList
        data={tiles}
        keyExtractor={(item) => String(item.id)}
        numColumns={1}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={styles.sectionLabel}>Universities</Text>}
        ListEmptyComponent={
          loading ? (
            <View style={{ paddingVertical: theme.spacing.xl, alignItems: 'center' }}>
              <ActivityIndicator color={(theme.colors && theme.colors.primary) || '#26a699'} />
            </View>
          ) : error ? (
            <Text style={[styles.subtitle, { color: (theme.colors && theme.colors.error) || '#dc2626' }]}>
              {error}
            </Text>
          ) : (
            <Text style={[styles.subtitle]}>
              No universities found
            </Text>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.gridItemWrapper}>
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              activeOpacity={0.85}
              style={styles.itemTouchable}
              accessibilityRole="button"
              accessibilityLabel={`Select ${item.name}`}
              accessibilityState={{ selected: selectedId === item.id }}
            >
              {selectedId === item.id ? (
                <LinearGradient
                  colors={['#48bd92', '#26a699']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientBorder}
                >
                  <LinearGradient
                  colors={['rgba(247, 255, 252, 1)', 'rgba(245, 255, 255, 1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.item, styles.itemSelected]}
                  >
                    <View style={styles.logoWrapper}>
                      {renderLogo(item.logoAsset)}
                    </View>
                    <Text style={styles.itemLabel} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={styles.rightCheck}>
                      <Text style={styles.rightCheckText}>✓</Text>
                    </View>
                  </LinearGradient>
                </LinearGradient>
              ) : (
                <View style={styles.neutralBorder}>
                  <View style={styles.item}>
                    <View style={styles.logoWrapper}>
                      {renderLogo(item.logoAsset)}
                    </View>
                    <Text style={styles.itemLabel} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          disabled={!selectedItem}
          onPress={() => {
            if (!selectedItem) return;
            onSelectUniversity({
              universityUid: selectedItem.id,
              name: selectedItem.name,
              themeColor: selectedItem.themeColor,
            });
          }}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityState={{ disabled: !selectedItem }}
        >
          <LinearGradient
            colors={selectedItem ? ['#48bd92', '#26a699'] : ['#b8c2cc', '#a0aec0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueBtn}
          >
            <Text style={styles.continueText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UniversitySelectionScreen;