import { AppState, Product, Promo } from '@/types';
import { create } from 'zustand';

const mockPromos: Promo[] = [
  {
    id: '1',
    title: 'Double Point Promos',
    description: 'Saatnya untuk mulai mengumpulkan poin. Bersama IQOS',
    image: 'https://images.pexels.com/photos/5632381/pexels-photo-5632381.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'double_point'
  },
  {
    id: '2', 
    title: 'Double Point Promos',
    description: 'Saatnya untuk mulai mengumpulkan poin. Bersama IQOS',
    image: 'https://images.pexels.com/photos/5632381/pexels-photo-5632381.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'double_point'
  }
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'IQOS ILUMAi',
    image: 'https://images.pexels.com/photos/7078619/pexels-photo-7078619.jpeg?auto=compress&cs=tinysrgb&w=200',
    color: 'Midnight Black'
  },
  {
    id: '2',
    name: 'IQOS ILUMAi',
    image: 'https://images.pexels.com/photos/7078619/pexels-photo-7078619.jpeg?auto=compress&cs=tinysrgb&w=200',
    color: 'Pearl White'
  }
];

export const useAppStore = create<AppState>((set) => ({
  language: 'en',
  user: { 
    name: 'MOCHAMMAD HUSNI THA', 
    points: 2450 
  },
  theme: 'light',
  promos: mockPromos,
  products: mockProducts,
  setLanguage: (lang) => set({ language: lang }),
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  updatePoints: (points) => set((state) => ({
    user: { ...state.user, points }
  }))
}));