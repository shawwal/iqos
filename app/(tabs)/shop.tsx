import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// --- Interfaces & Data (moved outside component for clarity) ---
interface Product {
  id: string;
  name: string;
  price: number;
  points: number;
  image: string;
  category: string;
  description: string;
  inStock: boolean;
}

const products: Product[] = [
  // ... (your product data remains unchanged)
  { id: '1', name: 'IQOS ILUMA Prime', price: 2500000, points: 0, image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Device', description: 'Premium IQOS device with advanced heating technology', inStock: true },
  { id: '2', name: 'IQOS ILUMA One', price: 1500000, points: 0, image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Device', description: 'Compact and portable IQOS device', inStock: true },
  { id: '3', name: 'TEREA Sticks - Amber', price: 45000, points: 150, image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Sticks', description: 'Rich and aromatic tobacco blend', inStock: true },
  { id: '4', name: 'TEREA Sticks - Blue', price: 45000, points: 150, image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Sticks', description: 'Cool and refreshing menthol blend', inStock: true },
  { id: '5', name: 'IQOS Cleaning Kit', price: 150000, points: 300, image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Accessories', description: 'Complete cleaning kit for your IQOS device', inStock: true },
  { id: '6', name: 'IQOS Leather Case', price: 250000, points: 500, image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Accessories', description: 'Premium leather protective case', inStock: false },
];

const categories = ['All', 'Device', 'Sticks', 'Accessories'];

// --- Helper Function (moved outside component to prevent re-creation) ---
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

// --- Child Component: ProductCard (for performance and organization) ---
const ProductCard = React.memo(({ item }: { item: Product }) => (
  <TouchableOpacity style={styles.productCard}>
    <View style={styles.productImageContainer}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      {!item.inStock && (
        <View style={styles.outOfStockOverlay}>
          <Text style={styles.outOfStockText}>Out of Stock</Text>
        </View>
      )}
    </View>
    <View style={styles.productInfo}>
      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
        {item.points > 0 && (
          <View style={styles.pointsBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.pointsText}>+{item.points}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={[styles.addToCartButton, !item.inStock && styles.disabledButton]}
        disabled={!item.inStock}
      >
        <Text style={[styles.addToCartText, !item.inStock && styles.disabledText]}>
          {item.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
));

// --- Main Screen Component ---
export default function ShopScreen() {
  // const { language, user } = useAppStore(); // Assuming this is your state management
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Use useMemo to prevent re-calculating the product list on every render
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]); // Only re-filter when category or search query changes

  // Use useCallback to prevent re-creating the render function for FlatList
  const renderProductItem = useCallback(({ item }: { item: Product }) => (
    <ProductCard item={item} />
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shop</Text>
        <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="bag-outline" size={24} color="#333" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
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
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productsContainer}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.productRow}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found.</Text>
          </View>
        }
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
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#20B2AA',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    // A container View ensures the ScrollView has a defined space
    paddingVertical: 4, 
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    // ✅ FIX: Center the text vertically and horizontally inside the button
    justifyContent: 'center',
    alignItems: 'center',
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
  productsContainer: {
    paddingHorizontal: 12, // Adjusted for card margin
    paddingBottom: 100,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    // The calculation: (screen width - total horizontal padding - gap between items) / 2 columns
    width: (width - 24 - 16) / 2, // 24 is padding (12*2), 16 is the gap
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImageContainer: {
    position: 'relative',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EEE' // Placeholder color while image loads
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
    height: 32, // Ensures consistent height (2 lines * 16 lineHeight)
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#20B2AA',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pointsText: {
    fontSize: 10,
    color: '#B8860B',
    marginLeft: 2,
    fontWeight: '500',
  },
  addToCartButton: {
    backgroundColor: '#20B2AA',
    paddingVertical: 10, // Increased padding for better tap area
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#E5E5E5',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});