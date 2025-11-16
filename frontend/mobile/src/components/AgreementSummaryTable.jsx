import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';

const AgreementSummaryTable = ({
  title = 'Research Summary',
  subtitle = 'Breakdown by agreement attributes',
  headers = [],
  rows = [],
  loading,
  error,
  onRetry,
  containerStyle,
  maxHeight = 360,
  primaryFieldIndex = 0,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const safeHeaders = Array.isArray(headers) ? headers : [];
  const safeRows = Array.isArray(rows) ? rows : [];

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.stateWrapper}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.stateText}>Loading research summary…</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateWrapper}>
          <Icon name="warning-outline" size={20} color={theme.colors.error} />
          <Text style={[styles.stateText, { color: theme.colors.error }]}>{error}</Text>
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (!safeRows.length) {
      return (
        <View style={styles.stateWrapper}>
          <Icon name="information-circle-outline" size={22} color={theme.colors.textSecondary} />
          <Text style={styles.stateText}>No research summary data available</Text>
        </View>
      );
    }

		// Card-style listing with a clear title and friendly key-value rows.
		return (
			<ScrollView style={{ maxHeight }} showsVerticalScrollIndicator={false}>
				<View style={styles.cardList}>
					{safeRows.map((row) => {
						const cells = Array.isArray(row.cells) ? row.cells : [];
						const titleValue =
							row.title ||
							cells?.[primaryFieldIndex] ||
							`#${row.id}`;
						return (
							<View key={row.id} style={styles.itemCard}>
								<Text style={styles.itemTitle}>{String(titleValue || '—')}</Text>
								<View style={styles.itemBody}>
									{cells.map((value, index) => {
										if (index === primaryFieldIndex) return null;
										const label = safeHeaders[index] ?? `Field ${index + 1}`;
										return (
											<View key={`${row.id}-${index}`} style={styles.itemRow}>
												<Text style={styles.itemLabel}>{label}</Text>
												<Text style={styles.itemValue}>
													{value === null || value === undefined || value === '' ? '—' : String(value)}
												</Text>
											</View>
										);
									})}
								</View>
							</View>
						);
					})}
				</View>
			</ScrollView>
		);
  };

  return (
    <View style={[styles.card, containerStyle]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {onRetry && !loading && (
          <TouchableOpacity onPress={onRetry} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon name="refresh" size={18} color={theme.colors.secondary} />
          </TouchableOpacity>
        )}
      </View>
      {renderContent()}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    card: {
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.lg,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    stateWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    stateText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    retryButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    retryText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.primary,
    },
			cardList: {
				gap: theme.spacing.sm,
			},
			itemCard: {
				borderWidth: 1,
				borderColor: theme.colors.border,
				borderRadius: theme.borderRadius.lg,
				padding: theme.spacing.md,
				backgroundColor: theme.colors.background,
			},
			itemTitle: {
				fontSize: 16,
				fontWeight: '700',
				color: theme.colors.text,
				marginBottom: 8,
			},
			itemBody: {
				gap: 8,
			},
			itemRow: {
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'flex-start',
				paddingVertical: 6,
				borderBottomWidth: 1,
				borderBottomColor: theme.colors.border,
			},
			itemLabel: {
				flex: 1,
				fontSize: 12,
				fontWeight: '700',
				textTransform: 'uppercase',
				letterSpacing: 0.4,
				color: theme.colors.textSecondary,
				paddingRight: theme.spacing.md,
			},
			itemValue: {
				flex: 1.2,
				fontSize: 14,
				fontWeight: '600',
				color: theme.colors.text,
			},
  });

export default AgreementSummaryTable;


