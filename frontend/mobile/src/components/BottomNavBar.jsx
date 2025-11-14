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
          { id: 'home', label: 'Home', icon: 'home-outline' },
          { id: 'library', label: 'Library', icon: 'book-outline' },
          { id: 'media', label: 'media', icon: 'image-outline' },
          { id: 'calendar', label: 'Calendar', icon: 'calendar-outline' },
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
              width: tabWidth - 8,
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
            <Icon
              name={tab.icon}
              size={20}
              color={isActive ? theme.colors.text : 'rgba(255,255,255,0.7)'}
              style={styles.tabIcon}
            />
            {isActive && (
              <Text style={[styles.tabLabel, { color: theme.colors.text }]}>
                {tab.label}
              </Text>
            )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 28,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BottomNavBar;


