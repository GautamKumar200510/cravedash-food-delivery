export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  walletBalance: number;
  memberTier: 'Gold Member' | 'Silver Member' | 'VIP Craver' | 'Express Pro';
  rewardPoints: number;
  createdAt: string;
}

export interface OptionChoice {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface CustomizationGroup {
  id: string;
  title: string;
  required: boolean;
  maxChoices?: number; // 1 for radio, >1 for checkboxes
  options: OptionChoice[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  spicyLevel?: number; // 1 to 3
  isPopular?: boolean;
  customizationGroups?: CustomizationGroup[];
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  coverImage: string;
  rating: number;
  ratingCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number;
  minOrder: number;
  distanceMiles: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  cuisines: string[];
  tags: string[];
  isFeatured?: boolean;
  isSuperFast?: boolean;
  hasDiscount?: boolean;
  discountText?: string;
  address: string;
  menuCategories: string[];
  menuItems: MenuItem[];
}

export interface SelectedOption {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  id: string; // unique cart item instance ID
  menuItem: MenuItem;
  selectedOptions: SelectedOption[];
  specialInstructions?: string;
  quantity: number;
  unitPrice: number; // base price + selected options
  totalPrice: number; // unitPrice * quantity
}

export interface UserAddress {
  id: string;
  label: 'Home' | 'Work' | 'Gym' | 'Other';
  street: string;
  apt?: string;
  city: string;
  zip: string;
  deliveryNotes?: string;
  isDefault?: boolean;
}

export type DeliveryMethod = 'delivery' | 'pickup';
export type PaymentMethod = 'card' | 'apple_pay' | 'cash' | 'wallet';

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface DriverInfo {
  name: string;
  photo: string;
  phone: string;
  vehicle: string;
  rating: number;
  currentLat: number;
  currentLng: number;
}

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  subtext: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogo: string;
  restaurantCover: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tip: number;
  discount: number;
  promoCodeApplied?: string;
  total: number;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: UserAddress;
  paymentMethod: PaymentMethod;
  createdAt: string;
  estimatedMinutes: number;
  driver?: DriverInfo;
  timeline: OrderTimelineStep[];
}

export interface CuisineCategory {
  id: string;
  name: string;
  icon: string;
  bgGradient: string;
  image?: string;
}

export interface FilterOptions {
  category: string; // 'all' or specific cuisine
  minRating: number; // 0, 4.0, 4.5
  maxDeliveryTime: number; // 0 (any), 20, 30, 45
  maxPriceRange: string; // 'all', '$', '$$', '$$$'
  freeDeliveryOnly: boolean;
  offersOnly: boolean;
  dietaryFilter: 'all' | 'veg' | 'vegan' | 'gluten_free';
  sortBy: 'relevance' | 'rating' | 'delivery_time' | 'price_low' | 'price_high';
  searchQuery: string;
}
