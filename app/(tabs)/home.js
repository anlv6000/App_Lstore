import { StyleSheet } from 'react-native';
import { CartProvider } from '../../context/CartContext.js';
import { ProductsList } from '../ProductsList.js';

export default function Home() {
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
  