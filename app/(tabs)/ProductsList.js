import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { CartIcon } from '../../components/CartIcon';
import { Product } from '../../components/Product';
import { getProducts } from '../../services/ProductsService.js';

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
    marginTop: 40,
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
