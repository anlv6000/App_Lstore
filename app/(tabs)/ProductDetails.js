import React, { useEffect, useState, useContext } from 'react';
import {
  Text,
  Image,
  View,
  ScrollView,
  SafeAreaView,
  Button,
  StyleSheet,
} from 'react-native';

import { getProduct } from '../../services/ProductsService.js';
import { CartContext } from '../../context/CartContext';
import { useLocalSearchParams } from 'expo-router'; // ✅ dùng hook của Expo Router

export default function ProductDetails() {
  const { productId } = useLocalSearchParams(); // ✅ lấy params đúng cách
  const [product, setProduct] = useState(null);

  const { addItemToCart } = useContext(CartContext);

  useEffect(() => {
    if (productId) {
      setProduct(getProduct(Number(productId))); // đảm bảo là số
    }
  }, [productId]);

  function onAddToCart() {
    if (product) {
      addItemToCart(product.id);
    }
  }

  if (!product) {
    return (
      <SafeAreaView>
        <Text style={{ padding: 16 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>
        {product.image && (
          <Image style={styles.image} source={product.image} />
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>$ {product.price}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Button onPress={onAddToCart} title="Add to cart" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: '100%',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#787878',
    marginBottom: 16,
  },
});
