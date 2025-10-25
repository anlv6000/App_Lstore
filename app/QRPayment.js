import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function QRPayment() {
  const router = useRouter();
  const { userId, username } = useAuth();
  const { items: cartItems } = useContext(CartContext);

  const handleOK = async () => {
    try {
      const address = {
        recipient: 'Tên người nhận',
        phone: 'Số điện thoại',
        street: 'Địa chỉ đường',
        city: 'Thành phố',
        district: 'Quận/Huyện'
      };

      const items = cartItems.map(item => {
        const product = item.product || {};
        let price = product.price || 0;

        if (product.type === 'preorder' || /\(PreOrder\)/i.test(product.name || '')) {
          price = Math.floor(price / 10);
        }

        return {
          productId: product._id || product.id || item.productId,
          name: product.name || 'Sản phẩm',
          price,
          quantity: item.qty || item.quantity || 1,
          type: product.type || ''
        };
      });

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
        Alert.alert(' Lỗi', data.message || 'Không thể xử lý thanh toán.');
      }
    } catch (error) {
      Alert.alert(' Lỗi', 'Không thể gửi yêu cầu thanh toán.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đơn hàng của bạn sẽ được giao sớm.</Text>
      <View style={styles.qrBox}>
        <Image source={require('../assets/qr.png')} style={styles.qrImage} />
      </View>
      <Text style={styles.confirm}>Nhấn OK để xác nhận đơn hàng.</Text>
      <Button title="OK" onPress={handleOK} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
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
