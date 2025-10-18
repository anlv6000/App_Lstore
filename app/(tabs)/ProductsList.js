import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

// import { CartIcon } from '../../components/CartIcon';
import { Product } from '../../components/Product';

//tao filter thoi gian nhap
//them thanh search
//bo nut cart
//thu nho anh
//them thong tin description vao mongodb


export function ProductsList() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTime, setFilterTime] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('https://ctechlab-e.io.vn/products');
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Phản hồi không phải JSON');
        }
        const data = await response.json();
        // Lấy tất cả sản phẩm, không filter type
        const formattedProducts = data.map((item) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          scale: item.scale,
          brand: item.brand,
          stock: item.stock,
          thumbnail: item.images?.[0],
          createdAt: item.createdAt,
          type: item.type,
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error('❌ Lỗi khi lấy sản phẩm:', error);
        Alert.alert('Lỗi kết nối', 'Không thể lấy danh sách sản phẩm. Vui lòng thử lại sau.');
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    let list = products;
    // Filter by time
    if (filterTime !== 'all') {
      const now = new Date();
      list = list.filter((item) => {
        const created = new Date(item.createdAt);
        if (filterTime === '7d') {
          return (now - created) / (1000 * 60 * 60 * 24) <= 7;
        }
        if (filterTime === '30d') {
          return (now - created) / (1000 * 60 * 60 * 24) <= 30;
        }
        return true;
      });
    }
    // Filter by search
    if (search.trim()) {
      list = list.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredProducts(list);
  }, [products, search, filterTime]);


  function renderProduct({ item: product }) {
    const isPreorder = product.type === 'preorder';
    return (
      <Product
        {...product}
        onPress={() => {
          navigation.navigate('ProductDetails', {
            productId: product.id,
          });
        }}
        smallThumb
        priceColor={isPreorder ? '#007aff' : undefined}
        preorderLabel={isPreorder}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sản phẩm</Text>
      </View>
      <View style={styles.filterRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChangeText={setSearch}
        />
       
      </View>
      <FlatList
        style={styles.productsList}
        contentContainerStyle={styles.productsListContainer}
        keyExtractor={(item) => item.id.toString()}
        data={filteredProducts}
        renderItem={renderProduct}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40 }}>Không có sản phẩm phù hợp.</Text>}
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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: '#fff',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  filterTimeBox: {
    flexDirection: 'row',
    gap: 4,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#eee',
    marginLeft: 4,
  },
  filterBtnActive: {
    backgroundColor: '#d2691e',
  },
  filterBtnText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
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
