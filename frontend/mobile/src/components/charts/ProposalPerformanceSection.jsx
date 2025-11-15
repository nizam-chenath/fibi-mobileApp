// components/charts/ProposalPerformanceSection.jsx
import React, { useMemo, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import useTheme from '../../hooks/useTheme.jsx';

const BAR_CHART_HEIGHT = 140;
const DONUT_SIZE = 180;
const OUTER_RADIUS = DONUT_SIZE / 2 - 12;
const INNER_RADIUS = OUTER_RADIUS - 26;

const ProposalPerformanceSection = ({
  incomeLabel = 'Income',
  incomeTotal = 0,
  incomeSeries = [],
  donutLabel = 'Unpaid Invoices',
  donutTotal = 0,
  donutSegments = [],
}) => {
  const theme = useTheme();
  const animationProgress = useRef(new Animated.Value(0)).current;
  const [renderProgress, setRenderProgress] = useState(0);

  const maxIncomeValue = useMemo(() => {
    const values = incomeSeries.map((entry) => entry?.value || 0);
    return values.length ? Math.max(...values, 1) : 1;
  }, [incomeSeries]);

  const { normalizedSegments } = useMemo(() => {
    const totalValue =
      donutSegments.reduce((sum, seg) => sum + (seg?.value || 0), 0) || 1;

    let cursor = -90;
    const normalized = donutSegments.map((segment) => {
      const percentage = (segment?.value || 0) / totalValue;
      const sweep = percentage * 360;
      const startAngle = cursor;
      const endAngle = cursor + sweep;
      cursor = endAngle;

      return {
        ...segment,
        startAngle,
        endAngle,
        percentage,
      };
    });

    return {
      normalizedSegments: normalized,
    };
  }, [donutSegments]);

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
  }, [animationProgress, normalizedSegments]);

  const formattedIncome = formatCurrency(incomeTotal);
  const formattedDonut = formatCurrency(donutTotal);

  return (
    <View style={styles.section}>
      <View style={[styles.card, styles.darkCard]}>
        <Text style={[styles.cardLabel, styles.accentText]}>{incomeLabel.toUpperCase()}</Text>
        <Text style={[styles.cardValue, { color: theme.colors.secondary }]}>
          {formattedIncome}
        </Text>

        <View style={styles.barChart}>
          {incomeSeries.map((entry) => {
            const barHeight =
              ((entry?.value || 0) / maxIncomeValue) * BAR_CHART_HEIGHT;
            return (
              <View key={entry.id} style={styles.barWrapper}>
                <View style={[styles.bar, { backgroundColor: entry.color || theme.colors.primary, height: Math.max(barHeight, 8) }]} />
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.card, styles.darkCard]}>
        <Text style={[styles.cardLabel, styles.accentText]}>
          {donutLabel.toUpperCase()}
        </Text>
        <View style={styles.donutWrapper}>
          {normalizedSegments.length > 0 ? (
            <>
              <Svg width={DONUT_SIZE} height={DONUT_SIZE}>
                {normalizedSegments.map((segment) => {
                  const animatedEnd =
                    segment.startAngle +
                    (segment.endAngle - segment.startAngle) * renderProgress;
                  return (
                    <Path
                      key={segment.id}
                      d={describeDonutArc(
                        DONUT_SIZE / 2,
                        DONUT_SIZE / 2,
                        OUTER_RADIUS,
                        INNER_RADIUS,
                        segment.startAngle,
                        animatedEnd,
                      )}
                      fill={segment.color || theme.colors.primary}
                    />
                  );
                })}
              </Svg>
              <View style={styles.donutCenter}>
                <Text style={[styles.centerLabel, styles.accentText]}>
                  {donutLabel.toUpperCase()}
                </Text>
                <Text style={[styles.centerValue, { color: theme.colors.secondary }]}>
                  {formattedDonut}
                </Text>
              </View>
            </>
          ) : (
            <Text style={[styles.emptyState, { color: theme.colors.secondary }]}>
              No data available
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeDonutArc = (x, y, outerRadius, innerRadius, startAngle, endAngle) => {
  const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, startAngle);
  const endInner = polarToCartesian(x, y, innerRadius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M',
    startOuter.x,
    startOuter.y,
    'A',
    outerRadius,
    outerRadius,
    0,
    largeArcFlag,
    0,
    endOuter.x,
    endOuter.y,
    'L',
    startInner.x,
    startInner.y,
    'A',
    innerRadius,
    innerRadius,
    0,
    largeArcFlag,
    1,
    endInner.x,
    endInner.y,
    'Z',
  ].join(' ');
};

const formatCurrency = (value) => {
  if (typeof value === 'string') return value;
  if (!value && value !== 0) return '$0.00';

  try {
    return `$${Number(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  } catch (error) {
    return `$${value}`;
  }
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 16,
  },
  card: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  darkCard: {
    backgroundColor: '#081122',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 14,
  },
  accentText: {
    color: '#60A5FA',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: BAR_CHART_HEIGHT,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: 14,
    borderRadius: 7,
  },
  donutWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  donutCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 6,
  },
  centerValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptyState: {
    fontSize: 14,
    opacity: 0.8,
  },
});

export default ProposalPerformanceSection;


