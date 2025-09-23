import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import PointsCard from '@/components/PointsCard';
import ProductsSection from '@/components/ProductsSection';
import PromosSection from '@/components/PromosSection';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/useAppStore';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { theme } = useAppStore();
  const colors = Colors[theme || 'light'];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Header />
          <HeroSection />
          <PointsCard />
          <PromosSection />
          <ProductsSection />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});