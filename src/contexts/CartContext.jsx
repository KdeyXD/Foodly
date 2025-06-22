"use client"

import { createContext, useState, useContext } from "react"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (food, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === food.id)
      if (existingItem) {
        return prevItems.map((item) => (item.id === food.id ? { ...item, quantity: item.quantity + quantity } : item))
      }
      return [...prevItems, { ...food, quantity }]
    })
  }

  const removeFromCart = (foodId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== foodId))
  }

  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId)
      return
    }
    setCartItems((prevItems) => prevItems.map((item) => (item.id === foodId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
