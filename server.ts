import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { MOCK_RESTAURANTS, MOCK_PROMO_CODES } from './src/data/mockData';
import { Order, OrderStatus, DriverInfo } from './src/types';

// In-memory order store for live tracking
const ordersDb: Record<string, Order> = {};

// In-memory user database
const usersDb: Record<string, any> = {
  'alex@example.com': {
    id: 'usr_alex_123',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'password123',
    phone: '+1 (555) 019-2834',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    walletBalance: 45.50,
    memberTier: 'VIP Craver',
    rewardPoints: 1250,
    createdAt: '2025-01-15'
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Auth Routes
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const user = usersDb[cleanEmail];

    if (!user || user.password !== password) {
      // For convenience, if user doesn't exist, allow quick auto-registration on login or fallback
      if (!user) {
        return res.status(401).json({ success: false, error: 'Account not found. Please sign up first!' });
      }
      return res.status(401).json({ success: false, error: 'Invalid password. Try "password123"' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  });

  app.post('/api/auth/signup', (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    if (usersDb[cleanEmail]) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists' });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: String(name).trim(),
      email: cleanEmail,
      password: String(password),
      phone: phone ? String(phone).trim() : '+1 (555) 123-4567',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      walletBalance: 10.00, // $10 welcome bonus balance!
      memberTier: 'VIP Craver',
      rewardPoints: 500, // 500 welcome bonus points!
      createdAt: new Date().toISOString().split('T')[0]
    };

    usersDb[cleanEmail] = newUser;
    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ success: true, user: userWithoutPassword, message: 'Account created successfully! Enjoy $10 welcome credit!' });
  });

  // 2. Restaurants List Endpoint
  app.get('/api/restaurants', (req, res) => {
    const { category, search, dietary, sortBy, minRating, maxTime, offersOnly } = req.query;

    let results = [...MOCK_RESTAURANTS];

    if (category && category !== 'all') {
      results = results.filter(r => 
        r.cuisines.some(c => c.toLowerCase().includes(String(category).toLowerCase()))
      );
    }

    if (search) {
      const q = String(search).toLowerCase();
      results = results.filter(r => 
        r.name.toLowerCase().includes(q) ||
        r.cuisines.some(c => c.toLowerCase().includes(q)) ||
        r.menuItems.some(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
      );
    }

    if (dietary && dietary !== 'all') {
      if (dietary === 'veg') {
        results = results.filter(r => r.menuItems.some(i => i.isVegetarian));
      } else if (dietary === 'vegan') {
        results = results.filter(r => r.menuItems.some(i => i.isVegan));
      } else if (dietary === 'gluten_free') {
        results = results.filter(r => r.menuItems.some(i => i.isGlutenFree));
      }
    }

    if (minRating && Number(minRating) > 0) {
      results = results.filter(r => r.rating >= Number(minRating));
    }

    if (maxTime && Number(maxTime) > 0) {
      results = results.filter(r => r.deliveryTimeMax <= Number(maxTime));
    }

    if (offersOnly === 'true') {
      results = results.filter(r => r.hasDiscount || r.deliveryFee === 0);
    }

    // Sort
    if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'delivery_time') {
      results.sort((a, b) => a.deliveryTimeMin - b.deliveryTimeMin);
    } else if (sortBy === 'price_low') {
      results.sort((a, b) => a.priceRange.length - b.priceRange.length);
    }

    res.json({ success: true, count: results.length, data: results });
  });

  // 3. Single Restaurant Endpoint
  app.get('/api/restaurants/:id', (req, res) => {
    const restaurant = MOCK_RESTAURANTS.find(r => r.id === req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }
    res.json({ success: true, data: restaurant });
  });

  // 4. Create Order Endpoint
  app.post('/api/orders', (req, res) => {
    const {
      restaurantId,
      items,
      subtotal,
      deliveryFee,
      serviceFee,
      tip,
      promoCode,
      deliveryMethod,
      deliveryAddress,
      paymentMethod
    } = req.body;

    const restaurant = MOCK_RESTAURANTS.find(r => r.id === restaurantId);
    if (!restaurant) {
      return res.status(400).json({ success: false, error: 'Invalid restaurant' });
    }

    // Calculate discount
    let discount = 0;
    if (promoCode && MOCK_PROMO_CODES[promoCode.toUpperCase()]) {
      const promo = MOCK_PROMO_CODES[promoCode.toUpperCase()];
      if (promo.discountPercent) {
        discount = (subtotal * promo.discountPercent) / 100;
      } else if (promo.discountFixed) {
        discount = promo.discountFixed;
      }
    }

    const total = Math.max(0, subtotal + deliveryFee + serviceFee + tip - discount);
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();

    const mockDriver: DriverInfo = {
      name: 'Alex Rivera',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: '+1 (555) 382-9102',
      vehicle: 'Red Honda Scooter (#402)',
      rating: 4.9,
      currentLat: 37.7749,
      currentLng: -122.4194
    };

    const newOrder: Order = {
      id: orderId,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantLogo: restaurant.logo,
      restaurantCover: restaurant.coverImage,
      items,
      subtotal,
      deliveryFee,
      serviceFee,
      tip,
      discount,
      promoCodeApplied: promoCode ? promoCode.toUpperCase() : undefined,
      total,
      status: 'placed',
      deliveryMethod: deliveryMethod || 'delivery',
      deliveryAddress,
      paymentMethod: paymentMethod || 'card',
      createdAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedMinutes: Math.floor((restaurant.deliveryTimeMin + restaurant.deliveryTimeMax) / 2),
      driver: mockDriver,
      timeline: [
        { status: 'placed', label: 'Order Sent', subtext: 'Received by restaurant', timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true, current: true },
        { status: 'confirmed', label: 'Order Confirmed', subtext: 'Kitchen accepted order', timestamp: '', completed: false, current: false },
        { status: 'preparing', label: 'Preparing Food', subtext: 'Chef is cooking your meal', timestamp: '', completed: false, current: false },
        { status: 'on_the_way', label: 'Out for Delivery', subtext: 'Driver Alex is en route', timestamp: '', completed: false, current: false },
        { status: 'delivered', label: 'Delivered', subtext: 'Enjoy your meal!', timestamp: '', completed: false, current: false }
      ]
    };

    ordersDb[orderId] = newOrder;

    res.json({ success: true, data: newOrder });
  });

  // 5. Get Order Live Status Endpoint
  app.get('/api/orders/:id', (req, res) => {
    const order = ordersDb[req.params.id];
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  });

  // 6. Gemini AI Meal Assistant
  app.post('/api/ai-recommend', async (req, res) => {
    const { prompt, dietaryPreference, maxBudget } = req.body;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback gracefully with intelligent mock recommendation if key is missing
        return res.json({
          success: true,
          recommendation: {
            title: "Chef's Spicy & Savory Craving Pick",
            summary: "Based on your request, we recommend the Truffle Double Smash Burger from The Artisan Craft Burger Co. or the Spicy Diavola Pepperoni Pizza from Bella Napoli!",
            dishes: [
              { dishName: "The Truffle Double Smash", restaurantName: "The Artisan Craft Burger Co.", restaurantId: "rest-1", price: 14.99, reason: "Dry-aged beef patties with black truffle aioli, perfect for satisfying rich savory cravings." },
              { dishName: "Spicy Diavola Pepperoni", restaurantName: "Bella Napoli Woodfired Pizza", restaurantId: "rest-2", price: 18.99, reason: "Spicy Calabrian salami & chili honey glaze baked in a 900° woodfired oven." }
            ]
          }
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const menuDataSummary = MOCK_RESTAURANTS.map(r => ({
        id: r.id,
        restaurantName: r.name,
        cuisine: r.cuisines.join(', '),
        dishes: r.menuItems.map(m => ({
          name: m.name,
          price: m.price,
          description: m.description,
          category: m.category,
          isVeg: m.isVegetarian,
          isVegan: m.isVegan,
          isGlutenFree: m.isGlutenFree,
          isSpicy: m.isSpicy
        }))
      }));

      const systemInstruction = `You are the AI Culinary Concierge for our Food Delivery Platform.
Your job is to parse the user's craving, mood, budget, or dietary preference and recommend 2 to 3 dishes from the available restaurant partner menus provided in JSON context.

Available Restaurants and Menus:
${JSON.stringify(menuDataSummary)}

Respond ONLY with clean JSON matching this format:
{
  "title": "Short creative headline for the recommendation",
  "summary": "1-2 engaging sentences explaining why these picks match the user's prompt",
  "dishes": [
    {
      "dishName": "Exact dish name from menu",
      "restaurantName": "Exact restaurant name from menu",
      "restaurantId": "Restaurant ID",
      "price": number,
      "reason": "Why this specific dish fits the craving/diet"
    }
  ]
}`;

      const userPrompt = `User request: "${prompt || 'Suggest a delicious dinner'}". Dietary preference: ${dietaryPreference || 'None'}. Max budget: $${maxBudget || 'Unlimited'}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);

      res.json({ success: true, recommendation: parsed });
    } catch (err: any) {
      console.error('Gemini AI error:', err);
      // Failover recommendation
      res.json({
        success: true,
        recommendation: {
          title: "Popular Craving Highlights",
          summary: "Check out top-rated dishes carefully selected from local chef partners!",
          dishes: [
            { dishName: "Classic Margherita DOC", restaurantName: "Bella Napoli Woodfired Pizza", restaurantId: "rest-2", price: 16.50, reason: "San Marzano tomatoes & fresh buffalo mozzarella." },
            { dishName: "Dragon Flame Roll (8 pcs)", restaurantName: "Sakura Omakase & Sushi Bar", restaurantId: "rest-3", price: 17.50, reason: "Fresh torched spicy salmon with unagi glaze." }
          ]
        }
      });
    }
  });

  // 7. Vite or Static Server
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Food Delivery platform server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
