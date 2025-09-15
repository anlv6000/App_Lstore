import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import HomeGoc from '../homegoc.js';

export default function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await fetch('https://3542273ca3f9.ngrok-free.app/ping', {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (res.ok) {
        console.log('✅ Backend sẵn sàng');
        setIsLoggedIn(true);
      } else {
        Alert.alert('Lỗi kết nối', 'Máy chủ phản hồi lỗi. Vui lòng thử lại sau.');
      }
    } catch (err) {0
      
      console.error('❌ Không kết nối được backend:', err);
      Alert.alert('Lỗi kết nối', 'Không thể kết nối tới máy chủ. Kiểm tra mạng hoặc thử lại sau.');
    }
  };


  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chào mừng đến với LTStore!</Text>
        <Text style={styles.title}>Ấn đăng nhập để tiếp tục</Text>
        <Button title="Đăng nhập" onPress={handleLogin} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <HomeGoc />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 20,
  },
});
