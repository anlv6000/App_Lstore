import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { CartIcon } from '../../components/CartIcon';
import { Product } from '../../components/Product';

export function ProductsList() {
  const navigation = useNavigation(); 
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('https://3542273ca3f9.ngrok-free.app/products', {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Phản hồi không phải JSON');
        }

        const data = await response.json();

        const availableProducts = data.filter((item) => item.type === 'available');

        const formattedProducts = availableProducts.map((item) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          scale: item.scale,
          brand: item.brand,
          stock: item.stock,
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error('❌ Lỗi khi lấy sản phẩm:', error);
        Alert.alert('Lỗi kết nối', 'Không thể lấy danh sách sản phẩm. Vui lòng thử lại sau.');
      }
    }

    fetchProducts();
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
