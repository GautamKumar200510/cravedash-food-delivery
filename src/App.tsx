import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryBar } from './components/CategoryBar';
import { FilterBar } from './components/FilterBar';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantDetailModal } from './components/RestaurantDetailModal';
import { DishCustomizationModal } from './components/DishCustomizationModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LiveOrderTracker } from './components/LiveOrderTracker';
import { AiFoodAssistantModal } from './components/AiFoodAssistantModal';
import { AddressModal } from './components/AddressModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';

import { CUISINE_CATEGORIES, MOCK_RESTAURANTS, MOCK_SAVED_ADDRESSES, MOCK_PROMO_CODES } from './data/mockData';
import { 
  Restaurant, 
  MenuItem, 
  CartItem, 
  SelectedOption, 
  UserAddress, 
  Order, 
  FilterOptions,
  DeliveryMethod,
  PaymentMethod,
  User
} from './types';

export default function App() {
  // User Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('cravedash_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState<UserAddress[]>(MOCK_SAVED_ADDRESSES);
  const [currentAddress, setCurrentAddress] = useState<UserAddress>(MOCK_SAVED_ADDRESSES[0]);

  // Favorites Wishlist State
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['rest-1', 'rest-3']);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    minRating: 0,
    maxDeliveryTime: 0,
    maxPriceRange: 'all',
    freeDeliveryOnly: false,
    offersOnly: false,
    dietaryFilter: 'all',
    sortBy: 'relevance',
    searchQuery: '',
  });

  // Restaurants Data State
  const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [tip, setTip] = useState<number>(3.00);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);

  // Active Orders & History
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Modals & Drawers State
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // 1. Fetch Restaurants based on filter parameters
  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (activeCategory !== 'all') queryParams.append('category', activeCategory);
    if (searchQuery) queryParams.append('search', searchQuery);
    if (filters.dietaryFilter !== 'all') queryParams.append('dietary', filters.dietaryFilter);
    if (filters.minRating > 0) queryParams.append('minRating', String(filters.minRating));
    if (filters.maxDeliveryTime > 0) queryParams.append('maxTime', String(filters.maxDeliveryTime));
    if (filters.offersOnly) queryParams.append('offersOnly', 'true');
    if (filters.sortBy !== 'relevance') queryParams.append('sortBy', filters.sortBy);

    fetch(`/api/restaurants?${queryParams.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRestaurants(data.data);
        }
      })
      .catch(err => {
        console.error('Error loading restaurants:', err);
      });
  }, [activeCategory, searchQuery, filters]);

  // Handle Favorites toggle
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  // Cart Price Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  }, [cartItems]);

  const deliveryFee = useMemo(() => {
    if (cartItems.length === 0) return 0;
    // Check if promo code gives free delivery
    if (promoCode.toUpperCase() === 'FREEDEL') return 0;
    return 1.99;
  }, [cartItems.length, promoCode]);

  const serviceFee = useMemo(() => {
    return cartItems.length > 0 ? 2.50 : 0;
  }, [cartItems.length]);

  // Recalculate discount
  const calculatedDiscount = useMemo(() => {
    if (!promoCode || !MOCK_PROMO_CODES[promoCode.toUpperCase()]) return 0;
    const promo = MOCK_PROMO_CODES[promoCode.toUpperCase()];
    if (subtotal < promo.minOrder) return 0;

    if (promo.discountPercent) {
      return (subtotal * promo.discountPercent) / 100;
    }
    if (promo.discountFixed) {
      return promo.discountFixed;
    }
    return 0;
  }, [promoCode, subtotal]);

  const total = useMemo(() => {
    return Math.max(0, subtotal + deliveryFee + serviceFee + tip - calculatedDiscount);
  }, [subtotal, deliveryFee, serviceFee, tip, calculatedDiscount]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // Cart Operations
  const handleQuickAddToCart = (item: MenuItem) => {
    const newItemId = `cart-${item.id}-default`;
    setCartItems(prev => {
      const existing = prev.find(i => i.id === newItemId);
      if (existing) {
        return prev.map(i => i.id === newItemId ? {
          ...i,
          quantity: i.quantity + 1,
          totalPrice: i.unitPrice * (i.quantity + 1)
        } : i);
      }
      return [...prev, {
        id: newItemId,
        menuItem: item,
        selectedOptions: [],
        quantity: 1,
        unitPrice: item.price,
        totalPrice: item.price
      }];
    });
  };

  const handleAddCustomizedToCart = (
    item: MenuItem,
    selectedOptions: SelectedOption[],
    specialInstructions: string,
    quantity: number
  ) => {
    const optionsTotal = selectedOptions.reduce((acc, opt) => acc + opt.price, 0);
    const unitPrice = item.price + optionsTotal;
    const newItemId = `cart-${item.id}-${Date.now()}`;

    const newCartItem: CartItem = {
      id: newItemId,
      menuItem: item,
      selectedOptions,
      specialInstructions,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity
    };

    setCartItems(prev => [...prev, newCartItem]);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.id === cartItemId) {
        return {
          ...item,
          quantity: newQty,
          totalPrice: item.unitPrice * newQty
        };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems(prev => prev.filter(i => i.id !== cartItemId));
  };

  const handleApplyPromoCode = (code: string) => {
    setPromoCode(code.toUpperCase());
  };

  // Checkout & Place Order
  const handlePlaceOrder = async (details: {
    deliveryMethod: DeliveryMethod;
    paymentMethod: PaymentMethod;
    instructions: string;
  }) => {
    if (cartItems.length === 0) return;
    setIsPlacingOrder(true);

    try {
      const firstRestId = cartItems[0].menuItem.restaurantId;
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: firstRestId,
          items: cartItems,
          subtotal,
          deliveryFee,
          serviceFee,
          tip,
          promoCode,
          deliveryMethod: details.deliveryMethod,
          deliveryAddress: currentAddress,
          paymentMethod: details.paymentMethod,
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        const newOrder = data.data;
        setOrders(prev => [newOrder, ...prev]);
        setActiveOrder(newOrder);
        setCartItems([]);
        setIsCheckoutOpen(false);
        setIsCartOpen(false);
        setIsOrderTrackerOpen(true);
      }
    } catch (err) {
      console.error('Error placing order:', err);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Reorder
  const handleReorder = (order: Order) => {
    setCartItems(order.items);
    setIsOrderTrackerOpen(false);
    setIsCartOpen(true);
  };

  // Filtered Restaurant Display
  const displayedRestaurants = useMemo(() => {
    if (showFavoritesOnly) {
      return restaurants.filter(r => favoriteIds.includes(r.id));
    }
    return restaurants;
  }, [restaurants, showFavoritesOnly, favoriteIds]);

  // Auth Handlers
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('cravedash_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user session', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('cravedash_user');
    } catch (e) {
      console.error('Failed to remove user session', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans flex flex-col selection:bg-orange-500 selection:text-white">
      
      {/* App Header */}
      <Header
        currentAddress={currentAddress}
        onOpenAddressModal={() => setIsAddressModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        cartTotal={total}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        activeOrderCount={activeOrder && activeOrder.status !== 'delivered' ? 1 : 0}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
        favoriteCount={favoriteIds.length}
        onOpenFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        currentUser={currentUser}
        onOpenAuthModal={(mode = 'login') => {
          setAuthMode(mode);
          setIsAuthModalOpen(true);
        }}
        onOpenUserProfile={() => setIsUserProfileModalOpen(true)}
      />

      {/* Hero Banner with Promos & AI Callout */}
      <HeroBanner
        onSelectCategory={(catId) => setActiveCategory(catId)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onApplyPromoCode={(code) => {
          handleApplyPromoCode(code);
          setIsCartOpen(true);
        }}
      />

      {/* Category Pills Bar */}
      <CategoryBar
        categories={CUISINE_CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Filter Toolbar */}
      <FilterBar
        filters={filters}
        onFilterChange={(updated) => setFilters(prev => ({ ...prev, ...updated }))}
        onResetFilters={() => {
          setActiveCategory('all');
          setSearchQuery('');
          setShowFavoritesOnly(false);
          setFilters({
            category: 'all',
            minRating: 0,
            maxDeliveryTime: 0,
            maxPriceRange: 'all',
            freeDeliveryOnly: false,
            offersOnly: false,
            dietaryFilter: 'all',
            sortBy: 'relevance',
            searchQuery: '',
          });
        }}
        totalResults={displayedRestaurants.length}
      />

      {/* Main Content: Restaurant Cards Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {showFavoritesOnly && (
          <div className="flex items-center justify-between bg-orange-50 border border-orange-200 p-4 rounded-2xl shadow-sm">
            <span className="text-sm font-semibold text-orange-900">
              Showing {displayedRestaurants.length} Favorite Saved Restaurants
            </span>
            <button
              onClick={() => setShowFavoritesOnly(false)}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 underline"
            >
              Show All Restaurants
            </button>
          </div>
        )}

        {displayedRestaurants.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#F97316] mx-auto flex items-center justify-center font-bold text-xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-[#111827]">No restaurants match your search</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Try adjusting your dietary filters, resetting search parameters, or searching for a different dish!
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setShowFavoritesOnly(false);
                setFilters({
                  category: 'all',
                  minRating: 0,
                  maxDeliveryTime: 0,
                  maxPriceRange: 'all',
                  freeDeliveryOnly: false,
                  offersOnly: false,
                  dietaryFilter: 'all',
                  sortBy: 'relevance',
                  searchQuery: '',
                });
              }}
              className="px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-medium text-xs shadow-sm transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                isFavorite={favoriteIds.includes(restaurant.id)}
                onToggleFavorite={handleToggleFavorite}
                onSelectRestaurant={(r) => setSelectedRestaurant(r)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 text-[#64748B] text-xs text-center shadow-sm">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-[#111827]">
            CraveDash Food Express Platform • 20-Min Express Delivery
          </p>
          <p className="text-[#64748B]">
            Powered by Gemini AI Culinary Assistant & Modern Express Architecture
          </p>
        </div>
      </footer>

      {/* Modal 1: Restaurant Menu Modal */}
      {selectedRestaurant && (
        <RestaurantDetailModal
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          onOpenCustomization={(item) => setCustomizingItem(item)}
          onQuickAddToCart={handleQuickAddToCart}
          cartCount={cartCount}
          cartTotal={total}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {/* Modal 2: Dish Customization Options Modal */}
      {customizingItem && (
        <DishCustomizationModal
          item={customizingItem}
          onClose={() => setCustomizingItem(null)}
          onAddToCart={handleAddCustomizedToCart}
        />
      )}

      {/* Drawer 3: Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        serviceFee={serviceFee}
        tip={tip}
        onChangeTip={setTip}
        promoCode={promoCode}
        onApplyPromoCode={handleApplyPromoCode}
        discount={calculatedDiscount}
        total={total}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        restaurantName={cartItems.length > 0 ? selectedRestaurant?.name : undefined}
      />

      {/* Modal 4: Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        addresses={addresses}
        selectedAddress={currentAddress}
        onSelectAddress={setCurrentAddress}
        cartItems={cartItems}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        serviceFee={serviceFee}
        tip={tip}
        discount={calculatedDiscount}
        total={total}
        onPlaceOrder={handlePlaceOrder}
        isSubmitting={isPlacingOrder}
        restaurantName={cartItems.length > 0 ? cartItems[0].menuItem.name : 'Food Express'}
      />

      {/* Modal 5: Live Order Tracker Modal */}
      {isOrderTrackerOpen && (
        <LiveOrderTracker
          order={activeOrder}
          onClose={() => setIsOrderTrackerOpen(false)}
          onReorder={handleReorder}
        />
      )}

      {/* Modal 6: AI Food Assistant Modal */}
      <AiFoodAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        restaurants={restaurants}
        onSelectRestaurantById={(id) => {
          const r = restaurants.find(rest => rest.id === id);
          if (r) setSelectedRestaurant(r);
        }}
        onQuickAddToCart={handleQuickAddToCart}
      />

      {/* Modal 7: Delivery Address Switcher Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={addresses}
        currentAddress={currentAddress}
        onSelectAddress={setCurrentAddress}
        onAddNewAddress={(newAddr) => setAddresses(prev => [...prev, newAddr])}
      />

      {/* Modal 8: Order History Modal */}
      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        orders={orders}
        onSelectOrder={(ord) => {
          setActiveOrder(ord);
          setIsOrderTrackerOpen(true);
        }}
        onReorder={handleReorder}
      />

      {/* Modal 9: Authentication (Login / Signup) Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Modal 10: User Profile & Crave Wallet Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={isUserProfileModalOpen}
          onClose={() => setIsUserProfileModalOpen(false)}
          user={currentUser}
          onLogout={handleLogout}
          onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
          onOpenAddressModal={() => setIsAddressModalOpen(true)}
        />
      )}

    </div>
  );
}
