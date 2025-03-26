import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Mock Artwork Data
export const ARTWORK_MOCK_DATA = [
  {
    id: 'artwork-01',
    title: 'Serene Reflections',
    description: 'A powerful portrait capturing introspective emotion',
    category: 'Portrait',
    price: 450.00,
    imageUrl: '/api/placeholder/800/600',
    isAvailable: true,
    size: '24x36 inches',
    medium: 'Charcoal on Premium Canvas'
  },
  {
    id: 'artwork-02',
    title: 'Urban Silhouette',
    description: 'Dynamic cityscape exploring light and shadow',
    category: 'Landscape',
    price: 350.00,
    imageUrl: '/api/placeholder/800/600',
    isAvailable: true,
    size: '18x24 inches',
    medium: 'Charcoal on Textured Paper'
  }
];

// Mock Merchandise Data
export const MERCHANDISE_MOCK_DATA = [
  {
    id: 'merch-hoodie-01',
    name: 'Artist Logo Hoodie',
    description: 'Comfortable black hoodie featuring Levi.art logo',
    category: 'Clothing',
    price: 55.00,
    imageUrl: '/api/placeholder/400/500',
    colors: ['Black', 'Dark Gray'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true
  },
  {
    id: 'merch-tshirt-01',
    name: 'Artistic Journey T-Shirt',
    description: 'Minimalist design celebrating artistic creativity',
    category: 'Clothing',
    price: 35.00,
    imageUrl: '/api/placeholder/400/500',
    colors: ['White', 'Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true
  }
];

// Export Firebase services
export { db, storage, auth };
