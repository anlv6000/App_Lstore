import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function DeliveryAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('pending');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://103.249.117.201:12732/deliveries');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
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
      await fetch(`http://103.249.117.201:12732/deliveries/${selectedOrder._id}`, {
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
      {orders.map((order, idx) => (
        <View key={order._id || idx} style={styles.orderBox}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.orderId}>Mã đơn: {order._id}</Text>
            <TouchableOpacity onPress={() => openModal(order)} style={styles.plusBtn}>
              <Text style={{ fontSize: 22, color: '#1976d2', fontWeight: 'bold' }}>+</Text>
            </TouchableOpacity>
          </View>
          <Text>Người nhận: {order.address?.recipient}</Text>
          <Text>Điện thoại: {order.address?.phone}</Text>
          <Text>Địa chỉ: {order.address?.street}, {order.address?.district}, {order.address?.city}</Text>
          <Text>Trạng thái: {order.status}</Text>
          <Text>Ngày tạo: {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</Text>
          <Text style={{ fontWeight: 'bold', marginTop: 6 }}>Username người mua: {order.username || '(không có)'}</Text>
          <TouchableOpacity
            style={styles.trashBtn}
            onPress={async () => {
              try {
                await fetch(`http://103.249.117.201:12732/deliveries/${order._id}`, { method: 'DELETE' });
                fetchOrders();
              } catch {}
            }}
          >
            <Text style={{ fontSize: 20, color: '#e53935', fontWeight: 'bold' }}>🗑️</Text>
          </TouchableOpacity>
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
