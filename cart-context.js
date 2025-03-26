import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('levi-art-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('levi-art-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const existingItemIndex = cart.findIndex(
      cartItem => cartItem.id === item.id && 
      cartItem.selectedSize === item.selectedSize && 
      cartItem.selectedColor === item.selectedColor
    );

    if (existingItemIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += item.quantity || 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: item.quantity || 1 }]);
    }
  };

  const removeFromCart = (itemId, selectedSize, selectedColor) => {
    setCart(cart.filter(
      item => !(
        item.id === itemId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
      )
    ));
  };

  const updateQuantity = (itemId, selectedSize, selectedColor, newQuantity) => {
    const updatedCart = cart.map(item => 
      item.id === itemId && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      calculateTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
