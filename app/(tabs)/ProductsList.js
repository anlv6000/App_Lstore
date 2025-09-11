import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Product } from '../../components/Product';
import { getProducts } from '../../services/ProductsService.js';
import { CartIcon } from '../../components/CartIcon';

export function ProductsList() {
  const navigation = useNavigation(); 

  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(getProducts());
  }, []); 

  function renderProduct({ item: product }) {
    return (
      <Product
        {...product}
        onPress={() => {
          navigation.navigate('ProductDetails', {
            productId: product.id,
          });
        }}
      />
    );
  }

  return (
  <View style={{ flex: 1 }}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Sản phẩm</Text>
      <CartIcon />
    </View>

    <FlatList
      style={styles.productsList}
      contentContainerStyle={styles.productsListContainer}
      keyExtractor={(item) => item.id.toString()}
      data={products}
      renderItem={renderProduct}
    />
  </View>
);
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  productsList: {
    backgroundColor: '#eeeeee',
  },
  productsListContainer: {
    backgroundColor: '#eeeeee',
    paddingVertical: 8,
    marginHorizontal: 8,
  },
});
