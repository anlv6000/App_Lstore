import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

const bestSellers = [
  { id: '1', name: 'Tai nghe ReactProX', price: '350.000₫', image: require('../assets/products/33tos1.png') },
  { id: '2', name: 'Xe đồ chơi FastLane', price: '600.000₫', image: require('../assets/products/33tos2.png') },
];

export default function HomeGoc() {
  return (
    <ScrollView style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <TextInput
        style={styles.searchBar}
        placeholder="Tìm kiếm sản phẩm..."
        placeholderTextColor="#999"
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
        <Image source={require('../assets/products/33tos1.png')} style={styles.carouselImage} />
        <Image source={require('../assets/products/33tos2.png')} style={styles.carouselImage} />
        <Image source={require('../assets/products/33tos3.png')} style={styles.carouselImage} />
      </ScrollView>

      <Text style={styles.sectionTitle}>Danh mục</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel2}>
        <Image source={require('../assets/danhmuc_1.png')} style={styles.carouselImage2} />
        <Image source={require('../assets/danhmuc_2.png')} style={styles.carouselImage2} />
        <Image source={require('../assets/danhmuc_3.png')} style={styles.carouselImage2} />
        <Image source={require('../assets/danhmuc_4.png')} style={styles.carouselImage2} />
        <Image source={require('../assets/danhmuc_5.webp')} style={styles.carouselImage2} />
        <Image source={require('../assets/danhmuc_6.webp')} style={styles.carouselImage2} />
        <Image source={require('../assets/danhmuc_7.webp')} style={styles.carouselImage2} />
      </ScrollView>

      <Text style={styles.sectionTitle}>Sản phẩm đặt trước mới nhất</Text>
      <FlatList
        horizontal
        data={bestSellers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={item.image} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.sectionTitle}>Sản phẩm có sẵn</Text>
      <FlatList
        horizontal
        data={bestSellers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={item.image} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Thông tin cửa hàng</Text>

        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>LTStore</Text>
          <Text>Địa chỉ: Số 1, 266 Đường Thụy Phương, Từ Liêm, Hà Nội</Text>
          <Text>Điện thoại: 0543970667</Text>
          <Text>Email: ltstore@gmail.com</Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>Chính sách</Text>
          <Text>- Chính sách đổi trả</Text>
          <Text>- Chính sách bảo hành</Text>
          <Text>- Chính sách bảo mật</Text>
        </View>
        {/* 
        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>Hướng dẫn</Text>
          <Text>- Cách mua hàng</Text>
          <Text>- Cách thanh toán</Text>
          <Text>- Kiểm tra đơn hàng</Text>
        </View> */}

        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>Kết nối với chúng tôi</Text>
          <Text>- YouTube | Facebook | Instagram | TikTok</Text>
          <Text>- Thanh toán: MoMo, chuyển khoản</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 37,
  },
  logo: {
    width: 140,
    height: 60,
    marginBottom: 10,
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
  },
  productCard: {
    width: 160,
    marginRight: 12,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 8,
  },
  productImage: {
    width: 120,
    height: 100,
    borderRadius: 8,
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
  },
  placeholder: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 20,
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#444',
  },
  footerLink: {
    marginTop: 6,
    color: '#1e88e5',
  },
  infoSection: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
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
});