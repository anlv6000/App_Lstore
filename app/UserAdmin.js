import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'user', // user / admin
    status: 'active', // active / inactive
  });

  const API_URL = 'https://ctechlab-e.io.vn/users';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      Alert.alert('Lỗi', 'Không thể tải danh sách người dùng');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa người dùng này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchUsers();
          } catch {
            Alert.alert('Lỗi', 'Không thể xóa người dùng');
          }
        },
      },
    ]);
  };

  const handleSave = async () => {
    try {
      await fetch(`${API_URL}/${editingUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      });
      setEditingUser(null);
      fetchUsers();
    } catch {
      Alert.alert('Lỗi', 'Không thể cập nhật người dùng');
    }
  };

  const handleAddUser = async () => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        Alert.alert('Thành công', 'Đã thêm người dùng mới');
        setAddingUser(false);
        setNewUser({ username: '', email: '', role: 'user', status: 'active' });
        fetchUsers();
      } else {
        Alert.alert('Lỗi', 'Không thể thêm người dùng');
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể thêm người dùng');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemBox}>
      {editingUser?._id === item._id ? (
        <>
          <TextInput
            placeholder="Tên người dùng"
            value={editingUser.username}
            onChangeText={(t) => setEditingUser({ ...editingUser, username: t })}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={editingUser.email}
            onChangeText={(t) => setEditingUser({ ...editingUser, email: t })}
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Role (user/admin)"
            value={editingUser.role}
            onChangeText={(t) => setEditingUser({ ...editingUser, role: t })}
            style={styles.input}
          />
          <TextInput
            placeholder="Status (active/inactive)"
            value={editingUser.status}
            onChangeText={(t) => setEditingUser({ ...editingUser, status: t })}
            style={styles.input}
          />
          <View style={styles.row}>
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditingUser(null)} style={styles.cancelBtn}>
              <Text style={{ color: '#0A1D56', fontWeight: '600' }}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.name}>{item.username}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <Text style={styles.roleStatus}>Role: {item.role} | Status: {item.status}</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => setEditingUser(item)} style={styles.editBtn}>
              <Text style={{ color: '#0A1D56', fontWeight: '600' }}>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
              <Text style={{ color: '#e53935', fontWeight: '600' }}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 50 }}>
        <Text style={styles.title}>Quản lý người dùng</Text>

        <TouchableOpacity style={styles.addBtn} onPress={() => setAddingUser(true)}>
          <Text style={styles.addText}>+ Thêm người dùng</Text>
        </TouchableOpacity>

        {addingUser && (
          <View style={styles.itemBox}>
            <TextInput
              placeholder="Tên người dùng"
              value={newUser.username}
              onChangeText={(t) => setNewUser({ ...newUser, username: t })}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              value={newUser.email}
              onChangeText={(t) => setNewUser({ ...newUser, email: t })}
              style={styles.input}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Role (user/admin)"
              value={newUser.role}
              onChangeText={(t) => setNewUser({ ...newUser, role: t })}
              style={styles.input}
            />
            <TextInput
              placeholder="Status (active/inactive)"
              value={newUser.status}
              onChangeText={(t) => setNewUser({ ...newUser, status: t })}
              style={styles.input}
            />

            <View style={styles.row}>
              <TouchableOpacity onPress={handleAddUser} style={styles.saveBtn}>
                <Text style={styles.saveText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAddingUser(false)} style={styles.cancelBtn}>
                <Text style={{ color: '#0A1D56', fontWeight: '600' }}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#0A1D56', textAlign: 'center' },
  addBtn: {
    backgroundColor: '#0A1D56',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#0A1D56',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  addText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  itemBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D6DAF0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: { borderWidth: 1, borderColor: '#D6DAF0', borderRadius: 10, padding: 10, marginBottom: 10, fontSize: 15, color: '#0A1D56' },
  row: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#0A1D56', marginBottom: 4 },
  email: { fontSize: 15, color: '#555', marginBottom: 4 },
  roleStatus: { fontSize: 14, color: '#0A1D56', marginBottom: 6 },
  editBtn: { marginRight: 12, borderWidth: 1, borderColor: '#0A1D56', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  deleteBtn: { borderWidth: 1, borderColor: '#e53935', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  saveBtn: { backgroundColor: '#0A1D56', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12, marginRight: 12 },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  cancelBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#0A1D56', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
});
