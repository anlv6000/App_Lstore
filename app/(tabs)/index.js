import React from 'react';
import { StyleSheet } from 'react-native';
import { Cart } from './Cart.js';
import { ProductsList } from './ProductsList.js';
import { CartProvider } from '../../context/CartContext.js';

export default function Main() {
  return (
    <CartProvider>
      <ProductsList />
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
  },
});
  