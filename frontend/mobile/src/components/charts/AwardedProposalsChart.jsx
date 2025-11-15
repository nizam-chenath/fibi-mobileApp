// components/charts/AwardedProposalsChart.jsx
import React, { useMemo, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import useTheme from '../../hooks/useTheme.jsx';

const AwardedProposalsChart = ({
  data = [],
  title = 'Awarded Proposals by Sponsors',
  subtitle = null,
  size = 220,
  strokeWidth = 32,
  maxVisibleSponsors = 4,
  onShowMore,
  showMoreLabel = 'Show more',
}) => {
  const theme = useTheme();
  const animationProgress = useRef(new Animated.Value(0)).current;
  const [renderProgress, setRenderProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const { normalizedData, total } = useMemo(() => {
    const safeData = Array.isArray(data) ? data : [];
    const running = [];
    let cumulativeAngle = 0;
    const totalValue = safeData.reduce((sum, entry) => sum + (entry.value || 0), 0) || 1;

    safeData.forEach((entry) => {
      const percentage = (entry.value || 0) / totalValue;
      const segmentAngle = percentage * 360;
      running.push({
        ...entry,
        percentage,
        startAngle: cumulativeAngle,
        endAngle: cumulativeAngle + segmentAngle,
      });
      cumulativeAngle += segmentAngle;
    });

    return {
      normalizedData: running,
      total: totalValue,
    };
  }, [data]);

  useEffect(() => {
    animationProgress.setValue(0);
    const listenerId = animationProgress.addListener(({ value }) => {
      setRenderProgress(value);
    });

    Animated.timing(animationProgress, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => {
      animationProgress.removeListener(listenerId);
    };
  }, [animationProgress, normalizedData]);

  if (!normalizedData.length) {
    return (
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          No sponsor data available yet.
        </Text>
      </View>
    );
  }

  const displayedData = normalizedData.slice(0, maxVisibleSponsors);
  const hiddenCount = normalizedData.length - displayedData.length;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <View style={styles.content}>
        <View style={[styles.chartWrapper, { width: size, height: size }]}>
          <Svg height={size} width={size}>
            {displayedData.map((segment) => {
              const animatedEnd =
                segment.startAngle +
                (segment.endAngle - segment.startAngle) * renderProgress;
              return (
                <Path
                  key={segment.id}
                  d={describeArc(
                    size / 2,
                    size / 2,
                    radius,
                    segment.startAngle,
                    animatedEnd,
                  )}
                  stroke={segment.color || theme.colors.primary}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius - strokeWidth / 2}
              fill={theme.colors.surface}
            />
          </Svg>
          <View style={styles.centerLabel}>
            <Text style={[styles.total, { color: theme.colors.text }]}>{total}</Text>
            <Text style={[styles.caption, { color: theme.colors.textSecondary }]}>
              Total awarded
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.legend}>
        {displayedData.map((segment) => (
          <View key={segment.id} style={styles.legendItem}>
            <View
              style={[
                styles.legendSwatch,
                { backgroundColor: segment.color || theme.colors.primary },
              ]}
            />
            <View style={styles.legendTextContainer}>
              <Text style={[styles.legendLabel, { color: theme.colors.text }]}>
                {segment.id} · {segment.label}
              </Text>
              <Text
                style={[styles.legendValue, { color: theme.colors.textSecondary }]}
              >
                {segment.value} ({Math.round(segment.percentage * 1000) / 10}%)
              </Text>
            </View>
          </View>
        ))}
        {hiddenCount > 0 && (
          <TouchableOpacity
            style={[
              styles.showMoreButton,
              { borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
            ]}
            onPress={onShowMore || (() => {})}
            activeOpacity={0.85}
          >
            <Text style={[styles.showMoreText, { color: theme.colors.primary }]}>
              {showMoreLabel} ({hiddenCount} more)
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    // elevation: 2,
    // shadowColor: '#000000',
    // shadowOpacity: 0.08,
    // shadowRadius: 12,
    // shadowOffset: { width: 0, height: 4 },
    marginHorizontal: 16,
    marginTop: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  total: {
    fontSize: 24,
    fontWeight: '700',
  },
  caption: {
    fontSize: 12,
    marginTop: 4,
  },
  legend: {
    marginTop: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginRight: 10,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  legendValue: {
    fontSize: 12,
    marginTop: 2,
  },
  legendOverflow: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  showMoreButton: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
  },
});

export default AwardedProposalsChart;

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
};


