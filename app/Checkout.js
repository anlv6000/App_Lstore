import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function Checkout() {
  const params = useLocalSearchParams();
  const { items: cartItems, getTotalPrice } = useContext(CartContext);
  let buyNowItems = [];
  if (params.buyNow) {
    try {
      buyNowItems = JSON.parse(params.buyNow);
    } catch { }
  }
  const items = buyNowItems.length > 0 ? buyNowItems : cartItems;
  const { userId, username } = useAuth();
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    if (!name || !street || !phone || !city || !district) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (!userId) {
      Alert.alert('Lỗi', 'Không xác định được tài khoản.');
      return;
    }
    setLoading(true);
    try {
      await fetch('https://ctechlab-e.io.vn/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          username,
          address: {
            recipient: name,
            phone,
            street,
            city,
            district
          },
          items: items.map(item => {
            const product = item.product || {};
            let price = product.price || 0;

            // Giảm giá nếu là PreOrder
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
          })

        }),
      });
      setLoading(false);
      router.push({
        pathname: '/QRPayment',
        params: {
          address: JSON.stringify({
            recipient: name,
            phone,
            street,
            city,
            district
          }),
          items: JSON.stringify(items),
          userId,
          username
        }
      });

    } catch (error) {
      setLoading(false);
      Alert.alert('Lỗi', 'Không thể gửi đơn hàng.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thông tin mua hàng</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ và tên người nhận"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ (số nhà, đường, ... )"
        value={street}
        onChangeText={setStreet}
      />
      <TextInput
        style={styles.input}
        placeholder="Quận/Huyện"
        value={district}
        onChangeText={setDistrict}
      />
      <TextInput
        style={styles.input}
        placeholder="Tỉnh/Thành phố"
        value={city}
        onChangeText={setCity}
      />
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>
        {items.map((item, idx) => {
          let name = item?.product?.name || 'Sản phẩm';
          let isPreorder = false;
          let price = item?.product?.price || 0;
          if (item?.product?.type === 'preorder' || /\(PreOrder\)/i.test(name)) {
            isPreorder = true;
            price = Math.floor((item?.product?.price || 0) / 10);
            if (!/\(PreOrder\)/i.test(name)) {
              name = name + ' (PreOrder)';
            }
          }
          return (
            <Text key={idx} style={styles.summaryItem}>
              {name} x {item.qty} - {price * item.qty} đ{isPreorder ? ' (PreOrder)' : ''}
            </Text>
          );
        })}
        <Text style={styles.total}>Tổng cộng: {items.reduce((sum, item) => {
          let price = item?.product?.price || 0;
          if (item?.product?.type === 'preorder' || /\(PreOrder\)/i.test(item?.product?.name || '')) {
            price = Math.floor(price / 10);
          }
          return sum + price * item.qty;
        }, 0)} đ</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#d2691e" />
      ) : (
        <Button title="Thanh toán" onPress={handlePayment} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  summary: {
    marginVertical: 20,
    padding: 12,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 18,
  },
  summaryItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  total: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
    color: '#d2691e',
  },
});
