import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function AccountInfo() {
  const { userId, username, role, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`https://ctechlab-e.io.vn/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng');
      });
  }, [userId]);

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color="#1976d2" /></View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}><Text>Không tìm thấy thông tin người dùng.</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin tài khoản</Text>
      <View style={styles.infoBlock}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{user.username}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>
        <Text style={styles.label}>Quyền:</Text>
        <Text style={styles.value}>{user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</Text>
        {user.phone && <><Text style={styles.label}>Số điện thoại:</Text><Text style={styles.value}>{user.phone}</Text></>}
        {user.address && <><Text style={styles.label}>Địa chỉ:</Text><Text style={styles.value}>{user.address}</Text></>}
        <Text style={styles.label}>Ngày tạo:</Text>
        <Text style={styles.value}>{new Date(user.createdAt).toLocaleString()}</Text>
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#1976d2',
    textAlign: 'center',
  },
  infoBlock: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 18,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },
  logoutBtn: {
    backgroundColor: '#e53935',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
