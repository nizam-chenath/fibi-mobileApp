// components/BottomNavBar.jsx
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';

const BottomNavBar = ({
  tabs = [],
  activeTab,
  onTabPress,
  style,
}) => {
  const theme = useTheme();
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  const effectiveTabs =
    tabs.length > 0
      ? tabs
      : [
          { id: 'home', label: 'Home', icon: 'home-outline' },
          { id: 'tracker', label: 'Tracker', icon: 'construct-outline' },
          { id: 'awards', label: 'Awards', icon: 'trophy-outline' },
          { id: 'Email', label: 'Email', icon: 'mail-outline' },
        ];

  const selectedId = activeTab || effectiveTabs[0]?.id;
  const activeIndex = effectiveTabs.findIndex((tab) => tab.id === selectedId);
  const tabWidth = containerWidth > 0 ? containerWidth / effectiveTabs.length : 0;

  // Handle screen dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (tabWidth === 0 || activeIndex < 0) return;

    Animated.spring(indicatorAnim, {
      toValue: activeIndex * tabWidth + 4,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
      mass: 0.6,
    }).start();
  }, [activeIndex, indicatorAnim, tabWidth]);

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: "#36454F",
          shadowColor: theme.colors.text,
        },
        style,
      ]}
      onLayout={(event) => {
        setContainerWidth(event.nativeEvent.layout.width);
      }}
    >
      {tabWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            {
              width: Math.max(0, tabWidth - 8),
              backgroundColor: theme.colors.brandPrimary,
              transform: [{ translateX: indicatorAnim }],
            },
          ]}
        />
      )}
      {effectiveTabs.map((tab) => {
        const isActive = tab.id === selectedId;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              {
                width: tabWidth > 0 ? tabWidth : undefined,
              },
            ]}
            onPress={() => onTabPress?.(tab)}
            activeOpacity={0.85}
          >
            <View style={styles.tabContent}>
              <Icon
                name={tab.icon}
                size={isActive ? 22 : 20}
                color={isActive ? theme.colors.secondary : 'rgba(255,255,255,0.7)'}
                style={[
                  styles.tabIcon,
                  isActive ? styles.tabIconActive : styles.tabIconInactive,
                ]}
              />
              {isActive && (
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: theme.colors.secondary,
                      fontSize: screenWidth < 360 ? 10 : 11,
                    },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}
                >
                  {tab.label}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  indicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 0,
    borderRadius: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  tabIcon: {
    marginBottom: 2,
  },
  tabIconActive: {
    marginBottom: 4,
  },
  tabIconInactive: {
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 2,
    flexShrink: 1,
    maxWidth: '80%',
    textAlign: 'center',
  },
});

export default BottomNavBar;