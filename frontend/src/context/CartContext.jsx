import { createContext, useContext, useState, useCallback } from 'react';
import client from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const { user } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    try {
      const res = await client.get('/cart');
      setItems(res.data);
    } catch {
      setItems([]);
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    await client.post('/cart', { productId, quantity });
    await refreshCart();
  };

  const removeFromCart = async (itemId) => {
    await client.delete(`/cart/${itemId}`);
    await refreshCart();
  };

  const updateQuantity = async (itemId, quantity) => {
    await client.put(`/cart/${itemId}`, { quantity });
    await refreshCart();
  };

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
