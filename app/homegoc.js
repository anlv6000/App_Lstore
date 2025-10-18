import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Pressable, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';


import {
  Alert,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'; // nếu chưa có

export default function HomeGoc() {
  const [preOrderProducts, setPreOrderProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const navigation = useNavigation();
  const { role } = useAuth();

  const [showPreorderList, setShowPreorderList] = useState(false);

  useEffect(() => {
    fetch('https://ctechlab-e.io.vn/products')
      .then((res) => res.json())
      .then((data) => {
        const preOrder = data.filter((item) => item.type === 'preorder');
        const available = data.filter((item) => item.type === 'available');
        setPreOrderProducts(preOrder);
        setAvailableProducts(available);
      })
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  const storeAddress = 'Số 1, 266 Đường Thụy Phương, Từ Liêm, Hà Nội';
  const storeLocation = { latitude: 21.0315, longitude: 105.7820 };

  const openMap = async (address = storeAddress) => {
    const query = encodeURIComponent(address);
    const url = Platform.OS === 'ios'
      ? `maps://?q=${query}`
      : `https://www.google.com/maps/search/?api=1&query=${query}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // fallback to web url
        await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể mở bản đồ.');
    }
  };

  const lat = 21.0315, lng = 105.7820;

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { productId: item._id })}
    >
      <View style={styles.productCard}>
        <Image source={{ uri: item.images?.[0] }} style={styles.productImage} />
        <Text style={styles.productName}>{item.name || item.title}</Text>
        <Text style={styles.productPrice}>{item.price}₫</Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={{ flex: 1 }}>
      {/* Header with DeliveryAdmin button & Chat logo */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 37, backgroundColor: '#fff' }}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {role === 'admin' && (
            <>
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? '#e0e0e0' : '#f2f2f2',
                    borderRadius: 20,
                    paddingVertical: 6,
                    paddingHorizontal: 14,
                    marginLeft: 10,
                  },
                ]}
                onPress={() => navigation.navigate('DeliveryAdmin')}
              >
                <Text style={{ fontWeight: 'bold', color: '#1976d2' }}>Đơn hàng</Text>
              </Pressable>
              <TouchableOpacity
                style={{ marginLeft: 16, padding: 6, borderRadius: 20, backgroundColor: '#e3f2fd' }}
                onPress={() => navigation.navigate('ConversationListScreen')}
              >
                <Text style={{ color: '#1976d2', fontWeight: 'bold', fontSize: 16 }}>Chat</Text>
              </TouchableOpacity>
            </>
          )}
          {role !== 'admin' && (
            <TouchableOpacity
              style={{ marginLeft: 16, padding: 6, borderRadius: 20, backgroundColor: '#e3f2fd' }}
              onPress={async () => {
                // Gửi tin nhắn mở đầu trước khi vào chat
                try {
                  const username = require('../context/AuthContext').useAuth().username;
                  await fetch('https://ctechlab-e.io.vn/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      from: username,
                      to: 'admin',
                      message: 'Xin chào shop!',
                      conversationId: username
                    })
                  });
                } catch { }
                navigation.navigate('MessageScreen');
              }}
            >
              <Image source={require('../assets/icon.png')} style={{ width: 32, height: 32 }} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView style={styles.container}>
        {/* ...existing code... */}
        <TextInput
          style={styles.searchBar}
          placeholder="Tìm kiếm sản phẩm..."
          placeholderTextColor="#999"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
          <Image source={require('../assets/products/33tos1.jpg')} style={styles.carouselImage} />
          <Image source={require('../assets/products/33tos2.jpg')} style={styles.carouselImage} />
          <Image source={require('../assets/products/33tos3.jpg')} style={styles.carouselImage} />
        </ScrollView>

        <Text style={styles.sectionTitle}>Danh mục</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel2}>
          <TouchableOpacity onPress={() => navigation.navigate('PreorderListScreen')}>
            <Image source={require('../assets/danhmuc_1.png')} style={styles.carouselImage2} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('BandaiListScreen')}>
            <Image source={require('../assets/danhmuc_8.webp')} style={styles.carouselImage2} />
          </TouchableOpacity>
          <Image source={require('../assets/danhmuc_2.png')} style={styles.carouselImage2} />
          <Image source={require('../assets/danhmuc_3.png')} style={styles.carouselImage2} />
          <Image source={require('../assets/danhmuc_4.png')} style={styles.carouselImage2} />
          <Image source={require('../assets/danhmuc_5.webp')} style={styles.carouselImage2} />
          <Image source={require('../assets/danhmuc_6.webp')} style={styles.carouselImage2} />
          <Image source={require('../assets/danhmuc_7.webp')} style={styles.carouselImage2} />

        </ScrollView>

        {/* Sản phẩm đặt trước */}
        <Text style={styles.sectionTitle}>Sản phẩm Đặt Trước</Text>
        <FlatList
          horizontal
          data={preOrderProducts}
          keyExtractor={(item) => item._id}
          renderItem={renderProduct}
          showsHorizontalScrollIndicator={false}
        />

        {/* ...danh sách preorder đã chuyển sang trang riêng... */}

        {/* Sản phẩm có sẵn */}
        <Text style={styles.sectionTitle}>Sản phẩm Có Sẵn</Text>
        <FlatList
          horizontal
          data={availableProducts}
          keyExtractor={(item) => item._id}
          renderItem={renderProduct}
          showsHorizontalScrollIndicator={false}
        />

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Thông tin cửa hàng</Text>

          <View style={styles.infoBlock}>
            <Text style={styles.infoTitle}>LTStore</Text>
            <Text>Địa chỉ: Số 1, 266 Đường Thụy Phương, Từ Liêm, Hà Nội</Text>
            <Text>Điện thoại: 0543970667</Text>
            <Text>Email: ltstore@gmail.com</Text>
            <TouchableOpacity style={styles.mapBtn} onPress={() => openMap()}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Xem bản đồ</Text>
            </TouchableOpacity>
          </View>
        
          <View style={styles.infoBlock}>
            <Text style={styles.infoTitle}>Kết nối với chúng tôi</Text>
            <Text>- YouTube | Facebook | Instagram | TikTok</Text>
            <Text>- Thanh toán: MoMo, chuyển khoản</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  logo: {
    width: 140,
    height: 60,

    alignSelf: 'center',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#f2f2f2',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
  },
  productCard: {
    width: 180,
    marginRight: 12,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 120,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
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
  infoSection: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    marginTop: 20,
  },
  infoBlock: {
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },


  carousel: {
    marginBottom: 20,
  },
  carousel2: {
    marginBottom: 20,
    marginStart: 5,
  },
  carouselImage: {
    width: 280,
    height: 140,
    borderRadius: 10,
    marginRight: 12,
  },
  carouselImage2: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 10,
    resizeMode: 'cover',
  },
  mapBtn: {
    marginTop: 10,
    backgroundColor: '#1976d2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },


});
