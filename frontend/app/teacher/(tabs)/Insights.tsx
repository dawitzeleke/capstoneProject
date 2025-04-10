import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EngagementInsightsScreen = () => {
  const { width } = useWindowDimensions();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#4F46E5" />
        <Text style={styles.title}>Engagement Insights</Text>
        <Ionicons name="information-circle-outline" size={24} color="#4F46E5" />
      </View>

      {/* Main Stats Section */}
      <View style={styles.mainStatsContainer}>
        <View style={styles.totalQuestionsCard}>
          <Text style={styles.totalQuestionsLabel}>TOTAL POSTED QUESTIONS</Text>
          <Text style={styles.totalQuestionsValue}>120</Text>
        </View>

        <View style={styles.attemptsCard}>
          <Text style={styles.sectionTitle}>Correct Vs Incorrect Attempts</Text>
          
          <View style={styles.attemptsGrid}>
            {/* Correct Column */}
            <View style={styles.attemptColumn}>
              <View style={styles.attemptBadge}>
                <Text style={styles.attemptValue}>54</Text>
                <Text style={styles.attemptPercentage}>67%</Text>
              </View>
              <Text style={styles.attemptLabel}>Correctly answered</Text>
            </View>

            {/* Divider */}
            <View style={styles.verticalDivider} />

            {/* Incorrect Column */}
            <View style={styles.attemptColumn}>
              <View style={[styles.attemptBadge, styles.incorrectBadge]}>
                <Text style={styles.attemptValue}>54</Text>
                <Text style={styles.attemptPercentage}>33%</Text>
              </View>
              <Text style={styles.attemptLabel}>Incorrect attempts</Text>
            </View>
          </View>

          {/* Bottom Stats */}
          <View style={styles.bottomStatsContainer}>
            <View style={styles.bottomStatItem}>
              <Text style={styles.bottomStatLabel}>TOTAL STUDENTS</Text>
              <Text style={styles.bottomStatValue}>54</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.bottomStatItem}>
              <Text style={styles.bottomStatLabel}>RATE</Text>
              <Text style={styles.bottomStatValue}>67%</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  mainStatsContainer: {
    padding: 24,
  },
  totalQuestionsCard: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  totalQuestionsLabel: {
    color: '#E0E7FF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  totalQuestionsValue: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
  },
  attemptsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 24,
    textAlign: 'center',
  },
  attemptsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  attemptColumn: {
    alignItems: 'center',
    flex: 1,
  },
  attemptBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  incorrectBadge: {
    backgroundColor: '#FEE2E2',
  },
  attemptValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4F46E5',
  },
  attemptPercentage: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  attemptLabel: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  bottomStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  bottomStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  bottomStatLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  bottomStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
});

export default EngagementInsightsScreen;