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
  { id: '1', name: 'Tai nghe ReactProX', price: '$350', image: require('../assets/icon.png') },
  { id: '2', name: 'Xe đồ chơi FastLane', price: '$600', image: require('../assets/icon.png') },
];

export default function HomeGoc() {
  return (
    <ScrollView style={styles.container}>
      {/* 🔍 Thanh tìm kiếm */}
      <TextInput
        style={styles.searchBar}
        placeholder="Tìm kiếm sản phẩm..."
      />

      {/* 🖼️ Hàng ảnh sản phẩm chạy ngang */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
        <Image source={require('../assets/icon.png')} style={styles.carouselImage} />
        <Image source={require('../assets/icon.png')} style={styles.carouselImage} />
        <Image source={require('../assets/icon.png')} style={styles.carouselImage} />
      </ScrollView>

      {/* 📂 Danh mục thể loại */}
      <Text style={styles.sectionTitle}>Danh mục</Text>
      <View style={styles.categories}>
        <Text style={styles.category}>Tai nghe</Text>
        <Text style={styles.category}>Xe đồ chơi</Text>
        <Text style={styles.category}>Phụ kiện</Text>
      </View>

      {/* 🔥 Sản phẩm bán chạy */}
      <Text style={styles.sectionTitle}>Sản phẩm bán chạy</Text>
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

      {/* 🛒 Khu vực sản phẩm khác */}
      <Text style={styles.sectionTitle}>Sản phẩm khác</Text>
      <View style={styles.placeholder}>
        <Text>Đang cập nhật...</Text>
      </View>

      {/* 📍 Địa chỉ & liên hệ */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>LTStore Hà Nội</Text>
        <Text>Địa chỉ: Bình Yên, Hà Nội</Text>
        <Text>Liên hệ: 0988 123 456</Text>
        <Text>Email: support@ltstore.vn</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  carousel: {
    marginBottom: 20,
  },
  carouselImage: {
    width: 250,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  category: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
  },
  productCard: {
    width: 140,
    marginRight: 12,
    alignItems: 'center',
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
  },
  productPrice: {
    fontSize: 13,
    color: '#888',
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
  },
});