import { useRouter } from 'expo-router'; // ✅ dùng để điều hướng
import { Button, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    login(); 
    router.replace('/(tabs)'); 
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Đăng nhập để tiếp tục</Text>
      <Button title="Đăng nhập" onPress={handleLogin} />
    </View>
  );
}