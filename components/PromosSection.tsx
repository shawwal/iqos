import { Colors, Gradients } from '@/constants/Colors';
import { useAppStore } from '@/store/useAppStore';
import { Promo } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PromosSection() {
  const { promos, theme } = useAppStore();
  const colors = Colors[theme || 'light'];

  const renderPromo = ({ item }: { item: Promo }) => (
    <TouchableOpacity style={styles.promoCard}>
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.promoBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={Gradients.promo}
          style={styles.promoOverlay}
        >
          <Text style={styles.promoTitle}>{item.title}</Text>
          <Text style={styles.promoDescription}>{item.description}</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Latest Promos</Text>
        <TouchableOpacity>
          <Text style={[styles.seeMore, { color: colors.primary }]}>See more</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={promos}
        renderItem={renderPromo}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.promosList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeMore: {
    fontSize: 14,
    fontWeight: '500',
  },
  promosList: {
    paddingHorizontal: 20,
  },
  promoCard: {
    width: 280,
    height: 140,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  promoBackground: {
    flex: 1,
  },
  promoOverlay: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  promoDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 16,
  },
});