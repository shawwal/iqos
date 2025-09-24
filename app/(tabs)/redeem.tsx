import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
// --- Interfaces & Data ---
interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  image: string;
  category: string;
  available: boolean;
  limited: boolean;
  expiryDate?: string;
  terms: string[];
}

const rewards: Reward[] = [
  // ... (your rewards data remains unchanged)
  { id: '1', name: 'IQOS Cleaning Kit', description: 'Complete cleaning kit for your IQOS device', points: 500, image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Accessories', available: true, limited: false, terms: ['Valid for 30 days', 'One per customer', 'Cannot be combined with other offers'], },
  { id: '2', name: 'IQOS Leather Case', description: 'Premium leather protective case', points: 800, image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Accessories', available: true, limited: true, terms: ['Limited stock', 'Valid for 60 days', 'Premium quality guarantee'], },
  { id: '3', name: '20% Discount Voucher', description: '20% off on next TEREA purchase', points: 300, image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Vouchers', available: true, limited: false, expiryDate: '2025-12-31', terms: ['Valid until December 31, 2025', 'Minimum purchase required', 'Cannot be combined'], },
  { id: '4', name: 'Free TEREA Pack', description: 'One free pack of TEREA sticks', points: 1000, image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Products', available: true, limited: true, terms: ['Limited time offer', 'Valid for 14 days', 'One flavor per redemption'], },
  { id: '5', name: 'IQOS Branded T-Shirt', description: 'Premium cotton t-shirt with IQOS logo', points: 600, image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Merchandise', available: false, limited: false, terms: ['Size selection available', 'High quality cotton', 'Official merchandise'], },
  { id: '6', name: 'Exclusive Event Invitation', description: 'VIP invitation to IQOS exclusive events', points: 1500, image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Experiences', available: true, limited: true, terms: ['Subject to availability', 'Non-transferable', 'Includes refreshments'], },
];

const categories = ['All', 'Accessories', 'Vouchers', 'Products', 'Merchandise', 'Experiences'];

// --- Child Component: RewardCard ---
const RewardCard = React.memo(
  ({ item, userPoints, onRedeem }: { item: Reward; userPoints: number; onRedeem: (reward: Reward) => void }) => {
    const isRedeemable = item.available && userPoints >= item.points;
    
    let buttonText = 'Redeem Now';
    if (!item.available) {
      buttonText = 'Unavailable';
    } else if (userPoints < item.points) {
      buttonText = 'Insufficient Points';
    }

    return (
      <View style={styles.rewardCard}>
        <View style={styles.rewardImageContainer}>
          <Image source={{ uri: item.image }} style={styles.rewardImage} />
          {item.limited && (
            <View style={styles.limitedBadge}>
              <Text style={styles.limitedText}>LIMITED</Text>
            </View>
          )}
          {!item.available && (
            <View style={styles.unavailableOverlay}>
              <Text style={styles.unavailableText}>Unavailable</Text>
            </View>
          )}
        </View>
        
        <View style={styles.rewardContent}>
          <View style={styles.rewardHeader}>
            <Text style={styles.rewardName} numberOfLines={2}>{item.name}</Text>
            <View style={styles.pointsContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rewardPoints}>{item.points}</Text>
            </View>
          </View>
          
          <Text style={styles.rewardDescription} numberOfLines={2}>{item.description}</Text>
          
          {item.expiryDate && (
            <View style={styles.expiryContainer}>
              <Ionicons name="time-outline" size={14} color="#F44336" />
              <Text style={styles.expiryText}>Expires: {item.expiryDate}</Text>
            </View>
          )}
          
          <View style={styles.categoryTagContainer}>
            <Text style={styles.categoryLabel}>{item.category}</Text>
          </View>
          
          <TouchableOpacity
            style={[styles.redeemButton, !isRedeemable && styles.disabledButton]}
            onPress={() => onRedeem(item)}
            disabled={!isRedeemable}
          >
            <Text style={[styles.redeemButtonText, !isRedeemable && styles.disabledButtonText]}>
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

// --- Main Screen Component ---
export default function RedeemScreen() {
  const { user } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredRewards = useMemo(() => {
    return rewards.filter((reward) => {
      return selectedCategory === 'All' || reward.category === selectedCategory;
    });
  }, [selectedCategory]);

  const handleRedeem = useCallback((reward: Reward) => {
    if (user.points < reward.points) {
      Alert.alert('Insufficient Points', `You need ${reward.points - user.points} more points to redeem this reward.`);
      return;
    }
    // The button is already disabled if unavailable, so this check is a fallback.
    if (!reward.available) {
      Alert.alert('Unavailable', 'This reward is currently unavailable.');
      return;
    }
    Alert.alert(
      'Confirm Redemption',
      `Are you sure you want to redeem "${reward.name}" for ${reward.points} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Redeem', onPress: () => { /* Handle actual redeem logic */ Alert.alert('Success!', `You have redeemed "${reward.name}".`); } },
      ]
    );
  }, [user.points]);

  const renderRewardItem = useCallback(({ item }: { item: Reward }) => (
    <RewardCard item={item} userPoints={user.points} onRedeem={handleRedeem} />
  ), [user.points, handleRedeem]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Redeem</Text>
        <TouchableOpacity style={styles.historyButton}>
          <Ionicons name="time-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <LinearGradient colors={['#20B2AA', '#17A2B8']} style={styles.pointsCard}>
        <View>
          <Text style={styles.pointsLabel}>Available Points</Text>
          <Text style={styles.pointsAmount}>{user.points.toLocaleString()}</Text>
        </View>
        <Ionicons name="star" size={32} color="rgba(255, 255, 255, 0.3)" />
      </LinearGradient>
      
      <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[ styles.categoryButton, selectedCategory === category && styles.selectedCategoryButton ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[ styles.categoryText, selectedCategory === category && styles.selectedCategoryText ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
      </View>
      
      <FlatList
        data={filteredRewards}
        renderItem={renderRewardItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.rewardsContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No rewards available in this category.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E5E5' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  historyButton: { padding: 8 },
  pointsCard: { marginHorizontal: 20, marginVertical: 16, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 5 },
  pointsLabel: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, marginBottom: 4 },
  pointsAmount: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' },
  categoriesContainer: { paddingVertical: 4, marginBottom: 12 },
  categoriesContent: { paddingHorizontal: 20 },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    // ✅ FIX: Center the text vertically and horizontally
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategoryButton: { backgroundColor: '#20B2AA', borderColor: '#20B2AA' },
  categoryText: { fontSize: 14, fontWeight: '500', color: '#666' },
  selectedCategoryText: { color: '#FFFFFF' },
  rewardsContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  emptyContainer: { flex: 1, marginTop: 50, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#666' },
  rewardCard: { backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5, overflow: 'hidden' },
  rewardImageContainer: { position: 'relative', height: 120, backgroundColor: '#EEE' },
  rewardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  limitedBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#FF6B6B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  limitedText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  unavailableOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
  unavailableText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  rewardContent: { padding: 16 },
  rewardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  rewardName: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 12 },
  pointsContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8DC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  rewardPoints: { fontSize: 14, fontWeight: 'bold', color: '#B8860B', marginLeft: 4 },
  rewardDescription: { fontSize: 14, color: '#666', marginBottom: 12, lineHeight: 20, height: 40 }, // ✨ Set a fixed height
  expiryContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  expiryText: { fontSize: 12, color: '#F44336', marginLeft: 4, fontWeight: '500' },
  categoryTagContainer: { marginBottom: 16 },
  categoryLabel: { fontSize: 12, color: '#20B2AA', fontWeight: '500', backgroundColor: '#E8F5F5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  redeemButton: { backgroundColor: '#20B2AA', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  disabledButton: { backgroundColor: '#E5E5E5' },
  redeemButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  disabledButtonText: { color: '#999' },
});