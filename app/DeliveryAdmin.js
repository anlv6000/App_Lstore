import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function DeliveryAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('pending');
  const { role, username } = useAuth();
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://ctechlab-e.io.vn/deliveries');
      const data = await res.json();
      const allOrders = Array.isArray(data) ? data : [];

      let filtered = role === 'admin'
        ? allOrders
        : allOrders.filter(order => order.username === username);

      // Lọc theo username người mua
      if (searchText.trim()) {
        const keyword = searchText.trim().toLowerCase();
        filtered = filtered.filter(order =>
          order.username?.toLowerCase().includes(keyword)
        );
      }

      // Lọc theo khoảng ngày
      if (filterStartDate || filterEndDate) {
        filtered = filtered.filter(order => {
          const created = new Date(order.createdAt);
          if (filterStartDate && created < new Date(filterStartDate.setHours(0, 0, 0, 0))) return false;
          if (filterEndDate && created > new Date(filterEndDate.setHours(23, 59, 59, 999))) return false;
          return true;
        });
      }


      setOrders(filtered);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  };



  useEffect(() => {
    fetchOrders();
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setModalVisible(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      await fetch(`https://ctechlab-e.io.vn/deliveries/${selectedOrder._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setModalVisible(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch {
      // handle error
      setModalVisible(false);
      setSelectedOrder(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Danh sách đơn hàng</Text>
      {loading ? <Text>Đang tải...</Text> : null}
      {orders.length === 0 && !loading ? (
        <Text style={{ marginTop: 20 }}>Không có đơn hàng nào.</Text>
      ) : null}
      {role === 'admin' && (
        <View style={{ marginBottom: 16 }}>
          {/* Tìm kiếm theo tên người nhận */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Tên người nhận..."
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 6,
                padding: 8,
                marginRight: 8,
              }}
            />
            <TouchableOpacity
              onPress={fetchOrders}
              style={{
                backgroundColor: '#1976d2',
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Tìm</Text>
            </TouchableOpacity>
          </View>
          {/* Lọc theo ngày tạo */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 6,
                padding: 10,
                marginRight: 8,
              }}
            >
              <Text>{startDate.toISOString().slice(0, 10)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 6,
                padding: 10,
                marginRight: 8,
              }}
            >
              <Text>{endDate.toISOString().slice(0, 10)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setFilterStartDate(startDate);
                setFilterEndDate(endDate);
                fetchOrders();
              }}
              style={{
                backgroundColor: '#1976d2',
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Lọc</Text>
            </TouchableOpacity>

          </View>

          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartPicker(Platform.OS === 'ios');
                if (selectedDate) setStartDate(selectedDate);
              }}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndPicker(Platform.OS === 'ios');
                if (selectedDate) setEndDate(selectedDate);
              }}
            />
          )}

        </View>
      )}


      {orders.map((order, idx) => (
        <View key={order._id || idx} style={styles.orderBox}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.orderId}>Mã đơn: {order._id}</Text>
            {role === 'admin' && (
              <TouchableOpacity onPress={() => openModal(order)} style={styles.plusBtn}>
                <Text style={{ fontSize: 22, color: '#1976d2', fontWeight: 'bold' }}>+</Text>
              </TouchableOpacity>
            )}

          </View>
          <Text>Người nhận: {order.address?.recipient}</Text>
          <Text>Điện thoại: {order.address?.phone}</Text>
          <Text>Địa chỉ: {order.address?.street}, {order.address?.district}, {order.address?.city}</Text>
          <Text style={{
            color: order.status === 'delivered' ? 'green' :
              order.status === 'shipped' ? '#f57c00' : '#999'
          }}>
            Trạng thái: {order.status}
          </Text>

          <Text style={{ marginTop: 6, fontWeight: 'bold' }}>Sản phẩm:</Text>
          {Array.isArray(order.items) && order.items.length > 0 ? (
            order.items.map((item, i) => (
              <Text key={i} style={{ marginLeft: 8 }}>
                - {item.name} x {item.quantity} @ {item.price} đ
                {item.type === 'preorder' && <Text style={{ color: '#007aff' }}> (PreOrder)</Text>}
              </Text>
            ))
          ) : (
            <Text style={{ marginLeft: 8, fontStyle: 'italic' }}>Không có sản phẩm</Text>
          )}
          <Text style={{ marginTop: 6, fontWeight: 'bold' }}>Tổng tiền: {order.totalPrice?.toLocaleString()} đ</Text>

          <Text>Ngày tạo: {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</Text>
          <Text style={{ fontWeight: 'bold', marginTop: 6 }}>Username người mua: {order.username || '(không có)'}</Text>
          {role === 'admin' && (
            <TouchableOpacity
              style={styles.trashBtn}
              onPress={() => {
                setOrderToDelete(order);
                setConfirmDeleteVisible(true);
              }}
            >
              <Text style={{ fontSize: 20, color: '#e53935', fontWeight: 'bold' }}>🗑️</Text>
            </TouchableOpacity>
          )}

          {/* Modal xác nhận xóa đơn hàng */}

          <Modal
            visible={confirmDeleteVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setConfirmDeleteVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Xác nhận xóa đơn hàng</Text>
                <Text>Bạn có chắc muốn xóa đơn hàng này không?</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                  <Pressable onPress={() => setConfirmDeleteVisible(false)} style={{ marginRight: 16 }}>
                    <Text style={{ color: '#888', fontWeight: 'bold' }}>Hủy</Text>
                  </Pressable>
                  <Pressable
                    onPress={async () => {
                      try {
                        await fetch(`https://ctechlab-e.io.vn/deliveries/${orderToDelete._id}`, { method: 'DELETE' });
                        setConfirmDeleteVisible(false);
                        setOrderToDelete(null);
                        fetchOrders();
                      } catch {
                        setConfirmDeleteVisible(false);
                        setOrderToDelete(null);
                      }
                    }}
                  >
                    <Text style={{ color: '#e53935', fontWeight: 'bold' }}>Xóa</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>


        </View>
      ))}

      {/* Modal cập nhật trạng thái */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Cập nhật trạng thái</Text>
            {['pending', 'shipped', 'delivered'].map((status) => (
              <Pressable
                key={status}
                style={{
                  padding: 10,
                  backgroundColor: newStatus === status ? '#1976d2' : '#f2f2f2',
                  marginBottom: 8,
                  borderRadius: 6,
                }}
                onPress={() => setNewStatus(status)}
              >
                <Text style={{ color: newStatus === status ? '#fff' : '#222', fontWeight: 'bold' }}>{status}</Text>
              </Pressable>
            ))}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
              <Pressable onPress={() => setModalVisible(false)} style={{ marginRight: 16 }}>
                <Text style={{ color: '#888', fontWeight: 'bold' }}>Hủy</Text>
              </Pressable>
              <Pressable onPress={handleUpdateStatus}>
                <Text style={{ color: '#1976d2', fontWeight: 'bold' }}>Lưu</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  trashBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#ffeaea',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
  },
  plusBtn: {
    backgroundColor: '#e3eaff',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    minWidth: 260,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderBox: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  orderId: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
