import { useRouter } from 'expo-router';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

export default function QRPayment() {
  const router = useRouter();

  const handleOK = () => {
    router.push('/');
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
