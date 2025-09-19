import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { CartContext } from '../context/CartContext';

export default function Checkout() {
  const { items, getTotalPrice } = useContext(CartContext);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    if (!name || !address || !phone) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }
    setLoading(true);
    try {
      await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          address,
          phone,
          note,
          items,
          total: getTotalPrice(),
        }),
      });
      setLoading(false);
      router.push('/QRPayment');
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
        placeholder="Họ và tên"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ giao hàng"
        value={address}
        onChangeText={setAddress}
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
        placeholder="Ghi chú (tuỳ chọn)"
        value={note}
        onChangeText={setNote}
      />
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>
        {items.map((item, idx) => (
          <Text key={idx} style={styles.summaryItem}>
            {item?.product?.name || 'Sản phẩm'} x {item.qty} - {item.totalPrice} đ
          </Text>
        ))}
        <Text style={styles.total}>Tổng cộng: {getTotalPrice()} đ</Text>
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
