import React, { createContext, useState } from 'react';
import { getProduct } from '../services/ProductsService.js';

export const CartContext = createContext();

export function CartProvider(props) {
  const [items, setItems] = useState([]);

  async function addItemToCart(id) {
    const product = await getProduct(id);

    if (!product || typeof product !== 'object' || product.price == null) {
      console.error('❌ Dữ liệu sản phẩm không hợp lệ:', product);
      return;
    }

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


  function getItemsCount() {
    return items.reduce((sum, item) => sum + item.qty, 0);
  }

  function getTotalPrice() {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  return (
    <CartContext.Provider
      value={{ items, setItems, getItemsCount, addItemToCart, getTotalPrice }}
    >
      {props.children}
    </CartContext.Provider>
  );
}
