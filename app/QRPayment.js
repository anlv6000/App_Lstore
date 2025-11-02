import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function QRPayment() {
  const router = useRouter();
  const params = useLocalSearchParams();

  let address = {
    recipient: '',
    phone: '',
    street: '',
    city: '',
    district: ''
  };
  let rawItems = [];
  let items = [];
  let userId = '';
  let username = '';

  try {
    address = JSON.parse(params.address || '{}');
    rawItems = JSON.parse(params.items || '[]');
    userId = params.userId || '';
    username = params.username || '';
  } catch (error) {
    console.warn('Lỗi khi parse dữ liệu từ Checkout:', error);
  }

  // ✅ Xử lý lại dữ liệu items giống như Checkout
  items = rawItems.map(item => {
    const product = item.product || {};
    let price = product.price || item.price || 0;
    const name = product.name || item.name || 'Sản phẩm';
    const quantity = item.qty || item.quantity || 1;

    if (product.type === 'preorder' || /\(PreOrder\)/i.test(name)) {
      price = Math.floor(price / 10);
    }

    return {
      productId: product._id || product.id || item.productId,
      name,
      price,
      quantity,
      type: product.type || item.type || ''
    };
  });

  const handleOK = async () => {
    try {
      const response = await fetch('https://sandbox.ctechlab-e.io.vn/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          username,
          method: 'banking_qr',
          address,
          items
        })
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Thành công', 'Đơn hàng đã được xác nhận!');
        router.push('/');
      } else {
        Alert.alert('Lỗi', data.message || 'Không thể xử lý thanh toán.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi yêu cầu thanh toán.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thông tin đơn hàng</Text>

      <View style={styles.addressBox}>
        <Text>👤 {address.recipient}</Text>
        <Text>📞 {address.phone}</Text>
        <Text>🏠 {address.street}, {address.district}, {address.city}</Text>
      </View>

      <View style={styles.itemsBox}>
        {items.map((item, idx) => (
          <Text key={idx} style={styles.item}>
            {item.name} x {item.quantity} - {item.price * item.quantity} đ
          </Text>
        ))}
        <Text style={styles.total}>
          Tổng cộng: {items.reduce((sum, item) => sum + item.price * item.quantity, 0)} đ
        </Text>
      </View>

      <View style={styles.qrBox}>
        <Image source={require('../assets/qr.png')} style={styles.qrImage} />
      </View>

      <Text style={styles.confirm}>Nhấn OK để xác nhận đơn hàng.</Text>
      <Button title="OK" onPress={handleOK} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addressBox: {
    width: '100%',
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  itemsBox: {
    width: '100%',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  item: {
    fontSize: 16,
    marginVertical: 2,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  qrBox: {
    width: 220,
    height: 220,
    backgroundColor: '#eee',
    borderRadius: 16,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  confirm: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});
