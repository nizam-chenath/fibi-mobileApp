// screens/SplashScreen.jsx
import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

const SplashScreen = ({ onFinish }) => {
  const { width } = useWindowDimensions();
  const contentWidth = useMemo(() => Math.min(width * 0.7, 250), [width]);

  // Animation values - use refs to avoid recreating
  const primaryBlockWidth = useRef(new Animated.Value(0)).current;
  const primaryBlockLeft = useRef(new Animated.Value(0)).current;
  const primaryBlockOpacity = useRef(new Animated.Value(1)).current;
  
  const secondaryBlockWidth = useRef(new Animated.Value(0)).current;
  const secondaryBlockLeft = useRef(new Animated.Value(0)).current;
  const secondaryBlockOpacity = useRef(new Animated.Value(1)).current;
  
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  // Wrap onFinish in useCallback to prevent re-renders
  const handleFinish = useCallback(() => {
    console.log('Splash animation completed, calling onFinish');
    if (onFinish) {
      onFinish();
    }
  }, [onFinish]);

  useEffect(() => {
    // Main title block animation (0-2.8s)
    const animatePrimaryBlock = Animated.sequence([
      // Expand from left (0-1.4s)
      Animated.parallel([
        Animated.timing(primaryBlockWidth, {
          toValue: contentWidth,
          duration: 1400,
          easing: Easing.bezier(0.74, 0.06, 0.4, 0.92),
          useNativeDriver: false,
        }),
        Animated.timing(primaryBlockOpacity, {
          toValue: 0.7,
          duration: 1400,
          useNativeDriver: false,
        }),
      ]),
      // Collapse to right (1.4-2.8s)
      Animated.parallel([
        Animated.timing(primaryBlockLeft, {
          toValue: contentWidth,
          duration: 1400,
          easing: Easing.bezier(0.74, 0.06, 0.4, 0.92),
          useNativeDriver: false,
        }),
        Animated.timing(primaryBlockWidth, {
          toValue: 0,
          duration: 1400,
          easing: Easing.bezier(0.74, 0.06, 0.4, 0.92),
          useNativeDriver: false,
        }),
        Animated.timing(primaryBlockOpacity, {
          toValue: 0.5,
          duration: 1400,
          useNativeDriver: false,
        }),
      ]),
    ]);

    // Title fade in (after 1.3s delay)
    const animateTitleFadeIn = Animated.sequence([
      Animated.delay(1300),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]);

    // Subtitle block animation (starts at 2s)
    const animateSecondaryBlock = Animated.sequence([
      Animated.delay(2000),
      // Expand from left (2s-3s)
      Animated.parallel([
        Animated.timing(secondaryBlockWidth, {
          toValue: contentWidth,
          duration: 1000,
          easing: Easing.bezier(0.74, 0.06, 0.4, 0.92),
          useNativeDriver: false,
        }),
        Animated.timing(secondaryBlockOpacity, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
      // Collapse to right (3s-4s)
      Animated.parallel([
        Animated.timing(secondaryBlockLeft, {
          toValue: contentWidth,
          duration: 1000,
          easing: Easing.bezier(0.74, 0.06, 0.4, 0.92),
          useNativeDriver: false,
        }),
        Animated.timing(secondaryBlockWidth, {
          toValue: 0,
          duration: 1000,
          easing: Easing.bezier(0.74, 0.06, 0.4, 0.92),
          useNativeDriver: false,
        }),
        Animated.timing(secondaryBlockOpacity, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ]);

    // Subtitle fade in (after 3s delay)
    const animateSubtitleFadeIn = Animated.sequence([
      Animated.delay(3000),
      Animated.timing(subtitleOpacity, {
        toValue: 0.5,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    // Run all animations in parallel
    Animated.parallel([
      animatePrimaryBlock,
      animateTitleFadeIn,
      animateSecondaryBlock,
      animateSubtitleFadeIn,
    ]).start();

    // Navigate after animation completes
    const timer = setTimeout(() => {
      handleFinish();
    }, 4200);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentWidth, handleFinish]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#48BD92',
          alignItems: 'center',
          justifyContent: 'center',
        },
        box: {
          width: contentWidth,
          height: 250,
          position: 'relative',
          justifyContent: 'center',
        },
        titleRow: {
          width: '100%',
          position: 'relative',
          height: 50,
          justifyContent: 'center',
        },
        titleBlock: {
          position: 'absolute',
          height: 50,
          backgroundColor: '#FFFFFF',
        },
        title: {
          fontFamily: 'System',
          color: '#FFFFFF',
          fontSize: 32,
          fontWeight: '700',
          position: 'relative',
        },
        roleRow: {
          width: '100%',
          position: 'relative',
          height: 30,
          marginTop: -10,
          justifyContent: 'center',
        },
        roleBlock: {
          position: 'absolute',
          height: 30,
          backgroundColor: '#FFFFFF',
        },
        subtitle: {
          fontFamily: 'System',
          color: '#FFFFFF',
          fontSize: 12,
          fontWeight: '400',
          textTransform: 'uppercase',
          letterSpacing: 5,
          position: 'relative',
        },
      }),
    [contentWidth],
  );

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.titleRow}>
          <Animated.View
            style={[
              styles.titleBlock,
              {
                width: primaryBlockWidth,
                left: primaryBlockLeft,
                opacity: primaryBlockOpacity,
              },
            ]}
          />
          <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
            Fibi
          </Animated.Text>
        </View>

        <View style={styles.roleRow}>
          <Animated.View
            style={[
              styles.roleBlock,
              {
                width: secondaryBlockWidth,
                left: secondaryBlockLeft,
                opacity: secondaryBlockOpacity,
              },
            ]}
          />
          <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
            Loading...
          </Animated.Text>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;