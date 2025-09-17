import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider(props) {
  const [items, setItems] = useState([]);

  function addItemToCart(product) {
    if (
      !product ||
      typeof product !== 'object' ||
      product.price == null ||
      !product._id
    ) {
      console.error('❌ Dữ liệu sản phẩm không hợp lệ:', product);
      return;
    }

    const id = product._id.toString(); // đảm bảo id là chuỗi

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
