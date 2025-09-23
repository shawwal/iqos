import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';

const { width } = Dimensions.get('window');

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
  {
    id: '1',
    name: 'IQOS Cleaning Kit',
    description: 'Complete cleaning kit for your IQOS device',
    points: 500,
    image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Accessories',
    available: true,
    limited: false,
    terms: ['Valid for 30 days', 'One per customer', 'Cannot be combined with other offers'],
  },
  {
    id: '2',
    name: 'IQOS Leather Case',
    description: 'Premium leather protective case',
    points: 800,
    image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Accessories',
    available: true,
    limited: true,
    terms: ['Limited stock', 'Valid for 60 days', 'Premium quality guarantee'],
  },
  {
    id: '3',
    name: '20% Discount Voucher',
    description: '20% off on next TEREA purchase',
    points: 300,
    image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Vouchers',
    available: true,
    limited: false,
    expiryDate: '2024-03-31',
    terms: ['Valid until March 31, 2024', 'Minimum purchase required', 'Cannot be combined'],
  },
  {
    id: '4',
    name: 'Free TEREA Pack',
    description: 'One free pack of TEREA sticks',
    points: 1000,
    image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Products',
    available: true,
    limited: true,
    terms: ['Limited time offer', 'Valid for 14 days', 'One flavor per redemption'],
  },
  {
    id: '5',
    name: 'IQOS Branded T-Shirt',
    description: 'Premium cotton t-shirt with IQOS logo',
    points: 600,
    image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Merchandise',
    available: false,
    limited: false,
    terms: ['Size selection available', 'High quality cotton', 'Official merchandise'],
  },
  {
    id: '6',
    name: 'Exclusive Event Invitation',
    description: 'VIP invitation to IQOS exclusive events',
    points: 1500,
    image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Experiences',
    available: true,
    limited: true,
    terms: ['Subject to availability', 'Non-transferable', 'Includes refreshments'],
  },
];

const categories = ['All', 'Accessories', 'Vouchers', 'Products', 'Merchandise', 'Experiences'];

export default function RedeemScreen() {
  const { language, user } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredRewards = rewards.filter((reward) => {
    return selectedCategory === 'All' || reward.category === selectedCategory;
  });

  const handleRedeem = (reward: Reward) => {
    if (user.points < reward.points) {
      Alert.alert(
        'Insufficient Points',
        `You need ${reward.points - user.points} more points to redeem this reward.`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (!reward.available) {
      Alert.alert(
        'Unavailable',
        'This reward is currently unavailable.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Confirm Redemption',
      `Are you sure you want to redeem "${reward.name}" for ${reward.points} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: () => {
            Alert.alert(
              'Success!',
              `You have successfully redeemed "${reward.name}". Check your email for further instructions.`,
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const renderReward = ({ item }: { item: Reward }) => (
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
          <Text style={styles.rewardName}>{item.name}</Text>
          <View style={styles.pointsContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rewardPoints}>{item.points}</Text>
          </View>
        </View>
        
        <Text style={styles.rewardDescription}>{item.description}</Text>
        
        {item.expiryDate && (
          <View style={styles.expiryContainer}>
            <Ionicons name="time-outline" size={14} color="#F44336" />
            <Text style={styles.expiryText}>Expires: {item.expiryDate}</Text>
          </View>
        )}
        
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryLabel}>{item.category}</Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.redeemButton,
            (!item.available || user.points < item.points) && styles.disabledButton,
          ]}
          onPress={() => handleRedeem(item)}
          disabled={!item.available || user.points < item.points}
        >
          <Text
            style={[
              styles.redeemButtonText,
              (!item.available || user.points < item.points) && styles.disabledButtonText,
            ]}
          >
            {!item.available
              ? 'Unavailable'
              : user.points < item.points
              ? 'Insufficient Points'
              : 'Redeem Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Redeem</Text>
        <TouchableOpacity style={styles.historyButton}>
          <Ionicons name="time-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Points Balance */}
      <LinearGradient
        colors={['#20B2AA', '#17A2B8']}
        style={styles.pointsCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.pointsContent}>
          <Text style={styles.pointsLabel}>Available Points</Text>
          <Text style={styles.pointsAmount}>{user.points.toLocaleString()}</Text>
        </View>
        <Ionicons name="star" size={32} color="rgba(255, 255, 255, 0.3)" />
      </LinearGradient>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Rewards List */}
      <FlatList
        data={filteredRewards}
        renderItem={renderReward}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.rewardsContainer}
        showsVerticalScrollIndicator={false}
      />
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
  historyButton: {
    padding: 8,
  },
  pointsCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsContent: {
    flex: 1,
  },
  pointsLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  pointsAmount: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedCategoryButton: {
    backgroundColor: '#20B2AA',
    borderColor: '#20B2AA',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  rewardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  rewardImageContainer: {
    position: 'relative',
    height: 120,
  },
  rewardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  limitedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  limitedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rewardContent: {
    padding: 16,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rewardPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#B8860B',
    marginLeft: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  expiryText: {
    fontSize: 12,
    color: '#F44336',
    marginLeft: 4,
    fontWeight: '500',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#20B2AA',
    fontWeight: '500',
    backgroundColor: '#E8F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  redeemButton: {
    backgroundColor: '#20B2AA',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#E5E5E5',
  },
  redeemButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#999',
  },
});