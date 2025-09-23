import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PointsCard() {
  const { user, theme } = useAppStore();
  const colors = Colors[theme || 'light'];

  const handleShop = () => {
    router.push('/(tabs)/shop');
  };

  const handleRedeem = () => {
    router.push('/(tabs)/redeem');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>Point Balance</Text>
      
      <Text style={[styles.points, { color: colors.primary }]}>
        {user.points.toLocaleString()}
      </Text>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.shopButton, { backgroundColor: colors.secondary }]}
          onPress={handleShop}
        >
          <Ionicons name="bag-outline" size={20} color={colors.text} />
          <Text style={[styles.buttonText, { color: colors.text }]}>Shop</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.redeemButton, { backgroundColor: colors.primary }]}
          onPress={handleRedeem}
        >
          <Ionicons name="gift-outline" size={20} color="#FFFFFF" />
          <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Redeem</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  points: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  shopButton: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  redeemButton: {},
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});