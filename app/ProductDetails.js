import { useContext, useEffect, useState } from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useLocalSearchParams } from 'expo-router';
import { Alert, Platform, ToastAndroid } from 'react-native';
import { CartContext } from '../context/CartContext.js';
import { getProduct } from '../services/ProductsService.js';

export default function ProductDetails() {
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState(null);

  const { addItemToCart } = useContext(CartContext);

  useEffect(() => {
    if (productId) {
      setProduct(getProduct(Number(productId)));
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
  const handleAddToCart = () => {
    onAddToCart();

    if (Platform.OS === 'android' && ToastAndroid) {
      ToastAndroid.show("Đã thêm vào giỏ hàng!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Thông báo", "Đã thêm vào giỏ hàng!");
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ backgroundColor: '#fff' }}>
        {product.image && (
          <Image style={styles.image} source={product.image} />
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>$ {product.price}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Button onPress={handleAddToCart} title="Add to cart" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    marginTop: 40,
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
