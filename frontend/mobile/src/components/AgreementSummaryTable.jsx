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
	numColumns = 2,
	maxFieldsPerCard = 3,
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
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<ScrollView
					style={{ maxHeight }}
					nestedScrollEnabled
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.table}>
						{safeHeaders.length > 0 && (
							<View style={[styles.tableRow, styles.tableHeader]}>
								{safeHeaders.map((header, index) => (
									<Text
										key={`${header}-${index}`}
										style={[styles.cell, styles.headerCell, index === 0 && styles.primaryCell]}
									>
										{header}
									</Text>
								))}
							</View>
						)}
						{safeRows.map((row) => (
							<View key={row.id} style={styles.tableRow}>
								{(row.cells || []).map((value, index) => (
									<Text
										key={`${row.id}-${index}`}
										style={[styles.cell, index === 0 && styles.primaryCell]}
									>
										{value === null || value === undefined || value === '' ? '—' : String(value)}
									</Text>
								))}
							</View>
						))}
					</View>
				</ScrollView>
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
			table: {
				minWidth: '100%',
			},
			itemCard: {
				borderWidth: 1,
				borderColor: theme.colors.border,
				borderRadius: theme.borderRadius.lg,
				padding: theme.spacing.md,
				backgroundColor: theme.colors.background,
			},
			tableRow: {
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
                paddingVertical: theme.spacing.sm,
            },
            tableHeader: {
                borderBottomWidth: 2,
                borderBottomColor: theme.colors.primary + '55',
            },
            cell: {
                minWidth: 120,
                paddingRight: theme.spacing.lg,
                fontSize: 14,
                color: theme.colors.text,
                fontWeight: '500',
            },
            headerCell: {
                fontWeight: '700',
                color: theme.colors.primary,
            },
            primaryCell: {
                minWidth: 180,
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


