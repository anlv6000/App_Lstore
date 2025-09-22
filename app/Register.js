import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  // Kiểm tra trùng username realtime
  useEffect(() => {
    if (!username) {
      setUsernameError('');
      return;
    }
    let cancelled = false;
    const check = setTimeout(() => {
      fetch(`http://103.249.117.201:12732/users?username=${encodeURIComponent(username)}`)
        .then(res => res.json())
        .then(data => {
          if (cancelled) return;
          // Nếu username ở thời điểm fetch khác username hiện tại, bỏ qua
          if (
            username !== '' &&
            Array.isArray(data) &&
            data.some(u => u.username === username)
          ) {
            setUsernameError('Tên đăng nhập đã tồn tại');
          } else {
            setUsernameError('');
          }
        })
        .catch(() => {
          if (!cancelled) setUsernameError('Không kiểm tra được tên đăng nhập');
        });
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(check);
    };
  }, [username]);

  // Kiểm tra password mạnh realtime
  useEffect(() => {
    if (!password) {
      setPasswordError('');
      return;
    }
    if (password.length < 8) {
      setPasswordError('Mật khẩu phải trên 8 ký tự');
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError('Mật khẩu phải có ít nhất 1 chữ hoa');
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      setPasswordError('Mật khẩu phải có ký tự đặc biệt');
    } else {
      setPasswordError('');
    }
  }, [password]);

  const handleRegister = async () => {
    setLoading(true);
    if (!username || !password || !confirmPassword || !email) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
      setLoading(false);
      return;
    }
    if (usernameError || passwordError) {
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Mật khẩu không khớp');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('http://103.249.117.201:12732/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          passwordHash: password,
          email,
          role: 'customer',
        }),
      });
      const data = await res.json();
      if (res.ok && (data.success || data._id || data.username)) {
        Alert.alert('Thành công', 'Đăng ký thành công! Hãy đăng nhập.');
        router.replace('/Login');
      } else {
        setUsernameError(data.error || 'Đăng ký thất bại');
      }
    } catch (err) {
      setUsernameError('Không thể kết nối máy chủ.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      {!!usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Nhập lại mật khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
  <Button title={loading ? 'Đang đăng ký...' : 'Đăng ký'} onPress={handleRegister} disabled={loading || !!usernameError || !!passwordError} />
      <TouchableOpacity onPress={() => router.replace('/Login')} style={styles.loginLink}>
        <Text style={styles.loginText}>Đã có tài khoản? Đăng nhập</Text>
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
  loginLink: {
    marginTop: 18,
  },
  loginText: {
    color: '#007aff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: 4,
    fontSize: 14,
  },
});
