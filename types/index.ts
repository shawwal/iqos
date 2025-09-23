export interface User {
  name: string;
  points: number;
  avatar?: string;
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'double_point' | 'discount' | 'special';
}

export interface Product {
  id: string;
  name: string;
  image: string;
  color: string;
  price?: number;
}

export type Language = 'en' | 'id';

export interface AppState {
  language: Language;
  user: User;
  theme: 'dark' | 'light';
  promos: Promo[];
  products: Product[];
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
  updatePoints: (points: number) => void;
}