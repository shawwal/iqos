import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';

const { width } = Dimensions.get('window');

interface Transaction {
  id: string;
  type: 'earned' | 'spent';
  points: number;
  description: string;
  date: string;
  category: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  progress: number;
  maxProgress: number;
  icon: string;
}

const transactions: Transaction[] = [
  {
    id: '1',
    type: 'earned',
    points: 150,
    description: 'Purchase TEREA Sticks - Amber',
    date: '2024-01-15',
    category: 'Purchase',
  },
  {
    id: '2',
    type: 'earned',
    points: 300,
    description: 'Double Points Promo',
    date: '2024-01-14',
    category: 'Promo',
  },
  {
    id: '3',
    type: 'spent',
    points: 500,
    description: 'Redeemed IQOS Cleaning Kit',
    date: '2024-01-12',
    category: 'Redemption',
  },
  {
    id: '4',
    type: 'earned',
    points: 200,
    description: 'Weekly Challenge Completed',
    date: '2024-01-10',
    category: 'Challenge',
  },
  {
    id: '5',
    type: 'earned',
    points: 100,
    description: 'App Login Bonus',
    date: '2024-01-08',
    category: 'Bonus',
  },
];

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Purchase',
    description: 'Make your first purchase',
    points: 100,
    completed: true,
    progress: 1,
    maxProgress: 1,
    icon: 'bag-check',
  },
  {
    id: '2',
    title: 'Point Collector',
    description: 'Earn 1,000 points',
    points: 200,
    completed: true,
    progress: 2450,
    maxProgress: 1000,
    icon: 'star',
  },
  {
    id: '3',
    title: 'Loyal Customer',
    description: 'Make 10 purchases',
    points: 500,
    completed: false,
    progress: 7,
    maxProgress: 10,
    icon: 'heart',
  },
  {
    id: '4',
    title: 'Social Sharer',
    description: 'Share 5 products',
    points: 150,
    completed: false,
    progress: 2,
    maxProgress: 5,
    icon: 'share-social',
  },
];

export default function PointsScreen() {
  const { language, user } = useAppStore();
  const [activeTab, setActiveTab] = useState<'history' | 'achievements'>('history');

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionLeft}>
        <View
          style={[
            styles.transactionIcon,
            { backgroundColor: item.type === 'earned' ? '#E8F5E8' : '#FFF0F0' },
          ]}
        >
          <Ionicons
            name={item.type === 'earned' ? 'add-circle' : 'remove-circle'}
            size={20}
            color={item.type === 'earned' ? '#4CAF50' : '#F44336'}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={styles.transactionDate}>{item.date}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
      </View>
      <Text
        style={[
          styles.transactionPoints,
          { color: item.type === 'earned' ? '#4CAF50' : '#F44336' },
        ]}
      >
        {item.type === 'earned' ? '+' : '-'}{item.points}
      </Text>
    </View>
  );

  const renderAchievement = ({ item }: { item: Achievement }) => (
    <View style={[styles.achievementCard, item.completed && styles.completedAchievement]}>
      <View style={styles.achievementHeader}>
        <View
          style={[
            styles.achievementIcon,
            { backgroundColor: item.completed ? '#20B2AA' : '#E5E5E5' },
          ]}
        >
          <Ionicons
            name={item.icon as any}
            size={24}
            color={item.completed ? '#FFFFFF' : '#999'}
          />
        </View>
        <View style={styles.achievementInfo}>
          <Text style={styles.achievementTitle}>{item.title}</Text>
          <Text style={styles.achievementDescription}>{item.description}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min((item.progress / item.maxProgress) * 100, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {item.progress}/{item.maxProgress}
            </Text>
          </View>
        </View>
        <View style={styles.achievementPoints}>
          <Text style={styles.pointsValue}>+{item.points}</Text>
          <Ionicons name="star" size={16} color="#FFD700" />
        </View>
      </View>
      {item.completed && (
        <View style={styles.completedBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.completedText}>Completed</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Points</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Points Balance Card */}
      <LinearGradient
        colors={['#20B2AA', '#17A2B8']}
        style={styles.balanceCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.balanceContent}>
          <Text style={styles.balanceLabel}>Total Points</Text>
          <Text style={styles.balanceAmount}>{user.points.toLocaleString()}</Text>
          <Text style={styles.balanceSubtext}>Keep earning to unlock more rewards!</Text>
        </View>
        <View style={styles.balanceIcon}>
          <Ionicons name="star" size={40} color="rgba(255, 255, 255, 0.3)" />
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>1,250</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>7</Text>
          <Text style={styles.statLabel}>Transactions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Achievements</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'achievements' && styles.activeTab]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'history' ? (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={achievements}
          renderItem={renderAchievement}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  infoButton: {
    padding: 8,
  },
  balanceCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceContent: {
    flex: 1,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  balanceIcon: {
    marginLeft: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#20B2AA',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  transactionPoints: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completedAchievement: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#20B2AA',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  achievementPoints: {
    alignItems: 'center',
    marginLeft: 12,
  },
  pointsValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginBottom: 2,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  completedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
    marginLeft: 4,
  },
});