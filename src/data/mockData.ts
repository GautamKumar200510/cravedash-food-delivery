import { Restaurant, CuisineCategory, UserAddress } from '../types';

export const CUISINE_CATEGORIES: CuisineCategory[] = [
  { id: 'all', name: 'All Cuisines', icon: 'Utensils', bgGradient: 'from-amber-500 to-orange-600' },
  { id: 'burgers', name: 'Burgers', icon: 'Beef', bgGradient: 'from-orange-500 to-red-600' },
  { id: 'pizza', name: 'Pizza', icon: 'Pizza', bgGradient: 'from-red-500 to-amber-600' },
  { id: 'sushi', name: 'Japanese & Sushi', icon: 'Fish', bgGradient: 'from-blue-500 to-indigo-600' },
  { id: 'mexican', name: 'Mexican & Tacos', icon: 'Flame', bgGradient: 'from-emerald-500 to-teal-600' },
  { id: 'healthy', name: 'Healthy & Bowls', icon: 'Salad', bgGradient: 'from-green-500 to-emerald-600' },
  { id: 'indian', name: 'Indian Curry', icon: 'Soup', bgGradient: 'from-yellow-500 to-amber-600' },
  { id: 'asian', name: 'Asian Noodles', icon: 'CookingPot', bgGradient: 'from-pink-500 to-rose-600' },
  { id: 'desserts', name: 'Bakery & Sweets', icon: 'Cake', bgGradient: 'from-purple-500 to-pink-600' },
];

export const MOCK_SAVED_ADDRESSES: UserAddress[] = [
  {
    id: 'addr-1',
    label: 'Home',
    street: '742 Evergreen Terrace',
    apt: 'Apt 4B',
    city: 'Springfield',
    zip: '97477',
    deliveryNotes: 'Ring bell twice, leave at front door.',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Work',
    street: '100 Innovation Way',
    apt: 'Floor 3, Tech Hub',
    city: 'Springfield',
    zip: '97478',
    deliveryNotes: 'Leave at main reception front desk.',
    isDefault: false,
  },
  {
    id: 'addr-3',
    label: 'Gym',
    street: '450 Fitness Boulevard',
    city: 'Springfield',
    zip: '97479',
    deliveryNotes: 'Meet in parking lot near entrance.',
    isDefault: false,
  },
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'The Artisan Craft Burger Co.',
    tagline: 'Smash burgers, dry-aged beef & hand-cut truffled fries',
    logo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=150&q=80',
    coverImage: '/src/assets/images/gourmet_burger_cover_1786179934458.jpg',
    rating: 4.9,
    ratingCount: 480,
    deliveryTimeMin: 15,
    deliveryTimeMax: 25,
    deliveryFee: 0, // Free Delivery
    minOrder: 15,
    distanceMiles: 1.2,
    priceRange: '$$',
    cuisines: ['Burgers', 'American', 'Fries'],
    tags: ['Top Rated', 'Super Fast', 'Free Delivery'],
    isFeatured: true,
    isSuperFast: true,
    hasDiscount: true,
    discountText: '20% OFF on $25+',
    address: '124 Market Street, Downtown',
    menuCategories: ['Signature Burgers', 'Sides & Fries', 'Craft Shakes', 'Beverages'],
    menuItems: [
      {
        id: 'item-101',
        restaurantId: 'rest-1',
        name: 'The Truffle Double Smash',
        description: 'Two dry-aged beef patties, white cheddar, black truffle aioli, crispy shallots, brioche bun.',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        category: 'Signature Burgers',
        isPopular: true,
        customizationGroups: [
          {
            id: 'size',
            title: 'Choose Patty Count',
            required: true,
            maxChoices: 1,
            options: [
              { id: 'double', name: 'Double Patty (Standard)', price: 0, isDefault: true },
              { id: 'triple', name: 'Triple Patty (+1 Patty)', price: 3.50 },
            ]
          },
          {
            id: 'cheese',
            title: 'Extra Cheese & Toppings',
            required: false,
            maxChoices: 3,
            options: [
              { id: 'extra-cheddar', name: 'Extra Sharp Cheddar', price: 1.50 },
              { id: 'bacon', name: 'Applewood Smoked Bacon', price: 2.50 },
              { id: 'avocado', name: 'Fresh Hass Avocado', price: 2.00 },
            ]
          }
        ]
      },
      {
        id: 'item-102',
        restaurantId: 'rest-1',
        name: 'Smokey Bacon Avocado Burger',
        description: 'Single grass-fed patty, thick cut bacon, crushed avocado, pepper jack cheese, chipotle crema.',
        price: 13.50,
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80',
        category: 'Signature Burgers',
        isPopular: true,
      },
      {
        id: 'item-103',
        restaurantId: 'rest-1',
        name: 'Hand-Cut Parmesan Truffle Fries',
        description: 'Crispy Russet potatoes tossed in white truffle oil, grated aged parmesan, fresh parsley, dip.',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
        category: 'Sides & Fries',
        isVegetarian: true,
        isPopular: true,
      },
      {
        id: 'item-104',
        restaurantId: 'rest-1',
        name: 'Salted Caramel Bourbon Shake',
        description: 'Hand-spun Madagascar vanilla ice cream, sea salt caramel swirl, whipped cream, crushed pecans.',
        price: 7.25,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
        category: 'Craft Shakes',
        isVegetarian: true,
      }
    ]
  },
  {
    id: 'rest-2',
    name: 'Bella Napoli Woodfired Pizza',
    tagline: 'Authentic Neapolitan pizza cooked in 900° wood stone oven',
    logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=150&q=80',
    coverImage: '/src/assets/images/food_hero_banner_1786179921375.jpg',
    rating: 4.8,
    ratingCount: 620,
    deliveryTimeMin: 20,
    deliveryTimeMax: 30,
    deliveryFee: 1.99,
    minOrder: 18,
    distanceMiles: 2.1,
    priceRange: '$$',
    cuisines: ['Pizza', 'Italian', 'Pasta'],
    tags: ['Authentic', 'Chef Special', 'Vegetarian Friendly'],
    isFeatured: true,
    address: '88 Little Italy Ave',
    menuCategories: ['Woodfired Pizzas', 'Handmade Pasta', 'Starters', 'Desserts'],
    menuItems: [
      {
        id: 'item-201',
        restaurantId: 'rest-2',
        name: 'Classic Margherita DOC',
        description: 'San Marzano tomato sauce, fresh buffalo mozzarella, fresh basil leaves, extra virgin olive oil.',
        price: 16.50,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80',
        category: 'Woodfired Pizzas',
        isVegetarian: true,
        isPopular: true,
        customizationGroups: [
          {
            id: 'crust',
            title: 'Select Crust Type',
            required: true,
            options: [
              { id: 'neapolitan', name: 'Classic Neapolitan (Chewy & Blistered)', price: 0, isDefault: true },
              { id: 'thin', name: 'Crispy Thin Crust', price: 0 },
              { id: 'gluten-free', name: 'Gluten-Free Crust', price: 3.00 },
            ]
          },
          {
            id: 'extra-toppings',
            title: 'Add Extra Toppings',
            required: false,
            options: [
              { id: 'prosciutto', name: 'Prosciutto di Parma', price: 3.50 },
              { id: 'burrata', name: 'Whole Fresh Burrata Ball', price: 4.00 },
              { id: 'mushrooms', name: 'Wild Truffle Mushrooms', price: 2.50 },
            ]
          }
        ]
      },
      {
        id: 'item-202',
        restaurantId: 'rest-2',
        name: 'Spicy Diavola Pepperoni',
        description: 'Spicy Calabrian salami, pepperoni, smoked provolone, chili honey glaze, crushed hot peppers.',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
        category: 'Woodfired Pizzas',
        isSpicy: true,
        spicyLevel: 2,
        isPopular: true,
      },
      {
        id: 'item-203',
        restaurantId: 'rest-2',
        name: 'Truffle Mushroom Tagliatelle',
        description: 'Fresh egg pasta tossed in wild black truffle butter crema, porcini mushrooms, parmigiano reggiano.',
        price: 19.50,
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281288?auto=format&fit=crop&w=600&q=80',
        category: 'Handmade Pasta',
        isVegetarian: true,
      },
      {
        id: 'item-204',
        restaurantId: 'rest-2',
        name: 'Traditional Espresso Tiramisu',
        description: 'Ladyfingers soaked in dark espresso and rum, layered with whipped mascarpone cream & cocoa dust.',
        price: 8.50,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
        category: 'Desserts',
        isVegetarian: true,
      }
    ]
  },
  {
    id: 'rest-3',
    name: 'Sakura Omakase & Sushi Bar',
    tagline: 'Fresh Tokyo-grade sashimi, signature rolls & warm ramen bowls',
    logo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=150&q=80',
    coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
    rating: 4.95,
    ratingCount: 390,
    deliveryTimeMin: 25,
    deliveryTimeMax: 35,
    deliveryFee: 2.99,
    minOrder: 25,
    distanceMiles: 3.0,
    priceRange: '$$$',
    cuisines: ['Japanese & Sushi', 'Asian', 'Seafood'],
    tags: ['Premium', 'Fresh Fish', 'Chef Recommended'],
    isFeatured: true,
    hasDiscount: true,
    discountText: '$5 off on $35',
    address: '45 Sakura Way, East District',
    menuCategories: ['Signature Rolls', 'Sashimi & Nigiri', 'Hot Ramen', 'Sides'],
    menuItems: [
      {
        id: 'item-301',
        restaurantId: 'rest-3',
        name: 'Dragon Flame Roll (8 pcs)',
        description: 'Eel, cucumber topped with sliced avocado, torched spicy salmon, unagi glaze & tobiko.',
        price: 17.50,
        image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=600&q=80',
        category: 'Signature Rolls',
        isPopular: true,
      },
      {
        id: 'item-302',
        restaurantId: 'rest-3',
        name: 'Tonkotsu Pork Belly Ramen',
        description: 'Rich 16-hour pork bone broth, tender chashu pork, soft poached egg, bamboo shoots, wood ear mushrooms.',
        price: 16.90,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
        category: 'Hot Ramen',
        isPopular: true,
        customizationGroups: [
          {
            id: 'spice',
            title: 'Spiciness Level',
            required: true,
            options: [
              { id: 'mild', name: 'Mild (Original Broth)', price: 0, isDefault: true },
              { id: 'medium', name: 'Medium Chili Oil 🌶️', price: 0 },
              { id: 'spicy', name: 'Extra Spicy Bomb 🌶️🌶️', price: 0.75 },
            ]
          }
        ]
      },
      {
        id: 'item-303',
        restaurantId: 'rest-3',
        name: 'Premium Salmon & Tuna Sashimi Deluxe',
        description: '6 slices Atlantic King Salmon and 6 slices Bluefin Tuna sashimi served with fresh wasabi.',
        price: 24.00,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
        category: 'Sashimi & Nigiri',
      }
    ]
  },
  {
    id: 'rest-4',
    name: 'El Burro Loco Mexican Grill',
    tagline: 'Sizzling fajitas, birria tacos & freshly made guacamole',
    logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=150&q=80',
    coverImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    ratingCount: 510,
    deliveryTimeMin: 15,
    deliveryTimeMax: 25,
    deliveryFee: 0,
    minOrder: 12,
    distanceMiles: 1.5,
    priceRange: '$',
    cuisines: ['Mexican & Tacos', 'Tacos', 'Burritos'],
    tags: ['Budget Friendly', 'Free Delivery', 'Spicy Options'],
    isSuperFast: true,
    address: '210 Fiesta Street',
    menuCategories: ['Street Tacos', 'Giant Burritos', 'Sides & Dips', 'Drinks'],
    menuItems: [
      {
        id: 'item-401',
        restaurantId: 'rest-4',
        name: 'Crispy Birria Tacos with Consomé (3 pcs)',
        description: 'Slow-braised shredded beef, melted Oaxaca cheese, cilantro & white onion in griddled corn tortilla.',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80',
        category: 'Street Tacos',
        isPopular: true,
        isSpicy: true,
        spicyLevel: 1,
      },
      {
        id: 'item-402',
        restaurantId: 'rest-4',
        name: 'The Monster Carne Asada Burrito',
        description: 'Grilled steak, Mexican rice, pinto beans, guacamole, pico de gallo, chipotle cream in warm tortilla.',
        price: 12.50,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80',
        category: 'Giant Burritos',
        isPopular: true,
      },
      {
        id: 'item-403',
        restaurantId: 'rest-4',
        name: 'Chips & Freshly Smashed Guacamole',
        description: 'Warm crispy tortilla chips served with house-smashed Hass avocado, lime, sea salt, cilantro.',
        price: 6.50,
        image: 'https://images.unsplash.com/photo-1541288097308-7b8e3f58c4c6?auto=format&fit=crop&w=600&q=80',
        category: 'Sides & Dips',
        isVegetarian: true,
        isVegan: true,
      }
    ]
  },
  {
    id: 'rest-5',
    name: 'Green Superfood & Acai Bowl Bar',
    tagline: 'Clean eating, organic protein bowls, fresh cold-pressed juices',
    logo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=150&q=80',
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    rating: 4.85,
    ratingCount: 290,
    deliveryTimeMin: 12,
    deliveryTimeMax: 20,
    deliveryFee: 1.49,
    minOrder: 14,
    distanceMiles: 0.8,
    priceRange: '$$',
    cuisines: ['Healthy & Bowls', 'Salads', 'Smoothies'],
    tags: ['Vegan Options', 'Gluten-Free', 'Super Fast'],
    isSuperFast: true,
    address: '15 Wellness Plaza',
    menuCategories: ['Warm Grain Bowls', 'Acai & Smoothie Bowls', 'Cold-Pressed Juices'],
    menuItems: [
      {
        id: 'item-501',
        restaurantId: 'rest-5',
        name: 'Tahini Salmon Quinoa Bowl',
        description: 'Pan-seared Atlantic salmon, warm quinoa, roasted sweet potatoes, avocado, kale, garlic tahini dressing.',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
        category: 'Warm Grain Bowls',
        isGlutenFree: true,
        isPopular: true,
      },
      {
        id: 'item-502',
        restaurantId: 'rest-5',
        name: 'Tropical Berry Acai Bowl',
        description: 'Organic acai blend topped with banana slices, blueberries, chia seeds, almond butter drizzle, cacao nibs.',
        price: 11.50,
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80',
        category: 'Acai & Smoothie Bowls',
        isVegan: true,
        isGlutenFree: true,
        isPopular: true,
      }
    ]
  },
  {
    id: 'rest-6',
    name: 'Bombay Spice Curry House',
    tagline: 'Fragrant chicken tikka masala, garlic naan & dum biryani',
    logo: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=150&q=80',
    coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80',
    rating: 4.75,
    ratingCount: 410,
    deliveryTimeMin: 25,
    deliveryTimeMax: 40,
    deliveryFee: 2.49,
    minOrder: 20,
    distanceMiles: 2.8,
    priceRange: '$$',
    cuisines: ['Indian Curry', 'Asian', 'Vegetarian'],
    tags: ['Rich Flavors', 'Halal', 'Family Portion'],
    address: '50 Spice Gardens Boulevard',
    menuCategories: ['Curry Specialties', 'Tandoori Grill', 'Naan & Rice', 'Desserts'],
    menuItems: [
      {
        id: 'item-601',
        restaurantId: 'rest-6',
        name: 'Butter Chicken Makhani',
        description: 'Tender tandoori chicken cooked in a rich, velvety tomato butter cream sauce with aromatic fenugreek.',
        price: 16.50,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
        category: 'Curry Specialties',
        isPopular: true,
        customizationGroups: [
          {
            id: 'spice-level',
            title: 'Choose Spice Level',
            required: true,
            options: [
              { id: 'mild', name: 'Mild & Creamy', price: 0, isDefault: true },
              { id: 'medium', name: 'Medium Spice 🌶️', price: 0 },
              { id: 'hot', name: 'Authentic Hot 🌶️🌶️', price: 0 },
            ]
          }
        ]
      },
      {
        id: 'item-602',
        restaurantId: 'rest-6',
        name: 'Garlic Butter Tandoori Naan',
        description: 'Leavened flatbread baked fresh in traditional clay oven, brushed with garlic & herb butter.',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
        category: 'Naan & Rice',
        isVegetarian: true,
        isPopular: true,
      }
    ]
  }
];

export const MOCK_PROMO_CODES: Record<string, { discountPercent?: number; discountFixed?: number; minOrder: number; description: string }> = {
  'CRAVE20': { discountPercent: 20, minOrder: 20, description: '20% off on orders over $20' },
  'WELCOME50': { discountPercent: 50, minOrder: 15, description: '50% off first order (up to $15 value)' },
  'FREEDEL': { discountFixed: 2.99, minOrder: 10, description: 'Free Delivery Discount' },
};
