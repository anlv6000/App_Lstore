import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://103.249.117.201:12732/users/search/by-username?username=${encodeURIComponent(username)}`);
      const data = await res.json();

      if (data && data.passwordHash) {
        if (data.passwordHash === password) {
          login(data);
          router.replace('/'); 
        } else {
          Alert.alert('Lỗi', 'Sai tài khoản hoặc mật khẩu.');
        }
      } else {
        Alert.alert('Lỗi', 'Sai tài khoản hoặc mật khẩu.');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể kết nối máy chủ.');
    }
    setLoading(false);
  };

  const goToRegister = () => {
    router.push('/Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={loading ? 'Đang đăng nhập...' : 'Đăng nhập'} onPress={handleLogin} disabled={loading} />
      <TouchableOpacity onPress={goToRegister} style={styles.registerLink}>
        <Text style={styles.registerText}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  registerLink: {
    marginTop: 18,
  },
  registerText: {
    color: '#007aff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});