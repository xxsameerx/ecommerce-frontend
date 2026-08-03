import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axiosConfig";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch {
      setCart(null);
    }
  }, []);

  const addToCart = async (gameId, quantity = 1) => {
    const res = await api.post(`/cart/add?gameId=${gameId}&quantity=${quantity}`);
    setCart(res.data);
  };

  const removeItem = async (cartItemId) => {
    await api.delete(`/cart/${cartItemId}`);
    fetchCart();
  };

  const updateQuantity = async (cartItemId, quantity) => {
    const res = await api.put(`/cart/${cartItemId}?quantity=${quantity}`);
    setCart(res.data);
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, removeItem, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}