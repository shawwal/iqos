import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Header() {
  const { user, theme } = useAppStore();
  const colors = Colors[theme || 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.greeting}>
        <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
          Welcome,
        </Text>
        <Text style={[styles.nameText, { color: colors.text }]} numberOfLines={1}>
          {user.name}
        </Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.primary }]}>
          <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.secondary }]}>
          <Ionicons name="person-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    flex: 1,
    marginRight: 16,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: '400',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});