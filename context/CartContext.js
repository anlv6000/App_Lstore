import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider(props) {
  const [items, setItems] = useState([]);

  function addToCart(product) {
    if (
      !product ||
      typeof product !== 'object' ||
      product.price == null ||
      !product._id
    ) {
      console.error('❌ Dữ liệu sản phẩm không hợp lệ:', product);
      return;
    }

    const id = product._id.toString();

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === id);

      if (!existingItem) {
        return [
          ...prevItems,
          {
            id,
            qty: 1,
            product,
            totalPrice: product.price, 
          },
        ];
      }

      return prevItems.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + 1;
          return {
            ...item,
            qty: newQty,
            totalPrice: newQty * product.price, 
          };
        }
        return item;
      });
    });
  }

  function removeFromCart(product) {
    if (!product || typeof product !== 'object' || !product._id) return;
    const id = product._id.toString();
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === id);
      if (!existingItem) return prevItems;
      if (existingItem.qty <= 1) {
        return prevItems.filter((item) => item.id !== id);
      }
      return prevItems.map((item) =>
        item.id === id
          ? { ...item, qty: item.qty - 1, totalPrice: (item.qty - 1) * item.product.price }
          : item
      );
    });
  }

  function getItemsCount() {
    return items.reduce((sum, item) => sum + item.qty, 0);
  }

  function getTotalPrice() {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  return (
    <CartContext.Provider
      value={{ items, setItems, getItemsCount, addToCart, removeFromCart, getTotalPrice }}
    >
      {props.children}
    </CartContext.Provider>
  );
}
