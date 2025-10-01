import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function PreorderListScreen() {
  const [preOrderProducts, setPreOrderProducts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetch('http://103.249.117.201:12732/products')
      .then((res) => res.json())
      .then((data) => {
        const preOrder = data.filter((item) => item.type === 'preorder');
        setPreOrderProducts(preOrder);
      })
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  const renderProduct = ({ item }) => (
    <Pressable
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { productId: item._id })}
    >
      <Image
        source={item.images && item.images[0] ? { uri: item.images[0] } : require('../assets/products/33tos1.png')}
        style={styles.productImage}
      />
      <Text style={styles.productName}>{item.name || item.title}</Text>
      <Text style={styles.productPrice}>{item.price}₫</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách sản phẩm Preorder</Text>
      <FlatList
        data={preOrderProducts}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1976d2',
  },
  productCard: {
    width: 180,
    marginBottom: 16,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  productImage: {
    width: 120,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  productName: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#222',
  },
  productPrice: {
    fontSize: 13,
    color: '#e53935',
    marginTop: 4,
    textAlign: 'center',
  },
});
