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
import { fetchResearchSummaryWidget } from '../../api/proposalsApi.js';

const AwardedProposalsChart = ({
  data = [],
  title = 'Awarded Proposals by Sponsors',
  subtitle = null,
  size = 220,
  strokeWidth = 32,
  maxVisibleSponsors = 4,
  initialVisibleSponsors = 1,
  onShowMore,
  showMoreLabel = 'Show more',
  autoLoadRemoteData = true,
  widgetParams = {
    unitNumber: '000001',
    tabName: 'INPROGRESS_PROPOSALS_BY_SPONSOR',
    descentFlag: 'Y',
  },
}) => {
  const theme = useTheme();
  const animationProgress = useRef(new Animated.Value(0)).current;
  const [renderProgress, setRenderProgress] = useState(0);
  const [remoteData, setRemoteData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const radius = (size - strokeWidth) / 2;
  const [visibleCount, setVisibleCount] = useState(
    Math.max(1, initialVisibleSponsors),
  );
  const fallbackPalette = ['#2754C1', '#EA5A2B', '#F4B33F', '#7AC29A', '#A45CE6', '#34d399'];
  const chartData = useMemo(() => {
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return remoteData;
  }, [data, remoteData]);

  useEffect(() => {
    if (!autoLoadRemoteData) return undefined;
    let isMounted = true;
    const loadWidgetData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchResearchSummaryWidget({
          unitNumber: widgetParams?.unitNumber || '000001',
          tabName: widgetParams?.tabName || 'INPROGRESS_PROPOSALS_BY_SPONSOR',
          descentFlag: widgetParams?.descentFlag || 'Y',
        });
        console.log('response', response);
        if (!isMounted) return;
        const rows = Array.isArray(response?.widgetDatas)
          ? response.widgetDatas.map((row, index) => ({
              id: row?.[0] || `sponsor-${index}`,
              label: row?.[1] || 'Sponsor',
              value: Number(row?.[2]) || 0,
            }))
          : [];
        const coloredRows = rows.map((row, index) => ({
          ...row,
          color: row.color || fallbackPalette[index % fallbackPalette.length],
        }));
        setRemoteData(coloredRows);
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load sponsor data');
          setRemoteData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadWidgetData();
    return () => {
      isMounted = false;
    };
  }, [
    autoLoadRemoteData,
    widgetParams?.unitNumber,
    widgetParams?.tabName,
    widgetParams?.descentFlag,
  ]);
  useEffect(() => {
    setVisibleCount(Math.max(1, initialVisibleSponsors));
  }, [initialVisibleSponsors, chartData]);

  const { normalizedData, total } = useMemo(() => {
    const safeData = Array.isArray(chartData)
      ? chartData.map((entry, index) => ({
          ...entry,
          color: entry.color || fallbackPalette[index % fallbackPalette.length],
        }))
      : [];
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
  }, [chartData]);

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

  if (loading) {
    return (
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: '#000000' }]}>{title}</Text>
        <Text style={[styles.emptyText, { color: '#000000' }]}>
          Loading sponsors...
        </Text>
      </View>
    );
  }

  if (!normalizedData.length) {
    return (
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: '#000000' }]}>
          {title}
        </Text>
        <Text style={[styles.emptyText, { color: '#000000' }]}>
          {error || 'No sponsor data available yet.'}
        </Text>
      </View>
    );
  }

  const listedData = normalizedData.slice(0, visibleCount);
  const hiddenCount = Math.max(normalizedData.length - listedData.length, 0);

  const maxBarValue =
    listedData.reduce((max, seg) => Math.max(max, seg.value || 0), 1) || 1;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: '#000000' }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: '#000000' }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <View style={styles.content}>
        <View style={[styles.chartWrapper, { width: size, height: size }]}>
          <Svg height={size} width={size}>
            {normalizedData.map((segment) => {
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
            <Text style={[styles.total, { color: '#000000' }]}>{total}</Text>
            <Text style={[styles.caption, { color: '#000000' }]}>
              Total awarded
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.barList}>
        {listedData.map((segment) => {
          const widthPercent = `${Math.min(
            ((segment.value || 0) / maxBarValue) * 100,
            100,
          )}%`;

          return (
            <View key={segment.id} style={styles.barRow}>
              <View style={styles.barLabel}>
                <View
                  style={[
                    styles.legendSwatch,
                    { backgroundColor: segment.color || theme.colors.primary },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.legendLabel, { color: '#000000' }]}>
                    {segment.id} · {segment.label}
                  </Text>
                  <Text style={[styles.legendValue, { color: '#000000' }]}>
                    {segment.value} ({Math.round(segment.percentage * 1000) / 10}%)
                  </Text>
                </View>
              </View>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: widthPercent,
                      backgroundColor: segment.color || theme.colors.primary,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
        {hiddenCount > 0 && (
          <TouchableOpacity
            style={[
              styles.showMoreButton,
              { borderColor: '#cccccc', backgroundColor: theme.colors.surface },
            ]}
            onPress={() => {
              setVisibleCount((prev) =>
                Math.min(
                  prev + Math.max(maxVisibleSponsors, 1),
                  normalizedData.length,
                ),
              );
              if (typeof onShowMore === 'function') {
                onShowMore();
              }
            }}
            activeOpacity={0.85}
          >
            <Text style={[styles.showMoreText, { color: '#000000' }]}>
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
    padding: 15,
    // elevation: 2,
    // shadowColor: '#000000',
    // shadowOpacity: 0.08,
    // shadowRadius: 12,
    // shadowOffset: { width: 0, height: 4 },
    marginHorizontal: 16,
    // marginTop: 16,
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
  barList: {
    marginTop: 24,
    gap: 16,
  },
  barRow: {
    gap: 10,
  },
  barLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  legendValue: {
    fontSize: 12,
    marginTop: 2,
  },
  barWrapper: {
    height: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
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


