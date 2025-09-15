import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';

import { useLocalSearchParams } from 'expo-router';
import { CartContext } from '../context/CartContext.js';

export default function ProductDetails() {
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  const { addItemToCart } = useContext(CartContext);

  useEffect(() => {
    async function fetchProductDetail() {
      try {
        const response = await fetch(`http://103.249.117.201:12732/products/${productId}`);

        const data = await response.json();
        setProduct(data);
        setMainImage(data.images?.[0]); // ảnh đầu tiên làm ảnh chính
      } catch (error) {
        console.error('❌ Lỗi khi lấy chi tiết sản phẩm:', error);
        Alert.alert('Lỗi', 'Không thể tải chi tiết sản phẩm.');
      }
    }

    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);




  async function onAddToCart() {
    if (product) {
      await addItemToCart(product._id); // ✅ dùng await để chờ dữ liệu
    }
  }


  const handleAddToCart = () => {
    onAddToCart();
    if (Platform.OS === 'android' && ToastAndroid) {
      ToastAndroid.show("Đã thêm vào giỏ hàng!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Thông báo", "Đã thêm vào giỏ hàng!");
    }
  };

  if (!product) {
    return (
      <SafeAreaView>
        <Text style={{ padding: 16 }}>Đang tải sản phẩm...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ backgroundColor: '#fff' }}>
        {mainImage && (
          <Image style={styles.mainImage} source={{ uri: mainImage }} />
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailContainer}
        >
          {product.images?.map((imgUrl, index) => (
            <TouchableOpacity key={index} onPress={() => setMainImage(imgUrl)}>
              <Image source={{ uri: imgUrl }} style={styles.thumbnail} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>Giá: {product.price}₫</Text>
          <Text style={styles.detail}>Thương hiệu: {product.brand}</Text>
          <Text style={styles.detail}>Kho: {product.stock}</Text>

          <Text style={styles.status}>
            Trạng thái: {product.type === 'preorder'
              ? `Đặt trước (Giá đặt: ${Math.floor(product.price / 10)}₫)`
              : 'Có sẵn'}
          </Text>

          {product.type === 'preorder' ? (
            <TouchableOpacity
              onPress={handleAddToCart}
              style={styles.preorderButton}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Đặt trước</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleAddToCart}
              style={styles.orderButton}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Đặt hàng</Text>
            </TouchableOpacity>
          )}

        </View>



      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  mainImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  thumbnail: {
    width: 80,
    height: 80,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: '#e91e63',
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    color: '#007aff',
    marginBottom: 12,
    fontWeight: '500',
  },

  orderButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#e53935', // đỏ
    marginTop: 10,
  },

  preorderButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#007aff', // xanh
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  status: {
    fontSize: 16,
    color: '#007aff',
    marginBottom: 12,
    fontWeight: '500',
  },

});
