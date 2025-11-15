// components/BottomNavBar.jsx
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
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
  const effectiveTabs =
    tabs.length > 0
      ? tabs
      : [
          { id: 'home', label: 'Dashboard', icon: 'home-outline' },
          { id: 'service', label: 'Tracker', icon: 'construct-outline' },
          { id: 'awards', label: 'Awards', icon: 'trophy-outline' },
        ];

  const selectedId = activeTab || effectiveTabs[0]?.id;
  const activeIndex = effectiveTabs.findIndex((tab) => tab.id === selectedId);
  const tabWidth = containerWidth > 0 ? containerWidth / effectiveTabs.length : 0;

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
          backgroundColor: theme.colors.text,
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
              width: Math.max(tabWidth - 8, 0),
              backgroundColor: theme.colors.primary,
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
                size={20}
                color={isActive ? theme.colors.text : 'rgba(255,255,255,0.7)'}
                style={[
                  styles.tabIcon,
                  isActive ? styles.tabIconActive : styles.tabIconInactive,
                ]}
              />
              {isActive && (
                <Text style={[styles.tabLabel, { color: theme.colors.text }]}>
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
    borderRadius: 40,
    padding: 6,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 12,
  },
  indicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: 28,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  tabIcon: {},
  tabIconActive: {
    marginRight: 4,
  },
  tabIconInactive: {
    marginRight: 0,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BottomNavBar;


